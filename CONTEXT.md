# House of Velo - Java/Spring Boot API - Development Context

## Project Overview

**Project Name:** HouseOfVeloAPI
**Location (Local Dev):** `/Users/danielcoleman/Desktop/Nurill/HouseOfVeloAPI`
**Location (Server):** Will be deployed to `/home/serversam/HouseOfVeloJava/` (future)
**Developer:** Daniel Coleman (serversam)
**Started:** December 30, 2024
**Status:** Active Development - Session 1 Complete

---

## Why This Project Exists

This is a **dual-purpose rebuild** of an existing Node.js/Express booking platform for House of Velo, a real business offering baseball training services.

### 1. Learning & Interview Preparation
- **Primary Goal:** Build hands-on experience with Java/Spring Boot for technical interviews
- **Approach:** Manual coding (no copy-paste), detailed explanations of WHY behind every decision
- **Focus Areas:**
  - Enterprise-grade architecture patterns
  - Spring Boot ecosystem (Security, Data JPA, Transactions)
  - Production-ready practices (environment variables, proper error handling, testing)
  - Database design and JPA relationships
  - RESTful API design
  - Payment integration (Stripe)

### 2. Production Application for Real Business
- **Business Owner:** Counting on this for actual use in production
- **Requirements:**
  - Rock-solid reliability
  - Secure authentication and payment processing
  - Scalable architecture
  - Clean separation of concerns for future maintenance
- **No Timeline Pressure:** Quality over speed - this needs to work flawlessly

---

## Business Context

### House of Velo Umbrella Organization

**Two Main Programs:**
1. **Moore Velocity** - Individual training sessions with package bookings
2. **518 Velocity** - Youth baseball program

**Core Features Needed:**
- User authentication (parents, trainers, admins, scouts)
- Player management (linked to parent accounts)
- Session type management
- Package purchases (e.g., "10 sessions for $500")
- Booking system with trainer scheduling
- Stripe payment processing
- Admin dashboard for managing bookings, users, and analytics

**Future Vision:**
- Scouting platform with player analytics
- Integration with Rapsodo/HitTrax data
- Scout reports and player rankings
- Showcase event management

---

## Original vs. Rebuild

### Node.js Version (Reference Implementation)
- **Location:** `/home/serversam/HouseOfVelo` (on server)
- **Status:** Working prototype
- **Tech Stack:** Node.js, Express, PostgreSQL, BCrypt, Stripe integration
- **Purpose:** Reference for feature parity, API patterns, business logic validation

### Java/Spring Boot Version (This Project)
- **Tech Stack:**
  - Java 17
  - Spring Boot 4.0.1
  - Spring Data JPA (Hibernate 7.2)
  - Spring Security (JWT planned)
  - PostgreSQL
  - Stripe Java SDK (to add)
  - Maven
- **Why Java:**
  - Better type safety
  - Enterprise-grade transaction management
  - More interview-relevant than Node.js
  - Long-term production stability
  - Stronger ecosystem for scaling

---

## Development Philosophy

### Learning Approach
1. **Manual Implementation:** Code typed manually to build muscle memory
2. **Deep Understanding:** Every pattern explained with WHY, not just HOW
3. **Interview-Ready:** Focus on concepts that come up in technical interviews
4. **Production Mindset:** Build it right the first time, not "quick and dirty"

### Code Quality Standards
- Environment variable configuration from day one
- Proper exception handling
- Repository pattern for data access
- Service layer for business logic
- DTOs for API request/response separation
- Comprehensive validation
- Security best practices (BCrypt, JWT, no hardcoded secrets)

---

## Project Structure

```
HouseOfVeloAPI/
├── src/
│   ├── main/
│   │   ├── java/com/houseofvelo/api/
│   │   │   ├── config/           ← Security, CORS, app configuration
│   │   │   ├── controller/       ← REST endpoints
│   │   │   ├── service/          ← Business logic
│   │   │   ├── repository/       ← Database queries (Spring Data JPA)
│   │   │   ├── model/            ← JPA Entities (User, Booking, etc.)
│   │   │   ├── dto/              ← Request/Response objects
│   │   │   ├── exception/        ← Custom exceptions & handlers
│   │   │   ├── util/             ← Helper utilities
│   │   │   └── HouseOfVeloApiApplication.java
│   │   └── resources/
│   │       ├── application.yml   ← Configuration (uses env variables)
│   │       └── db/migration/     ← Flyway migrations (to add)
│   └── test/
│       └── java/com/houseofvelo/api/
├── pom.xml                        ← Maven dependencies
├── CONTEXT.md                     ← This file
└── .gitignore
```

---

## Progress Tracker

### ✅ Session 1 Complete (December 30, 2024)

**Infrastructure Setup:**
- [x] Created Spring Boot 4.0.1 project in IntelliJ
- [x] Fixed Maven dependencies (removed invalid variants, corrected starters)
- [x] Installed PostgreSQL 16 locally on Mac via Homebrew
- [x] Created `houseofvelo_java` database
- [x] Set up database user with proper permissions

**Project Foundation:**
- [x] Created 8-package architecture (config, controller, service, repository, model, dto, exception, util)
- [x] Configured production-ready `application.yml` with environment variables
- [x] Set up IntelliJ Run Configuration with environment variables
- [x] Project compiles and runs successfully

**Data Layer:**
- [x] Created `Role` enum (PARENT, ADMIN, TRAINER, SCOUT)
- [x] Implemented `User` entity with JPA annotations
  - Auto-increment ID
  - Email (unique, indexed)
  - BCrypt-ready password field
  - Role enum (stored as string)
  - Timestamps (created_at, updated_at)
  - Lombok annotations for boilerplate reduction
- [x] Created `UserRepository` interface with Spring Data JPA
  - `findByEmail()` - Email lookup for authentication
  - `existsByEmail()` - Duplicate check for registration
- [x] Tested database connection successfully
- [x] Verified Hibernate auto-created `users` table with correct schema

---

## Next Steps (Session 2 - Authentication)

### Immediate Priorities
1. **UserService Implementation**
   - User registration with BCrypt password hashing
   - Email validation
   - Duplicate email prevention
   - Login validation

2. **Spring Security Configuration**
   - JWT token generation
   - JWT token validation
   - SecurityFilterChain setup
   - BCryptPasswordEncoder bean

3. **AuthController (REST API)**
   - `POST /api/auth/signup` - User registration
   - `POST /api/auth/login` - User authentication
   - DTOs: SignupRequest, LoginRequest, AuthResponse

4. **Testing**
   - Test endpoints with Postman
   - Verify JWT token flow
   - Test invalid credentials handling

---

## Future Roadmap

### Phase 3: Core Entities (Sessions 4-5)
- Player entity and repository
- SessionType entity (training session types)
- Package entity (bundle purchases)
- Booking entity
- Entity relationship mapping (@OneToMany, @ManyToOne, etc.)

### Phase 4: Business Logic (Sessions 6-8)
- Booking service with @Transactional
- Package purchase logic
- Session scheduling
- Cancellation and refund handling
- Availability checking

### Phase 5: Stripe Integration (Sessions 9-10)
- Stripe Java SDK integration
- Payment intent creation
- Webhook handling
- Payment confirmation flow
- Refund processing

### Phase 6: Admin Features (Sessions 11-12)
- Admin dashboard endpoints
- User management (CRUD)
- Booking management
- Analytics and reporting

### Phase 7: Testing & Deployment (Sessions 13-15)
- Unit tests (JUnit, Mockito)
- Integration tests
- Docker containerization
- Deployment to server
- Environment-specific configurations

### Phase 8: Advanced Features (Future)
- Scouting platform
- Player metrics (Rapsodo/HitTrax integration)
- Scout reports
- Player rankings
- Showcase event management

---

## Technical Decisions Log

### Decision: Spring Boot 4.0.1 vs 3.3.6
- **Choice:** Use 4.0.1 (IntelliJ default)
- **Reason:** Move forward with latest, core concepts remain same
- **Risk:** Bleeding edge, fewer resources
- **Mitigation:** Reference 3.x docs, core Spring patterns unchanged

### Decision: Maven vs Gradle
- **Choice:** Maven
- **Reason:** More standard in enterprise, better for interview prep

### Decision: Monolith vs Microservices
- **Choice:** Start with monolith
- **Reason:** Simpler to build/deploy/maintain, can refactor later if needed

### Decision: Environment Variables from Day 1
- **Choice:** Use `${VAR:default}` pattern in application.yml
- **Reason:** Production-ready from start, no refactoring needed later

### Decision: Hibernate DDL Auto Strategy
- **Choice:** `update` for dev, `validate` for production (via env var)
- **Reason:** Auto-creates tables during development, safe validation in production

---

## Development Environment

### Local Mac Setup
- **OS:** macOS
- **IDE:** IntelliJ IDEA
- **Java:** OpenJDK 25.0.1
- **Database:** PostgreSQL 16.11 (via Homebrew)
- **Build Tool:** Maven (via IntelliJ)

### Database Configuration (Local Dev)
```yaml
DB_HOST=localhost
DB_PORT=5432
DB_NAME=houseofvelo_java
DB_USERNAME=houseofvelo
DB_PASSWORD=<local_dev_password>
HIBERNATE_DDL_AUTO=update
SHOW_SQL=true
```

### Production Deployment (Future)
- **Server:** serversam (Linux server with Tailscale)
- **Database:** PostgreSQL (production instance)
- **Environment:** Environment variables via systemd or .env file
- **Deployment:** Docker container or JAR with systemd service

---

## Interview Prep Value

This project demonstrates:
- ✅ REST API design principles
- ✅ Layered architecture (controller → service → repository)
- ✅ JPA entity relationships and cascade strategies
- ✅ Transaction management (@Transactional)
- ✅ Spring Security with JWT authentication
- ✅ Payment processing (Stripe integration)
- ✅ Environment-based configuration
- ✅ Exception handling strategies
- ✅ DTO pattern for API contract separation
- ✅ Repository pattern with Spring Data JPA
- ✅ Bean Validation
- ✅ Role-based access control
- ✅ Database schema design
- ✅ Testing strategies (unit, integration)

---

## Resources & References

**Spring Boot Documentation:**
- https://docs.spring.io/spring-boot/docs/current/reference/html/

**Spring Data JPA:**
- https://spring.io/projects/spring-data-jpa

**Spring Security:**
- https://spring.io/projects/spring-security

**Stripe Java SDK:**
- https://stripe.com/docs/api/java

**Learning Resources:**
- Baeldung Spring Tutorials: https://www.baeldung.com/spring-boot

**Node.js Reference:**
- `/home/serversam/HouseOfVelo` - Original implementation for feature reference

---

## Notes & Reminders

- **Tailscale:** Configured on server for remote access (Mac setup pending)
- **Business Owner Dependency:** This is needed for actual production use
- **Learning First:** Detailed explanations prioritized over speed
- **No Shortcuts:** Building production-quality code from the start
- **Manual Typing:** Code written manually, not copy-pasted

---

**Last Updated:** December 30, 2024 - Session 1 Complete
**Next Session:** Authentication & JWT Implementation
