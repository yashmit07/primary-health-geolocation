package com.primaryhealth.geolocation.controller

import com.primaryhealth.geolocation.model.SocialProgram
import com.primaryhealth.geolocation.service.SocialProgramService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/programs")
class SocialProgramController(
    private val socialProgramService: SocialProgramService
) {
    
    // Search programs endpoint
    @GetMapping("/search")
    fun searchPrograms(
        @RequestParam address: String,
        @RequestParam radiusMiles: Double
    ): List<SocialProgram> {
        return socialProgramService.findNearbyPrograms(
            address,
            radiusMiles
        )
    }

    // Add program endpoint
    @PostMapping("/add")
    fun addProgram(@RequestBody request: AddProgramRequest): SocialProgram {
        return socialProgramService.addProgram(
            request.name,
            request.programType,
            request.address
        )
    }
}

data class AddProgramRequest(
    val name: String,
    val programType: String,
    val address: String
)