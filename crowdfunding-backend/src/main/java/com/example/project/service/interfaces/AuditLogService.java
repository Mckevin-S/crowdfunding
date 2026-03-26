package com.example.project.service.interfaces;

import com.example.project.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

/**
 * Service for recording and retrieving audit logs of administrative actions.
 */
public interface AuditLogService {

    /**
     * Records a new administrative action.
     *
     * @param userId  ID of the admin performing the action.
     * @param action  Description of the action.
     * @param ip      IP address of the user (optional).
     * @param details JSON string describing additional context.
     * @return The saved AuditLog entry.
     */
    AuditLog logAction(Long userId, String action, String ip, String details);

    Page<AuditLog> getAllLogs(Pageable pageable);

    Page<AuditLog> getLogsByUser(Long userId, Pageable pageable);

    Page<AuditLog> getLogsByDateRange(LocalDateTime start, LocalDateTime end, Pageable pageable);
}
