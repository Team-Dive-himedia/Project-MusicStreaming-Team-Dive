package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.dto.DailyCountDto;
import com.himedia.projectteamdive.entity.DailyCount;
import com.himedia.projectteamdive.repository.DailyCountRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DailyCountService {

    @Autowired
    private DailyCountRepository dcr;

    // ✅ 하루 단위 스트리밍 데이터 저장 (매일 자정 실행)
   @Scheduled(cron = "0 0 0 * * ?")
    public void saveDailyStreamingStats() {
       LocalDate yesterday = LocalDate.now().minusDays(1);


        // ✅ 해당 날짜의 기존 데이터 삭제 (중복 저장 방지)
        dcr.deleteByDate(yesterday);

        // ✅ 새로운 하루 단위 데이터 생성
        DailyCount stats = new DailyCount();
        stats.setDate(yesterday);
        stats.setTotalPlayCount(calculateTotalPlayCount(yesterday));
        stats.setMalePlayCount(calculateGenderPlayCount(yesterday, "male"));
        stats.setFemalePlayCount(calculateGenderPlayCount(yesterday, "female"));

        // ✅ 연령대별 재생 수 계산
        for (String ageGroup : List.of("10대", "20대", "30대", "40대", "50대 이상")) {
            setAgePlayCount(stats, yesterday, ageGroup);
        }


        dcr.save(stats);
        System.out.println("✅ 하루 단위 스트리밍 데이터 저장 완료: " + yesterday);
    }

    public void forceSaveDailyStreamingStats(LocalDate targetDate) {
        System.out.println("🔹 강제 실행: " + targetDate);

        dcr.deleteByDate(targetDate);

        DailyCount stats = new DailyCount();
        stats.setDate(targetDate);
        stats.setTotalPlayCount(calculateTotalPlayCount(targetDate));
        stats.setMalePlayCount(calculateGenderPlayCount(targetDate, "male"));
        stats.setFemalePlayCount(calculateGenderPlayCount(targetDate, "female"));

        for (String ageGroup : List.of("10대", "20대", "30대", "40대", "50대 이상")) {
            setAgePlayCount(stats, targetDate, ageGroup);
        }

        dcr.save(stats);
        System.out.println("✅ 강제 저장 완료: " + targetDate);
    }

    // ✅ 특정 기간의 일별 스트리밍 통계 조회
    public List<DailyCountDto> getDailyStreamingStats(LocalDate startDate, LocalDate endDate) {
        List<DailyCount> statsList = dcr.findByDateBetween(startDate, endDate);
        return statsList.stream()
                .map(DailyCountDto::new) // ✅ DTO 변환
                .collect(Collectors.toList());
    }
    // ✅ 특정 연도의 월별 스트리밍 데이터를 조회
    public List<DailyCountDto> getMonthlyStreamingStats(int year) {
        List<DailyCountDto> monthlyStats = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            int totalPlayCount = dcr.sumTotalPlayCountByMonth(year, month).orElse(0);
            LocalDate monthDate = LocalDate.of(year, month, 1);

            // ✅ 새 생성자를 사용하여 DTO 생성
            monthlyStats.add(new DailyCountDto(monthDate, totalPlayCount));
        }

        return monthlyStats;
    }



    // ✅ 하루 전체 재생 수 계산
    private int calculateTotalPlayCount(LocalDate date) {
        return dcr.sumTotalPlayCountByDate(date).orElse(0);
    }

    // ✅ 성별별 재생 수 계산
    private int calculateGenderPlayCount(LocalDate date, String gender) {
        return "male".equalsIgnoreCase(gender) ?
                dcr.sumMalePlayCountByDate(date).orElse(0) :
                dcr.sumFemalePlayCountByDate(date).orElse(0);
    }

    // ✅ 연령대별 스트리밍 수 자동 설정
    private void setAgePlayCount(DailyCount stats, LocalDate date, String ageGroup) {
        int count = calculateAgePlayCount(date, ageGroup);
        switch (ageGroup) {
            case "10대" -> stats.setTeenPlayCount(count);
            case "20대" -> stats.setTwentiesPlayCount(count);
            case "30대" -> stats.setThirtiesPlayCount(count);
            case "40대" -> stats.setFortiesPlayCount(count);
            case "50대 이상" -> stats.setFiftiesPlusPlayCount(count);
        }
    }

    // ✅ 특정 연령대의 스트리밍 수 계산
    private int calculateAgePlayCount(LocalDate date, String ageGroup) {
        return switch (ageGroup) {
            case "10대" -> dcr.sumTeenPlayCountByDate(date).orElse(0);
            case "20대" -> dcr.sumTwentiesPlayCountByDate(date).orElse(0);
            case "30대" -> dcr.sumThirtiesPlayCountByDate(date).orElse(0);
            case "40대" -> dcr.sumFortiesPlayCountByDate(date).orElse(0);
            case "50대 이상" -> dcr.sumFiftiesPlusPlayCountByDate(date).orElse(0);
            default -> 0;
        };
    }



    // ✅ 연령대 변환 (출생 연도 → 연령대)
    public String getAgeGroup(int birthYear) {
        int currentYear = LocalDate.now().getYear();
        int age = currentYear - birthYear;

        if (age < 20) {
            return "10대";
        } else if (age < 30) {
            return "20대";
        } else if (age < 40) {
            return "30대";
        } else if (age < 50) {
            return "40대";
        } else {
            return "50대 이상";
        }


    }

    public DailyCountDto getDailyStreamingStatsByDate(LocalDate date) {
        return dcr.findByDate(date)
                .map(DailyCountDto::new)
                .orElseThrow(() -> new RuntimeException("❌ 해당 날짜의 데이터가 없습니다: " + date));
    }


}
