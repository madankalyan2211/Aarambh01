const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for PDF files only - stricter validation
const fileFilter = (req, file, cb) => {
  // Accept only PDF files with correct MIME type
  // This is more strict than just checking extension
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    // Special case: if it's a PDF extension but wrong MIME type, reject it
    if (file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(new Error('File extension is .pdf but content is not a valid PDF document!'), false);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
};

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;