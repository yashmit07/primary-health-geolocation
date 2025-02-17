# Primary Health Geolocation Service

A geolocation-based service for matching patients with nearby social programs based on their location and program types.

## Overview

This service helps match patients with social programs based on their location and program types, helping address social determinants of health needs. It uses S2 Geometry for efficient spatial searching and Google Maps for visualization.

## Features

- Geocode addresses to coordinates using Google Maps API
- Find nearby social programs within specified radius
- Filter programs by type (Food, Healthcare, etc.)
- Efficient spatial searching using S2 Geometry's Hilbert curve
- Interactive map visualization with Google Maps
- Address autocomplete using Google Places API

## Tech Stack

### Backend
- Kotlin + Spring Boot
- PostgreSQL with spatial indexing
- S2 Geometry for spatial queries
- Google Maps Geocoding API
- Gradle for build management

### Frontend
- Next.js 14 with React 18
- Google Maps JavaScript API
- Tremor for UI components
- TypeScript for type safety
- Tailwind CSS for styling

## Setup

1. **Prerequisites**
   - JDK 17+
   - PostgreSQL 15+
   - Node.js 18+
   - Google Maps API key

2. **Database Setup**
   ```bash
   # Create database
   createdb primary_health

   # Run migrations in order
   psql primary_health < backend/src/main/resources/db/migration/create_social_programs_tables_V2.sql
   psql primary_health < backend/src/main/resources/db/migration/create_social_programs_tables_V3.sql
   ```

3. **Backend Configuration**
   - Update `application.properties`
   - Add your Google Maps API key and database credentials
   ```properties
   google.maps.api.key=your_api_key_here
   spring.datasource.url=jdbc:postgresql://localhost:5432/primary_health
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Frontend Configuration**
   - Create `.env.local`
   - Add your Google Maps API key
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

## Running the Application

1. **Start Backend**
   ```bash
   cd backend
   ./gradlew bootRun
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Visit `http://localhost:3000` to use the application.

## API Endpoints

### Programs
- `GET /api/programs/search` - Search for nearby programs
  - Query params: 
    - `address`: Address to search from
    - `radiusMiles`: Search radius in miles
    - `typeId`: (Optional) Filter by program type ID
- `POST /api/programs/add` - Add a new program
  - Body: `{ name: string, address: string, types: string[] }`

### Program Types
- `GET /api/types` - Get all available program types

## Architecture

- Uses S2 Geometry's Hilbert curve for efficient spatial indexing
- Implements geolocation functionality in a base class for reusability
- Separates program types from spatial data for flexibility
- Uses CellID ranges for efficient radius searches

## Database Schema

The database uses three main tables:
1. `social_programs` - Stores program information and location data
2. `program_types` - Stores available program types
3. `program_type_ref` - Maps programs to their types (many-to-many)
