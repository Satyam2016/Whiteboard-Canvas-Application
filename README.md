
# Whiteboard-Canvas-Application

Designed and built a real-time AI-powered collaborative whiteboard using React, Firebase, Rough.js, and WebRTC for a seamless multi-user experience. The whiteboard features:

#
## Key Features

- Real-time Drawing & Collaboration – Multiple users can draw and edit in sync using Firebase Firestore’s real-time updates.

-  Advanced Drawing Tools – Supports freehand, shapes (rectangles, circles, lines), stroke styles, and colors powered by Rough.js.

- Authentication & Session Management – Secure login via Google OAuth (Firebase Auth) and private/shared sessions.

- Undo/Redo & Version Control – Implemented action history tracking for improved usability.

- AI-Powered Features (Upcoming) – Leveraging AI for handwriting recognition and shape auto-correction.

- Multi-Device Compatibility – Optimized for desktop & tablet use with touch and stylus support.

- Upcoming AI Features – Handwriting recognition & shape auto-correction using AI models.

## Tech Stack

- **Frontend:** React (Vite)

- **Backend:** Node.js (Express.js)

- **WebSockets:** Socket.io

- **Database:** Firebase Firestore

- **Authentication:** Firebase Authentication


# Installation

### Backend Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Run the backend:

```bash
node server.js
```

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Run the backend:

```bash
npm run dev
```


    
## Usage

- Open the application in the browser.

- Login or create an account.

- Start drawing on the canvas.

- Invite others for real-time collaboration.
