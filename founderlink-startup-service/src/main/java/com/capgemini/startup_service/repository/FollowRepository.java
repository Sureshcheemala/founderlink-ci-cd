package com.capgemini.startup_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capgemini.startup_service.entity.Follow;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByStartupIdAndEmail(Long startupId, String email);

    List<Follow> findByEmail(String email);
}
