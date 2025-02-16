package com.primaryhealth.geolocation.model

import jakarta.persistence.*

@Entity
@Table(name = "social_programs")
data class SocialProgram(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val name: String,
    val address: String,
    val latitude: Double,
    val longitude: Double,
    val cellId: Long
)