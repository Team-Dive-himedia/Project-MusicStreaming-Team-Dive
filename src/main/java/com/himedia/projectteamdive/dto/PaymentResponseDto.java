package com.himedia.projectteamdive.dto;

import com.himedia.projectteamdive.entity.Payment;
import lombok.Getter;

import java.sql.Timestamp;

/* 서버 -> 클라이언트로 결제 정보를 보낼 때 사용 */
@Getter
public class PaymentResponseDto {
    private String orderId;
    private int amount;
    private String orderName;
    private String paymentKey;
    private boolean isPaid; // 결제 완료 여부
    private String failReason; // 실패 이유
    private String cancelStatus; // 결제 취소 상태
    private String cancelReason; // 취소 이유
    private Timestamp createAt; // 생성 날짜

    public PaymentResponseDto(Payment payment) {
        this.orderId = payment.getOrderId();
        this.amount = payment.getAmount();
        this.orderName = payment.getOrderName();
        this.isPaid = payment.isPaid();
        this.paymentKey = payment.getPaymentKey();

        this.failReason = payment.getFailReason();
        this.cancelStatus = payment.getCancelStatus();
        this.cancelReason = payment.getCancelReason();
        this.createAt = payment.getCreatedAt();
    }
}
