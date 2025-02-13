package com.primaryhealth.geolocation.service

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Assertions.*
import org.mockito.Mockito.*
import org.mockito.Mock
import org.mockito.MockitoAnnotations
import com.primaryhealth.geolocation.repository.SocialProgramRepository
import org.mockito.ArgumentMatchers.anyLong
import com.primaryhealth.geolocation.base.GeocodingResult
import com.primaryhealth.geolocation.base.CellIdRange
import com.primaryhealth.geolocation.model.SocialProgram
import org.mockito.ArgumentMatchers.any

class SocialProgramServiceTest {
    @Mock
    private lateinit var repository: SocialProgramRepository

    private lateinit var service: TestSocialProgramService

    // Test-specific subclass that overrides GeolocationBase methods
    private class TestSocialProgramService(repository: SocialProgramRepository) : SocialProgramService(repository) {
        override fun geocodeAddress(address: String): GeocodingResult {
            return GeocodingResult(40.7128, -74.0060)  // NYC coordinates
        }

        override fun latLngToCellId(lat: Double, lng: Double): Long {
            return 123456789L
        }

        override fun getCellIdRangesForRadius(lat: Double, lng: Double, radiusMiles: Double): List<CellIdRange> {
            return listOf(CellIdRange(123000000L, 123999999L))
        }
    }

    @BeforeEach
    fun setup() {
        MockitoAnnotations.openMocks(this)
        service = TestSocialProgramService(repository)
    }

    @Test
    fun `test add program`() {
        val expectedProgram = SocialProgram(
            id = 1,
            name = "Test Program",
            programType = "FOOD",
            address = "123 Test St",
            latitude = 40.7128,
            longitude = -74.0060,
            cellId = 123456789L
        )
        
        `when`(repository.save(any())).thenReturn(expectedProgram)
        
        val program = service.addProgram("Test Program", "FOOD", "123 Test St")
        
        assertNotNull(program)
        assertEquals("Test Program", program.name)
        assertEquals("FOOD", program.programType)
        assertEquals("123 Test St", program.address)
        assertEquals(40.7128, program.latitude)
        assertEquals(-74.0060, program.longitude)
        assertEquals(123456789L, program.cellId)
    }

    @Test
    fun `test find nearby programs`() {
        val testProgram = SocialProgram(
            id = 1,
            name = "Test Program",
            programType = "FOOD",
            address = "123 Test St",
            latitude = 40.7128,
            longitude = -74.0060,
            cellId = 123456789L
        )
        
        `when`(repository.findProgramsInRange(anyLong(), anyLong()))
            .thenReturn(listOf(testProgram))
        
        val results = service.findNearbyPrograms("123 Test St", 5.0)
        
        assertNotNull(results)
        assertFalse(results.isEmpty())
        assertEquals(testProgram, results[0])
    }
}