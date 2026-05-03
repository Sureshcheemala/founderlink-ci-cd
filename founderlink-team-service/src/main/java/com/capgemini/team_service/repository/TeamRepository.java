package com.capgemini.team_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capgemini.team_service.entity.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

	List<Team> findByStartupIdAndStatus(Long startupId, String string);

	boolean existsByStartupIdAndUserEmailAndStatus(Long startupId, String userEmail, String string);

	List<Team> findByUserEmail(String email);

	boolean existsByStartupIdAndUserEmail(Long startupId, String userEmail);

	void deleteByStartupId(Long startupId);
}