package com.primaryhealth.geolocation.model

import jakarta.persistence.*

@Entity
@Table(name = "program_type_refs")
data class ProgramTypeRef(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @ManyToOne
    @JoinColumn(name = "program_id")
    val program: SocialProgram,

    @ManyToOne
    @JoinColumn(name = "type_id")
    val programType: ProgramType,
)
