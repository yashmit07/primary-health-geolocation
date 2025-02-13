package com.primaryhealth.geolocation.service

import com.primaryhealth.geolocation.base.GeolocationBase
import com.primaryhealth.geolocation.model.SocialProgram
import com.primaryhealth.geolocation.repository.SocialProgramRepository
import org.springframework.stereotype.Service

@Service
class SocialProgramService(
    private val repository: SocialProgramRepository
) : GeolocationBase() {
    
    fun findNearbyPrograms(address: String, radiusMiles: Double): List<SocialProgram> {
        // Get the coordinates for the search address
        val searchCoords = geocodeAddress(address)
        
        // Get cell ranges that cover our search area
        val cellRanges = getCellIdRangesForRadius(
            searchCoords.latitude, 
            searchCoords.longitude, 
            radiusMiles
        )
        
        // Get all programs in these cell ranges
        return cellRanges.flatMap { range ->
            repository.findProgramsInRange(range.start, range.end)
        }.distinct()
    }

    fun addProgram(name: String, programType: String, address: String): SocialProgram {
        val coords = geocodeAddress(address)
        val cellId = latLngToCellId(coords.latitude, coords.longitude)
        
        val program = SocialProgram(
            name = name,
            programType = programType,
            address = address,
            latitude = coords.latitude,
            longitude = coords.longitude,
            cellId = cellId
        )
        return repository.save(program)
    }
}