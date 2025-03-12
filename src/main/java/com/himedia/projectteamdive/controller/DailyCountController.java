package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.dto.DailyCountDto;
import com.himedia.projectteamdive.service.DailyCountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/stats")
public class DailyCountController {

    @Autowired
    private DailyCountService dcs;






    @GetMapping("/daily")
    public List<DailyCountDto> getStreamingStats(
            @RequestParam String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        System.out.println("📊 요청 타입: " + type + " | 기간: " + startDate + " ~ " + endDate);
        return dcs.getStreamingStats(type, startDate, endDate);
    }

    /**
     * ✅ 일별, 월별, 연도별 통계 상세 조회 API
     * @param type "daily" | "monthly" | "yearly"
     * @param date 기준 날짜 (yyyy-MM-dd)
     * @return DailyCountDto 리스트
     */


    @GetMapping("/detail")
    public ResponseEntity<?> getDetailStats(
            @RequestParam String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        try {
            List<DailyCountDto> stats = dcs.getDetailStats(type, date);
            return ResponseEntity.ok(stats);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("❌ 잘못된 요청: " + e.getMessage());
        }
    }




    @GetMapping("/dailyDetail/{date}")
    public List<DailyCountDto> getDailyStatsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        System.out.println("세부 데이터 조회 요청: " + date);

        List<DailyCountDto> statsList = dcs.getDailyDetail(date);

        if (statsList.isEmpty()) {
            System.out.println("해당 날짜의 데이터가 없습니다: " + date);
            throw new RuntimeException("해당 날짜의 데이터가 없습니다: " + date);
        }

        // 조회된 데이터 개수 출력
        System.out.println("조회된 데이터 개수: " + statsList.size());

        statsList.forEach(stats -> {
            System.out.println("날짜: " + stats.getDate() + ",총 재생 수: " + stats.getTotalPlayCount());
            System.out.println("성별 - 남성: " + stats.getMalePlayCount() + ", 여성: " + stats.getFemalePlayCount());
            System.out.println("연령대 - 10대: " + stats.getTeenPlayCount() + ", 20대: " + stats.getTwentiesPlayCount() +
                    ", 30대: " + stats.getThirtiesPlayCount() + ", 40대: " + stats.getFortiesPlayCount() +
                    ", 50대 이상: " + stats.getFiftiesPlusPlayCount());
        });

        return statsList;
    }





}
