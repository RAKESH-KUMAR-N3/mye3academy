import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/Usermodel.js";

dotenv.config();

const fixRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to DB");
    const users = await User.find({});
    for (const user of users) {
      if (user.role && typeof user.role === 'string') {
        const trimmedRole = user.role.trim();
        if (trimmedRole !== user.role) {
          console.log(`Fixing role for ${user.email}: [${user.role}] -> [${trimmedRole}]`);
          user.role = trimmedRole;
          await user.save();
        }
      }
    }
    console.log("Roles fixed!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixRoles();
