package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.dto.MemberRecentMusicsDto;
import com.himedia.projectteamdive.dto.MusicDto;
import com.himedia.projectteamdive.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface MusicRepository extends JpaRepository<Music, Integer> {

    Music findByMusicId(int musicId);

    List<MusicDto> findByTitleContainingIgnoreCase(String title);

    List<MusicDto> findByLyricsContainingIgnoreCase(String lyrics);

    List<Music> findByMoodContaining(String mood);

    @Query("Select m From Music m Where m.mood = :mood And m.genre In :genres ORDER BY RAND() Limit :limit")
    List<MusicDto> getMusicByMoodAndGenre(@Param("mood") String mood, @Param("genres") List<String> genres, @Param("limit") int limit);

    @Query("Select m From Music m Where m.mood In :mood And m.genre In :genres ORDER BY RAND() LIMIT :limit")
    List<MusicDto> getMusicBySimilarMoodsAndGenre(@Param("mood") List<String> mood, @Param("genres") List<String> genres, @Param("limit") int limit);

    @Query("Select m From Music m JOIN Playcountlist p ON m.musicId = p.music.musicId GROUP BY m.musicId ORDER BY SUM(p.playCount) DESC LIMIT :limit")
    List<MusicDto> getPopularMusic(@Param("limit") int limit);

    @Query("Select m From Music m ORDER BY RAND() LIMIT :limit")
    List<MusicDto> getRandomMusic(@Param("limit") int limit);

    @Query("SELECT m FROM Music m WHERE m.musicId IN :musicId")
    List<MusicDto> getMusicByIds(@Param("musicId") List<Integer> musicId);

//    @Query("SELECT m FROM Music m WHERE m.musicId IN :ids ORDER BY m.tracknumber ASC")
//    List<Music> findAllByMusicId(@Param("ids") List<Integer> ids);


//    @Modifying
//    @Query("update Music m set m.playCountDay=0")
//    void resetPlayCountDay();
//
//    @Modifying
//    @Query("update Music m set m.playCountWeek=0")
//    void resetPlayCountWeek();
//
//    @Modifying
//    @Query("update Music m set m.playCountMonth=0")
//    void resetPlayCountMonth();

}
