# SwiftLogistics Deployment Guide

## Files needed for Backend (Render):
- server.js
- package.json 
- .env (with your MongoDB URI)

## Files needed for Frontend (Netlify):
- index.html
- tracking.html
- styles.css
- script.js
- tracking.js
- images/ (folder with team photos)

## Environment Setup:
1. MongoDB Atlas: Create database named 'swiftlogistics'
2. Render: Deploy backend with MONGODB_URI environment variable
3. Update API_BASE in HTML files with your Render URL
4. Netlify: Deploy frontend files

## Admin Access:
- Double-click "Smart Package Tracking" heading
- Password: swift2025admin

## Sample Tracking Numbers:
- SL123456789 (In Transit)
- SL987654321 (Delivered) 
- SL555666777 (Processing)