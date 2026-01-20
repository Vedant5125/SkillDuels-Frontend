# SkillDuels Frontend

React frontend for the SkillDuels competitive learning platform.

## Setup

1. Install dependencies:
```bash
cd client
npm install
```

2. Create a `.env` file in the client directory:
```bash
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Features

- User authentication (login/register)
- Real-time 1v1 quiz battles
- Live score updates using Socket.IO
- Global leaderboard
- User profile with stats and battle history
- Admin panel for adding quiz questions
- Multiple quiz categories (Technical, Aptitude, Logical, General Knowledge)

## Tech Stack

- React 18
- Vite
- React Router v6
- Socket.IO Client
- Axios
- Context API for state management
