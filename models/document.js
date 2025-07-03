const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  visibility: { type: String, enum: ["public", "private"], default: "private" },
  sharedWith: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  lastModified: Date,
});

module.exports = mongoose.model("Document", documentSchema);
