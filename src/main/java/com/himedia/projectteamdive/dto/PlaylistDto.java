package com.himedia.projectteamdive.dto;

import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.Music;
import com.himedia.projectteamdive.entity.Playlist;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistDto {
    private int playlistId;
    private String title;
    private String coverImage;
    private String content;
    private String memberId;
    private List<MusicDto> musicList;
    private boolean shayringyn;
    private Timestamp indate;

    public PlaylistDto(Playlist playlist) {
        this.playlistId = playlist.getPlaylistId();
        this.title = playlist.getTitle();
        this.coverImage = playlist.getCoverImage();
        this.content = playlist.getContent();
        this.memberId = playlist.getMember().getMemberId();
        this.musicList = playlist.getMusicList().stream().map(MusicDto::new).collect(Collectors.toList());
        this.shayringyn = playlist.isShayringyn();
        this.indate = playlist.getIndate();
    }

}
