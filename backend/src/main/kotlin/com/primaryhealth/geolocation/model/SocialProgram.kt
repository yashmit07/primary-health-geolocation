package com.primaryhealth.geolocation.model

import jakarta.persistence.*

@Entity
@Table(
    name = "social_programs",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_social_program_name_address",
            columnNames = ["name", "address"]
        )
    ],
    indexes = [
        Index(
            name = "idx_social_programs_cell_id",
            columnList = "cellId"
        )
    ]
)
data class SocialProgram(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val name: String,
    val address: String,
    val latitude: Double,
    val longitude: Double,
    val cellId: Long
)