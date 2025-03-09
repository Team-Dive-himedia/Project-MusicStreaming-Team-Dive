package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.dto.DailyCountDto;
import com.himedia.projectteamdive.service.DailyCountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/stats")
public class DailyCountController {

    @Autowired
    private DailyCountService dailyCountService;

    // ✅ 특정 기간의 일별 스트리밍 데이터 조회
    @GetMapping("/daily")
    public List<DailyCountDto> getDailyStreamingStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        System.out.println("📅 조회 요청: " + startDate + " ~ " + endDate);

        List<DailyCountDto> stats = dailyCountService.getDailyStreamingStats(startDate, endDate);

        // ✅ 조회된 데이터 개수 출력
        System.out.println("✅ 조회된 데이터 개수: " + stats.size());
        stats.forEach(stat -> {
            System.out.println("📆 날짜: " + stat.getDate() + ", 🎵 총 재생 수: " + stat.getTotalPlayCount());
        });

        return stats;
    }

    @GetMapping("/monthly")
    public List<DailyCountDto> getMonthlyStreamingStats(@RequestParam int year) {
        return dailyCountService.getMonthlyStreamingStats(year);
    }


    @GetMapping("/dailyDetail/{date}")
    public DailyCountDto getDailyStatsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        System.out.println("📅 세부 데이터 조회 요청: " + date);

        DailyCountDto stats = dailyCountService.getDailyStreamingStatsByDate(date);

        System.out.println("✅ 조회된 날짜: " + stats.getDate());
        System.out.println("🎵 총 재생 수: " + stats.getTotalPlayCount());
        System.out.println("👨‍👩‍👦‍👦 성별 - 남성: " + stats.getMalePlayCount() + ", 여성: " + stats.getFemalePlayCount());
        System.out.println("🔢 연령대 - 10대: " + stats.getTeenPlayCount() + ", 20대: " + stats.getTwentiesPlayCount() +
                ", 30대: " + stats.getThirtiesPlayCount() + ", 40대: " + stats.getFortiesPlayCount() +
                ", 50대 이상: " + stats.getFiftiesPlusPlayCount());

        return stats;
    }

    // ✅ 수동 실행을 위한 API
    @PostMapping("/saveManual")
    public String forceSaveDailyStats(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        dailyCountService.forceSaveDailyStreamingStats(date);
        return "✅ " + date + " 데이터 강제 저장 완료!";
    }


}
