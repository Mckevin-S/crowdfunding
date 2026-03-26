package com.example.project.controller;

import com.example.project.dto.TransactionResponseDTO;
import com.example.project.entity.Utilisateur;
import com.example.project.exception.ResourceNotFoundException;
import com.example.project.mapper.TransactionMapper;
import com.example.project.repository.TransactionRepository;
import com.example.project.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final UtilisateurRepository utilisateurRepository;

    @GetMapping("/utilisateur/{utilisateurId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#utilisateurId)")
    public ResponseEntity<List<TransactionResponseDTO>> getTransactionsByUser(@PathVariable Long utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", utilisateurId));

        List<TransactionResponseDTO> transactions = transactionRepository.findByUtilisateur(utilisateur)
                .stream()
                .map(transactionMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> getTransactionById(@PathVariable Long id) {
        return transactionRepository.findById(id)
                .map(transactionMapper::toResponseDTO)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransactionResponseDTO>> getAllTransactions() {
        List<TransactionResponseDTO> transactions = transactionRepository.findAll()
                .stream()
                .map(transactionMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(transactions);
    }
}
