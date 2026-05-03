package com.capgemini.startup_service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.capgemini.startup_service.controller.StartupController;
import com.capgemini.startup_service.entity.Startup;
import com.capgemini.startup_service.security.JwtService;
import com.capgemini.startup_service.service.StartupService;

@WebMvcTest(StartupController.class)
@AutoConfigureMockMvc(addFilters = false)
class StartupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private StartupService startupService;
    
    @MockitoBean
    private JwtService jwtService;

    @Test
    void testGetStartups() throws Exception {

        // Arrange
        Startup startup = new Startup();
        startup.setName("Test Startup");

        Page<Startup> startups = (Page<Startup>) List.of(startup);

        when(startupService.getStartups(any(), any(), any(), any(), any(), null, null, null, false, 0, 0))
                .thenReturn(startups);

        // Act + Assert
        mockMvc.perform(get("/startups"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Startup"));
    }
}