package com.example.project.controller;

import com.example.project.dto.*;
import com.example.project.service.interfaces.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/social")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SocialController {

    private final SocialService socialService;

    @PostMapping("/comments")
    public ResponseEntity<CommentResponseDTO> addComment(@RequestBody CommentRequestDTO request) {
        return ResponseEntity.ok(socialService.addComment(request));
    }

    @GetMapping("/comments/project/{projectId}")
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable Long projectId) {
        return ResponseEntity.ok(socialService.getCommentsByProject(projectId));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        socialService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/like/project/{projectId}/user/{utilisateurId}")
    public ResponseEntity<InteractionResponseDTO> toggleLike(
            @PathVariable Long projectId, 
            @PathVariable Long utilisateurId) {
        return ResponseEntity.ok(socialService.toggleLike(projectId, utilisateurId));
    }

    @PostMapping("/share/project/{projectId}/user/{utilisateurId}")
    public ResponseEntity<Void> trackShare(
            @PathVariable Long projectId, 
            @PathVariable Long utilisateurId) {
        socialService.trackShare(projectId, utilisateurId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats/project/{projectId}")
    public ResponseEntity<SocialStatsDTO> getStats(
            @PathVariable Long projectId, 
            @RequestParam(required = false) Long utilisateurId) {
        return ResponseEntity.ok(socialService.getProjectSocialStats(projectId, utilisateurId));
    }
}
