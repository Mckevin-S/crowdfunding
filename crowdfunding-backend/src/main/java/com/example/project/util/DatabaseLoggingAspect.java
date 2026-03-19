package com.example.project.util;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * AOP Aspect for logging database operations.
 * Monitors save, update, delete, and query operations with performance metrics.
 */
@Slf4j
@Aspect
@Component
public class DatabaseLoggingAspect {

    private static final long SLOW_QUERY_THRESHOLD = 100; // milliseconds

    /**
     * Log save operations
     */
    @Around("execution(* org.springframework.data.repository.CrudRepository.save(..))")
    public Object logSaveOperation(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String entityType = getEntityType(joinPoint.getArgs());

        try {
            log.debug("DATABASE_SAVE_START: Entity={}", entityType);
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            log.info("DATABASE_SAVE_SUCCESS: Entity={}, Duration={}ms", entityType, duration);
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("DATABASE_SAVE_FAILED: Entity={}, Duration={}ms, Error={}", 
                entityType, duration, e.getMessage());
            throw e;
        }
    }

    /**
     * Log update operations
     */
    @Around("execution(* org.springframework.data.repository.CrudRepository.saveAll(..))")
    public Object logBulkUpdateOperation(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object[] args = joinPoint.getArgs();
        int recordCount = args.length > 0 ? getRecordCount(args[0]) : 0;

        try {
            log.debug("DATABASE_BULK_UPDATE_START: RecordCount={}", recordCount);
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            log.info("DATABASE_BULK_UPDATE_SUCCESS: RecordCount={}, Duration={}ms", recordCount, duration);
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("DATABASE_BULK_UPDATE_FAILED: RecordCount={}, Duration={}ms, Error={}", 
                recordCount, duration, e.getMessage());
            throw e;
        }
    }

    /**
     * Log delete operations
     */
    @Around("execution(* org.springframework.data.repository.CrudRepository.delete*(..))")
    public Object logDeleteOperation(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();

        try {
            log.info("DATABASE_DELETE_START: Operation={}", methodName);
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            log.info("DATABASE_DELETE_SUCCESS: Operation={}, Duration={}ms", methodName, duration);
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("DATABASE_DELETE_FAILED: Operation={}, Duration={}ms, Error={}", 
                methodName, duration, e.getMessage());
            throw e;
        }
    }

    /**
     * Log query operations
     */
    @Around("execution(* org.springframework.data.repository.CrudRepository.find*(..))")
    public Object logQueryOperation(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            if (duration > SLOW_QUERY_THRESHOLD) {
                log.warn("SLOW_QUERY: Method={}, Duration={}ms (threshold: {}ms)", 
                    methodName, duration, SLOW_QUERY_THRESHOLD);
            } else {
                log.debug("QUERY_EXECUTED: Method={}, Duration={}ms", methodName, duration);
            }

            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("QUERY_FAILED: Method={}, Duration={}ms, Error={}", 
                methodName, duration, e.getMessage());
            throw e;
        }
    }

    /**
     * Get entity type from method arguments
     */
    private String getEntityType(Object[] args) {
        if (args.length > 0 && args[0] != null) {
            return args[0].getClass().getSimpleName();
        }
        return "Unknown";
    }

    /**
     * Get record count from collection arguments
     */
    private int getRecordCount(Object arg) {
        if (arg instanceof Iterable) {
            int count = 0;
            for (Object ignored : (Iterable<?>) arg) {
                count++;
            }
            return count;
        }
        return 1;
    }
}
