const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Check
async function checkConnection() {
  try {
    await prisma.$connect();
    console.log('Prisma Database Connected');
  } catch (error) {
    console.error('Database Connection Error:', error);
    process.exit(1);
  }
}

checkConnection();

// Routes
app.get('/', (req, res) => {
    res.send('CP Analyzer API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
