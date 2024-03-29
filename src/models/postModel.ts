import mongoose from "mongoose";
mongoose.set('useCreateIndex', true)

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }
});

const post = mongoose.model("post", postSchema);

export default post;
