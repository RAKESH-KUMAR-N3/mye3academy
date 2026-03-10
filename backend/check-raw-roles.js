import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/Usermodel.js";

dotenv.config();

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const users = await User.find({}, "email firstname role");
    console.log("Users with RAW roles:");
    users.forEach(u => {
      console.log(`Email: [${u.email}], Firstname: [${u.firstname}], Role: [${u.role}] (Length: ${u.role.length})`);
    });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
