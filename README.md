# Crowdfunding Platform - Backend

This is the backend for a crowdfunding platform built with Spring Boot and JPA/Hibernate.

## Tech Stack
- **Framework**: Spring Boot 4.0.3
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Persistence**: Spring Data JPA / Hibernate
- **Build Tool**: Maven

## Project Structure
The project follows a standard Spring Boot package structure:
- `com.example.project.entity`: JPA Entities mapped to SQL tables.
- `com.example.project.repository`: Spring Data JPA repositories.
- `com.example.project.enums`: Domain-specific enumerations (UserRole, ProjectStatus, etc.).
- `com.example.project.config`: Application configurations.

## Database Schema
The persistence layer is managed by Hibernate (`ddl-auto=update`). The entities are mapped to the following SQL tables:
- `users`: Unified table for user credentials and profiles (first name, last name, phone, etc.).
- `projects`: Crowdfunding campaigns.
- `project_steps`: Milestones for each project.
- `rewards`: Incentives for contributors.
- `contributions`: Tracks user investments in projects.
- `transactions`: Financial movements (Investments, Withdrawals).
- `kyc_documents`: User verification documents.
- `ai_analysis`: AI-driven success and risk scoring for projects.

## Getting Started

### Prerequisites
- Java 17+
- MySQL Server

### Configuration
Update `src/main/resources/application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/crowdfunding?createDatabaseIfNotExist=true
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### Running the Application
```bash
./mvnw spring-boot:run
```

## Work History
- **Flyway Removal**: Migrated from Flyway-based schema management to Hibernate automatic ddl-auto for flexibility during development.
- **Entity Alignment**: Refactored the domain model to align with a standardized SQL schema (Long IDs, BigDecimal for currency).
- **Profile Merger**: Consolidated `Utilisateur` and `ProfilUtilisateur` into a single, efficient entity.
