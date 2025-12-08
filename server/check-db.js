const prisma = require('./config/db');

async function check() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Try to query users count
    const count = await prisma.user.count();
    console.log(`✅ Users table accessible (Count: ${count})`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database check failed:', error);
    process.exit(1);
  }
}

check();
