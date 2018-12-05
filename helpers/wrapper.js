module.exports = fn => async (req, res, next) => {
  fn(req, res, next)
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
    })
}
