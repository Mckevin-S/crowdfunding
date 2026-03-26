package com.example.project.repository;

import com.example.project.entity.Litige;
import com.example.project.enums.StatutLitige;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LitigeRepository extends JpaRepository<Litige, Long> {
    List<Litige> findByStatut(StatutLitige statut);
    List<Litige> findByPlaignantId(Long plaignantId);
}
