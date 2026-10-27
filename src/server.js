const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Secret key used to sign JWTs (In production, use process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_12345';
const SALT_ROUNDS = 10;

// In-Memory Database for demonstration
const usersDB = [];

// =========================================================================
// 1. USER REGISTRATION FLOW
// Flow: Validate -> Check Existing -> Hash Password -> Save -> Return Token
// =========================================================================
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Input Validation
        if (!email || !password || password.length < 6) {
            return res.status(400).json({ 
                error: 'Please provide a valid email and password (min 6 characters).' 
            });
        }

        // Step 2: Check if User Already Exists
        const existingUser = usersDB.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // Step 3: Hash Password with bcrypt (Salt + Hash)
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Step 4: Save User to Database
        const newUser = {
            id: Date.now().toString(),
            email,
            password: hashedPassword // Save ONLY the hash, NEVER plain text
        };
        usersDB.push(newUser);

        // Step 5: Generate & Return Token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: { id: newUser.id, email: newUser.email }
        });

    } catch (error) {
        return res.status(500).json({ error: 'Server error during registration.' });
    }
});

// =========================================================================
// 2. USER LOGIN FLOW
// Flow: Find User -> Compare Password -> Generate Token
// =========================================================================
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Validate Input Presence
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Step 2: Find User in Database
        const user = usersDB.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Step 3: Compare Input Password with Stored Hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Step 4: Generate & Return Token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful!',
            token,
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        return res.status(500).json({ error: 'Server error during login.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Authentication server running on http://localhost:${PORT}`);
});
