package com.example.project.service.interfaces; // syntax fix

import com.example.project.dto.WalletRequestDTO;
import com.example.project.dto.WalletResponseDTO;

import java.math.BigDecimal;

/**
 * Service interface for managing user virtual wallets.
 * Handles balance tracking, deposits, and withdrawals within the platform.
 */
public interface WalletService {
    /**
     * Retrieves the wallet associated with a user.
     *
     * @param utilisateurId the user ID.
     * @return the wallet details.
     */
    WalletResponseDTO getWalletByUtilisateurId(Long utilisateurId);

    /**
     * Increases the wallet balance.
     *
     * @param utilisateurId the user ID.
     * @param amount the amount to add.
     * @return the updated wallet.
     */
    WalletResponseDTO addFunds(Long utilisateurId, BigDecimal amount);

    /**
     * Decreases the wallet balance for a withdrawal or payment.
     *
     * @param utilisateurId the user ID.
     * @param amount the amount to deduct.
     * @return the updated wallet.
     */
    WalletResponseDTO withdrawFunds(Long utilisateurId, BigDecimal amount);
}
