package com.example.project.service.interfaces;

import com.example.project.dto.MessageRequestDTO;
import com.example.project.dto.MessageResponseDTO;

import java.util.List;

public interface MessageService {
    
    MessageResponseDTO sendMessage(MessageRequestDTO request);
    
    List<MessageResponseDTO> getConversation(Long user1Id, Long user2Id);
    
    List<MessageResponseDTO> getRecentConversations(Long userId);
    
    void markAsRead(Long messageId, Long userId);
    
    long getUnreadCount(Long userId);
}
