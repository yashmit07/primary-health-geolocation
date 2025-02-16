# Problems Encountered and Solutions

## Backend Issues

### 1. S2 Geometry Library Installation
**Problem**: Could not find com.google.geometry:s2-geometry-library:1.0
**Solution**: 
1. Added mavenLocal() to repositories in build.gradle.kts
2. Updated dependency version to HEAD-SNAPSHOT:
```kotlin
implementation("com.google.geometry:s2-geometry-library:HEAD-SNAPSHOT")
```

### 2. Database Schema Evolution
**Problem**: Needed to update schema to support program types
**Solution**: 
1. Created new tables for program_types and program_type_refs
2. Added migration scripts
3. Updated models and repositories accordingly

### 3. Type System Issues
**Problem**: Program types showing as "Multiple Services" instead of actual types
**Solution**:
1. Added DTOs package to handle response formatting
2. Updated service layer to include type information in responses
3. Modified frontend to properly display type information

### 4. Testing Issues
**Problem**: Compilation errors in test files due to unresolved references
**Solution**:
1. Added mockk for better Kotlin testing support
2. Moved DTOs to shared package
3. Updated test files to use proper mocking syntax

### 5. CORS Issues
**Problem**: Frontend couldn't connect to backend
**Solution**: Added WebConfig.kt with CORS configuration:
```kotlin
@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
    }
}
```

## Frontend Issues

### 1. React Dependencies
**Problem**: Dependency conflicts with @tremor/react
**Solution**: Used --legacy-peer-deps flag for installation:
```bash
npm install @react-google-maps/api @tremor/react --legacy-peer-deps
```

### 2. Type Definition Issues
**Problem**: TypeScript errors with program type definitions
**Solution**: 
1. Created proper interfaces for program types
2. Updated API response handling
3. Fixed component prop types

### 3. Google Maps Integration
**Problem**: Google Maps not loading properly
**Solution**: Added Script tag in layout.tsx with proper API key loading

# Resources

## Official Documentation
- [Spring Boot Documentation](https://spring.io/guides/gs/spring-boot#scratch)
- [S2 Geometry Library](https://github.com/google/s2-geometry-library-java)
- [Google Maps Services](https://mvnrepository.com/artifact/com.google.maps/google-maps-services/2.1.2)
- [Next.js Documentation](https://nextjs.org/docs)

## Tutorials and Guides
- [Kotlin CRUD REST API Tutorial](https://dev.to/francescoxx/kotlin-crud-rest-api-using-spring-boot-hibernate-postgres-docker-and-docker-compose-1cnl)
- [Spring Initializr](http://start.spring.io)
- [S2 Region Coverer Documentation](https://github.com/google/s2-geometry-library-java/blob/master/library/src/com/google/common/geometry/S2RegionCoverer.java)

## Tools
- [Map Circle Drawing Tool](https://www.mapdevelopers.com/draw-circle-tool.php)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Useful Commands

### PostgreSQL
```bash
# List databases
psql -l

# Connect to database
psql primary_health

# Show tables
\dt

# Show table schema
\d table_name

# Show indexes
\di

# Exit
\q
```

### Backend
```bash
# Clean and build
./gradlew clean build

# Run tests
./gradlew test

# Start application
./gradlew bootRun
```

### Frontend
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build
npm run build
```