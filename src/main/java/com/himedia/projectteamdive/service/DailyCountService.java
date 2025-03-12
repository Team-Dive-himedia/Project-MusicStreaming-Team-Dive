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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.stream.Collectors;
import java.util.*;

@Service
public class DailyCountService {
    @Autowired
    private DailyCountRepository dcr;
    @Autowired
    private PlaycountlistRepository pcr;
    @Autowired
    private MemberRepository mr;



    // ✅ 매일 자정 자동 실행 (하루 단위 스트리밍 데이터 저장)
    @Scheduled(cron = "0 0 0  * * ?")
    @Transactional
    public void saveDailyStreamingStats() {
        LocalDate yesterday = LocalDate.now().minusDays(1);

        // ✅ 기존 데이터가 있는지 확인하고 없으면 새로 생성
        DailyCount stats = dcr.findByDate(yesterday).orElseGet(() -> {
            DailyCount newStats = new DailyCount();
            newStats.setDate(yesterday);
            return newStats;
        });


        // ✅ 해당 날짜의 Playcountlist 데이터 가져오기
        List<Playcountlist> playcountList = pcr.findByIndateBetween(
                yesterday.atStartOfDay(), yesterday.plusDays(1).atStartOfDay());
        if (playcountList.isEmpty()) return;

        Map<String, Member> memberCache = new HashMap<>();
        for (Playcountlist pc : playcountList) {
            if (!memberCache.containsKey(pc.getMemberId())) {
                Member member = mr.findByMemberId(pc.getMemberId());
                memberCache.put(pc.getMemberId(), member);
            }
        }



        stats.setTotalPlayCount(playcountList.stream().mapToInt(Playcountlist::getPlayCount).sum());
        stats.setMalePlayCount(calculatePlayCountByGender(playcountList, memberCache, "male"));
        stats.setFemalePlayCount(calculatePlayCountByGender(playcountList, memberCache, "female"));
        stats.setUnknownGenderPlayCount(calculateUnknownGenderPlayCount(playcountList, memberCache));

        List<String> ageGroups = List.of("10대", "20대", "30대", "40대", "50대 이상");
        ageGroups.forEach(ageGroup -> setAgePlayCount(stats, playcountList, memberCache , ageGroup));


        dcr.save(stats);
        System.out.println("✅ 하루 단위 스트리밍 데이터 저장 완료: " + yesterday);
    }




    // ✅ 성별별 재생 수 계산
    private int calculatePlayCountByGender(List<Playcountlist> playcountList, Map<String, Member> memberCache, String gender) {
        return playcountList.stream()
                .filter(pc -> {
                    Member member = memberCache.get(pc.getMemberId());
                    return member != null && gender.equalsIgnoreCase(member.getGender());
                })
                .mapToInt(Playcountlist::getPlayCount)
                .sum();
    }

    private int calculateUnknownGenderPlayCount(List<Playcountlist> playcountList, Map<String, Member> memberCache) {
        return playcountList.stream()
                .filter(pc -> {
                    Member member = memberCache.get(pc.getMemberId());
                    return member == null || member.getGender() == null; // ✅ 성별이 null인 경우
                })
                .mapToInt(Playcountlist::getPlayCount)
                .sum();
    }






    // ✅ 연령대별 스트리밍 수 자동 설정
    private void setAgePlayCount(DailyCount stats, List<Playcountlist> playcountList, Map<String, Member> memberCache, String ageGroup) {
        int playCount = playcountList.stream()
                .filter(pc -> {
                    Member member = memberCache.get(pc.getMemberId());
                    return member != null && ageGroup.equals(getAgeGroup(member.getBirthDate()));
                })
                .mapToInt(Playcountlist::getPlayCount)
                .sum();
        switch (ageGroup) {
            case "10대": stats.setTeenPlayCount(playCount); break;
            case "20대": stats.setTwentiesPlayCount(playCount); break;
            case "30대": stats.setThirtiesPlayCount(playCount); break;
            case "40대": stats.setFortiesPlayCount(playCount); break;
            case "50대 이상": stats.setFiftiesPlusPlayCount(playCount); break;
        }
    }


    // ✅ 연령대 변환 (출생 연도 → 연령대)
    private String getAgeGroup(LocalDate birthDate) {
        if (birthDate == null) return "50대 이상"; // 기본값 설정
        int age = Period.between(birthDate, LocalDate.now()).getYears();
        if (age < 20) return "10대";
        if (age < 30) return "20대";
        if (age < 40) return "30대";
        if (age < 50) return "40대";
        return "50대 이상";
    }


    // ✅ 특정 기간의 스트리밍 통계 조회
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



    // ✅ 특정 기간의 일별 스트리밍 통계 조회
    public List<DailyCountDto> getDailyStreamingStats(LocalDate startDate, LocalDate endDate) {
        List<DailyCount> statsList = dcr.findByDateBetween(startDate, endDate);
        return statsList.stream().map(DailyCountDto::new).collect(Collectors.toList());
    }



    // ✅ 특정 기간의 월별 스트리밍 데이터 조회
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

    // ✅ 특정 기간의 연도별 스트리밍 데이터 조회
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





    public List<DailyCountDto> getDetailStats(String type, LocalDate date) {
        List<DailyCount> statsList;

        switch (type.toLowerCase()) {
            case "daily":
                LocalDate dailyStart = date.withDayOfMonth(1);
                LocalDate dailyEnd = date.withDayOfMonth(date.lengthOfMonth());
                statsList = dcr.findByDateBetween(dailyStart, dailyEnd);
                break;
            case "monthly":
                LocalDate monthStart = date.withMonth(1).withDayOfMonth(1);
                LocalDate monthEnd = date.withMonth(12).withDayOfMonth(31);
                statsList = dcr.findByDateBetween(monthStart, monthEnd);
                break;
            case "yearly":
                LocalDate yearStart = date.minusYears(9).withMonth(1).withDayOfMonth(1);
                LocalDate yearEnd = date.withMonth(12).withDayOfMonth(31);
                statsList = dcr.findByDateBetween(yearStart, yearEnd);
                break;
            default:
                throw new IllegalArgumentException("❌ 잘못된 조회 타입: " + type);
        }

        return statsList.stream()
                .map(DailyCountDto::new)
                .collect(Collectors.toList());
    }


    public List<DailyCountDto> getDailyDetail(LocalDate date) {
        List<DailyCountDto> statsList = new ArrayList<>();
        return statsList;
    }
}
