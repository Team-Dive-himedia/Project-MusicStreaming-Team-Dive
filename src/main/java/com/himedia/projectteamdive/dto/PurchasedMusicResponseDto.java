package com.himedia.projectteamdive.dto;

import lombok.Getter;

@Getter
public class PurchasedMusicResponseDto {
    private int musicId;
    private String title;
    private String artist;

    public PurchasedMusicResponseDto(int musicId, String title, String artist) {
        this.musicId = musicId;
        this.title = title;
        this.artist = artist;
    }
}
