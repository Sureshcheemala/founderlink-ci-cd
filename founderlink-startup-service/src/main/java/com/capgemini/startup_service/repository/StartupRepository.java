package com.capgemini.startup_service.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import com.capgemini.startup_service.entity.Startup;

public interface StartupRepository extends JpaRepository<Startup, Long>{

	List<Startup> findByStatus(String status, Sort sort);
	
	List<Startup> findByFounderEmail(String founderEmail);

	Page<Startup> findAll(Specification<Startup> spec, Pageable pageable);
}
