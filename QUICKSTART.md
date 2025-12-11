# Quick Start Guide

## Prerequisites Check
- [ ] Node.js installed (v14+)
- [ ] MySQL installed and running
- [ ] npm or yarn installed

## Step-by-Step Setup

### 1. Database Setup (5 minutes)
```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source database/schema.sql

# Verify (should show Customers and Payments tables)
USE payment_collection;
SHOW TABLES;
```

### 2. Backend Setup (2 minutes)
```bash
cd backend
npm install

# Create .env file with your MySQL credentials:
# PORT=3000
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=payment_collection
# DB_PORT=3306

npm start
```

### 3. Frontend Setup (2 minutes)
```bash
cd frontend
npm install

# Update frontend/config/api.js with your API URL:
# - Android Emulator: http://10.0.2.2:3000
# - iOS Simulator: http://localhost:3000
# - Physical Device: http://YOUR_IP:3000

npm start
```

### 4. Test Login
Use these test credentials:
- Account Number: `ACC001`
- Mobile: `9876543210`

## Troubleshooting

**Backend won't start:**
- Check MySQL is running
- Verify .env file exists and has correct credentials
- Check if port 3000 is available

**Frontend can't connect:**
- Verify backend is running on port 3000
- Check API_BASE_URL in frontend/config/api.js
- For physical device, ensure phone and computer are on same network

**Database errors:**
- Ensure MySQL is running
- Verify database exists: `SHOW DATABASES;`
- Check table structure: `DESCRIBE Customers;`

