import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: null },
    role: { type: String, enum: ["member", "admin"], default: "member" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UsersSchema);
