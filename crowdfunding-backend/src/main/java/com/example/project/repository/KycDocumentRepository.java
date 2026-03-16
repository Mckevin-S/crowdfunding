package com.example.project.repository;

import com.example.project.entity.KycDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KycDocumentRepository extends JpaRepository<KycDocument, Long> {
}
