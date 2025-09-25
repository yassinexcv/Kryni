# Krini – Digital Car Rental Platform

## 1. Introduction

Krini is a digital platform that acts as a bridge between customers who want to rent a car and rental agencies that provide vehicles. The product focuses on simplifying the car rental process in Morocco by offering:

- **Seamless discovery** – intuitive search and booking flows for customers.
- **Operational tooling** – a professional dashboard for agencies to manage their fleet and reservations.
- **Secure, transparent transactions** – trusted payment processing and dispute resolution.

## 2. Main Actors

- **Customer (User)** – browses available vehicles, makes bookings and payments, and submits reviews after rentals.
- **Agency** – registers on the platform, publishes cars, and manages reservations and fleet availability.
- **Administrator** – validates agency onboarding, monitors transactions, moderates listings and reviews, and ensures overall platform quality.

## 3. Core Features

### Customer Experience

- Register or log in using email, Google, or Facebook.
- Search vehicles by city, rental dates, price range, and transmission type (manual/automatic).
- Filter results and visualize cars in list view or on an interactive map.
- Book vehicles and pay securely online.
- Access a complete booking history.
- Post ratings and reviews after rentals.

### Agency Experience

- Register or log in (subject to administrator validation and KYC checks).
- Manage listings and reservations through a dedicated dashboard.
- Add detailed car information: brand, model, year, daily price, photos, and availability.
- Monitor bookings in real-time.
- View analytics including visits, reservations, and revenue metrics.

### Admin Experience

- Validate agency accounts following KYC procedures.
- Manage users and vehicle listings.
- Moderate reviews and ensure content quality.
- Oversee payment flows and handle disputes.

## 4. User Flow – Car Booking

1. Customer logs in.
2. Customer searches for cars with filters such as location, date, vehicle type, and price.
3. Customer selects a car from an agency listing.
4. Customer confirms the booking and completes payment.
5. Both the customer and agency receive booking confirmation notifications.
6. After the rental period, the customer can leave a review for the agency and vehicle.

## 5. Technology Stack (Recommended)

### Frontend

- React or Next.js for performant, SEO-friendly user interfaces.
- Tailwind CSS for modern, responsive styling.
- React Query or Zustand for managing API-driven state.

### Backend

- Node.js with Express for the RESTful API layer.
- MongoDB or PostgreSQL as the primary data store.
- JWT-based authentication or Firebase Authentication for secure sessions.

### Payments

- Stripe or PayPal for international payments.
- CMI Morocco for local payment processing.

### Additional Integrations

- Google Maps or Mapbox for car location visualization.
- AWS S3 or Firebase Storage for storing vehicle imagery.

## 6. Security Considerations

- Enforce JWT-based authentication and authorization for all roles.
- Store passwords securely using strong hashing algorithms.
- Require HTTPS-only communication across the platform.
- Implement fraud prevention checks on transactions.
- Conduct manual verification of agencies before activation.

## 7. High-Level UML Overview

### Core Entities (Class Diagram)

- **User** – represents customers, agencies, and administrators.
- **Car** – captures vehicle details, availability, and associated agency.
- **Reservation** – tracks bookings, schedules, and status.
- **Payment** – records payment attempts, confirmations, and refunds.
- **Review** – stores post-rental ratings and feedback.

### Key Use Cases

- **Customer** – search for cars, place bookings, process payments, and publish reviews.
- **Agency** – publish and manage car listings, monitor bookings, and review analytics.
- **Administrator** – validate agencies, moderate content, and supervise system operations.

## 8. Branding & Design

- **Product Name:** Krini.
- **Logo Concept:** A car silhouette integrated into a bridge, accented with Moroccan zellige-inspired patterns.
- **Color Palette:** Navy Blue (#1f3b63) paired with Bright Orange (#f7931e).
- **Visual Style:** Clean, flat, startup-tech aesthetic optimized for mobile-first experiences.

## 9. Roadmap & Deliverables

### MVP (Phase 1)

- Customer and agency authentication flows.
- Car publishing tools for agencies.
- Car search and booking journey for customers.
- Basic payment integration.

### Phase 2 Enhancements

- Interactive map with advanced filters.
- Ratings and reviews module.
- Detailed analytics for agency dashboards.
- Comprehensive admin panel.
