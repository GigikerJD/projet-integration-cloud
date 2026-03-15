import mongoose, { Schema } from "mongoose"

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    role: { type: String, required: true },
    birthdate: { type: Date, required: true}
}, { timestamps: true })

export const Users = mongoose.model("Users", UserSchema)