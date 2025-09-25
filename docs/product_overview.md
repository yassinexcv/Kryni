# Krini Platform Overview

## 1. Introduction

Krini is a digital marketplace that connects customers looking to rent cars with professional rental agencies operating across Morocco. The platform is designed to streamline the entire rental journey by providing:

- A frictionless search and booking experience for customers.
- A professional-grade dashboard that helps agencies manage listings, availability, and reservations.
- Secure, transparent transactions for all parties involved.

## 2. Main Actors

| Actor | Description |
| --- | --- |
| **Customer** | Browses the catalog, manages bookings, makes payments, and leaves feedback after a rental. |
| **Agency** | Registers with the marketplace, publishes fleet inventory, and manages reservations through a dashboard. |
| **Administrator** | Verifies agencies, supervises transactions, and ensures the overall quality of the marketplace. |

## 3. Core Features

### Customer Experience
- Authentication via email/password and social providers (Google, Facebook).
- Car discovery with filters for city, pickup dates, transmission type, and price.
- List and map-based browsing to compare vehicles quickly.
- Online booking and payment with secure checkout flows.
- Booking history management.
- Ratings and reviews once a rental is complete.

### Agency Portal
- Authentication with an additional validation step performed by administrators.
- Dashboard for creating and managing listings and reservations.
- Car publishing workflow capturing brand, model, year, daily price, media gallery, and availability calendar.
- Real-time view of incoming bookings.
- Performance analytics covering visits, reservations, and revenue trends.

### Administration Panel
- KYC validation for newly registered agencies.
- Management tools for users, vehicles, and reservations.
- Moderation workflow for listings and customer reviews.
- Oversight of payment flows and dispute resolution.

## 4. User Flow: Car Booking

1. Customer signs in to the application.
2. Customer searches for cars using location, date, transmission, and price filters.
3. Customer selects an agency vehicle and reviews its details.
4. Customer confirms the reservation and completes payment online.
5. Confirmation notifications are issued to both the customer and the agency.
6. After the rental period ends, the customer can submit a rating and review.

## 5. Recommended Technology Stack

### Frontend
- **Framework**: React or Next.js for SEO-friendly, performant frontends.
- **Styling**: Tailwind CSS for modern responsive UI development.
- **State Management**: React Query and/or Zustand to handle API data and local state efficiently.

### Backend
- **Runtime**: Node.js with Express for API delivery.
- **Database**: MongoDB or PostgreSQL depending on reporting requirements.
- **Authentication**: JWT-based flows or Firebase Authentication for social login support.

### Payments
- International gateways such as Stripe or PayPal.
- Local Moroccan gateway integration via CMI.

### Additional Integrations
- Mapping via Google Maps or Mapbox to display vehicle pickup locations.
- Media storage for vehicle photos using AWS S3 or Firebase Storage.

## 6. Security Considerations

- JWT-secured API access.
- Storage of encrypted passwords and sensitive data.
- HTTPS-only communication between clients and the platform.
- Fraud checks on transactions and manual verification of agencies.

## 7. High-Level Architecture

### Core Domain Entities
- **User**: encapsulates customers, agencies, and administrators with role-based access.
- **Car**: represents vehicles listed by agencies.
- **Reservation**: captures booking lifecycle, availability, and pricing.
- **Payment**: records transaction details and settlement status.
- **Review**: stores customer feedback and ratings.

### Key Use Cases
- Customer searches, books, pays, and leaves reviews.
- Agency publishes vehicles and manages bookings.
- Administrator validates agencies and monitors marketplace health.

## 8. Design & Branding Notes

- **Brand Name**: Krini.
- **Logo Concept**: Bridge motif featuring a stylized car with Moroccan zellige-inspired patterns.
- **Palette**: Navy Blue (#1f3b63) for trust and Bright Orange (#f7931e) for energy.
- **Design Style**: Clean, flat, mobile-first interface suited for a modern startup.

## 9. Roadmap Deliverables

### Phase 1 – Minimum Viable Product
- Customer and agency authentication flows.
- Car listing management for agencies.
- Car search, booking, and payment for customers.
- Baseline payment integration.

### Phase 2 – Enhanced Experience
- Interactive map browsing with advanced filters.
- Customer reviews and ratings.
- Advanced analytics for agencies.
- Comprehensive admin console.

## 10. Next Steps

- Finalize technology choices and development infrastructure.
- Define detailed API contracts and database schemas.
- Create UI/UX wireframes aligned with the branding direction.
- Prioritize MVP backlog items and plan sprint milestones.
