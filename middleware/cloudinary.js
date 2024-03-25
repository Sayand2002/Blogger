const cloudinary = require('../config/cloudinaryConfig'); 

function cloudinaryUpload(req, res, next) {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  cloudinary.uploader.upload(req.files.file.tempFilePath, { folder: 'uploads' })
    .then((result) => {
      req.cloudinaryUrl = result.secure_url;
      next();
    })
    .catch((error) => {
      console.error('Upload failed:', error);
      return res.status(500).json({ error: 'Upload failed' });
    });
}

module.exports = cloudinaryUpload;
