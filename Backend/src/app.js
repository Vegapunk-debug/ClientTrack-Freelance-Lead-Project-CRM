const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("ClientTrack Backend Running...");
});
app.use("/auth", authRoutes);
app.use("/user", authRoutes); // Also allow /user routes for profile updates
app.use("/leads", leadRoutes);
app.use("/projects", projectRoutes);

module.exports = app;
