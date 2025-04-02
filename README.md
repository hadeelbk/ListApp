# Shared To-Do 

A collaborative list-sharing web app built with **React + TypeScript**, **Supabase**, and a **Node.js/Express backend**. Designed for Alex, Raine, and their roommates to manage to-dos, grocery shopping, and reusable templates — all while prioritizing **data privacy (GDPR)** and modularity.

---

## Features

### Core
- Authentication via Supabase (email/password)
- Create & delete to-do / grocery lists
- Name lists & toggle between `private` and `shared`
- Check/uncheck, add, and delete items in a list
- GDPR-conscious data access with Supabase RLS
- Fully responsive and mobile-friendly UI

### Collaboration
- Invite roommates to shared lists (via email)
- Link-based guest viewing (no login needed)
- Secure row-level access based on collaborators

### Templates 
- Save lists as templates 
- Reuse templates to generate new lists
- Server-side logic for secure cloning (Node.js)

---

## Tech Stack

### Frontend
- **Vite** + **React** + **TypeScript**
- **TailwindCSS** (for styling)
- **React Router** (routing)
- **React Icons** (iconography)
- **Supabase JS Client** (v2)

### Backend
- **Node.js** (v22+)
- **Express** (v4)
- **Supabase JS** (v2)
- **dotenv** (for env config)

### Auth & DB
- **Supabase**: Authentication, Database, Row-Level Security (RLS)
- PostgreSQL: managed by Supabase

---

## Setup Instructions

### 1. Clone the project
- git clone https://github.com/your-username/ListApp.git

- cd ListApp

### 2. Install dependencies
### Frontend
- cd client
- npm install

### Backend
- cd server
- npm install

### 3. Set up environment variables

## client:
- VITE_SUPABASE_URL=https://your-project.supabase.co   
- VITE_SUPABASE_ANON_KEY=your-anon-key

## server:
- SUPABASE_URL=https://your-project.supabase.co   |
- SUPABASE_SERVICE_ROLE_KEY=your-service-role-key


## key packages:
# Frontend:
react | 
react-router-dom |
@supabase/supabase-js |
tailwindcss |
react-icons


# Backend:
express |
@supabase/supabase-js |
dotenv |
cors |
typescript |
ts-node-dev

### Run the app using:
# client 
 - npm run dev
# server
- node dist/index.js

## 🌟 Enjoy!!!
