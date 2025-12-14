const multer = require("multer");
const path = require("path");

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    const ext = path.extname(safeName);
    const base = path.basename(safeName, ext);

    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({ storage: uploadStorage });

module.exports = upload;
