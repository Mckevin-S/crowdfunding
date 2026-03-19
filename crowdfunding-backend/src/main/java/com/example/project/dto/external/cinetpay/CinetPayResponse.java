package com.example.project.dto.external.cinetpay;

import lombok.Data;

@Data
public class CinetPayResponse {
    private String code;
    private String message;
    private DataContent data;

    @Data
    public static class DataContent {
        private String payment_url;
        private String payment_token;
    }
}
