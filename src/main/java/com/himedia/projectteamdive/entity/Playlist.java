package com.himedia.projectteamdive.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
public class Playlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playlist_id")
    private int playlistId;
    private String title;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member;

    @ManyToMany
    @JoinTable(name = "Playlist_music",
            joinColumns = @JoinColumn(name = "playlist_id"),
            inverseJoinColumns = @JoinColumn(name = "music_id"))
    @OrderColumn(name = "order_index")  // 추가: 순서 컬럼 지정
    private List<Music> musicList = new ArrayList<>();

    @ColumnDefault("false")
    private boolean shayringyn;

    public void addMusic(Music music) {
        if (!this.musicList.contains(music)) {
            this.musicList.add(music);
            music.getPlaylists().add(this);  // Music 엔티티에도 반대로 추가
        }
    }
    public void removeMusic(Music music) {
        if (this.musicList.contains(music)) {
            this.musicList.remove(music);
            music.getPlaylists().remove(this);
        }

    }

}
