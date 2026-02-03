import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    // Remove deprecated options - just pass the URI
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://dinusha200026_db_user:zockKPrO5NkmuYXG@primeauto.fs237ab.mongodb.net/?appName=primeauto');

    console.log('✅ Connected to MongoDB successfully!\n');

    // Check if Super Admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'SUPER_ADMIN' });

    if (existingSuperAdmin) {
      console.log('⚠️  Super Admin already exists! Updating password and ensuring account is active...');

      // Ensure the Super Admin has the known seeded password and is active.
      // Assigning password and calling save() will trigger the pre-save hook to hash it.
      existingSuperAdmin.password = 'SuperAdmin@123';
      existingSuperAdmin.isActive = true;
      await existingSuperAdmin.save();

      console.log('✅ Super Admin updated with seeded credentials.');
      console.log('📧 Email:', existingSuperAdmin.email);
      console.log('👤 Name:', existingSuperAdmin.name);
      console.log('\nLogin Credentials:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:    admin@primeauto.com');
      console.log('🔑 Password: SuperAdmin@123');
      console.log('👤 Role:     SUPER_ADMIN');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      await mongoose.connection.close();
      process.exit(0);
    }

    console.log('Creating Super Admin...\n');

    // Create Super Admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@primeauto.com',
      password: 'SuperAdmin@123', // Will be hashed by pre-save hook
      role: 'SUPER_ADMIN',
      isActive: true
    });

    console.log('✅ Super Admin created successfully!\n');
    console.log('Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@primeauto.com');
    console.log('🔑 Password: SuperAdmin@123');
    console.log('👤 Role:     SUPER_ADMIN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Change this password after first login!\n');

    await mongoose.connection.close();
    console.log('Disconnected from MongoDB.');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error seeding Super Admin:');
    console.error(error.message);
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    process.exit(1);
  }
};

seedSuperAdmin();