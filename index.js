const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

const app = express();
const PORT = 8080 || process.env.PORT;
const host = "localhost";

require("./db");

// Use CORS middleware
app.use(cors());

// Use bodyParser middleware for parsing requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);

// Start the server
app.listen(PORT, () => console.log(`Listening at http://${host}:${PORT}`));
