package com.himedia.projectteamdive.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ChatController {

    private static final String HF_CHAT_URL = "https://huggingface.co/chat/conversation";

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");

        // 요청 JSON 데이터 구성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("inputs", message);

        // HTTP 요청 헤더 설정 (Authorization 헤더 제거)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 요청 객체 생성
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // HTTP 요청 전송 및 응답 받기
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<Map> response = restTemplate.exchange(HF_CHAT_URL, HttpMethod.POST, entity, Map.class);

            // 응답 확인
            System.out.println("📩 Hugging Face 응답: " + response.getBody());

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace(); // 서버 로그 출력

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Hugging Face API 호출 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
