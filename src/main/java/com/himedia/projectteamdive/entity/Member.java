package com.himedia.projectteamdive.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
public class Member {
    @Id
    @Column(name = "member_id")
    private String memberId;
    private String password;
    private String name;
    private String nickname;
    private String phone;
    private String email;
    private String gender;
    private String birth;
    @Column(name ="zip_code" )
    private Integer zipCode ;
    private String address;
    @Column(name ="address_detail" )
    private String addressDetail;
    @Column(name ="address_extra" )
    private String addressExtra;
    private String image;
    @CreationTimestamp
    @Column(columnDefinition="DATETIME default now()")
    private Timestamp indate;
    private String provider;
    @Column(name = "member_key")
    private String memberKey;
    private String introduction;

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<RoleName> memberRoleList = new ArrayList<RoleName>();

    @OneToMany(mappedBy = "member",cascade = CascadeType.ALL, orphanRemoval = true)
    List<Playlist> playLists=new ArrayList<>();
}
