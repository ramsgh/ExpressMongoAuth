# Express.js Authentication Example (bcrypt + JWT)

This project provides a clean reference implementation of user authentication using Node.js, Express,  for password hashing, and  for token-based authorization.

## Core Concepts Covered
1. **Password Hashing with bcrypt:**
   - **Salt Rounds:** Adds random salt and computational cost (work factor = 10) to prevent rainbow table attacks.
   - **One-way hashing:** Passwords are never stored in plain text.
   - **Constant-time comparison ():** Verifies passwords securely against stored hashes.
2. **Registration Flow:** Input Validation -> Existing Check -> Password Hashing -> Save User -> Issue JWT.
3. **Login Flow:** User Lookup -> Password Hash Verification -> Issue JWT.

## How to Run

1. **Install Dependencies:**
   

2. **Start the Server:**
   

3. **Test Endpoints:**

   - **Register a User:**
     

   - **Login:**
     
