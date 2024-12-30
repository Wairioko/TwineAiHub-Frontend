# TwineAIHub Frontend

TwineAIHub is a dynamic SaaS platform allowing users to combine different AI models (such as ChatGPT, Claude, Gemini, and others) to perform various tasks in a flexible, user-friendly interface. This repository contains the code for the frontend application, built using React.

---

## Features

- **AI Model Selection**: Easily interchange and assign tasks to various AI models.  
- **Dynamic Workflow Management**: Flexible interface for combining models and task sequencing.  
- **User Profiles**: Manage preferences and view task history.  

---

## Tech Stack

- **React**  
- **React Router** for navigation  
- **Axios** for API calls  
- **Styled-Components** for styling  
- **Redux** (or Context API) for state management  

---

## Getting Started

### Prerequisites

- Node.js (v16.x or later)
- npm or yarn package manager

### Installation

 Clone the repository:

   ```bash
   git clone https://github.com/username/twineaihub-frontend.git
   cd twineaihub-frontend

### Install dependencies:

    npm install


### Start the development server:


### npm start
Open the app in your browser at http://localhost:3000.

Environment Variables
Create a .env file in the root directory and add the following environment variables:
    REACT_APP_PADDLE_VENDOR_ID=
    REACT_APP_BASIC_WEEKLY_ID=
    REACT_APP_STANDARD_MONTHLY_ID=
    REACT_APP_PREMIUM_MONTHLY_ID=
    REACT_APP_AWS_URL=
    REACT_APP_WS_URL= 
    REACT_APP_GOOGLE_CLIENT_ID=


REACT_APP_API_BASE_URL=http://your-backend-url.com/api
### Deployment
The frontend can be deployed on platforms like Netlify, Vercel, or AWS Amplify. Follow their documentation for deployment.