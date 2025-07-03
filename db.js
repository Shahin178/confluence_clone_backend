const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to mongoDB");
  })
  .catch((err) => console.log("\n\nError while connecting to mongoDB =>", err));

require("./models/user");
require("./models/document");
