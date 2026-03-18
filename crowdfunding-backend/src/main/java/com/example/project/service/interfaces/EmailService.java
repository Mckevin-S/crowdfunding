package com.example.project.service.interfaces; // syntax fix

/**
 * Service interface for sending email notifications.
 * Integration point for system alerts and communication with users.
 */
public interface EmailService {
    /**
     * Sends a plain text email message.
     *
     * @param to the recipient email address.
     * @param subject the email subject.
     * @param text the email body content.
     */
    void sendSimpleMessage(String to, String subject, String text);
}
