package com.primaryhealth.geolocation.service

import com.primaryhealth.geolocation.base.GeolocationBase
import com.primaryhealth.geolocation.dto.ProgramResponse
import com.primaryhealth.geolocation.dto.AddProgramRequest
import com.primaryhealth.geolocation.model.*
import com.primaryhealth.geolocation.repository.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SocialProgramService(
    private val programRepository: SocialProgramRepository,
    private val typeRepository: ProgramTypeRepository,
    private val typeRefRepository: ProgramTypeRefRepository
) : GeolocationBase() {
    
    fun getAllProgramTypes(): List<ProgramType> = typeRepository.getAllTypes()

    fun findNearbyPrograms(address: String, radiusMiles: Double, typeId: Int? = null): List<ProgramResponse> {
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
    }

    @Transactional
    fun addProgram(request: AddProgramRequest): SocialProgram {
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
        
        // Explicit type for forEach to resolve ambiguity
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
    }
}