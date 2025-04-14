# Bookmart

## Peer-to-Peer Book Exchange Portal

Bookmart is a simple and efficient platform I built to connect two types of users: Book Owners and Book Seekers. As the developer, I focused on making it easy for seekers to explore and rent or buy books based on genre and location, while owners can list their books to rent, sell, or exchange. The app is built with React and Node.js, using cookie-based authentication for simplicity.


----------------------------------------------------------------------------------------

## Features

### User Roles

**Seeker:**
- Browse books by genre and location.
- Rent, buy or exchange books

**Owner:**
- Add books for rent, sale, or exchange
- Accept or decline seeker requests
- Manage book listing statuses

### Functional Highlights

- Role-based navigation and dashboards
- Book request system with accept/decline options
- Message feedback for request actions
- Simple cookie-based login system
- In-memory or JSON file data storage



----------------------------------------------------------------------------------------

## What’s Working

- User registration and login with role selection (Seeker or Owner)
- Cookie-based authentication
- Book rental system with status tracking
- Owner dashboard for managing requests
- Real-time messaging for request actions


----------------------------------------------------------------------------------------

## What’s Not Working / In Progress

- Exchange and buy flows need refinement
- Profile image upload is not implemented yet


----------------------------------------------------------------------------------------

## Bonus Features I Added

Books will be automatically marked as "Rented" or "Exchanged" after the owner accepts the seeker's request.
- UI adapts based on user role (Seeker or Owner)
- Dashboards are separated for each role
- Modular routing and clean structure for scalability
- Messaging system shows feedback on request actions



----------------------------------------------------------------------------------------

## AI Tools I Used

- ChatGPT
- DeepSeek


----------------------------------------------------------------------------------------

## Setup Instructions

Here's how you can run this project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bookmart.git
   cd bookmart
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   - In `backend/.env`:
     ```
     MONGO_URI=your_mongo_connection_string
     PORT=5000
     ```

   - In `frontend/.env`:
     ```
     VITE_API_URL=http://localhost:5000
     ```

5. **Run the application**
   - Start the backend:
     ```bash
     npm run dev
     ```
   - Start the frontend:
     ```bash
     npm run dev
     ```

---


