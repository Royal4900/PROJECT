@echo off
echo ========================================
echo Smart Resume Builder - Installation
echo ========================================
echo.

echo Installing backend dependencies...
npm install

echo.
echo Installing frontend dependencies...
cd client
npm install
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy env.example to .env and configure your settings
echo 2. Make sure MongoDB is running
echo 3. Add your OpenAI API key to .env
echo 4. Run 'npm run dev' to start the application
echo.
echo The app will be available at:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:5000
echo.
pause
