const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key-change-in-production', {
        expiresIn: '6h',
    });
};

const verifyGoogleToken = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (error) {
        throw new Error('Invalid Google token');
    }
};


router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, codeforces_handle } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            // If user exists with Google OAuth, suggest they use Google login
            if (existingUser.googleId) {
                return res.status(400).json({
                    error: 'An account with this email already exists. Please use Google login.'
                });
            }
            return res.status(400).json({ error: 'An account with this email already exists' });
        }

        const usernameExists = await prisma.user.findFirst({ where: { username } });
        if (usernameExists) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                codeforces_handle: codeforces_handle || null,
            }
        });

        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            codeforces_handle: user.codeforces_handle,
            token: generateToken(user.id),
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            error: error.message || 'Error creating user account'
        });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const identifier = email || username;

        if (!identifier || !password) {
            return res.status(400).json({ error: 'Email/Username and password are required' });
        }

        // Find user by email or username
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user has a password (not Google OAuth only)
        if (!user.password) {
            return res.status(401).json({
                error: 'This account uses Google login. Please sign in with Google.'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            codeforces_handle: user.codeforces_handle,
            token: generateToken(user.id),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error authenticating user' });
    }
});


router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Google token is required' });
        }

        // Verify Google token
        const googleUser = await verifyGoogleToken(token);

        if (!googleUser.email || !googleUser.sub) {
            return res.status(400).json({ error: 'Invalid Google account information' });
        }

        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: googleUser.email },
                    { googleId: googleUser.sub }
                ]
            }
        });

        if (user) {
            // Update Google ID if not set
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        googleId: googleUser.sub,
                        profilePicture: googleUser.picture || user.profilePicture
                    }
                });
            }
        } else {
            // Create new user
            const username = googleUser.name?.replace(/\s+/g, '').toLowerCase() ||
                googleUser.email.split('@')[0];

            // Ensure username is unique
            let uniqueUsername = username;
            let counter = 1;
            while (await prisma.user.findFirst({ where: { username: uniqueUsername } })) {
                uniqueUsername = `${username}${counter}`;
                counter++;
            }

            user = await prisma.user.create({
                data: {
                    username: uniqueUsername,
                    email: googleUser.email,
                    googleId: googleUser.sub,
                    profilePicture: googleUser.picture || null,
                    password: null,
                }
            });
        }

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            codeforces_handle: user.codeforces_handle,
            profilePicture: user.profilePicture,
            token: generateToken(user.id),
        });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({ error: error.message || 'Error with Google authentication' });
    }
});

module.exports = router;
