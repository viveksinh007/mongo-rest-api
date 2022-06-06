const mongoose = require("mongoose");

const { Schema } = mongoose;

const CodePostSchema = new Schema({
  title: {
    type: String,
    required: [true, "Must Provide Post Title"],
    trim: true,
    maxlength: [100, "Post Title can not more than 100 characters"],
    minlength: [10, "Post Title can not less than 15 characters"],
  },
  code: {
    type: String,
    required: [true, "Must Provide code Description"],
    trim: true,
  },
  category: {
    type: String,
    enum: ["java", "c", "c++", "javascript", "python"],
    required: [true, "Must Provide Code Category"],
    trim: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
},
{
  timestamps:true
}
);

module.exports = mongoose.model("Post", CodePostSchema);
