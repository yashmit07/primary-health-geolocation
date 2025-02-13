package com.primaryhealth.geolocation.base

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import com.google.common.geometry.S2CellId
import com.google.common.geometry.S2LatLng

class GeolocationBaseTest {
    private val testBase = object : GeolocationBase() {
        override fun geocodeAddress(address: String) = GeocodingResult(40.7128, -74.0060)
    }

    @Test
    fun `test coordinate to cellId conversion`() {
        val lat = 40.7128  // NYC coordinates
        val lng = -74.0060
        
        val cellId = testBase.latLngToCellId(lat, lng)
        assertNotNull(cellId)
        // Cell ID should be at level 13
        assertEquals(13, S2CellId(cellId).level())
        
        // Verify the cell contains our point
        val point = S2LatLng.fromDegrees(lat, lng)
        assertTrue(S2CellId(cellId).contains(S2CellId.fromLatLng(point)))
    }

    @Test
    fun `test get cell ranges for radius`() {
        val lat = 40.7128
        val lng = -74.0060
        val radiusMiles = 5.0

        val ranges = testBase.getCellIdRangesForRadius(lat, lng, radiusMiles)
        
        assertFalse(ranges.isEmpty())
        assertTrue(ranges.size <= 20)  // Should not exceed MAX_CELLS
        
        // All cells should be at level 13 or lower
        ranges.forEach { range ->
            val startLevel = S2CellId(range.start).level()
            val endLevel = S2CellId(range.end).level()
            assertTrue(startLevel <= 13)
            assertTrue(endLevel <= 13)
            assertTrue(range.start <= range.end)  // Verify range ordering
        }
        
        // Verify the ranges cover our center point
        val centerCell = S2CellId.fromLatLng(S2LatLng.fromDegrees(lat, lng))
        assertTrue(ranges.any { range -> 
            range.start <= centerCell.id() && centerCell.id() <= range.end 
        })
    }
}