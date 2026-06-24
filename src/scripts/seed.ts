import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Invoice } from "../models/Invoice";
import * as dotenv from "dotenv";

// Load environment variables from .env if present
dotenv.config();

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in the environment variables.");
    process.exit(1);
  }

  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    // Clear existing data
    console.log("⏳ Clearing existing users and invoices...");
    await User.deleteMany({});
    await Invoice.deleteMany({});

    // 1. Create Admin User
    console.log("⏳ Creating Admin User...");
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@saaskit.com",
      password: adminPassword,
      role: "ADMIN",
      plan: "ENTERPRISE",
      isActive: true,
      emailVerified: new Date(),
    });
    console.log("✅ Admin User created successfully (admin@saaskit.com).");

    // 2. Create 50 Random Users
    console.log("⏳ Creating 50 Random Users...");
    const plans = ["FREE", "PRO", "ENTERPRISE"];
    const statuses = [true, false];
    
    const usersData = [];
    for (let i = 1; i <= 50; i++) {
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Random date in the last 12 months for Analytics data
      const randomDate = new Date();
      randomDate.setMonth(randomDate.getMonth() - Math.floor(Math.random() * 12));
      randomDate.setDate(Math.floor(Math.random() * 28) + 1);

      usersData.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: adminPassword, // generic password for seeded users
        role: "USER",
        plan: randomPlan,
        isActive: randomStatus,
        createdAt: randomDate,
        updatedAt: randomDate,
      });
    }
    
    const insertedUsers = await User.insertMany(usersData);
    console.log(`✅ Successfully created 50 random users with varied plans and statuses.`);

    // 3. Create 100 Transactions (Invoices)
    console.log("⏳ Creating 100 Invoices...");
    const invoiceStatuses = ["Paid", "Pending", "Failed"];
    
    const invoicesData = [];
    for (let i = 1; i <= 100; i++) {
      const randomUser = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
      const randomStatus = invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)];
      
      const randomDate = new Date();
      randomDate.setMonth(randomDate.getMonth() - Math.floor(Math.random() * 12));
      randomDate.setDate(Math.floor(Math.random() * 28) + 1);

      let amount = 0;
      if (randomUser.plan === "PRO") amount = 999;
      if (randomUser.plan === "ENTERPRISE") amount = 4999;

      invoicesData.push({
        userId: randomUser._id,
        stripeInvoiceId: `INV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        amount: amount,
        currency: "USD ($)",
        status: randomStatus,
        plan: randomUser.plan,
        invoiceUrl: "https://stripe.com/invoice/test",
        createdAt: randomDate,
      });
    }

    await Invoice.insertMany(invoicesData);
    console.log(`✅ Successfully created 100 random invoices across 12 months.`);
    
    console.log("🎉 Database seeded completely!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
