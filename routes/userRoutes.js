const path = require('path');
const multer = require('multer');

const Drawing = require('../models/Drawing');
const cloudinary = require('../services/cloudinary');
const requireLogin = require('../middlewares/requireLogin');
const bufferToString = require('../services/bufferToString');

const memoryStorage = multer.memoryStorage()

const cloudUpload = multer({
  storage: memoryStorage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback('Only images are allowed', null)
    }
    callback(null, true)
  }
})
.single('image');

module.exports = app => {
  app.get('/users', (req, res) => {
    res.send(users);
  });

  app.get('/users/xss', (req, res) => {
    res.send(usersXss);
  });

  app.get('/admins', requireLogin, (req, res) => {
    res.send(admins);
  });

  app.get('/user/drawings', requireLogin, async (req, res) => {
    Drawing.find({googleId: req.user.googleId},(err,items) => {
      res.status(200).json(items);
    });
  });

  app.post('/drawing/upload', requireLogin, cloudUpload, async (req, res) => {
    const imageContent = bufferToString(req.file.originalname,req.file.buffer).content
    cloudinary.uploader.upload(imageContent, async (err, imageResponse) => {
      await new Drawing({ googleId: req.user.googleId, drawingUrl: imageResponse.secure_url}).save();
      Drawing.find({googleId: req.user.googleId},(merr,items) => {
        res.status(200).json(items);
      });
    });
  });
};

const users = [
  { id: 1, name: 'Leanne Graham' },
  { id: 2, name: 'Ervin Howell' },
  { id: 3, name: 'Clementine Bauch' },
  { id: 4, name: 'Patricia Lebsack' },
  { id: 5, name: 'Chelsey Dietrich' }
];

const usersXss = [
  { id: 1, name: '</script><script>alert(1234567890)</script>' },
  { id: 2, name: 'Ervin Howell' },
  { id: 3, name: 'Clementine Bauch' },
  { id: 4, name: 'Patricia Lebsack' },
  { id: 5, name: 'Chelsey Dietrich' }
];

const admins = [
  { id: 1, name: 'Kurtis Weissnat' },
  { id: 2, name: 'Nicholas Runolfsdottir' },
  { id: 3, name: 'Gelann Reichert' },
  { id: 4, name: 'Moriah Stanton' },
  { id: 5, name: 'Rey Padberg' }
];
