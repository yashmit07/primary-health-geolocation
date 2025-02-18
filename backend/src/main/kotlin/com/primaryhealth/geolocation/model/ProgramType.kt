package com.primaryhealth.geolocation.model

import java.time.LocalDateTime
import jakarta.persistence.*

@Entity
@Table(name = "program_types")
data class ProgramType(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val typeId: Int? = null,
    @Column(unique = true)
    val typeName: String,
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
