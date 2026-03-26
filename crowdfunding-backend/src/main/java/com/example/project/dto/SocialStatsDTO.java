package com.example.project.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SocialStatsDTO {
    private long likesCount;
    private long commentsCount;
    private long sharesCount;
    private boolean isLikedByCurrentUser;
}
