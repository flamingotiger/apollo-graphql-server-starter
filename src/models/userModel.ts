import bcrypt from "bcrypt";
import mongoose from "mongoose";
mongoose.set('useCreateIndex', true)

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ]
});

userSchema.pre("save", function() {
  const hashedPassword = bcrypt.hashSync((this as any).password, 12);
  (this as any).password = hashedPassword;
});

const user = mongoose.model("user", userSchema);

export default user;
