package com.primaryhealth.geolocation.base

import com.google.maps.GeoApiContext
import com.google.maps.GeocodingApi
import com.google.common.geometry.S2CellId
import com.google.common.geometry.S2LatLng
import com.google.common.geometry.S2Cap
import com.google.common.geometry.S2RegionCoverer
import com.google.common.geometry.S1Angle
import org.springframework.beans.factory.annotation.Value

abstract class GeolocationBase {
    
    companion object {
        // Level 13 (~600m) for storing program locations
        private const val STORAGE_CELL_LEVEL = 13
        // Maximum number of cells to use in covering
        private const val MAX_CELLS = 20
    }
    
    @Value("\${google.maps.api.key}")
    private lateinit var googleMapsApiKey: String
    
    // Convert address to lat/lng using Google Maps API
    internal open fun geocodeAddress(address: String): GeocodingResult {
        val geoApiContext = GeoApiContext.Builder()
            .apiKey(googleMapsApiKey)
            .build()
        
        val results = GeocodingApi.geocode(geoApiContext, address).await()
        return if (results.isNotEmpty()) {
            val location = results[0].geometry.location
            GeocodingResult(location.lat, location.lng)
        } else {
            throw IllegalArgumentException("Could not geocode address")
        }
    }

    // Convert lat/lng to cell ID at our standard precision level
    internal open fun latLngToCellId(lat: Double, lng: Double): Long {
        return S2CellId.fromLatLng(S2LatLng.fromDegrees(lat, lng))
            .parent(STORAGE_CELL_LEVEL)
            .id()
    }

    // Get cells covering an area with given radius
    internal open fun getCellIdRangesForRadius(lat: Double, lng: Double, radiusMiles: Double): List<CellIdRange> {
        // Convert center point and radius to S2Cap
        val center = S2LatLng.fromDegrees(lat, lng)
        val radiusRadians = radiusMiles / 3959.0  // Earth's radius in miles
        val cap = S2Cap.fromAxisAngle(center.toPoint(), S1Angle.radians(radiusRadians))
        
        // Calculate appropriate max level based on radius
        // Smaller radius = higher level (more precise cells)
        val maxLevel = when {
            radiusMiles <= 1 -> STORAGE_CELL_LEVEL     // Very small radius, use precise cells
            radiusMiles <= 5 -> STORAGE_CELL_LEVEL - 1 // ~1.2km cells
            radiusMiles <= 10 -> STORAGE_CELL_LEVEL - 2 // ~2.4km cells
            else -> STORAGE_CELL_LEVEL - 3              // ~4.8km cells
        }
        
        // Create coverer with just the essential parameters
        val coverer = S2RegionCoverer.builder()
            .setMaxLevel(maxLevel)
            .setMaxCells(MAX_CELLS)  // Performance tuning parameter
            .build()

        // Get cell ranges covering this cap
        return coverer.getCovering(cap).map { cell ->
            // Convert to our storage level for querying
            val start = cell.rangeMin().parent(STORAGE_CELL_LEVEL)
            val end = cell.rangeMax().parent(STORAGE_CELL_LEVEL)
            CellIdRange(start.id(), end.id())
        }
    }
}

data class GeocodingResult(val latitude: Double, val longitude: Double)
data class CellIdRange(val start: Long, val end: Long)