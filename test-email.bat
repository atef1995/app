@echo off
echo Testing Promotional Email API
echo ================================

REM Test 1: Get email stats
echo.
echo Test 1: GET /api/email/promotional
curl -X GET "http://localhost:3000/api/email/promotional" -H "Content-Type: application/json"

echo.
echo.

REM Test 2: Send promotional email
echo Test 2: POST /api/email/promotional
curl -X POST "http://localhost:3000/api/email/promotional" ^
  -H "Content-Type: application/json" ^
  -d "{\"promotion\":{\"title\":\"Test Promo\",\"description\":\"Test description\",\"ctaText\":\"Click Here\",\"ctaUrl\":\"https://example.com\"}}"

echo.
echo.

REM Test 3: Test email template
echo Test 3: POST /api/email/test
curl -X POST "http://localhost:3000/api/email/test" ^
  -H "Content-Type: application/json" ^
  -d "{\"type\":\"promotional\"}"

echo.
echo Done!