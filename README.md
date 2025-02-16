# Primary Health Geolocation Service

A geolocation-based service for matching patients with nearby social programs based on location and program type.

## Overview

This service helps match patients with social programs by:
- Converting addresses to geographical coordinates
- Finding programs within a specified radius
- Filtering by program types (Food, Housing, etc.)
- Visualizing results on Google Maps

## Tech Stack

### Backend
- Kotlin 1.9.x
- Spring Boot 3.4.x
- PostgreSQL 14+
- S2 Geometry for spatial indexing
- Google Maps API for geocoding

### Frontend
- Next.js 14
- React
- Tailwind CSS
- Google Maps JavaScript API

## Local Development Setup

### Prerequisites
1. JDK 17 or higher
2. PostgreSQL 14 or higher
3. Node.js 18 or higher
4. Google Maps API key

### Database Setup
1. Create PostgreSQL database:
```sql
CREATE DATABASE primary_health;
```

2. Run the schema migration:
```sql
psql primary_health < src/main/resources/db/migration/create_social_programs_tables_V2.sql
```

### Backend Setup
1. Configure database connection in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/primary_health
spring.datasource.username=your_username
spring.datasource.password=your_password
google.maps.api.key=your_google_maps_api_key
```

2. Build and run the backend:
```bash
./gradlew bootRun
```

The backend will be available at http://localhost:8080

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with your Google Maps API key:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## API Endpoints

### Program Types
- `GET /api/programs/types` - Get all program types
```bash
curl http://localhost:8080/api/programs/types
```

### Search Programs
- `GET /api/programs/search` - Search for nearby programs
```bash
curl "http://localhost:8080/api/programs/search?address=123%20Broadway%20St&radiusMiles=2&typeId=1"
```

Parameters:
- `address`: Street address to search from
- `radiusMiles`: Search radius in miles
- `typeId`: (Optional) Filter by program type

### Add Program
- `POST /api/programs/add` - Add a new program
```bash
curl -X POST http://localhost:8080/api/programs/add \
-H "Content-Type: application/json" \
-d '{
  "name": "Food Bank Program",
  "address": "123 Main St, New York, NY 10001",
  "typeIds": [1]
}'
```

## Testing

### Backend Tests
```bash
./gradlew test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Database Schema

### program_types
- `type_id`: Primary key
- `type_name`: Program type name (Food, Housing, etc.)

### social_programs
- `id`: Primary key
- `name`: Program name
- `address`: Street address
- `latitude`: Geocoded latitude
- `longitude`: Geocoded longitude
- `cell_id`: S2 cell ID for spatial indexing

### program_type_refs
- `id`: Primary key
- `program_id`: Reference to social_programs
- `type_id`: Reference to program_types

## Development Notes

- The backend uses S2 Geometry library for efficient spatial indexing
- Program types are predefined in the database
- All addresses are geocoded using Google Maps API
- Search radius is converted to S2 cells for efficient querying
- Frontend fetches types dynamically from the backend
