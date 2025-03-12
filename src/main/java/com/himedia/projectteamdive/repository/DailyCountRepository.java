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



    @Query("SELECT SUM(d.totalPlayCount) FROM DailyCount d WHERE YEAR(d.date) = :year")
    Optional<Integer> sumTotalPlayCountByYear(@Param("year") int year);

    @Query("SELECT SUM(d.totalPlayCount) FROM DailyCount d WHERE YEAR(d.date) = :year AND MONTH(d.date) = :month")
    Optional<Integer> sumTotalPlayCountByMonth(@Param("year") int year, @Param("month") int month);

    List<DailyCount> findByDateBetween(LocalDate startDate, LocalDate endDate);



    void deleteByDate(LocalDate targetDate);

    @Query("SELECT d FROM DailyCount d WHERE d.date = :date")
    List<DailyCount> findAllByDate(@Param("date") LocalDate date);

    Optional<DailyCount> findByDate(LocalDate yesterday);
}
