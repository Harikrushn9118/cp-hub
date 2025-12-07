const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const prisma = require('../config/db');


router.get('/profile', protect, async (req, res) => {
    res.json(req.user);
});


router.put('/profile', protect, async (req, res) => {
    try {
        const { email, codeforces_handle } = req.body;
        
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                email: email || undefined,
                codeforces_handle: codeforces_handle !== undefined ? codeforces_handle : undefined
            },
            select: {
                id: true,
                username: true,
                email: true,
                codeforces_handle: true,
                profilePicture: true,
                googleId: true,
                createdAt: true,
                updatedAt: true
            }
        });
        
        res.json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});


router.get('/bookmarks', protect, async (req, res) => {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: req.user.id }
        });
        res.json(bookmarks);
    } catch (error) {
        console.error('Fetch bookmarks error:', error);
        res.status(500).json({ error: 'Error fetching bookmarks' });
    }
});


router.post('/bookmarks', protect, async (req, res) => {
    const { problem_id, problem_name, rating, tags } = req.body;

    try {
        const bookmark = await prisma.bookmark.create({
            data: {
                userId: req.user.id,
                problem_id,
                problem_name,
                rating,
                tags
            }
        });
        res.status(201).json(bookmark);
    } catch (error) {
        console.error('Add bookmark error:', error);
        res.status(500).json({ error: 'Error adding bookmark' });
    }
});


router.delete('/bookmarks/:id', protect, async (req, res) => {
    try {
        const bookmark = await prisma.bookmark.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.user.id
            }
        });

        if (bookmark) {
            await prisma.bookmark.delete({
                where: { id: bookmark.id }
            });
            res.json({ message: 'Bookmark removed' });
        } else {
            res.status(404).json({ error: 'Bookmark not found' });
        }
    } catch (error) {
        console.error('Remove bookmark error:', error);
        res.status(500).json({ error: 'Error removing bookmark' });
    }
});

module.exports = router;
