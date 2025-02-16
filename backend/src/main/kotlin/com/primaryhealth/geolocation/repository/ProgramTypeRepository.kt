package com.primaryhealth.geolocation.repository

import com.primaryhealth.geolocation.model.ProgramType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface ProgramTypeRepository : JpaRepository<ProgramType, Int> {
    @Query("SELECT pt FROM ProgramType pt ORDER BY pt.typeId")
    fun getAllTypes(): List<ProgramType>
}