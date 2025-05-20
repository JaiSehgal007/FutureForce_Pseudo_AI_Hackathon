import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: { type: String, required: true  },
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  educationLevel: String,
  email: { type: String, required: true, unique: true },
  contact: String,
  profilePicture: String, // URL
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ['Student', 'Mentor', 'Admin'],
    required: true
  },

  refreshToken : { type: String, default: null },

  interestedAreas: [String],
  experienceFields: [String],

  // Only for Students
  attendedCourses: [
    {
      course: { type: Schema.Types.ObjectId, ref: 'Course' },
      completedModules: [{ type: Schema.Types.ObjectId , ref: 'Module' }],
    }
  ],


} , {timestamps: true});

userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password , 10);
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
        fullname : this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema);
