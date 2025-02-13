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
  basicInfo: {
    title: { type: String, required: true, minlength: 3, maxlength: 100 },
    description: { type: String, required: true, minlength: 10 },
    type: { type: String, required: true },
    sessionType: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    duration: { type: Number, required: true, min: 15 },
    timeZone: { type: String, required: true },
    language: { type: String, required: true }
  },
  branding: {
    domain: { type: String, required: true, match: /^[a-z0-9-]*$/ },
    primaryColor: { type: String, default: '#FFFFFF' },
    secondaryColor: { type: String, default: '#000000' },
    contrastColor: { type: String, default: '#197DD2' },
    customCss: String
  },
  attendance: {
    maxAttendees: { type: Number, min: 1, max: 10000 },
    registrationType: { type: String, required: true },
    requireApproval: { type: Boolean, default: false },
    allowWaitlist: { type: Boolean, default: false },
    registrationDeadline: Date,
    price: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' }
    }
  },
  additionalInfo: {
    agenda: String,
    organizerName: { type: String, required: true },
    supportEmail: { type: String, required: true },
    speakers: [{ type: mongoose.Schema.Types.Mixed }],
    materials: [{ type: mongoose.Schema.Types.Mixed }],
    tags: [String],
    categories: [String],
    description: { type: String, required: true }
  },
  status: { type: String, default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const Webinar = mongoose.model('Webinar', webinarSchema);

// Validation middleware
const validateWebinar = (req, res, next) => {
  const { name, startDate, endDate } = req.body;
  
  // if (!name?.trim()) {
  //   return res.status(400).json({ message: "Webinar name is required" });
  // }
  
  // if (!startDate || !endDate) {
  //   return res.status(400).json({ message: "Start and end dates are required" });
  // }
  
  // if (new Date(startDate) >= new Date(endDate)) {
  //   return res.status(400).json({ message: "End date must be after start date" });
  // }
  
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
