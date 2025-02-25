package com.himedia.projectteamdive.dto;

import com.himedia.projectteamdive.entity.Music;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MusicDto {
    private int musicId;
    private String title;
    private int playCount;
    private String genre;
    private String lyrics;
    private boolean titleMusic;
    private int trackNumber;
    private String bucketPath;
    private String content;
    private int artistId;
    private String artistName;
    private int albumId;
    private String albumTitle;
    private String image;
    private Timestamp albumIndate;

    // Music -> MusicDTO 변환
    public MusicDto(Music music) {
        this.musicId = music.getMusicId();
        this.title = music.getTitle();
        this.playCount = music.getPlayCount();
        this.genre = music.getGenre();
        this.lyrics = music.getLyrics();
        this.titleMusic = music.isTitleMusic();
        this.trackNumber = music.getTrackNumber();
        this.bucketPath = music.getBucketPath();
        this.content = music.getContent();
        this.artistId= music.getArtist().getArtistId();
        this.artistName = music.getArtist().getArtistName();
        this.albumId = music.getAlbum().getAlbumId();
        this.albumTitle = music.getAlbum().getTitle();
        this.image = music.getAlbum().getImage();
        this.albumIndate=music.getAlbum().getIndate();
    }
}