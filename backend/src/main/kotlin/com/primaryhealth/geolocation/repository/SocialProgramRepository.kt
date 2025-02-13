package com.primaryhealth.geolocation.repository

import com.primaryhealth.geolocation.model.SocialProgram
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface SocialProgramRepository : JpaRepository<SocialProgram, Long> {
    @Query("SELECT sp FROM SocialProgram sp WHERE sp.cellId BETWEEN :startCell AND :endCell")
    fun findProgramsInRange(startCell: Long, endCell: Long): List<SocialProgram>
}