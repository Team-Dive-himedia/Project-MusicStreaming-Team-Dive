package com.himedia.projectteamdive.dto;

import com.himedia.projectteamdive.entity.DailyCount;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyCountDto {
    private Long id;
    private LocalDate date;
    private Integer totalPlayCount;
    private Integer malePlayCount;
    private Integer femalePlayCount;
    private Integer teenPlayCount;
    private Integer twentiesPlayCount;
    private Integer thirtiesPlayCount;
    private Integer fortiesPlayCount;
    private Integer fiftiesPlusPlayCount;

    private Map<String, Integer> genrePlayCounts;

    public DailyCountDto(DailyCount stats) {
        this.id = stats.getId();
        this.date = stats.getDate();
        this.totalPlayCount = stats.getTotalPlayCount();
        this.malePlayCount = stats.getMalePlayCount();
        this.femalePlayCount = stats.getFemalePlayCount();
        this.teenPlayCount = stats.getTeenPlayCount();
        this.twentiesPlayCount = stats.getTwentiesPlayCount();
        this.thirtiesPlayCount = stats.getThirtiesPlayCount();
        this.fortiesPlayCount = stats.getFortiesPlayCount();
        this.fiftiesPlusPlayCount = stats.getFiftiesPlusPlayCount();
    }


    public DailyCountDto(LocalDate monthDate, int totalPlayCount) {

        this.date = monthDate;
        this.totalPlayCount = totalPlayCount;
    }
}
