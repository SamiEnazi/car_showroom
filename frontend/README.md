# Car Showroom Management System - Challenge Solution

This project is a solution to the Full-Stack Developer Challenge for building a car showroom management system. It demonstrates the implementation of a complete web application using Spring Boot for the backend and Angular for the frontend.

## Challenge Requirements Met

### Backend Implementation ✅

- **Spring Boot & JPA**: Implemented using latest stable versions
- **Database Management**: PostgreSQL with JPA/Hibernate
- **API Endpoints**: All required endpoints implemented with proper validation
- **Authentication**: JWT-based authentication implemented as bonus
- **Authorization**: Role-based access control (ADMIN/USER)
- **Database Version Control**: Flyway integration for database migrations
- **Soft Delete**: Implemented for both showrooms and cars
- **Exception Handling**: Global exception handling with appropriate HTTP status codes

### Frontend Implementation ✅

- **Angular**: Latest version with standalone components
- **Secure Routes**: Admin and public route separation
- **Form Validation**: Comprehensive input validation
- **Responsive UI**: Mobile-friendly interface
- **Error Handling**: User-friendly error messages via Toastr
- **Lazy Loading**: Implemented for optimal performance
- **Authentication**: Login/logout functionality with JWT
- **Caching**: Service-level caching for better performance

## Project Structure

### Backend Structure

```
backend/src/main/java/com/challenge/carshowroom/
├── config/              # Configuration files (Security, etc.)
├── controllers/         # REST API endpoints
├── dtos/               # Data Transfer Objects
├── exceptions/         # Custom exceptions and handler
├── models/             # Entity classes
├── repositories/       # JPA repositories
├── security/          # JWT and auth implementation
├── seeders/           # Database seeders
└── services/          # Business logic layer
```

### Frontend Structure

```
frontend/src/
├── app/
│   ├── auth/           # Authentication components
│   ├── components/     # Feature components
│   ├── core/          # Core services
│   ├── Interfaces/    # TypeScript interfaces
│   └── shared/        # Shared modules
```

## Setup Instructions

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.8+

### Backend Setup

1. Database Configuration

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/car_showroom_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.flyway.schemas=car_showroom_db
   ```

2. Flyway Configuration in `pom.xml`:

   ```xml
   <plugin>
       <groupId>org.flywaydb</groupId>
       <artifactId>flyway-maven-plugin</artifactId>
       <version>10.20.1</version>
       <configuration>
           <url>jdbc:postgresql://localhost:5432/car_showroom_db</url>
           <user>your_username</user>
           <password>your_password</password>
           <schemas>car_showroom_db</schemas>
           <locations>filesystem:src/main/resources/db/migration</locations>
       </configuration>
   </plugin>
   ```

3. Build and Run
   ```bash
   cd backend
   mvn clean install
   mvn flyway:migrate
   java -jar target/car-showroom-management-0.0.1-SNAPSHOT.jar
   ```

### Frontend Setup

1. Install Dependencies

   ```bash
   cd frontend
   npm install
   ```

2. Configure Environment

   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: "http://localhost:8081",
   };
   ```

3. Run Development Server
   ```bash
   ng serve
   ```

## API Documentation

### Authentication

- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Public APIs

- GET `/public/showrooms` - List showrooms (paginated)
- GET `/public/showrooms/{id}` - Get showroom details
- GET `/public/cars` - List cars (paginated)
- GET `/public/cars/{id}` - Get car details

### Admin APIs

- POST `/admin/showrooms/create` - Create showroom
- PUT `/admin/showrooms/update/{id}` - Update showroom
- DELETE `/admin/showrooms/delete/{id}` - Soft delete showroom
- POST `/admin/cars/create` - Create car
- PUT `/admin/cars/update/{id}` - Update car
- DELETE `/admin/cars/delete/{id}` - Soft delete car

## Security Implementation

- JWT authentication with Spring Security
- Role-based authorization (USER/ADMIN)
- Password encryption using BCrypt
- Protected admin routes
- CORS configuration
- Frontend route guards

## Additional Features

### Backend

- Global exception handling
- Input validation using Jakarta Validation
- Soft delete implementation
- Caching for improved performance
- Data seeding capability

### Frontend

- Responsive design
- Service-level caching
- HTTP interceptors for JWT
- Toastr notifications
- Protected routes with guards

## Assumptions and Limitations

1. Single admin user (can be expanded)
2. JWT token expiry set to 24 hours
3. Soft delete implementation for data retention
4. Frontend caching assumes moderate data size
5. Image uploads not implemented (URLs only)

## Testing

### Backend Testing

- Use Postman collection provided in `/docs/postman`
- Unit tests available in test packages
- Integration tests for critical paths

### Frontend Testing

- Component tests using Jasmine/Karma
- End-to-end tests using Cypress
- Manual testing checklist in `/docs/testing`

## Performance Considerations

1. Database indexing on frequently queried fields
2. Frontend caching for better user experience
3. Lazy loading of Angular modules
4. Pagination for large datasets
5. Soft deletes for data integrity

## Future Improvements

1. Implement image upload functionality
2. Add user profile management
3. Enhance caching strategy
4. Add more comprehensive logging
5. Implement real-time notifications

## License

This project is licensed under the MIT License.
