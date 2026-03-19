package com.example.project.dto.external.cinetpay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class CinetPayRequest {
    private String apikey;
    
    @JsonProperty("site_id")
    private String siteId;
    
    @JsonProperty("transaction_id")
    private String transactionId;
    
    private BigDecimal amount;
    private String currency;
    private String description;
    
    @JsonProperty("notify_url")
    private String notifyUrl;
    
    @JsonProperty("return_url")
    private String returnUrl;
    
    @Builder.Default
    private String channels = "ALL";
    
    @Builder.Default
    private String lang = "fr";
}
