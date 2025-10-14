#!/usr/bin/env node

import { DatabaseSeeder } from './src/utils/seeder.js';
import { AppDataSource } from './src/config/database.js';

async function setup() {
  try {
    console.log('🚀 Setting up IremeCorner Backend...');
    
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');
    
    // Seed initial data
    await DatabaseSeeder.seed();
    
    console.log('🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy env.example to .env and configure your settings');
    console.log('2. Run: npm run dev');
    console.log('3. Visit: http://localhost:5000/health');
    console.log('\n🔑 Default admin credentials:');
    console.log('Email: admin@iremecorner.com');
    console.log('Password: admin123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setup();
