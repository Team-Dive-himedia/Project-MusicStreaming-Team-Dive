package com.himedia.projectteamdive.repository;


import com.himedia.projectteamdive.entity.DailyCount;
import com.himedia.projectteamdive.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface DailyCountRepository extends JpaRepository<DailyCount, Long> {

    // ✅ 해당 날짜의 기존 데이터 삭제 (중복 저장 방지)
    void deleteByDate(LocalDate yesterday);


    // ✅ 특정 날짜의 일별 스트리밍 데이터 조회
    Optional<DailyCount> findByDate(LocalDate date);

    // ✅ 특정 기간 동안의 일별 스트리밍 데이터 조회
    List<DailyCount> findByDateBetween(LocalDate startDate, LocalDate endDate);

    // ✅ 특정 연도의 특정 월 총 스트리밍 수 합산
    @Query("SELECT SUM(d.totalPlayCount) FROM DailyCount d WHERE YEAR(d.date) = :year AND MONTH(d.date) = :month")
    Optional<Integer> sumTotalPlayCountByMonth(@Param("year") int year, @Param("month") int month);



    // ✅ 하루 총 스트리밍 수 합산
    @Query("SELECT SUM(d.totalPlayCount) FROM DailyCount d WHERE d.date = :date")
    Optional<Integer> sumTotalPlayCountByDate(LocalDate date);

    // ✅ 성별 스트리밍 수 합산
    @Query("SELECT SUM(d.malePlayCount) FROM DailyCount d WHERE d.date = :date")
    Optional<Integer> sumMalePlayCountByDate(LocalDate date);

    @Query("SELECT SUM(d.femalePlayCount) FROM DailyCount d WHERE d.date = :date")
    Optional<Integer> sumFemalePlayCountByDate(LocalDate date);

    // ✅ 연령대별 스트리밍 수 합산
    @Query("SELECT SUM(d.teenPlayCount) FROM DailyCount d WHERE d.date = :date")
    Optional<Integer> sumTeenPlayCountByDate(LocalDate date);

    @Query("SELECT SUM(d.twentiesPlayCount) FROM DailyCount d WHERE d.date = :date")
    Optional<Integer> sumTwentiesPlayCountByDate(LocalDate date);

    @Query("SELECT SUM(d.thirtiesPlayCount) FROM DailyCount d WHERE d.date = :date")
    Optional<Integer> sumThirtiesPlayCountByDate(LocalDate date);

    @Query("SELECT SUM(d.fortiesPlayCount) FROM DailyCount d WHERE d.date = :date")
    Optional<Integer> sumFortiesPlayCountByDate(LocalDate date);

    @Query("SELECT SUM(d.fiftiesPlusPlayCount) FROM DailyCount d WHERE d.date = :date")
    Optional<Integer> sumFiftiesPlusPlayCountByDate(LocalDate date);




}
