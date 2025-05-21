@echo off
echo Testing the Cricket Glow Express API endpoints

set API_URL=http://localhost:5000/api

echo Testing health endpoint...
curl -s "http://localhost:5000/health"
echo.

echo Testing categories endpoints...
curl -s "%API_URL%/categories"
echo.

echo Testing products endpoints...
curl -s "%API_URL%/products"
echo.
curl -s "%API_URL%/products/featured"
echo.

echo API tests completed!
pause
