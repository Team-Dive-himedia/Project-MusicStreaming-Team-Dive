package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/AI")
public class AIController {

    @Autowired
    AIService AIs;

    @GetMapping("/recommendList")
    public HashMap<String, Object>recommendList(
            @RequestParam("mood")String mood,
            @RequestParam("memberId")String memberId){
        HashMap<String, Object> result = new HashMap<>();
        result.put("recommendList", AIs.getRecommend(mood, memberId));
        return result;
    }



}
