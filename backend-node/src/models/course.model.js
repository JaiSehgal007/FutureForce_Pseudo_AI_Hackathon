import mongoose,{Schema} from "mongoose";
const courseSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  domain: String,
  image: String, // Course cover image URL
  modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
  mentor: { type: Schema.Types.ObjectId, ref: 'User' },
} , {timestamps: true});

export const Course = mongoose.model('Course', courseSchema);
