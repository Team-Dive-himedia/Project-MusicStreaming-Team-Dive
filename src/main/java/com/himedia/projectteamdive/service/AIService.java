package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.dto.MusicDto;
import com.himedia.projectteamdive.dto.RecommendationScore;
import com.himedia.projectteamdive.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AIService {

    @Autowired
    MusicRepository mr;
    @Autowired
    MemberRecentMusicsRepository mrmr;

    public List<MusicDto> getRecommend(String mood, String memberId) {
        System.out.println("추천 시스템 실행: mood=" + mood + ", memberId=" + memberId);

        List<String> genre = getRecommendedGenres(mood);
        List<String> similarMoods = getSimilarMoods(mood);
        RecommendationScore score = getRecommendationScore(mood);

        List<MusicDto> musicList = new ArrayList<>();

        // 감정과 장르에 따른 추천
        try {
            List<MusicDto> moodBasedMusic = mr.getMusicByMoodAndGenre(mood, genre, score.getEmotionScore());
            if (moodBasedMusic == null || moodBasedMusic.isEmpty()) {
                System.out.println("감정 기반 추천 결과 없음");
            } else {
                musicList.addAll(moodBasedMusic);
                System.out.println("감정기반 추가된 개수: " + moodBasedMusic.size());
            }
        } catch (Exception e) {
            System.out.println("감정 기반 추천 예외 발생: " + e.getMessage());
            e.printStackTrace();
        }

        // 유사 감정과 장르에 따른 추천
        try {
            if (musicList.size() < score.getTotalLimit()) {
                List<MusicDto> similarMoodMusic = mr.getMusicBySimilarMoodsAndGenre(similarMoods, genre, score.getSimilarScore());
                if (similarMoodMusic != null && !similarMoodMusic.isEmpty()) {
                    musicList.addAll(similarMoodMusic);
                    System.out.println("유사 감정 기반 추가된 개수: " + similarMoodMusic.size());
                } else {
                    System.out.println("유사 감정 기반 추천 결과 없음");
                }
            }
        } catch (Exception e) {
            System.out.println("유사 감정 기반 추천 예외 발생: " + e.getMessage());
            e.printStackTrace();
        }

        // 최근 음악 재생 목록에서 추천
        try {
            if (musicList.size() < score.getTotalLimit()) {
                List<Integer> recentMusicIds = mrmr.getRecentMusicIdsByMemberId(memberId, score.getRecentMusicScore());
                if (recentMusicIds != null && !recentMusicIds.isEmpty()) {
                    List<MusicDto> recentMusic = mr.getMusicByIds(recentMusicIds);
                    if (recentMusic != null && !recentMusic.isEmpty()) {
                        musicList.addAll(recentMusic);
                        System.out.println("최근 음악 기반 추가된 개수: " + recentMusic.size());
                    } else {
                        System.out.println("최근 음악 추천 결과 없음");
                    }
                } else {
                    System.out.println("최근 재생 음악 ID 없음");
                }
            }
        } catch (Exception e) {
            System.out.println("최근 음악 추천 예외 발생: " + e.getMessage());
            e.printStackTrace();
        }

        // 부족할 경우 랜덤으로 추천
        try {
            if (musicList.size() < score.getTotalLimit()) {
                List<MusicDto> randomMusic = mr.getRandomMusic(score.getRandomScore());
                if (randomMusic != null && !randomMusic.isEmpty()) {
                    musicList.addAll(randomMusic);
                    System.out.println("랜덤 추천 기반 추가된 개수: " + randomMusic.size());
                } else {
                    System.out.println("랜덤 추천 결과 없음");
                }
            }
        } catch (Exception e) {
            System.out.println("랜덤 음악 추천 예외 발생: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("최종 추천 음악 개수: " + musicList.size());
        return musicList.stream().limit(50).toList();
    }

    private List<String> getRecommendedGenres(String mood) {
        switch (mood.toLowerCase()) {
            case "happy":
                return List.of("팝", "록", "전자음악");
            case "sad":
                return List.of("재즈", "클래식", "기타");
            case "angry":
                return List.of("힙합&랩", "록", "전자음악");
            case "boring":
                return List.of("클래식", "기타", "재즈");
            case "normal":
            default:
                return List.of("록", "팝", "힙합&랩", "재즈", "클래식", "전자음악", "기타");
        }
    }

    private List<String> getSimilarMoods(String mood) {
        switch (mood.toLowerCase()) {
            case "happy":
                return List.of("normal", "angry");
            case "sad":
                return List.of("boring", "normal");
            case "angry":
                return List.of("normal", "boring");
            case "boring":
                return List.of("sad", "happy");
            case "normal":
            default:
                return List.of("happy", "sad", "angry");
        }
    }

    private RecommendationScore getRecommendationScore(String mood) {
        int totalLimit = 50;

        switch (mood.toLowerCase()) {
            case "happy":
                return calculateRecommendationScore(totalLimit, 0.6, 0.2, 0.1, 0.1);
            case "sad":
                return calculateRecommendationScore(totalLimit, 0.7, 0.2, 0.06, 0.04);
            case "angry":
                return calculateRecommendationScore(totalLimit, 0.6, 0.2, 0.14, 0.06);
            case "boring":
                return calculateRecommendationScore(totalLimit, 0.5, 0.3, 0.14, 0.06);
            case "normal":
            default:
                return calculateRecommendationScore(totalLimit, 0.4, 0.3, 0.2, 0.1);
        }
    }

    private RecommendationScore calculateRecommendationScore(int total, double emotionRatio, double similarRatio, double recentRatio, double randomRatio) {
        int emotionScore = (int) (total * emotionRatio);
        int similarScore = (int) (total * similarRatio);
        int recentScore = (int) (total * recentRatio);
        int randomScore = total - (emotionScore + similarScore + recentScore);

        return new RecommendationScore(emotionScore, similarScore, recentScore, randomScore);
    }
}
