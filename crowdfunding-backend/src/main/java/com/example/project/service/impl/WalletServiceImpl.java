package com.example.project.service.impl;

import com.example.project.dto.WalletResponseDTO;
import com.example.project.entity.Utilisateur;
import com.example.project.entity.Wallet;
import com.example.project.entity.Transaction;
import com.example.project.enums.PaiementType;
import com.example.project.enums.StatutTransaction;
import com.example.project.exception.BadRequestException;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.WalletMapper;
import com.example.project.repository.UtilisateurRepository;
import com.example.project.repository.WalletRepository;
import com.example.project.service.interfaces.WalletService;
import com.example.project.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Implementation of {@link WalletService}.
 * Manages virtual wallet balances, supporting synchronized deposit (add funds) and withdrawal operations.
 * Maintains an audit trail of financial movements via the {@code Transaction} entity.
 */
@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletMapper walletMapper;
    private final UtilisateurRepository utilisateurRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public WalletResponseDTO getWalletByUtilisateurId(Long utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", utilisateurId));

        Wallet wallet = walletRepository.findByUtilisateur(utilisateur)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet pour utilisateur", utilisateurId));

        return walletMapper.toResponseDTO(wallet);
    }

    @Override
    @Transactional
    public WalletResponseDTO addFunds(Long utilisateurId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Le montant à ajouter doit être strictement positif");
        }

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", utilisateurId));

        Wallet wallet = walletRepository.findByUtilisateur(utilisateur)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet pour utilisateur", utilisateurId));

        wallet.setSolde(wallet.getSolde().add(amount));
        Wallet savedWallet = walletRepository.save(wallet);

        // Record transaction
        Transaction transaction = new Transaction();
        transaction.setUtilisateur(utilisateur);
        transaction.setAmount(amount);
        transaction.setType(PaiementType.MOBILE_MONEY); // Default or based on context
        transaction.setStatus(StatutTransaction.CONFIRMER);
        transactionRepository.save(transaction);

        return walletMapper.toResponseDTO(savedWallet);
    }

    @Override
    @Transactional
    public WalletResponseDTO withdrawFunds(Long utilisateurId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Le montant à retirer doit être strictement positif");
        }

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", utilisateurId));

        Wallet wallet = walletRepository.findByUtilisateur(utilisateur)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet pour utilisateur", utilisateurId));

        if (wallet.getSolde().compareTo(amount) < 0) {
            throw new BadRequestException("Solde insuffisant pour le retrait demandé");
        }

        wallet.setSolde(wallet.getSolde().subtract(amount));
        Wallet savedWallet = walletRepository.save(wallet);

        // Record transaction
        Transaction transaction = new Transaction();
        transaction.setUtilisateur(utilisateur);
        transaction.setAmount(amount.negate());
        transaction.setType(PaiementType.RETRAIT);
        transaction.setStatus(StatutTransaction.CONFIRMER);
        transactionRepository.save(transaction);

        return walletMapper.toResponseDTO(savedWallet);
    }
}
