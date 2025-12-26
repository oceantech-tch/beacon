# Beacon (MVP)

A full-stack MVP built to explore how wishlist-driven notifications can reduce manual inquiries for product availability.

This project simulates a real-world workflow where users register interest in specific G-Shock models, and an admin notifies interested users when products become available.

The focus of this MVP is **product logic, authentication flow, and admin–user interaction**, not UI polish.

---

## Overview

Many resale businesses receive repeated DMs asking about product availability.  
This MVP proposes a simple alternative:

- Users add products they want to a wishlist  
- Admin uploads a product when it becomes available  
- Users who wishlisted that product are automatically notified via email  

The system tracks demand first, then responds when supply arrives.

---

## Features

### User Features
- User authentication
- Add G-Shock models to a personal wishlist
- Remove models from wishlist
- View product details when available
- Receive email notification when a wishlisted product is uploaded

### Admin Features
- Admin authentication
- Upload new products
- Notify users who wishlisted a product
- View wishlist insights (models + interest count)
- View users interested in a specific model
- Disable products after notification to prevent duplicate alerts

---

## Wishlist Insights

The admin dashboard includes a **Wishlist Insights** page that displays:

- All wishlisted models
- Number of users requesting each model
- Drill-down view of users interested in a selected model

The insights page auto-refreshes periodically without resetting the UI state.

---

## Email Notifications

- Email notifications are sent using **SendGrid**
- Users receive alerts when a wishlisted product is uploaded
- After notification, the product is marked as disabled to prevent re-notification

---

## Tech Stack

### Frontend
- React
- TypeScript
- React Router
- Axios
- Context API
- Vite

### Backend
- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- SendGrid (Email Service)

---

## Project Structure

/client   → React frontend
/server   → Express + MongoDB backend

Frontend and backend are deployed separately.

---

## Authentication Model

- JWT-based authentication
- Separate access control for users and admin
- Protected routes on frontend and backend
- Session restoration via localStorage on refresh

---

## Design Philosophy

This MVP prioritizes:

- Clear data flow
- Correct authorization
- Realistic admin workflows
- Scalable backend logic

The goal was to build something **functional, testable, and close to a real business use-case**, not a marketing demo.

---

## Status

This project is an MVP.

The current implementation fully demonstrates the core flow:

> Track demand → upload supply → notify users.

---

## Notes

- Built as a practical exploration, not a commercial product 
- <strong role="alert">Brand names are used strictly for demonstration purposes</strong>
