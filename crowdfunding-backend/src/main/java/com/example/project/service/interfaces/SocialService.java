package com.example.project.service.interfaces;

import com.example.project.dto.*;
import java.util.List;

public interface SocialService {
    CommentResponseDTO addComment(CommentRequestDTO request);
    List<CommentResponseDTO> getCommentsByProject(Long projectId);
    void deleteComment(Long commentId);

    InteractionResponseDTO toggleLike(Long projetId, Long utilisateurId);
    void trackShare(Long projetId, Long utilisateurId);
    SocialStatsDTO getProjectSocialStats(Long projetId, Long utilisateurId);
}
