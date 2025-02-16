package com.primaryhealth.geolocation.controller

import com.primaryhealth.geolocation.model.SocialProgram
import com.primaryhealth.geolocation.model.ProgramType
import com.primaryhealth.geolocation.dto.ProgramResponse
import com.primaryhealth.geolocation.dto.AddProgramRequest
import com.primaryhealth.geolocation.service.SocialProgramService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/programs")
class SocialProgramController(
    private val socialProgramService: SocialProgramService
) {
    
    @GetMapping("/types")
    fun getProgramTypes(): List<ProgramType> {
        return socialProgramService.getAllProgramTypes()
    }

    @GetMapping("/search")
    fun searchPrograms(
        @RequestParam address: String,
        @RequestParam radiusMiles: Double,
        @RequestParam(required = false) typeId: Int?
    ): List<ProgramResponse> {
        return socialProgramService.findNearbyPrograms(
            address,
            radiusMiles,
            typeId
        )
    }

    @PostMapping("/add")
    fun addProgram(@RequestBody request: AddProgramRequest): SocialProgram {
        return socialProgramService.addProgram(request)
    }
}