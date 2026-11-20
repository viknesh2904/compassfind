const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const Item = require('./models/itemModel');

const seedUsers = [
  { rollNumber: 'student001', rawPassword: 'STUDENT001' },
  { rollNumber: 'student002', rawPassword: 'STUDENT002' },
  { rollNumber: 'student003', rawPassword: 'STUDENT003' },
  { rollNumber: 'student004', rawPassword: 'STUDENT004' },
  { rollNumber: 'student005', rawPassword: 'STUDENT005' },
  { rollNumber: 'student006', rawPassword: 'STUDENT006' },
  { rollNumber: 'student007', rawPassword: 'STUDENT007' },
  { rollNumber: 'student008', rawPassword: 'STUDENT008' },
  { rollNumber: 'faculty001', rawPassword: 'FACULTY001' },
  { rollNumber: 'admin001',   rawPassword: 'ADMIN001' }
];

const now = Date.now();
const oneHour = 3600 * 1000;
const oneDay = 24 * oneHour;

const seedItems = [
  {
    itemName: 'Apple AirPods Pro (2nd Gen)',
    description: 'White AirPods Pro inside a matte black silicone case with a small carabiner attached. Lost during the afternoon study session.',
    location: 'Central Library - 2nd Floor Silent Reading Room',
    photo: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student001@campus.edu', phone: '+91 98765 01001' },
    reportedBy: 'student001',
    category: 'lost',
    status: 'open',
    contactPreference: false,
    createdAt: new Date(now - 2 * oneHour),
    updatedAt: new Date(now - 2 * oneHour)
  },
  {
    itemName: 'Casio fx-991EX Scientific Calculator',
    description: 'Black and white Casio ClassWiz scientific calculator with the name tag "Viknesh - Mech" on the back cover.',
    location: 'Mechanical Workshop - Drafting Table 4',
    photo: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student002@campus.edu', phone: '+91 98765 01002' },
    reportedBy: 'student002',
    category: 'found',
    status: 'open',
    contactPreference: true,
    createdAt: new Date(now - 5 * oneHour),
    updatedAt: new Date(now - 5 * oneHour)
  },
  {
    itemName: 'Dell 65W USB-C Laptop Charger',
    description: 'Original Dell Type-C power adapter with long cord. Left plugged into the wall outlet near the charging station.',
    location: 'Campus Cafeteria - Booth near Coffee Corner',
    photo: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student003@campus.edu', phone: '+91 98765 01003' },
    reportedBy: 'student003',
    category: 'found',
    status: 'open',
    contactPreference: true,
    createdAt: new Date(now - 12 * oneHour),
    updatedAt: new Date(now - 12 * oneHour)
  },
  {
    itemName: 'College Student ID Card - CS Department',
    description: 'Student ID card belonging to Roll No: 2023CS104. Found on the pathway leading to the main auditorium.',
    location: 'Pathway near Main Auditorium',
    photo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student004@campus.edu', phone: '+91 98765 01004' },
    reportedBy: 'student004',
    category: 'found',
    status: 'open',
    contactPreference: true,
    createdAt: new Date(now - 1 * oneDay),
    updatedAt: new Date(now - 1 * oneDay)
  },
  {
    itemName: 'Hydro Flask 32oz Water Bottle (Midnight Black)',
    description: 'Matte black Hydro Flask vacuum insulated bottle with minor scratches on the base and a NASA sticker on the side.',
    location: 'Sports Complex - Basketball Court Bleachers',
    photo: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student005@campus.edu', phone: '+91 98765 01005' },
    reportedBy: 'student005',
    category: 'lost',
    status: 'open',
    contactPreference: false,
    createdAt: new Date(now - 2 * oneDay),
    updatedAt: new Date(now - 2 * oneDay)
  },
  {
    itemName: 'Brown Leather Bifold Wallet',
    description: 'Woodland brown leather wallet containing driving license, student metro card, and some cash. Contact immediately if found!',
    location: 'Lecture Hall Complex - Room 302',
    photo: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student006@campus.edu', phone: '+91 98765 01006' },
    reportedBy: 'student006',
    category: 'lost',
    status: 'open',
    contactPreference: false,
    createdAt: new Date(now - 3 * oneDay),
    updatedAt: new Date(now - 3 * oneDay)
  },
  {
    itemName: 'Titan Neo Analog Men Watch',
    description: 'Silver stainless steel mesh strap with dark blue dial. Has a slight scratch on the crystal bezel.',
    location: 'Computer Science Lab 3 - Workstation 24',
    photo: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student007@campus.edu', phone: '+91 98765 01007' },
    reportedBy: 'student007',
    category: 'found',
    status: 'open',
    contactPreference: true,
    createdAt: new Date(now - 4 * oneDay),
    updatedAt: new Date(now - 4 * oneDay)
  },
  {
    itemName: 'Bike & Hostel Keys on Spiderman Lanyard',
    description: 'Set of 3 keys (Hero Splendor key, godrej padlock key, and room key) attached to a red Marvel Spiderman neck lanyard.',
    location: 'Main Parking Lot - Gate 2 Area',
    photo: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student001@campus.edu', phone: '+91 98765 01001' },
    reportedBy: 'student001',
    category: 'found',
    status: 'open',
    contactPreference: true,
    createdAt: new Date(now - 5 * oneDay),
    updatedAt: new Date(now - 5 * oneDay)
  },
  {
    itemName: 'Sony WH-1000XM4 Wireless Headphones',
    description: 'Black Sony over-ear noise cancelling headphones inside grey zip travel case. Forgotten on the sofa in the student lounge.',
    location: 'Student Activity Center - 1st Floor Lounge',
    photo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student002@campus.edu', phone: '+91 98765 01002' },
    reportedBy: 'student002',
    category: 'found',
    status: 'returned',
    contactPreference: true,
    createdAt: new Date(now - 7 * oneDay),
    updatedAt: new Date(now - 6 * oneDay)
  },
  {
    itemName: 'Ray-Ban Wayfarer Eyeglasses',
    description: 'Black framed prescription glasses inside a dark brown textured leather case. Left on the instructor podium.',
    location: 'Seminar Hall B - Ground Floor',
    photo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'faculty001@campus.edu', phone: '+91 98765 01009' },
    reportedBy: 'faculty001',
    category: 'found',
    status: 'returned',
    contactPreference: true,
    createdAt: new Date(now - 9 * oneDay),
    updatedAt: new Date(now - 8 * oneDay)
  },
  {
    itemName: 'Spiral Bound Data Structures Lecture Notes',
    description: 'Classmate 300-page notebook with handwritten notes on Trees, Graphs, and Dynamic Programming. Crucial for semester exams!',
    location: 'Block A - Room 108',
    photo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student008@campus.edu', phone: '+91 98765 01008' },
    reportedBy: 'student008',
    category: 'lost',
    status: 'returned',
    contactPreference: false,
    createdAt: new Date(now - 10 * oneDay),
    updatedAt: new Date(now - 9 * oneDay)
  },
  {
    itemName: 'Decathlon Windproof Umbrella (Navy Blue)',
    description: 'Large navy blue automatic folding umbrella with a curved wooden handle. Left behind during yesterday evening heavy rain.',
    location: 'Campus Bus Shelter - Main Gate',
    photo: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student003@campus.edu', phone: '+91 98765 01003' },
    reportedBy: 'student003',
    category: 'found',
    status: 'open',
    contactPreference: true,
    createdAt: new Date(now - 11 * oneDay),
    updatedAt: new Date(now - 11 * oneDay)
  }
];

const seedData = async () => {
  try {
    console.log(`Connecting to MongoDB URI: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clg'}...`);
    await connectDB();

    // Clear existing data
    console.log('Clearing existing users and items in clg database...');
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('Collections cleared.');

    // Prepare users with hashed passwords
    console.log('Hashing passwords and seeding users...');
    const hashedUsers = [];
    for (const u of seedUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.rawPassword, salt);
      hashedUsers.push({
        rollNumber: u.rollNumber,
        password: hashedPassword
      });
    }
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Successfully seeded ${createdUsers.length} users!`);

    // Seed items
    console.log('Seeding campus lost & found items...');
    const createdItems = await Item.insertMany(seedItems);
    console.log(`Successfully seeded ${createdItems.length} items!`);

    console.log('\n--- Seeding Summary ---');
    console.log(`Users count: ${createdUsers.length}`);
    console.log(`Items count: ${createdItems.length} (${createdItems.filter(i => i.status === 'open').length} Open, ${createdItems.filter(i => i.status === 'returned').length} Returned)`);
    console.log('\nSample Login Credentials:');
    seedUsers.slice(0, 5).forEach(u => {
      console.log(`  Roll Number: ${u.rollNumber} | Password: ${u.rawPassword}`);
    });
    console.log('\nDatabase seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
