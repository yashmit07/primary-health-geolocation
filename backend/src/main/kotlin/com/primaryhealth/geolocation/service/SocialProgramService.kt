package com.primaryhealth.geolocation.service

import com.primaryhealth.geolocation.base.GeolocationBase
import com.primaryhealth.geolocation.dto.ProgramResponse
import com.primaryhealth.geolocation.dto.AddProgramRequest
import com.primaryhealth.geolocation.exception.ServiceException
import com.primaryhealth.geolocation.model.*
import com.primaryhealth.geolocation.repository.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SocialProgramService(
    private val programRepository: SocialProgramRepository,
    private val typeRepository: ProgramTypeRepository,
    private val typeRefRepository: ProgramTypeRefRepository
) : GeolocationBase() {
    
    private val logger = LoggerFactory.getLogger(javaClass)

    fun getAllProgramTypes(): List<ProgramType> = typeRepository.getAllTypes()

    fun findNearbyPrograms(address: String, radiusMiles: Double, typeId: Int? = null): List<ProgramResponse> {
        try {
            val searchCoords = geocodeAddress(address)
            val cellRanges = getCellIdRangesForRadius(
                searchCoords.latitude, 
                searchCoords.longitude, 
                radiusMiles
            )
            
            val programs = cellRanges.flatMap { range ->
                programRepository.findProgramsInRange(range.start, range.end, typeId)
            }.distinct()

            return programs.map { program ->
                val types = typeRefRepository.findByProgram(program).map { ref ->
                    ref.programType.typeName
                }
                ProgramResponse(
                    id = program.id!!,
                    name = program.name,
                    address = program.address,
                    latitude = program.latitude,
                    longitude = program.longitude,
                    types = types
                )
            }
        } catch (e: Exception) {
            logger.error("Error finding nearby programs", e)
            throw ServiceException("Failed to find nearby programs", e)
        }
    }

    @Transactional
    fun addProgram(request: AddProgramRequest): SocialProgram {
        try {
            val coords = geocodeAddress(request.address)
            val cellId = latLngToCellId(coords.latitude, coords.longitude)
            
            val program = SocialProgram(
                name = request.name,
                address = request.address,
                latitude = coords.latitude,
                longitude = coords.longitude,
                cellId = cellId
            )
            val savedProgram = programRepository.save(program)
            
            request.typeIds.forEach { typeId: Int ->
                typeRepository.findById(typeId).ifPresent { programType ->
                    val typeRef = ProgramTypeRef(
                        program = savedProgram,
                        programType = programType
                    )
                    typeRefRepository.save(typeRef)
                }
            }
            
            return savedProgram
        } catch (e: Exception) {
            logger.error("Failed to add program: ${request.name}", e)
            throw ServiceException("Failed to add program", e)
        }
    }
}