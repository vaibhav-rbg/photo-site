const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// -------------------- UPLOADS FOLDER --------------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// -------------------- MULTER STORAGE --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const qrID = req.body.qr_id || "unknown";
    const timestamp = Date.now();
    cb(null, `${qrID}_${timestamp}.png`);
  }
});

const upload = multer({ storage });

// -------------------- STATIC FRONTEND --------------------
app.use(express.static(path.join(__dirname, "public")));

// -------------------- UPLOAD ENDPOINT --------------------
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ status: "failed" });

  console.log("Photo received:", req.file.filename);

  // Return download URL
  res.json({ 
    status: "success", 
    downloadUrl: `/uploads/${req.file.filename}` 
  });
});

// -------------------- SERVE UPLOADS --------------------
app.use("/uploads", express.static(uploadDir));

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

