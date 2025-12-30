# Beacon — Wishlist Notification System (MVP)

Beacon is a full-stack MVP built to explore how wishlist-driven notifications can reduce manual product availability inquiries for social-commerce sellers.

The system was designed around a real workflow used by Instagram watch resellers, where customer demand is tracked *before* inventory arrives, and notifications are sent only when supply becomes available.

This project prioritizes **backend correctness, authentication design, and admin–user interaction** over UI polish or monetization features.

---

## Problem Context

Small resellers often receive repeated DMs asking about product availability:

- “Do you have model X?”
- “Any restock coming?”
- “Can you notify me if this arrives?”

These requests are usually tracked manually — or not at all.

When stock finally arrives:
- Sellers forget who asked
- Notifications are inconsistent
- There’s no visibility into which products are actually in demand

Beacon introduces structure **without changing the seller’s existing sales flow**.

---

## Core Workflow

1. Users add specific product models to a wishlist  
2. Admin uploads a product when inventory becomes available  
3. Users who wishlisted that model are notified automatically via email  
4. The product is disabled after notification to prevent duplicate alerts  

This creates a simple but reliable loop:

> Track demand → respond when supply arrives

---

## Features

### User
- Google-based authentication
- Add and remove products from a personal wishlist
- View wishlist and product availability
- Receive email notification when a matching product is uploaded
- No checkout or payment flow (intentional)

### Admin
- JWT-protected admin authentication
- Upload products with metadata (model, price, condition, image)
- Trigger notifications to matching users on upload
- Disable products after notification to prevent re-sending
- View **Wishlist Insights**:
  - Aggregated models users want
  - Interest count per model
  - Drill-down view of users per model
  - Auto-refreshing insights without breaking UI state

---

## Email Notifications

- Email delivery handled via **SendGrid**
- Notifications are sent only once per product
- Email logic is isolated and provider-agnostic

---

## Technical Stack

### Frontend
- React
- **TypeScript**
- Vite
- React Router
- Context API
- Axios

### Backend
- Node.js
- Express
- **TypeScript**
- MongoDB (Mongoose)
- JWT authentication
- SendGrid (email service)

---

## Project Structure

`/client`   → React + TypeScript frontend
`/server`   → Express + MongoDB backend

Frontend and backend are developed and deployed independently.

---

## Authentication & Authorization

- JWT-based authentication
- Separate access paths for users and admin
- Protected routes enforced on both frontend and backend
- Session restoration via `localStorage`
- Authorization enforced at the API level, not the UI

---

## Design Decisions & Tradeoffs

- **No payments or checkout**  
  Focus was kept on demand tracking and notifications, not ecommerce.

- **No public storefront**  
  The system supports existing DM-based sales workflows.

- **MVP-level UI**  
  Effort was prioritized on backend logic and correctness.

These decisions were made intentionally to avoid over-engineering.

---

## Current Status

- Core flows implemented end-to-end
- Email notifications are live (not sandboxed)
- Admin and user roles fully separated
- Stable MVP suitable for validation and demonstration

---

## Why This Project Exists

Beacon was built to demonstrate:

- Translating real business problems into software
- MVP scoping and trade-off decisions
- Full-stack execution with TypeScript
- Authentication, authorization, and notifications
- Knowing when **not** to add features

---

## Notes

- Built as a portfolio MVP, not a commercial product
- <strong role="alert">Brand names are used strictly for demonstration purposes</strong>
