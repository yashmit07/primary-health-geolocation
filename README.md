# Primary Health Geolocation Service

A geolocation-based service for matching patients with nearby social programs.

## Overview

This service helps match patients with social programs based on their location, helping address social determinants of health needs.

## Features

- Geocode addresses to coordinates
- Find nearby social programs within specified radius
- Efficient spatial searching using S2 Geometry
- Google Maps integration for visualization

## Tech Stack

- Backend: Kotlin + Spring Boot
- Database: PostgreSQL
- Spatial Indexing: S2 Geometry
- Geocoding: Google Maps API

## Setup

1. Ensure you have JDK 17+ and PostgreSQL installed
2. Configure database settings in `application.properties`
3. Add your Google Maps API key to `application.properties`
4. Run the application:
   ```bash
   ./gradlew bootRun
   ```

## API Endpoints

- GET /api/programs/search - Search for nearby programs
- POST /api/programs/add - Add a new program
