package com.example.project.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.util.UUID;

/**
 * HTTP Request/Response Interceptor for logging all API calls.
 * Logs request details, response status, and execution time.
 */
@Slf4j
@Component
public class HttpLoggingInterceptor implements HandlerInterceptor {

    private static final String REQUEST_ID_HEADER = "X-Request-ID";
    private static final String START_TIME_ATTRIBUTE = "start-time";
    private static final String REQUEST_ID_ATTRIBUTE = "request-id";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String requestId = UUID.randomUUID().toString();
        long startTime = System.currentTimeMillis();

        request.setAttribute(REQUEST_ID_ATTRIBUTE, requestId);
        request.setAttribute(START_TIME_ATTRIBUTE, startTime);

        String method = request.getMethod();
        String endpoint = request.getRequestURI();
        String queryString = request.getQueryString();
        String userAgent = request.getHeader("User-Agent");

        log.info("REQUEST_START [{}] {} {} | IP: {} | User-Agent: {}", 
            requestId, method, endpoint, 
            getClientIp(request), 
            userAgent);

        if (queryString != null && !queryString.isEmpty()) {
            log.debug("REQUEST_PARAMS [{}] Query: {}", requestId, queryString);
        }

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, 
                          ModelAndView modelAndView) {
        // Intentionally empty
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, 
                               Exception ex) {
        String requestId = (String) request.getAttribute(REQUEST_ID_ATTRIBUTE);
        long startTime = (long) request.getAttribute(START_TIME_ATTRIBUTE);
        long duration = System.currentTimeMillis() - startTime;

        String method = request.getMethod();
        String endpoint = request.getRequestURI();
        int status = response.getStatus();

        if (duration > 1000) {
            log.warn("SLOW_REQUEST [{}] {} {} | Status: {} | Duration: {}ms", 
                requestId, method, endpoint, status, duration);
        } else {
            log.info("REQUEST_END [{}] {} {} | Status: {} | Duration: {}ms", 
                requestId, method, endpoint, status, duration);
        }

        if (ex != null) {
            log.error("REQUEST_EXCEPTION [{}] {} {} | Exception: {}", 
                requestId, method, endpoint, ex.getMessage(), ex);
        }

        response.setHeader(REQUEST_ID_HEADER, requestId);
    }

    /**
     * Extract client IP address from request
     */
    private String getClientIp(HttpServletRequest request) {
        String[] ipHeaders = {
            "X-Forwarded-For",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_CLIENT_IP",
            "HTTP_X_FORWARDED_FOR"
        };

        for (String header : ipHeaders) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip.split(",")[0];
            }
        }

        return request.getRemoteAddr();
    }
}
