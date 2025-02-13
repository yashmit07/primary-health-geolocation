package com.primaryhealth.geolocation

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class GeolocationApplication

fun main(args: Array<String>) {
	runApplication<GeolocationApplication>(*args)
}
