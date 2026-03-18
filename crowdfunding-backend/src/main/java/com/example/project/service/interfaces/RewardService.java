package com.example.project.service.interfaces;

import com.example.project.dto.RewardRequestDTO;
import com.example.project.dto.RewardResponseDTO;
import com.example.project.enums.DeliveryStatus;

import java.util.List;

/**
 * Service interface for managing project rewards.
 * Handles the creation of tiers and the claiming/delivery of perks to
 * contributors.
 */
public interface RewardService {
    /**
     * Defines a new reward tier for a project.
     *
     * @param request the reward details.
     * @return the created reward tier.
     */
    RewardResponseDTO createReward(RewardRequestDTO request);

    /**
     * Retrieves details for a specific reward.
     *
     * @param id the reward ID.
     * @return the reward details.
     */
    RewardResponseDTO getReward(Long id);

    /**
     * Lists all available reward tiers for a project.
     *
     * @param projetId the project ID.
     * @return a list of rewards.
     */
    List<RewardResponseDTO> getRewardsByProjet(Long projetId);

    /**
     * Updates an existing reward tier.
     *
     * @param id      the reward ID.
     * @param request the new reward data.
     * @return the updated reward.
     */
    RewardResponseDTO updateReward(Long id, RewardRequestDTO request);

    /**
     * Deletes a reward tier.
     *
     * @param id the reward ID.
     */
    void deleteReward(Long id);

    /**
     * Assigns a reward to a specific contribution.
     *
     * @param rewardId       the reward ID.
     * @param contributionId the contribution ID.
     */
    void claimReward(Long rewardId, Long contributionId);

    /**
     * Updates the fulfillment status of a claimed reward.
     *
     * @param rewardId       the reward ID.
     * @param status         the new delivery status.
     * @param trackingNumber optional tracking info for physical rewards.
     */
    void updateDeliveryStatus(Long rewardId, DeliveryStatus status, String trackingNumber);
}
                             