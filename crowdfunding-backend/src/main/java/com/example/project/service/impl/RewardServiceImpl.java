package com.example.project.service.impl;

import com.example.project.dto.RewardRequestDTO;
import com.example.project.dto.RewardResponseDTO;
import com.example.project.entity.Contribution;
import com.example.project.entity.Projet;
import com.example.project.entity.Reward;
import com.example.project.enums.DeliveryStatus;
import com.example.project.exception.BadRequestException;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.RewardMapper;
import com.example.project.repository.ContributionRepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.repository.RewardRepository;
import com.example.project.service.interfaces.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link RewardService}.
 * Manages reward tiers for projects, including inventory tracking (quantities) and fulfillment workflows.
 * Validates contribution amounts against reward minimum requirements during the claim process.
 */
@Service
@RequiredArgsConstructor
public class RewardServiceImpl implements RewardService {

    private final RewardRepository rewardRepository;
    private final ProjetRepository projetRepository;
    private final ContributionRepository contributionRepository;

    @Override
    @Transactional
    public RewardResponseDTO createReward(RewardRequestDTO request) {
        Projet projet = projetRepository.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet", request.getProjetId()));

        Reward reward = RewardMapper.INSTANCE.toEntity(request);
        reward.setProjet(projet);
        reward.setQuantiteReservee(0);
        reward.setStatutLivraison(DeliveryStatus.EN_PREPARATION);

        return RewardMapper.INSTANCE.toResponseDTO(rewardRepository.save(reward));
    }

    @Override
    public RewardResponseDTO getReward(Long id) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contrepartie", id));
        return RewardMapper.INSTANCE.toResponseDTO(reward);
    }

    @Override
    public List<RewardResponseDTO> getRewardsByProjet(Long projetId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));
        return rewardRepository.findByProjet(projet).stream()
                .map(RewardMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RewardResponseDTO updateReward(Long id, RewardRequestDTO request) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contrepartie", id));

        if (reward.getQuantiteReservee() > 0
                && request.getMontantMinimum().compareTo(reward.getMontantMinimum()) != 0) {
            throw new BadRequestException(
                    "Impossible de modifier le montant minimum d'une contrepartie ayant déjà des réservations");
        }

        if (request.getQuantite() < reward.getQuantiteReservee()) {
            throw new BadRequestException(
                    "La nouvelle quantité totale ne peut pas être inférieure à la quantité déjà réservée");
        }

        reward.setTitre(request.getTitre());
        reward.setDescription(request.getDescription());
        reward.setMontantMinimum(request.getMontantMinimum());
        reward.setQuantite(request.getQuantite());
        // Do not update projetId safely

        return RewardMapper.INSTANCE.toResponseDTO(rewardRepository.save(reward));
    }

    @Override
    @Transactional
    public void deleteReward(Long id) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contrepartie", id));

        if (reward.getQuantiteReservee() > 0) {
            throw new BadRequestException("Impossible de supprimer une contrepartie ayant déjà des réservations");
        }

        rewardRepository.delete(reward);
    }

    @Override
    @Transactional
    public void claimReward(Long rewardId, Long contributionId) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new ResourceNotFoundException("Contrepartie", rewardId));

        Contribution contribution = contributionRepository.findById(contributionId)
                .orElseThrow(() -> new ResourceNotFoundException("Contribution", contributionId));

        if (contribution.getAmount().compareTo(reward.getMontantMinimum()) < 0) {
            throw new BadRequestException(
                    "Le montant de la contribution est insuffisant pour réclamer cette contrepartie");
        }

        if (!reward.getProjet().getId().equals(contribution.getProjet().getId())) {
            throw new BadRequestException("Cette contrepartie n'appartient pas au projet financé");
        }

        if (reward.getQuantiteReservee() >= reward.getQuantite()) {
            throw new BadRequestException("Cette contrepartie est épuisée");
        }

        reward.setQuantiteReservee(reward.getQuantiteReservee() + 1);
        rewardRepository.save(reward);

        contribution.setReward(reward);
        contributionRepository.save(contribution);
    }

    @Override
    @Transactional
    public void updateDeliveryStatus(Long rewardId, DeliveryStatus status, String trackingNumber) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new ResourceNotFoundException("Contrepartie", rewardId));

        reward.setStatutLivraison(status);
        if (trackingNumber != null && !trackingNumber.trim().isEmpty()) {
            reward.setNumeroSuivi(trackingNumber);
        }

        if (status == DeliveryStatus.EXPEDIE && reward.getDateLivraisonEstimee() == null) {
            reward.setDateLivraisonEstimee(LocalDate.now().plusDays(15)); // Default 15 days if null
        }

        rewardRepository.save(reward);
    }
}
