# Firebase Blog

hosted version: https://fir-crud-app-cac59.web.app

A simple blog platform built using Angular and Firebase. This project demonstrates key Firebase services, including Authentication, Firestore Database, Analytics, Hosting, as well as integrating SEO best practices and creating a Progressive Web App (PWA).

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Learning Objectives](#learning-objectives)
- [Detailed Task Breakdown](#detailed-task-breakdown)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Building for Production](#building-for-production)
- [Deploying to Firebase](#deploying-to-firebase)
- [Usage](#usage)
- [Progressive Web App](#progressive-web-app)
- [SEO Optimization](#seo-optimization)
- [Firebase Analytics](#firebase-analytics)
- [License](#license)

## Project Overview

This project is a "Blog Platform" that allows users to create, update, delete, and comment on blog posts. It integrates various Firebase services like Authentication, Firestore, and Analytics. It also follows SEO best practices using Angular Universal for server-side rendering (SSR) and implements a PWA for offline capabilities.

## Features

- Firebase Authentication: Supports email/password registration and Google sign-in.
- Firestore Database: Allows CRUD operations on blog posts and real-time comments.
- Progressive Web App (PWA): Includes offline capabilities for previously viewed blog posts.
- SEO Optimization: Server-side rendering and dynamic meta tag management for better search engine rankings.
- Firebase Analytics: Tracks user activities such as page views and interactions.

## Technologies Used

- Angular: Frontend framework
- Firebase: Authentication, Firestore, Hosting, Analytics
- Angular Universal: For server-side rendering (SSR)
- Tailwind CSS: For styling
- Jest: For unit testing
- PWA: Progressive Web App support
- Node.js/Express: For SSR

## Learning Objectives

- Implement Firebase Authentication in an Angular application
- Perform CRUD operations using Firestore in Angular
- Deploy an Angular application to Firebase Hosting
- Implement basic SEO techniques in an Angular application
- Create a Progressive Web App (PWA) using Angular
- Integrate Firebase Analytics for basic usage tracking

## Detailed Task Breakdown

### 1. Firebase Authentication

- Email/password registration and login.
- Google sign-in option.
- User profile page.

### 2. Firestore Database

- Data model for blog posts and comments.
- CRUD operations for blog posts.
- Real-time listeners for comments.

### 3. SEO Optimization

- Angular Universal for SSR.
- Meta tag management service.
- Dynamic meta tags for blog posts.
- Structured data for blog posts (JSON-LD).

### 4. Progressive Web App

- `manifest.webmanifest` for PWA.
- Service worker implementation.
- Offline access to previously viewed blog posts.

### 5. Firebase Analytics

- Set up Firebase Analytics.
- Track page views and custom user events (e.g., comments, likes).

### 6. Deployment

- Production build.
- Deploy to Firebase Hosting.
- Optionally set up a custom domain.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/firebase-blog.git
   cd firebase-blog
   npm install
   ng serve

   ```

2. Navigate to http://localhost:4200/ in your browser.

Running with SSR (Server-Side Rendering)
To run the application with SSR enabled:

npm run serve:ssr:firebase-blog

3. Building for Production
   Run the following command to build the project for production:

ng build --configuration production

4. Deploying to Firebase
   Build the project for production:

ng build --configuration production
firebase deploy

## Usage

Authentication: Users can sign up or log in using email/password or Google sign-in.
Blog Posts: Authenticated users can create, update, delete, and comment on blog posts.
Offline Mode: Once a blog post is loaded, it can be accessed offline.
Progressive Web App
To enable offline capabilities, a manifest.webmanifest and a service worker are included. The service worker caches resources and enables offline viewing of previously visited pages.

## SEO Optimization

The project implements SEO techniques through server-side rendering with Angular Universal. Meta tags such as title, description, and og: tags are dynamically updated for each blog post. Structured data (JSON-LD) is also added for blog posts.

## Firebase Analytics

Firebase Analytics tracks user interactions within the app. This includes:

## Page Views: Tracks when a blog post is viewed.

Custom Events: Tracks interactions like comments and likes.
