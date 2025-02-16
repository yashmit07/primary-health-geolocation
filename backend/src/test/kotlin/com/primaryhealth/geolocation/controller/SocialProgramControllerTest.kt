package com.primaryhealth.geolocation.controller

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.http.MediaType
import com.primaryhealth.geolocation.service.SocialProgramService
import com.primaryhealth.geolocation.model.*
import com.primaryhealth.geolocation.dto.*
import com.fasterxml.jackson.databind.ObjectMapper

@WebMvcTest(SocialProgramController::class)
class SocialProgramControllerTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @MockkBean
    private lateinit var service: SocialProgramService

    @Test
    fun `should return nearby programs when searching`() {
        // Setup
        val programResponse = ProgramResponse(
            id = 1,
            name = "Test Program",
            address = "123 Test St",
            latitude = 40.7128,
            longitude = -74.0060,
            types = listOf("Food")
        )

        every { 
            service.findNearbyPrograms(any(), any(), any()) 
        } returns listOf(programResponse)

        // Execute & Verify
        mockMvc.perform(get("/api/programs/search")
            .param("address", "123 Test St")
            .param("radiusMiles", "5.0")
            .param("typeId", "1"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].name").value("Test Program"))
            .andExpect(jsonPath("$[0].types[0]").value("Food"))
    }

    @Test
    fun `should add new program successfully`() {
        // Setup
        val request = AddProgramRequest(
            name = "Test Program",
            address = "123 Test St",
            typeIds = listOf(1)
        )

        val program = SocialProgram(
            id = 1,
            name = request.name,
            address = request.address,
            latitude = 40.7128,
            longitude = -74.0060,
            cellId = 123456789L
        )

        every { service.addProgram(any()) } returns program

        // Execute & Verify
        mockMvc.perform(post("/api/programs/add")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.name").value(program.name))
    }

    @Test
    fun `should return program types`() {
        // Setup
        val types = listOf(
            ProgramType(1, "Food"),
            ProgramType(2, "Housing")
        )

        every { service.getAllProgramTypes() } returns types

        // Execute & Verify
        mockMvc.perform(get("/api/programs/types"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].typeName").value("Food"))
            .andExpect(jsonPath("$[1].typeName").value("Housing"))
    }
}