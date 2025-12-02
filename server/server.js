const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('CP Analyzer API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
