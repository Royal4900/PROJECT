# Smart Resume Builder with AI Suggestions

An intelligent resume builder that uses AI to suggest improvements and generate professional resumes with PDF export functionality.

## Features

- 📝 **Interactive Resume Builder**: Easy-to-use forms for all resume sections
- 🤖 **AI-Powered Suggestions**: Get smart recommendations using OpenAI GPT-3.5
- 📄 **PDF Export**: Download your resume as a professional PDF
- 👀 **Preview Mode**: Real-time preview with print-optimized styling
- 💾 **Save & Load**: Store multiple resume versions in MongoDB
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS
- 🔒 **User Authentication**: Secure user accounts and data storage

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **AI**: OpenAI API (GPT-3.5)
- **PDF Generation**: PDFKit
- **Authentication**: JWT

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-resume-builder
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   - Add your OpenAI API key
   - Configure MongoDB connection string
   - Set JWT secret

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend client (port 3000).

## Usage

1. **Create Account**: Sign up for a new account
2. **Build Resume**: Fill in your information using the intuitive forms
3. **Get AI Suggestions**: Click the AI suggestion button for improvements
4. **Preview**: See how your resume looks in real-time
5. **Export**: Download as PDF or print directly

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/ai/suggestions` - Get AI suggestions
- `GET /api/resumes/:id/pdf` - Download resume as PDF

## Project Structure

```
smart-resume-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Utility functions
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── utils/            # Backend utilities
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository.
