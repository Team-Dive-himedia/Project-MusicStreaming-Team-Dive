package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.entity.Likes;
import com.himedia.projectteamdive.entity.Reply;
import com.himedia.projectteamdive.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/Community")
public class CommunityController {
    @Autowired
    CommunityService cs;

    @PostMapping("/insertReply")
    public HashMap<String,Object> insertReply(@RequestBody Reply reply, @RequestParam("pagetype")String type,@RequestParam("entityId")int entityId) {
        HashMap<String,Object> map = new HashMap<>();
        cs.insertReply(reply,type,entityId);
        map.put("msg","yes");
        return map;
    }

    @DeleteMapping("/deleteReply")
    public HashMap<String,Object> deleteReply(@RequestParam("replyId")int replyId) {
        HashMap<String,Object> map = new HashMap<>();
        cs.deleteReply(replyId);
        map.put("msg","yes");
        return map;
    }

    @PostMapping("/insertLikes")
    public HashMap<String,Object> insertLikes(@RequestParam("memberId")String memberId,
                                              @RequestParam("pagetype")String type,@RequestParam("entityId")int entityId) {
        HashMap<String,Object> map = new HashMap<>();
        cs.insertLikes(memberId,type,entityId);
        map.put("msg","yes");
        return map;
    }

    @GetMapping("/getReply")
    public HashMap<String,Object> getReply(@RequestParam("pagetype")String type,@RequestParam("entityId")int entityId) {
        HashMap<String,Object> map = new HashMap<>();
        map.put("reply",cs.getReply(type,entityId));
        return map;
    }

    @GetMapping("/getLikes")
    public HashMap<String,Object> getLikes(@RequestParam("memberId")String memberId
    ) {
        HashMap<String,Object> map = new HashMap<>();
        map.put("LikesList",cs.getLikes(memberId));
        return map;
    }

}
