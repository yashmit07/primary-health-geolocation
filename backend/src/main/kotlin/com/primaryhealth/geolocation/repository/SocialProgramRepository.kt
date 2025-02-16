package com.primaryhealth.geolocation.repository

import com.primaryhealth.geolocation.model.SocialProgram
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface SocialProgramRepository : JpaRepository<SocialProgram, Long> {
    @Query("""
        SELECT DISTINCT sp FROM SocialProgram sp 
        JOIN ProgramTypeRef ptr ON ptr.program = sp
        WHERE sp.cellId BETWEEN :startCell AND :endCell
        AND (:typeId IS NULL OR ptr.programType.typeId = :typeId)
    """)
    fun findProgramsInRange(
        startCell: Long, 
        endCell: Long, 
        typeId: Int?
    ): List<SocialProgram>
}