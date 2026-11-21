const bcrypt = require('bcryptjs');
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
    contactPreference: false,
    createdAt: new Date(now - 8 * oneHour),
    updatedAt: new Date(now - 8 * oneHour)
  },
  {
    itemName: 'Student ID Card - CSE Dept',
    description: 'Official College ID card belonging to Viknesh P (Roll No: 21CS101), Computer Science & Engineering, with blue campus lanyard.',
    location: 'Lecture Hall Complex - Block B Room 204',
    photo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student004@campus.edu', phone: '+91 98765 01004' },
    reportedBy: 'student004',
    category: 'found',
    status: 'open',
    contactPreference: true,
    createdAt: new Date(now - 12 * oneHour),
    updatedAt: new Date(now - 12 * oneHour)
  },
  {
    itemName: 'Milton Thermosteel Water Bottle (1 Litre)',
    description: 'Silver stainless steel insulated bottle with a dent on the bottom rim and sports lid. Keeps water cold for 24 hours.',
    location: 'Sports Complex - Indoor Badminton Court 2',
    photo: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student005@campus.edu', phone: '+91 98765 01005' },
    reportedBy: 'student005',
    category: 'lost',
    status: 'open',
    contactPreference: false,
    createdAt: new Date(now - 18 * oneHour),
    updatedAt: new Date(now - 18 * oneHour)
  },
  {
    itemName: 'Wildcraft Campus Backpack (Navy Blue)',
    description: 'Navy blue Wildcraft backpack containing 3 engineering spiral notebooks, engineering physics textbook, and a black geometry set.',
    location: 'Main Auditorium - Row F Seat 12',
    photo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student006@campus.edu', phone: '+91 98765 01006' },
    reportedBy: 'student006',
    category: 'lost',
    status: 'open',
    contactPreference: true,
    createdAt: new Date(now - 1 * oneDay),
    updatedAt: new Date(now - 1 * oneDay)
  },
  {
    itemName: 'Sony WH-1000XM4 Wireless Headphones',
    description: 'Silver/Grey Sony over-ear noise-cancelling headphones inside original grey zipper case with aux cable and airplane adapter.',
    location: 'Innovation Lab - AI & Robotics Bay Table 3',
    photo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student007@campus.edu', phone: '+91 98765 01007' },
    reportedBy: 'student007',
    category: 'found',
    status: 'open',
    contactPreference: false,
    createdAt: new Date(now - 1.5 * oneDay),
    updatedAt: new Date(now - 1.5 * oneDay)
  },
  {
    itemName: 'Set of 3 Bike & Hostel Keys with Brass Compass Keychain',
    description: 'Honda bike key, Yale hostel room padlock key, and godrej cupboard key on a distinctive brass compass keychain.',
    location: 'Student Parking Lot - Near Two-Wheeler Shed 3',
    photo: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student008@campus.edu', phone: '+91 98765 01008' },
    reportedBy: 'student008',
    category: 'found',
    status: 'open',
    contactPreference: true,
    createdAt: new Date(now - 2 * oneDay),
    updatedAt: new Date(now - 2 * oneDay)
  },
  {
    itemName: 'Kindle Paperwhite (11th Gen - 6.8")',
    description: 'Black Kindle Paperwhite with green fabric smart cover. Contains engineering reference PDFs and sci-fi books.',
    location: 'Central Library - Lawn Benches Outside Entrance',
    photo: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student001@campus.edu', phone: '+91 98765 01001' },
    reportedBy: 'student001',
    category: 'lost',
    status: 'returned',
    contactPreference: false,
    createdAt: new Date(now - 4 * oneDay),
    updatedAt: new Date(now - 3 * oneDay)
  },
  {
    itemName: 'Titan Neo Analog Watch for Men',
    description: 'Titan silver stainless steel analog watch with blue dial and date display. Found on the side bench after basketball practice.',
    location: 'Sports Complex - Basketball Court Bench',
    photo: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student002@campus.edu', phone: '+91 98765 01002' },
    reportedBy: 'student002',
    category: 'found',
    status: 'returned',
    contactPreference: true,
    createdAt: new Date(now - 5 * oneDay),
    updatedAt: new Date(now - 4 * oneDay)
  },
  {
    itemName: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Pale grey ergonomic mouse with electromagnetic scroll wheel. Left behind in CAD/CAM computer lab workstation 18.',
    location: 'CAD / CAM Computer Lab - Workstation 18',
    photo: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student003@campus.edu', phone: '+91 98765 01003' },
    reportedBy: 'student003',
    category: 'found',
    status: 'returned',
    contactPreference: false,
    createdAt: new Date(now - 6 * oneDay),
    updatedAt: new Date(now - 5 * oneDay)
  },
  {
    itemName: 'Spectacles with Ray-Ban Matte Black Frame',
    description: 'Prescription spectacles (-2.5 both eyes) with rectangular matte black Ray-Ban frame inside a hard red protective case.',
    location: 'Campus Cafeteria - Juice Counter Table',
    photo: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
    contactInfo: { email: 'student004@campus.edu', phone: '+91 98765 01004' },
    reportedBy: 'student004',
    category: 'lost',
    status: 'returned',
    contactPreference: true,
    createdAt: new Date(now - 7 * oneDay),
    updatedAt: new Date(now - 6 * oneDay)
  }
];

const seedDatabase = async (force = false) => {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0 && !force) {
    return {
      message: 'Database already has data. Use ?force=true to overwrite.',
      usersCount: existingUsers,
      itemsCount: await Item.countDocuments()
    };
  }

  // Clear existing data
  await User.deleteMany({});
  await Item.deleteMany({});

  // Prepare users with hashed passwords
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
  const createdItems = await Item.insertMany(seedItems);

  return {
    success: true,
    message: 'MongoDB Atlas seeded successfully with initial users and campus items!',
    usersCreated: createdUsers.length,
    itemsCreated: createdItems.length,
    sampleUsers: seedUsers.slice(0, 3).map(u => ({ rollNumber: u.rollNumber, password: u.rawPassword }))
  };
};

module.exports = seedDatabase;
