const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db(); // Gets the default db from connection string
    
    const hashedPassword = await bcrypt.hash("123456", 10);
    
    const existing = await db.collection("users").findOne({ email: "admin@gmail.com" });
    if (existing) {
      await db.collection("users").updateOne(
        { email: "admin@gmail.com" },
        { $set: { password: hashedPassword, role: "ADMIN" } }
      );
      console.log("Admin password updated successfully.");
    } else {
      await db.collection("users").insertOne({
        name: "Admin User",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "ADMIN",
        plan: "ENTERPRISE",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("Admin user created successfully.");
    }
  } catch (err) {
    console.error("Error seeding admin:", err);
  } finally {
    await client.close();
  }
}

seed();
