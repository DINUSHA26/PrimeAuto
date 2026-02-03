import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service.js';
import SparePart from '../models/SparePart.js';

dotenv.config();

// Sample Services Data
const services = [
  {
    name: 'Body Wash',
    description: 'Exterior vehicle cleaning and washing',
    duration: 30,
    price: 15.00,
    isActive: true
  },
  {
    name: 'Full Service',
    description: 'Complete vehicle servicing including oil change, filter replacement, and inspection',
    duration: 180,
    price: 120.00,
    isActive: true
  },
  {
    name: 'Oil Change',
    description: 'Engine oil and oil filter replacement',
    duration: 45,
    price: 35.00,
    isActive: true
  },
  {
    name: 'Brake Service',
    description: 'Brake pad replacement and brake system inspection',
    duration: 90,
    price: 80.00,
    isActive: true
  },
  {
    name: 'Tire Rotation',
    description: 'Rotate all four tires and check tire pressure',
    duration: 30,
    price: 25.00,
    isActive: true
  },
  {
    name: 'Interior Detailing',
    description: 'Deep cleaning of vehicle interior including vacuuming and upholstery cleaning',
    duration: 120,
    price: 90.00,
    isActive: true
  },
  {
    name: 'Battery Check & Replacement',
    description: 'Battery testing and replacement if needed',
    duration: 45,
    price: 100.00,
    isActive: true
  },
  {
    name: 'AC Service',
    description: 'Air conditioning system check and gas refill',
    duration: 60,
    price: 65.00,
    isActive: true
  }
];

// Sample Spare Parts Data
const spareParts = [
  {
    partNumber: 'ENG-OIL-001',
    name: 'Synthetic Engine Oil 5W-30',
    description: 'Premium synthetic engine oil for better performance',
    category: 'fluids',
    brand: 'Mobil 1',
    price: 45.00,
    costPrice: 30.00,
    quantity: 50,
    minStockLevel: 10,
    location: { shelf: 'A1', bin: '01' },
    supplier: {
      name: 'Auto Parts Distributor',
      contact: '+1234567890',
      email: 'sales@autoparts.com'
    },
    isActive: true
  },
  {
    partNumber: 'BRK-PAD-002',
    name: 'Ceramic Brake Pads (Front)',
    description: 'High-performance ceramic brake pads',
    category: 'brakes',
    brand: 'Brembo',
    price: 85.00,
    costPrice: 55.00,
    quantity: 25,
    minStockLevel: 8,
    location: { shelf: 'B2', bin: '15' },
    supplier: {
      name: 'Brake Solutions Inc',
      contact: '+1234567891',
      email: 'orders@brakesolutions.com'
    },
    isActive: true
  },
  {
    partNumber: 'FIL-AIR-003',
    name: 'Engine Air Filter',
    description: 'High-efficiency air filter for optimal engine performance',
    category: 'filters',
    brand: 'K&N',
    price: 35.00,
    costPrice: 20.00,
    quantity: 40,
    minStockLevel: 15,
    location: { shelf: 'C1', bin: '08' },
    isActive: true
  },
  {
    partNumber: 'BAT-STD-004',
    name: 'Car Battery 12V 60Ah',
    description: 'Maintenance-free car battery',
    category: 'electrical',
    brand: 'Exide',
    price: 120.00,
    costPrice: 80.00,
    quantity: 15,
    minStockLevel: 5,
    location: { shelf: 'D3', bin: '22' },
    supplier: {
      name: 'Battery World',
      contact: '+1234567892',
      email: 'info@batteryworld.com'
    },
    isActive: true
  },
  {
    partNumber: 'TIRE-ALL-005',
    name: 'All-Season Tire 205/55R16',
    description: 'Durable all-season tire for various conditions',
    category: 'other',
    brand: 'Michelin',
    price: 150.00,
    costPrice: 100.00,
    quantity: 8,
    minStockLevel: 12,
    location: { shelf: 'E1', bin: '30' },
    isActive: true
  },
  {
    partNumber: 'FIL-OIL-006',
    name: 'Oil Filter Standard',
    description: 'Standard oil filter for most vehicles',
    category: 'filters',
    brand: 'Fram',
    price: 12.00,
    costPrice: 7.00,
    quantity: 60,
    minStockLevel: 20,
    location: { shelf: 'C1', bin: '09' },
    isActive: true
  },
  {
    partNumber: 'SUS-SHK-007',
    name: 'Front Shock Absorber',
    description: 'Heavy-duty shock absorber for smooth ride',
    category: 'suspension',
    brand: 'Monroe',
    price: 95.00,
    costPrice: 65.00,
    quantity: 12,
    minStockLevel: 6,
    location: { shelf: 'F2', bin: '18' },
    isActive: true
  },
  {
    partNumber: 'ELC-SPK-008',
    name: 'Spark Plug Set (4pcs)',
    description: 'Iridium spark plugs for better ignition',
    category: 'electrical',
    brand: 'NGK',
    price: 40.00,
    costPrice: 25.00,
    quantity: 30,
    minStockLevel: 10,
    location: { shelf: 'D1', bin: '12' },
    isActive: true
  },
  {
    partNumber: 'FLU-CLT-009',
    name: 'Coolant/Antifreeze 1L',
    description: 'Engine coolant for optimal temperature regulation',
    category: 'fluids',
    brand: 'Prestone',
    price: 18.00,
    costPrice: 11.00,
    quantity: 45,
    minStockLevel: 15,
    location: { shelf: 'A2', bin: '05' },
    isActive: true
  },
  {
    partNumber: 'BRK-DSC-010',
    name: 'Brake Disc (Front)',
    description: 'Ventilated brake disc for improved cooling',
    category: 'brakes',
    brand: 'ATE',
    price: 110.00,
    costPrice: 75.00,
    quantity: 10,
    minStockLevel: 4,
    location: { shelf: 'B2', bin: '16' },
    isActive: true
  }
];

// Connect to MongoDB and seed data
const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vehicle-service');
    console.log('✅ MongoDB connected');

    // Clear existing data
    await Service.deleteMany();
    await SparePart.deleteMany();
    console.log('🗑️  Existing data cleared');

    // Insert services
    const createdServices = await Service.insertMany(services);
    console.log(`✅ ${createdServices.length} services added`);

    // Insert spare parts
    const createdParts = await SparePart.insertMany(spareParts);
    console.log(`✅ ${createdParts.length} spare parts added`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Services: ${createdServices.length}`);
    console.log(`   - Spare Parts: ${createdParts.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Delete all data
const deleteData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vehicle-service');
    console.log('✅ MongoDB connected');

    await Service.deleteMany();
    await SparePart.deleteMany();
    console.log('🗑️  All data deleted successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting data:', error.message);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-d') {
  deleteData();
} else {
  seedData();
}