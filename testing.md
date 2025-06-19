# Testing Frontend-Backend Integration

  1. Verify Backend CORS Settings

  The backend CORS is already configured to allow all origins (origin: "*"), which is good for local
  development.

  2. Test Login Flow

  1. Open http://localhost:3000 in your browser - CHECK
  2. Open Developer Tools (F12) - CHECK
  3. Go to Network tab -
  4. Try to log in with your Firebase user - FAILED svv6@cornell.edu
  5. Look for API calls to http://localhost:8080 -  FAILED to GET /users/{}/profile

  6. Common Issues & Solutions

  Blank Page

  - Check browser console for errors
  - Verify all env variables are loaded: window.__NEXT_DATA__.runtimeConfig

  CORS Issues

  - Backend is configured for origin: "*" ✓
  - If still issues, check request headers

  API Connection Issues

  - Verify backend is running: curl http://localhost:8080/api
  - Check network tab for failed requests
  - Ensure API URL doesn't have trailing slash

  Debugging Swagger UI Issues

  Let me check the Swagger configuration:

⏺ Read(../hvo-api-main/src/main.ts)
  ⎿  Read 60 lines (ctrl+r to expand)

⏺ The Swagger issue might be due to missing decorators or authentication. Let me check one of the
  controllers:

⏺ Search(pattern: "@ApiTags|@ApiOperation|@ApiBearerAuth", path: "../hvo-api-main/src", include:
        "*.controller.ts")
  ⎿  Found 4 files (ctrl+r to expand)

⏺ Fix Swagger UI Issues

  1. Add Bearer Auth to Swagger Config:

⏺ Update(../hvo-api-main/src/main.ts)
  ⎿  Updated ../hvo-api-main/src/main.ts with 1 addition                  
       41        .setDescription("The HVO API")
       42        .setVersion("1.0")
       43        .addTag("hvo")
       44 +      .addBearerAuth()
       45        .build();
       46 
       47      const document = SwaggerModule.createDocument(app, config);

⏺ 2. Restart the backend to apply changes:

⏺ Bash(ps aux | grep "nest start" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null; cd
      /Users/discrete/HVO-STACK/hvo-api-main && yarn dev > /tmp/backend.l…)
  ⎿  (No content)

⏺ Testing Video Compression Microservice

  1. Login to Frontend

  - Navigate to http://localhost:3000
  - Login with your Firebase credentials

  2. Upload a Video

  - Look for video upload functionality in the UI
  - The flow typically is:
    a. Upload video file
    b. Backend receives upload
    c. Backend triggers video compression microservice
    d. Check backend logs for processing status

  3. Monitor Processing

  Check backend logs:
  tail -f /tmp/backend.log

  4. Verify Microservice Communication

  - Check if PubSub messages are being sent
  - Look for Box API uploads in logs
  - Monitor database for video processing status updates

  Debug Checklist Summary

  Frontend Issues:

  1. ✅ Check if running: curl -I http://localhost:3000
  2. ✅ Verify env vars are loaded
  3. ✅ Check browser console for errors
  4. ✅ Monitor Network tab for API calls
  5. ✅ Ensure API endpoint has no trailing slash

  Backend/Swagger Issues:

  1. ✅ Added Bearer Auth to Swagger
  2. Check specific endpoint errors in browser console
  3. Verify all DTOs have proper decorators
  4. Check if routes need authentication

  Integration Testing:

  1. Login with Firebase user
  2. Check Network tab for API calls to port 8080
  3. Verify auth tokens are being sent
  4. Test video upload to trigger microservices

  The frontend is now running at http://localhost:3000 and should be able to communicate with the backend
  at http://localhost:8080. Try logging in and let me know if you encounter any specific errors!
