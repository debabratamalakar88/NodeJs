import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/contacts/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (["profilePicture", "imageGallery"].includes(file.fieldname) && !/\.(jpg|jpeg|png|gif)$/i.test(ext)) {
    return cb(new Error(`Only image files are allowed for ${file.fieldname}!`), false);
  }

  if (file.fieldname === "docCV" && !/\.(pdf|doc|docx|xlsx|xls)$/i.test(ext)) {
    return cb(new Error("Only PDF, DOC, DOCX, XLSX, and XLS files are allowed for CV uploads!"), false);
  }

  cb(null, true);
};

export const uploadFields = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
}).fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "imageGallery", maxCount: 5 },
  { name: "docCV", maxCount: 1 }
]);



export const ContactErrorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(400).send(`Error: ${err.message}`);
  }
  next();
}