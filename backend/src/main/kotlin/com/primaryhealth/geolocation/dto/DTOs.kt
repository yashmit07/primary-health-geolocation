package com.primaryhealth.geolocation.dto

data class ProgramResponse(
    val id: Long,
    val name: String,
    val address: String,
    val latitude: Double,
    val longitude: Double,
    val types: List<String>
)

data class AddProgramRequest(
    val name: String,
    val address: String,
    val typeIds: List<Int>
)