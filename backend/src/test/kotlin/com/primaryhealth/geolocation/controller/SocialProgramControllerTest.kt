package com.primaryhealth.geolocation.controller

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.http.MediaType
import com.primaryhealth.geolocation.service.SocialProgramService
import org.mockito.Mockito.`when`
import org.mockito.ArgumentMatchers.anyDouble
import org.mockito.ArgumentMatchers.anyString

@WebMvcTest(SocialProgramController::class)
class SocialProgramControllerTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var service: SocialProgramService

    @Test
    fun `test search endpoint`() {
        `when`(service.findNearbyPrograms(anyString(), anyDouble())).thenReturn(emptyList())

        mockMvc.perform(get("/api/programs/search")
            .param("address", "123 Test St")
            .param("radiusMiles", "5.0"))
            .andExpect(status().isOk)
    }

    @Test
    fun `test add program endpoint`() {
        mockMvc.perform(post("/api/programs/add")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"name":"Food Bank","programType":"FOOD","address":"123 Test St"}"""))
            .andExpect(status().isOk)
    }
}