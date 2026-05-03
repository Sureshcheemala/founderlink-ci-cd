package com.capgemini.startup_service.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.capgemini.startup_service.config.RabbitMQConstants;
import com.capgemini.startup_service.dto.NotificationEvent;
import com.capgemini.startup_service.dto.StartupRequest;
import com.capgemini.startup_service.entity.Follow;
import com.capgemini.startup_service.entity.Startup;
import com.capgemini.startup_service.exception.ConflictException;
import com.capgemini.startup_service.exception.ResourceNotFoundException;
import com.capgemini.startup_service.exception.UnauthorizedException;
import com.capgemini.startup_service.repository.FollowRepository;
import com.capgemini.startup_service.repository.StartupRepository;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StartupServiceImpl implements StartupService {

    private final StartupRepository repository;
    private final FollowRepository followRepository;
    private final RabbitTemplate rabbitTemplate;

    @Override
    public Startup createStartup(String email, StartupRequest request) {
        Startup startup = Startup.builder()
                .name(request.getName())
                .tagline(request.getTagline())
                .description(request.getDescription())
                .industry(request.getIndustry())
                .location(request.getLocation())
                .websiteUrl(request.getWebsiteUrl())
                .linkedinUrl(request.getLinkedinUrl())
                .logoUrl(request.getLogoUrl())
                .problemStatement(request.getProblemStatement())
                .solution(request.getSolution())
                .fundingGoal(request.getFundingGoal())
                .stage(request.getStage())
                .teamSize(request.getTeamSize())
                .foundedDate(request.getFoundedDate())
                .founderEmail(email)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        Startup savedStartup = repository.save(startup);
        
        sendEvent("STARTUP_CREATED", email, 
                "Startup " + savedStartup.getName() + " created and pending approval", savedStartup.getId());
        
        return savedStartup;
    }

    @Override
    public Startup updateStartup(Long id, String email, StartupRequest request) {
        Startup startup = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.getFounderEmail().equals(email)) {
            throw new UnauthorizedException("Not authorized to update this startup");
        }

        startup.setName(request.getName());
        startup.setTagline(request.getTagline());
        startup.setDescription(request.getDescription());
        startup.setIndustry(request.getIndustry());
        startup.setLocation(request.getLocation());
        startup.setWebsiteUrl(request.getWebsiteUrl());
        startup.setLinkedinUrl(request.getLinkedinUrl());
        startup.setLogoUrl(request.getLogoUrl());
        startup.setProblemStatement(request.getProblemStatement());
        startup.setSolution(request.getSolution());
        startup.setFundingGoal(request.getFundingGoal());
        startup.setStage(request.getStage());
        startup.setTeamSize(request.getTeamSize());
        startup.setFoundedDate(request.getFoundedDate());

        return repository.save(startup);
    }

    @Override
    public Page<Startup> getStartups(
            String search,
            String industry,
            String stage,
            Double minFunding,
            Double maxFunding,
            String sortBy,
            String sortDir,
            String email,
            boolean isAdmin,
            int page,
            int size) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Startup> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (!isAdmin) {
                predicates.add(cb.or(
                        cb.equal(cb.lower(root.get("status")), "approved"),
                        cb.equal(root.get("founderEmail"), email)
                ));
            }

            if (search != null && !search.isEmpty()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), searchLower),
                        cb.like(cb.lower(root.get("description")), searchLower)
                ));
            }

            if (industry != null && !industry.isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("industry")), industry.toLowerCase()));
            }

            if (stage != null && !stage.isEmpty()) {
                predicates.add(cb.equal(root.get("stage"), stage));
            }

            if (minFunding != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("fundingGoal"), minFunding));
            }

            if (maxFunding != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("fundingGoal"), maxFunding));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return repository.findAll(spec, pageable);
    }

    @Override
    public List<Startup> getMyStartups(String email) {
        return repository.findByFounderEmail(email);
    }

    @Override
    public Startup getStartupById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));
    }

    @Override
    public Startup approve(Long id, String email) {
        Startup startup = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));
        
        startup.setStatus("APPROVED");
        Startup savedStartup = repository.save(startup);

        sendEvent("STARTUP_APPROVED", startup.getFounderEmail(),
                "Startup " + savedStartup.getName() + " has been approved", savedStartup.getId());
        
        return savedStartup;
    }

    @Override
    public Startup reject(Long id, String email) {
        Startup startup = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));
        
        startup.setStatus("REJECTED");
        Startup savedStartup = repository.save(startup);

        sendEvent("STARTUP_REJECTED", startup.getFounderEmail(),
                "Startup " + savedStartup.getName() + " has been rejected", savedStartup.getId());
        
        return savedStartup;
    }

    @Override
    public void followStartup(Long startUpId, String email) {
        if (followRepository.existsByStartupIdAndEmail(startUpId, email)) {
            throw new ConflictException("Already following");
        }

        Follow follow = new Follow();
        follow.setStartupId(startUpId);
        follow.setEmail(email);
        follow.setCreatedAt(LocalDateTime.now());

        followRepository.save(follow);
        
        sendEvent("FOLLOWING", email,
                "You are now following the startup with id " + startUpId, startUpId);
    }

    @Override
    public List<Long> getFollowedStartupIds(String email) {
        return followRepository.findByEmail(email)
                .stream()
                .map(Follow::getStartupId)
                .toList();
    }

    @Override
    public void deleteStartup(Long id, String email) {
        Startup startup = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.getFounderEmail().equals(email)) {
            throw new UnauthorizedException("Not authorized to delete this startup");
        }

        repository.delete(startup);

        sendEvent("STARTUP_DELETED", startup.getFounderEmail(),
                "Startup " + startup.getName() + " has been deleted", id);
    }

    private void sendEvent(String type, String email, String message, Long id) {
        NotificationEvent event = new NotificationEvent(type, email, message, id, null);

        rabbitTemplate.convertAndSend(
                RabbitMQConstants.EXCHANGE,
                RabbitMQConstants.ROUTING_KEY,
                event
        );
    }
}
