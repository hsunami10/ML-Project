const upload = require('../config/multer');

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

  // TODO: Finish this later - find out format of req.body to get the names of files
  // https://www.npmjs.com/package/multer
  app.post('/secret/eecs349_project/save'/*, upload.array()*/, async (req, res) => {
    const { name, time } = req.query;
    /*
    Read number from training_times/name.txt
    Check if time is greater than number in training_times/name.txt
    If greater than, overwrite the training time in name.txt
     */

    res.sendStatus(200);
  });
};
