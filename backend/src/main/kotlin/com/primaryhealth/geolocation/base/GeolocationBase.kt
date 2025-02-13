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
        // Level 13 gives ~600m precision - better for social program search
        private const val CELL_LEVEL = 13
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
            .parent(CELL_LEVEL)
            .id()
    }

    // Get cells covering an area with given radius
    internal open fun getCellIdRangesForRadius(lat: Double, lng: Double, radiusMiles: Double): List<CellIdRange> {
        // Convert center point and radius to S2Cap
        val center = S2LatLng.fromDegrees(lat, lng)
        val radiusRadians = radiusMiles / 3959.0  // Earth's radius in miles
        val cap = S2Cap.fromAxisAngle(center.toPoint(), S1Angle.radians(radiusRadians))
        
        // Create coverer with adaptive levels based on radius
        val coverer = S2RegionCoverer.builder()
            .setMinLevel(CELL_LEVEL - 2)  // Allow slightly larger cells
            .setMaxLevel(CELL_LEVEL)      // But not smaller than our standard
            .setMaxCells(MAX_CELLS)       // Limit total cells for performance
            .setLevelMod(1)               // Allow intermediate levels
            .build()

        // Get cell ranges covering this cap
        return coverer.getCovering(cap).map { cell ->
            // Ensure returned ranges are at our standard level
            val start = cell.rangeMin().parent(CELL_LEVEL)
            val end = cell.rangeMax().parent(CELL_LEVEL)
            CellIdRange(start.id(), end.id())
        }
    }
}

data class GeocodingResult(val latitude: Double, val longitude: Double)
data class CellIdRange(val start: Long, val end: Long)