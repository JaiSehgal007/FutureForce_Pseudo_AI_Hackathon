import mongoose,{Schema} from "mongoose";

const moduleSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: String, // Module cover image URL
} , {timestamps: true});

export const Module = mongoose.model('Module', moduleSchema);
