package com.himedia.projectteamdive.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Map;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "daily_count")
public class DailyCount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date; // ✅ 해당 날짜

    @Column(name ="total_play_count" )
    private int totalPlayCount; // ✅ 하루 총 스트리밍 수

    @Column(name ="male_play_count" )
    private int malePlayCount;

    @Column(name ="female_play_count" )
    private int femalePlayCount;

    @Column(name ="teen_play_count" )
    private int teenPlayCount;

    @Column(name ="twenties_play_count" )
    private int twentiesPlayCount;

    @Column(name ="thirties_play_count" )
    private int thirtiesPlayCount;

    @Column(name ="forties_play_count" )
    private int fortiesPlayCount;

    @Column(name ="fifties_plus_play_count" )
    private int fiftiesPlusPlayCount;

    @Column(name ="unknown_gender_play_count" )
    private int unknownGenderPlayCount = 0;


}
