package com.example.project.util;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

/**
 * AOP Aspect for logging security-related events.
 * Monitors authentication, authorization, and security violations.
 */
@Slf4j
@Aspect
@Component
public class SecurityLoggingAspect {

    /**
     * Log authentication attempts
     */
    @Around("execution(* com.example.project.security..authenticate(..))")
    public Object logAuthenticationAttempt(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = getHttpServletRequest();
        String clientIp = getClientIp(request);
        
        try {
            log.info("AUTHENTICATION_ATTEMPT: IP={}, Endpoint={}", clientIp, request != null ? request.getRequestURI() : "unknown");
            Object result = joinPoint.proceed();
            log.info("AUTHENTICATION_SUCCESS: IP={}", clientIp);
            return result;
        } catch (Exception e) {
            log.warn("AUTHENTICATION_FAILURE: IP={}, Reason={}", clientIp, e.getMessage());
            throw e;
        }
    }

    /**
     * Log authorization checks (Excludes Filters to avoid NPE part of Spring Boot 3 AOP issues)
     */
    @Around("execution(* com.example.project.security..*(..)) && !within(jakarta.servlet.Filter+) && !within(org.springframework.web.filter.GenericFilterBean+)")
    public Object logAuthorizationCheck(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String userName = getCurrentUserName();

        try {
            Object result = joinPoint.proceed();
            log.debug("AUTHORIZATION_GRANTED: User={}, Method={}", userName, methodName);
            return result;
        } catch (AccessDeniedException e) {
            log.warn("AUTHORIZATION_DENIED: User={}, Method={}", userName, methodName);
            throw e;
        }
    }

    /**
     * Log sensitive operations that require security validation
     */
    @Around("@annotation(com.example.project.util.RequiresSecurityCheck)")
    public Object logSecuritySensitiveOperation(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String userName = getCurrentUserName();
        Object[] args = joinPoint.getArgs();

        try {
            log.info("SENSITIVE_OPERATION_START: User={}, Class={}, Method={}", 
                userName, className, methodName);
            
            Object result = joinPoint.proceed();
            
            log.info("SENSITIVE_OPERATION_SUCCESS: User={}, Class={}, Method={}", 
                userName, className, methodName);
            
            return result;
        } catch (Exception e) {
            log.error("SENSITIVE_OPERATION_FAILED: User={}, Class={}, Method={}, Error={}", 
                userName, className, methodName, e.getMessage());
            throw e;
        }
    }

    /**
     * Get the current authenticated user name
     */
    private String getCurrentUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                return ((UserDetails) principal).getUsername();
            }
            return principal.toString();
        }
        return "ANONYMOUS";
    }

    /**
     * Get the current HTTP request
     */
    private HttpServletRequest getHttpServletRequest() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            return attributes != null ? attributes.getRequest() : null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Extract client IP address from request
     */
    private String getClientIp(HttpServletRequest request) {
        if (request == null) {
            return "UNKNOWN";
        }

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
