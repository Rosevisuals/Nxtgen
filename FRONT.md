# Connecting Your React Frontend to the Hospital ERP Backend

This guide explains how to connect your React.js frontend to the backend API, including authentication, making API requests, and best practices.

---

## 1. Set Up Your Backend
- Ensure the backend server is running and accessible (e.g., `http://localhost:5000`).
- Confirm your `.env` is configured and the database is connected.

## 2. Configure the API Base URL in React
- In your React project, create a `.env` file:
  ```env
  REACT_APP_API_URL=http://localhost:5000/api
  ```
- Use `process.env.REACT_APP_API_URL` in your frontend code for all API requests.

## 3. User Authentication (Login/Register)
- Use the `/api/auth/register` endpoint to register new users.
- Use the `/api/auth/login` endpoint to log in. On success, you'll receive a JWT token.
- **Store the JWT token** in `localStorage` or `sessionStorage` (never in plain cookies).

**Example (login):**
```js
fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
  .then(res => res.json())
  .then(data => {
    localStorage.setItem('token', data.token);
    // Save user info if needed
  });
```

## 4. Making Authenticated API Requests
- For all protected endpoints, include the JWT token in the `Authorization` header:
  ```js
  fetch(`${process.env.REACT_APP_API_URL}/patients`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  ```
- Handle 401/403 errors by redirecting to login or showing an error message.

## 5. Example: Fetching Patients
```js
useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/patients`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(res => res.json())
    .then(data => setPatients(data));
}, []);
```

## 6. Example: Creating a Patient
```js
fetch(`${process.env.REACT_APP_API_URL}/patients`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(newPatient)
})
```

## 7. Handling Roles and Permissions
- The backend encodes the user's role in the JWT token.
- After login, decode the token (using [jwt-decode](https://www.npmjs.com/package/jwt-decode)) to get the user's role and show/hide frontend features accordingly.

## 8. Error Handling
- Always check for HTTP errors (401, 403, 404, 500) and display user-friendly messages.
- Handle token expiration by redirecting to login.

## 9. CORS
- The backend enables CORS by default. If you deploy to production, update the CORS settings in `server.js` as needed.

## 10. Best Practices
- Never commit your `.env` files with secrets or tokens to version control.
- Use HTTPS in production.
- Validate all user input on the frontend before sending to the backend.
- Use React context or a state management library (like Redux) to manage authentication state.

---

**You are now ready to connect your React frontend to the Hospital ERP backend!**

If you need more specific examples (e.g., for appointments, pharmacy, etc.), just ask! 