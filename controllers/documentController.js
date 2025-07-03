const Document = require("../models/document");

exports.createDoc = async (req, res) => {
  const { title, content, visibility } = req.body;
  const doc = await Document.create({
    title,
    content,
    visibility,
    author: req.userId,
    lastModified: new Date(),
  });
  res.status(201).json(doc);
};

exports.getPublicDocs = async (req, res) => {
  const docs = await Document.find({
    visibility: "public",
  }).populate("author", "username");
  res.json(docs);
};

exports.getDocWithUser = async (req, res) => {
  const docs = await Document.find({
    $or: [
      { visibility: "public" },
      { sharedWith: { $elemMatch: { userId: req.userId } } },
      { author: req.userId },
    ],
  }).populate("author", "username");
  res.json(docs);
};

exports.getDocById = async (req, res) => {
  const { id } = req.params;
  const doc = await Document.findById(id).populate("author", "username");
  if (!doc) return res.status(404).json({ message: "Document not found" });
  // Optionally, check permissions here
  res.json(doc);
};

exports.updateDoc = async (req, res) => {
  const { id } = req.params;

  const { content, title, visibility, sharedWith } = req.body;

  const doc = await Document.findById(id);
  if (!doc) return res.status(404).json({ message: "Document not found" });
  if (doc.author.toString() !== req.userId)
    return res.status(403).json({ message: "Forbidden" });

  doc.content = content;
  doc.title = title;
  doc.visibility = visibility;
  doc.sharedWith =
    visibility === "private" ? sharedWith.map((id) => ({ userId: id })) : [];
  doc.lastModified = new Date();
  await doc.save();

  res.json(doc);
};
