package com.example.project.util;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * AOP Aspect for logging method execution times and performance metrics.
 * Monitors all service methods and logs slow operations.
 */
@Slf4j
@Aspect
@Component
public class PerformanceLoggingAspect {

    private static final long SLOW_THRESHOLD = 500; // milliseconds

    /**
     * Log execution time for all service methods
     */
    @Around("execution(* com.example.project.service..*(..))")
    public Object logServiceMethodPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        long startTime = System.currentTimeMillis();
        log.debug("SERVICE_METHOD_START: {}.{}", className, methodName);

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            if (duration > SLOW_THRESHOLD) {
                log.warn("SLOW_SERVICE_METHOD: {}.{} took {}ms (threshold: {}ms)", 
                    className, methodName, duration, SLOW_THRESHOLD);
            } else {
                log.debug("SERVICE_METHOD_END: {}.{} | Duration: {}ms", className, methodName, duration);
            }

            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("SERVICE_METHOD_EXCEPTION: {}.{} | Duration: {}ms | Exception: {}", 
                className, methodName, duration, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Log execution time for all controller methods
     */
    @Around("execution(* com.example.project.controller..*(..))")
    public Object logControllerMethodPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        long startTime = System.currentTimeMillis();
        log.debug("CONTROLLER_METHOD_START: {}.{}", className, methodName);

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            log.debug("CONTROLLER_METHOD_END: {}.{} | Duration: {}ms", className, methodName, duration);
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("CONTROLLER_METHOD_EXCEPTION: {}.{} | Duration: {}ms | Exception: {}", 
                className, methodName, duration, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Log execution time for repository methods
     */
    @Around("execution(* com.example.project.repository..*(..))")
    public Object logRepositoryMethodPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        long startTime = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            if (duration > 100) {
                log.warn("SLOW_QUERY: {}.{} took {}ms", className, methodName, duration);
            } else {
                log.debug("QUERY_EXECUTED: {}.{} | Duration: {}ms", className, methodName, duration);
            }

            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("REPOSITORY_EXCEPTION: {}.{} | Duration: {}ms | Exception: {}", 
                className, methodName, duration, e.getMessage(), e);
            throw e;
        }
    }
}
