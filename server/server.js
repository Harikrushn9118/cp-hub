const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const cfRoutes = require('./routes/cfRoutes');
const userRoutes = require('./routes/userRoutes');

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

app.use('/api/auth', authRoutes);
app.use('/api/cf', cfRoutes);
app.use('/api/users', userRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
