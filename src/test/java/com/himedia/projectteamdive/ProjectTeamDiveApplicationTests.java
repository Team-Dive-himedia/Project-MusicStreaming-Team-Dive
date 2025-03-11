package com.himedia.projectteamdive;

import com.himedia.projectteamdive.entity.Allpage;
import com.himedia.projectteamdive.entity.Pagetype;
import com.himedia.projectteamdive.entity.Reply;
import com.himedia.projectteamdive.repository.AllpageRepository;
import com.himedia.projectteamdive.service.CommunityService;
import com.himedia.projectteamdive.service.MusicService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.List;

@SpringBootTest
class ProjectTeamDiveApplicationTests {

    @Autowired
    CommunityService communityService;
    @Autowired
    AllpageRepository allpageRepository;

    @Autowired
    MusicService musicService;
    @Test
    void contextLoads() {
        Pagetype P=Pagetype.valueOf("MUSIC");
        System.out.println(communityService.getReplyList("MUSIC","abc1"));

    }




}
