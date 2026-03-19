package com.example.project.service.impl;

import com.example.project.dto.RepaymentScheduleDTO;
import com.example.project.entity.LoanDetails;
import com.example.project.entity.Projet;
import com.example.project.entity.RepaymentSchedule;
import com.example.project.enums.StatutProjet;
import com.example.project.exception.BadRequestException;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.repository.LoanDetailsRepository;
import com.example.project.repository.ProjetRepository;
import com.example.project.repository.RepaymentScheduleRepository;
import com.example.project.service.interfaces.LoanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link LoanService}.
 * Uses standard amortization formulas to calculate monthly payments and
 * interest for debt crowdfunding.
 * Generates and persists the full repayment schedule upon project funding
 * completion.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private final LoanDetailsRepository loanDetailsRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    private final ProjetRepository projetRepository;

    @Override
    @Transactional
    public void initializeLoanRules(Long projetId, BigDecimal tauxInteret, Integer dureeEnMois,
            Integer gracePeriod, BigDecimal tauxPenalite, Integer seuilDefautJours) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));

        LoanDetails details = loanDetailsRepository.findByProjet(projet)
                .orElse(new LoanDetails());

        details.setProjet(projet);
        details.setTauxInteret(tauxInteret);
        details.setDureeEnMois(dureeEnMois);
        details.setPeriodeGrace(gracePeriod != null ? gracePeriod : 0);
        details.setFrequenceRemboursement("MONTHLY");

        if (tauxPenalite != null)
            details.setTauxPenalite(tauxPenalite);
        if (seuilDefautJours != null)
            details.setSeuilDefautJours(seuilDefautJours);

        loanDetailsRepository.save(details);
    }

    @Override
    @Transactional
    public void generateRepaymentSchedule(Long projetId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));

        if (projet.getStatut() != StatutProjet.TERMINE
                || projet.getMontantActuel().compareTo(projet.getObjectifFinancier()) < 0) {
            throw new BadRequestException("L'échéancier ne peut être généré que si la levée est terminée avec succès");
        }

        LoanDetails details = loanDetailsRepository.findByProjet(projet)
                .orElseThrow(() -> new ResourceNotFoundException("Paramètres de prêt manquants", projetId));

        // Generate schedule only once
        if (!scheduleRepository.findByProjetOrderByNumeroEcheanceAsc(projet).isEmpty()) {
            throw new BadRequestException("L'échéancier a déjà été généré pour ce projet");
        }

        BigDecimal capitalEmprunte = projet.getMontantActuel();
        BigDecimal tauxInteretMensuel = details.getTauxInteret().divide(BigDecimal.valueOf(12 * 100), 6,
                RoundingMode.HALF_UP);
        int d = details.getDureeEnMois();

        // Amortization (Mensualité = C * T / (1 - (1+T)^-n)
        BigDecimal monthlyRateFactor = BigDecimal.ONE.add(tauxInteretMensuel).pow(d);
        BigDecimal divisor = BigDecimal.ONE.subtract(BigDecimal.ONE.divide(monthlyRateFactor, 6, RoundingMode.HALF_UP));
        BigDecimal mensualite = capitalEmprunte.multiply(tauxInteretMensuel).divide(divisor, 2, RoundingMode.HALF_UP);

        BigDecimal balance = capitalEmprunte;
        BigDecimal totalInterets = BigDecimal.ZERO;
        LocalDate currentDate = LocalDate.now().plusMonths(details.getPeriodeGrace());

        for (int i = 1; i <= d; i++) {
            currentDate = currentDate.plusMonths(1);
            BigDecimal interestPayment = balance.multiply(tauxInteretMensuel).setScale(2, RoundingMode.HALF_UP);
            BigDecimal principalPayment = mensualite.subtract(interestPayment);

            if (i == d) {
                // Adjust last payment to avoid rounding scraps
                principalPayment = balance;
                mensualite = principalPayment.add(interestPayment);
            }

            balance = balance.subtract(principalPayment);
            totalInterets = totalInterets.add(interestPayment);

            RepaymentSchedule row = RepaymentSchedule.builder()
                    .projet(projet)
                    .numeroEcheance(i)
                    .dateEcheance(currentDate)
                    .montantTotal(mensualite)
                    .montantCapital(principalPayment)
                    .montantInterets(interestPayment)
                    .capitalRestant(balance)
                    .statut("PENDING")
                    .build();

            scheduleRepository.save(row);
        }

        // Update LoanDetails with Totals
        details.setMensualite(mensualite);
        details.setTotalInterets(totalInterets);
        details.setTotalRemboursement(capitalEmprunte.add(totalInterets));
        loanDetailsRepository.save(details);
    }

    @Override
    public List<RepaymentScheduleDTO> getSchedule(Long projetId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", projetId));

        return scheduleRepository.findByProjetOrderByNumeroEcheanceAsc(projet).stream()
                .map(row -> RepaymentScheduleDTO.builder()
                        .id(row.getId())
                        .projetId(row.getProjet().getId())
                        .numeroEcheance(row.getNumeroEcheance())
                        .dateEcheance(row.getDateEcheance())
                        .montantTotal(row.getMontantTotal())
                        .montantCapital(row.getMontantCapital())
                        .montantInterets(row.getMontantInterets())
                        .capitalRestant(row.getCapitalRestant())
                        .statut(row.getStatut())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markInstallmentPaid(Long scheduleId) {
        RepaymentSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Echéance", scheduleId));
        schedule.setStatut("PAID");
        schedule.setDatePaiement(LocalDateTime.now());
        scheduleRepository.save(schedule);
    }

    @Override
    @Transactional
    @org.springframework.scheduling.annotation.Scheduled(cron = "0 0 1 * * *") // Daily at 1 AM
    public void applyPenalties() {
        LocalDate today = LocalDate.now();
        List<RepaymentSchedule> pendingOrOverdue = scheduleRepository.findAll().stream()
                .filter(s -> "PENDING".equals(s.getStatut()) || "OVERDUE".equals(s.getStatut()))
                .collect(Collectors.toList());

        for (RepaymentSchedule schedule : pendingOrOverdue) {
            if (schedule.getDateEcheance().isBefore(today)) {
                // Determine penalty rate from LoanDetails
                LoanDetails details = loanDetailsRepository.findByProjet(schedule.getProjet()).orElse(null);
                if (details != null && details.getTauxPenalite() != null) {
                    BigDecimal dailyRate = details.getTauxPenalite().divide(BigDecimal.valueOf(100), 4,
                            RoundingMode.HALF_UP);
                    BigDecimal penalty = schedule.getMontantTotal().multiply(dailyRate);

                    schedule.setStatut("OVERDUE");
                    schedule.setMontantPenalites(schedule.getMontantPenalites().add(penalty));
                    scheduleRepository.save(schedule);
                    log.info("Applied penalty of {} to schedule {} for project {}", penalty, schedule.getId(),
                            schedule.getProjet().getId());
                }
            }
        }
    }
}
