package com.primaryhealth.geolocation.repository

import com.primaryhealth.geolocation.model.ProgramTypeRef
import com.primaryhealth.geolocation.model.SocialProgram
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface ProgramTypeRefRepository : JpaRepository<ProgramTypeRef, Long> {
    @Query("SELECT ptr FROM ProgramTypeRef ptr WHERE ptr.program = :program")
    fun findByProgram(program: SocialProgram): List<ProgramTypeRef>
}