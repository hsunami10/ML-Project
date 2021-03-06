const upload = require('../config/multer');
const fs = require('fs');
const wrapper = require('../helpers/wrapper');
const path = require('path');

module.exports = app => {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/eecs349_project/get_time', wrapper(async (req, res) => {
    const { name } = req.query;
    const timePath = `secret/eecs349_project/training_times/${name}.txt`;
    if (fs.existsSync(timePath)) {
      fs.readFile(timePath, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        }
        res.status(200).send(data);
      });
    } else {
      throw new Error('Specified time file does not exist');
    }
  }));

  app.get('/api/eecs349_project/check_load', wrapper(async (req, res) => {
    const { name } = req.query;
    const modelPath = `secret/eecs349_project/models/${name}.json`;
    const weightPath = `secret/eecs349_project/model_weights/${name}.weights.bin`;
    if (fs.existsSync(modelPath) && fs.existsSync(weightPath)) {
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  }));

  app.get('/api/eecs349_project/load_model', wrapper(async (req, res) => {
    const { name } = req.query;
    const modelPath = `${__dirname}/../secret/eecs349_project/models/${name}.json`;
    res.status(200).sendFile(path.resolve(modelPath));
  }));

  app.get('/api/eecs349_project/load_weights', wrapper(async (req, res) => {
    const { name } = req.query;
    const weightsPath = `${__dirname}/../secret/eecs349_project/model_weights/${name}.weights.bin`;
    res.status(200).sendFile(path.resolve(weightsPath));
  }));

  // TODO: Finish this later - find out format of req.body to get the names of files
  // https://www.npmjs.com/package/multer
  app.post('/api/eecs349_project/save', upload.any(), wrapper(async (req, res) => {
    const { name, time } = req.query;
    /*
    Read number from training_times/name.txt
    Check if time is greater than number in training_times/name.txt
    If greater than, overwrite the training time in name.txt
     */
    const path = `secret/eecs349_project/training_times/${name}.txt`;
    if (fs.existsSync(path)) { // If file already exists
      fs.readFile(path, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else if (parseInt(time, 10) > parseInt(data, 10)) {
          fs.writeFile(path, time, err => { // Write into file
            if (err) {
              console.log(err);
              res.status(500).send(err);
            } else {
              res.status(200).send(true);
            }
          });
        } else {
          res.status(200).send(true);
        }
      })
    } else { // If file doesn't exist
      fs.writeFile(path, time, err => { // Create and write into file
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          res.status(200).send(true);
        }
      });
    }
  }));
};
