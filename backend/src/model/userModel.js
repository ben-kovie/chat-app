import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const chatDB = mongoose.connection.useDb("chatDB")
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type: String
    }
},
{timestamps: true});

// hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = chatDB.model("User", UserSchema)