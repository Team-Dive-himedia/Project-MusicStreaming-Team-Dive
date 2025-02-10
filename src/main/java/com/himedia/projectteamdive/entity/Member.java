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
    private Timestamp birth;
    private String address;
    @Column(name ="address_detail" )
    private String addressDetail;
    @Column(name ="address_extra" )
    private String addressExtra;
    @Column(name ="zip_code" )
    private String zipCode;
    private String image;
    @CreationTimestamp
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;
    private String provider;

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<RoleName> memberRoleList = new ArrayList<RoleName>();

}
