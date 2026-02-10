const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

/* -------------------- IMPORTANT FIX -------------------- */
/* These allow Express to properly read form fields and avoid
   silent failures with multer + fetch FormData */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------------------------------------------- */

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage to save photos with readable names
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),

  filename: (req, file, cb) => {
    // qr_id sometimes arrives AFTER multer parses file,
    // so we safely fallback
    let qrID = "unknown";

    if (req.body && req.body.qr_id) {
      qrID = req.body.qr_id;
    }

    const timestamp = Date.now();
    cb(null, `${qrID}_${timestamp}.png`);
  }
});

const upload = multer({ storage });

/* Serve frontend files */
app.use(express.static(path.join(__dirname, "public")));

/* Endpoint to receive photo */
app.post("/api/upload", upload.single("photo"), (req, res) => {
  try {
    if (!req.file) {
      console.log("No file received");
      return res.status(400).json({ status: "no_file" });
    }

    console.log(`Photo received! File: ${req.file.filename}`);
    res.json({ status: "success" });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ status: "error" });
  }
});

/* Start server */
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

