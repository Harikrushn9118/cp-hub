const express = require('express');
const router = express.Router();
const axios = require('axios');

const CF_API_URL = 'https://codeforces.com/api';

router.get('/user/:handle', async (req, res) => {
    try {
        const { handle } = req.params;
        const response = await axios.get(`${CF_API_URL}/user.info?handles=${handle}`);

        if (response.data.status === 'OK') {
            res.json(response.data.result[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user info' });
    }
});


router.get('/user/:handle/rating', async (req, res) => {
    try {
        const { handle } = req.params;
        const response = await axios.get(`${CF_API_URL}/user.rating?handle=${handle}`);

        if (response.data.status === 'OK') {
            res.json(response.data.result);
        } else {
            res.status(404).json({ error: 'Rating history not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching rating history' });
    }
});


router.get('/user/:handle/status', async (req, res) => {
    try {
        const { handle } = req.params;
        const response = await axios.get(`${CF_API_URL}/user.status?handle=${handle}&from=1`);

        if (response.data.status === 'OK') {
            res.json(response.data.result);
        } else {
            res.status(404).json({ error: 'Submissions not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching submissions' });
    }
});


router.get('/problems', async (req, res) => {
    try {
        const { tags } = req.query;
        let url = `${CF_API_URL}/problemset.problems`;
        if (tags) {
            url += `?tags=${tags}`;
        }

        const response = await axios.get(url);

        if (response.data.status === 'OK') {
            res.json(response.data.result);
        } else {
            res.status(404).json({ error: 'Problems not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching problems' });
    }
});


router.get('/contests', async (req, res) => {
    try {
        const response = await axios.get(`${CF_API_URL}/contest.list?gym=false`);

        if (response.data.status === 'OK') {
            const upcoming = response.data.result
                .filter(c => c.phase === 'BEFORE' || c.phase === 'CODING')
                .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
            res.json(upcoming);
        } else {
            res.status(404).json({ error: 'Contests not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching contests' });
    }
});

module.exports = router;
