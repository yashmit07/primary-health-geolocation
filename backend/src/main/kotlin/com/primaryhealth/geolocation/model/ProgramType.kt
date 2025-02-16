package com.primaryhealth.geolocation.model

import jakarta.persistence.*

@Entity
@Table(name = "program_types")
data class ProgramType(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val typeId: Int? = null,
    val typeName: String
)
