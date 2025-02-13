import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/webinars-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Webinar Schema
const webinarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const Webinar = mongoose.model('Webinar', webinarSchema);

// Validation middleware
const validateWebinar = (req, res, next) => {
  const { name, startDate, endDate } = req.body;
  
  if (!name?.trim()) {
    return res.status(400).json({ message: "Webinar name is required" });
  }
  
  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start and end dates are required" });
  }
  
  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ message: "End date must be after start date" });
  }
  
  next();
};

// Routes
app.post("/api/webinars", validateWebinar, async (req, res) => {
  try {
    const webinar = new Webinar(req.body);
    await webinar.save();
    res.status(201).json(webinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/webinars/:id", async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }
    res.json(webinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/webinars", async (req, res) => {
  try {
    const webinars = await Webinar.find();
    res.json(webinars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/webinars/:id", validateWebinar, async (req, res) => {
  try {
    const webinar = await Webinar.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }
    res.json(webinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/webinars/:id", async (req, res) => {
  try {
    const webinar = await Webinar.findByIdAndDelete(req.params.id);
    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
