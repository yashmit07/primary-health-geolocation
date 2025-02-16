package com.primaryhealth.geolocation.service

import io.mockk.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import com.primaryhealth.geolocation.repository.*
import com.primaryhealth.geolocation.model.*
import com.primaryhealth.geolocation.dto.*
import com.primaryhealth.geolocation.base.GeocodingResult
import com.primaryhealth.geolocation.base.CellIdRange
import java.util.Optional

class SocialProgramServiceTest {
    private val programRepository = mockk<SocialProgramRepository>()
    private val typeRepository = mockk<ProgramTypeRepository>()
    private val typeRefRepository = mockk<ProgramTypeRefRepository>()
    private lateinit var service: TestSocialProgramService

    private class TestSocialProgramService(
        programRepository: SocialProgramRepository,
        typeRepository: ProgramTypeRepository,
        typeRefRepository: ProgramTypeRefRepository
    ) : SocialProgramService(programRepository, typeRepository, typeRefRepository) {
        override fun geocodeAddress(address: String) = GeocodingResult(40.7128, -74.0060)
        override fun latLngToCellId(lat: Double, lng: Double) = 123456789L
        override fun getCellIdRangesForRadius(lat: Double, lng: Double, radiusMiles: Double) = 
            listOf(CellIdRange(123000000L, 123999999L))
    }

    @BeforeEach
    fun setup() {
        clearAllMocks()
        service = TestSocialProgramService(programRepository, typeRepository, typeRefRepository)
    }

    @Test
    fun `should successfully find nearby programs when type is specified`() {
        // Setup
        val program = SocialProgram(
            id = 1,
            name = "Test Program",
            address = "123 Test St",
            latitude = 40.7128,
            longitude = -74.0060,
            cellId = 123456789L
        )

        val programType = ProgramType(1, "Food")
        val typeRef = ProgramTypeRef(
            id = 1,
            program = program,
            programType = programType
        )
        
        every { 
            programRepository.findProgramsInRange(any(), any(), any()) 
        } returns listOf(program)

        every {
            typeRefRepository.findByProgram(any())
        } returns listOf(typeRef)
        
        // Execute
        val results = service.findNearbyPrograms("123 Test St", 5.0, 1)
        
        // Verify
        assertFalse(results.isEmpty())
        assertEquals("Test Program", results.first().name)
        assertEquals(listOf("Food"), results.first().types)
        verify { programRepository.findProgramsInRange(any(), any(), any()) }
        verify { typeRefRepository.findByProgram(any()) }
    }

    @Test
    fun `should successfully add program with types`() {
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

        val programType = ProgramType(1, "Food")
        
        every { programRepository.save(any()) } returns program
        every { typeRepository.findById(1) } returns Optional.of(programType)
        every { typeRefRepository.save(any()) } returns mockk()
        
        // Execute
        val result = service.addProgram(request)
        
        // Verify
        assertNotNull(result)
        assertEquals(request.name, result.name)
        verify { typeRefRepository.save(any()) }
    }

    @Test
    fun `should return all program types`() {
        // Setup
        val types = listOf(
            ProgramType(1, "Food"),
            ProgramType(2, "Housing")
        )

        every { typeRepository.getAllTypes() } returns types

        // Execute
        val results = service.getAllProgramTypes()

        // Verify
        assertEquals(2, results.size)
        assertEquals("Food", results[0].typeName)
        assertEquals("Housing", results[1].typeName)
    }
}