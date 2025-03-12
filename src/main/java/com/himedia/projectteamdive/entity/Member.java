package com.himedia.projectteamdive.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

    @ElementCollection(fetch = FetchType.EAGER)
    @Builder.Default
    private List<RoleName> memberRoleList = new ArrayList<RoleName>();


    public int getBirthYear() {
        try {
            // 🔹 birth가 "yyyy-MM-dd" 형식인 경우, "-"로 분리 후 첫 번째 요소(연도)만 추출
            return Integer.parseInt(this.birth.split("-")[0]);
        } catch (Exception e) {
            throw new RuntimeException("유효하지 않은 birth 값: " + this.birth);
        }
    }

    public LocalDate getBirthDate() {
        if (this.birth == null || this.birth.isEmpty()) {
            return null; // 또는 적절한 기본값 처리
        }
        try {
            return LocalDate.parse(this.birth, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        } catch (Exception e) {
            throw new RuntimeException("유효하지 않은 birth 값: " + this.birth);
        }
    }
}
