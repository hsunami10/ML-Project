const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.originalUrl === '/secret/eecs349_project/save') {
      const ext = file.originalname.split('.').pop();
      if (ext === 'json') {
        cb(null, 'secret/eecs349_project/models');
      } else if (ext === 'bin') {
        cb(null, 'secret/eecs349_project/model_weights');
      } else {
        cb(new Error('Incorrect file type for /secret/eecs349_project/save, destination'));
      }
    } else {
      cb(new Error('Invalid URL in multer.js storage.destination'));
    }
  },
  filename: (req, file, cb) => {
    if (req.originalUrl === '/secret/eecs349_project/save') {
      const { name } = req.query;
      const ext = file.originalname.split('.').pop();
      if (ext === 'json') {
        cb(null, `${name}.json`);
      } else if (ext === 'bin') {
        cb(null, `${name}.weights.bin`);
      } else {
        cb(new Error('Incorrect file type for /secret/eecs349_project/save, filename'));
      }
    } else {
      cb(new Error('Invalid URL in multer.js storage.filename'));
    }
  }
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
