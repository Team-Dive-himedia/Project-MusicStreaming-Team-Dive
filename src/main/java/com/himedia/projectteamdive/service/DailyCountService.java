package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.dto.DailyCountDto;
import com.himedia.projectteamdive.entity.DailyCount;
import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.Playcountlist;
import com.himedia.projectteamdive.repository.DailyCountRepository;
import com.himedia.projectteamdive.repository.MemberRepository;
import com.himedia.projectteamdive.repository.PlaycountlistRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DailyCountService {

    @Autowired
    private DailyCountRepository dcr;

    @Autowired
    private PlaycountlistRepository playcountlistRepository;

    @Autowired
    private MemberRepository memberRepository;

    // ✅ 매일 자정 자동 실행 (하루 단위 스트리밍 데이터 저장)
    @Scheduled(cron = "0 0 0 * * ?")
    public void saveDailyStreamingStats() {
        LocalDate yesterday = LocalDate.now();


        Optional<DailyCount> existingStats = dcr.findAllByDate(yesterday).stream().findFirst();

        // ✅ 해당 날짜의 Playcountlist 데이터 가져오기
        List<Playcountlist> playcountList = playcountlistRepository.findByIndateBetween(
                yesterday.atStartOfDay(), yesterday.plusDays(1).atStartOfDay());
        if (playcountList.isEmpty()) return;

        // ✅ 새로운 하루 단위 데이터 생성
        DailyCount stats = existingStats.orElseGet(DailyCount::new);
        stats.setDate(yesterday);
        stats.setTotalPlayCount(playcountList.size());


        stats.setMalePlayCount(calculatePlayCountByGender(playcountList, "male"));
        stats.setFemalePlayCount(calculatePlayCountByGender(playcountList, "female"));

        // ✅ 연령대별 재생 수 계산
        for (String ageGroup : List.of("10대", "20대", "30대", "40대", "50대 이상")) {
            setAgePlayCount(stats, playcountList, ageGroup);
        }

        dcr.save(stats);
        System.out.println("✅ 하루 단위 스트리밍 데이터 저장 완료: " + yesterday);
    }




    // ✅ 성별별 재생 수 계산
    private int calculatePlayCountByGender(List<Playcountlist> playcountList, String gender) {
        return (int) playcountList.stream()
                .filter(p -> {
                    // 🔹 MemberRepository에서 memberId를 기준으로 Member 정보 조회
                    Optional<Member> memberOpt = memberRepository.findById(p.getMemberId());
                    return memberOpt.map(member -> member.getGender().equalsIgnoreCase(gender)).orElse(false);
                })
                .count();
    }

    // ✅ 연령대별 스트리밍 수 자동 설정
    private void setAgePlayCount(DailyCount stats, List<Playcountlist> playcountList, String ageGroup) {
        int count = calculatePlayCountByAge(playcountList, ageGroup);
        switch (ageGroup) {
            case "10대" -> stats.setTeenPlayCount(count);
            case "20대" -> stats.setTwentiesPlayCount(count);
            case "30대" -> stats.setThirtiesPlayCount(count);
            case "40대" -> stats.setFortiesPlayCount(count);
            case "50대 이상" -> stats.setFiftiesPlusPlayCount(count);
        }
    }

    // ✅ 특정 연령대의 스트리밍 수 계산
    private int calculatePlayCountByAge(List<Playcountlist> playcountList, String ageGroup) {
        return (int) playcountList.stream()
                .filter(p -> {
                    // 🔹 MemberRepository에서 memberId를 기준으로 Member 정보 조회
                    Optional<Member> memberOpt = memberRepository.findById(p.getMemberId());
                    if (memberOpt.isPresent()) {
                        Member member = memberOpt.get();
                        return getAgeGroup(member.getBirthYear()).equals(ageGroup);
                    }
                    return false;
                })
                .count();
    }

    // ✅ 연령대 변환 (출생 연도 → 연령대)
    public String getAgeGroup(int birthYear) {
        int currentYear = LocalDate.now().getYear();
        int age = currentYear - birthYear;

        if (age < 20) return "10대";
        if (age < 30) return "20대";
        if (age < 40) return "30대";
        if (age < 50) return "40대";
        return "50대 이상";
    }



    public List<DailyCountDto> getStreamingStats(String type, LocalDate startDate, LocalDate endDate) {
        if ("daily".equalsIgnoreCase(type)) {
            return getDailyStreamingStats(startDate, endDate);
        } else if ("monthly".equalsIgnoreCase(type)) {
            return getMonthlyStreamingStats(startDate, endDate);
        } else if ("yearly".equalsIgnoreCase(type)) {
            return getYearlyStreamingStats(startDate, endDate);
        } else {
            throw new IllegalArgumentException("❌ 잘못된 요청 타입: " + type);
        }
    }



    /**
     * ✅ 특정 기간의 일별 스트리밍 통계 조회
     */
    public List<DailyCountDto> getDailyStreamingStats(LocalDate startDate, LocalDate endDate) {
        List<DailyCount> statsList = dcr.findByDateBetween(startDate, endDate);
        return statsList.stream().map(DailyCountDto::new).collect(Collectors.toList());
    }



    /**
     * ✅ 특정 기간의 월별 스트리밍 데이터 조회
     */
    public List<DailyCountDto> getMonthlyStreamingStats(LocalDate startDate, LocalDate endDate) {
        int startYear = startDate.getYear();
        int endYear = endDate.getYear();

        List<DailyCountDto> monthlyStats = new ArrayList<>();

        for (int year = startYear; year <= endYear; year++) {
            for (int month = 1; month <= 12; month++) {
                int totalPlayCount = dcr.sumTotalPlayCountByMonth(year, month).orElse(0);
                LocalDate monthDate = LocalDate.of(year, month, 1);
                monthlyStats.add(new DailyCountDto(monthDate, totalPlayCount));
            }
        }

        return monthlyStats;
    }

    /**
     * ✅ 특정 기간의 연도별 스트리밍 데이터 조회
     */
    public List<DailyCountDto> getYearlyStreamingStats(LocalDate startDate, LocalDate endDate) {
        int startYear = startDate.getYear();
        int endYear = endDate.getYear();

        List<DailyCountDto> yearlyStats = new ArrayList<>();

        for (int year = startYear; year <= endYear; year++) {
            int totalPlayCount = dcr.sumTotalPlayCountByYear(year).orElse(0);
            LocalDate yearDate = LocalDate.of(year, 1, 1);
            yearlyStats.add(new DailyCountDto(yearDate, totalPlayCount));
        }

        return yearlyStats;
    }




    public List<DailyCountDto> getDailyDetail(LocalDate date) {
        List<DailyCount> dailyCounts = dcr.findAllByDate(date);  // ✅ 특정 날짜의 모든 데이터 조회
        if (dailyCounts.isEmpty()) {
            throw new RuntimeException("❌ 해당 날짜의 데이터가 없습니다: " + date);
        }
        return dailyCounts.stream()
                .map(DailyCountDto::new)
                .collect(Collectors.toList());
    }





}
