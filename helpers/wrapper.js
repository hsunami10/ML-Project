module.exports = fn => async (req, res, next) => {
  fn(req, res, next)
    .catch(error => {
      console.log(error);
      res.status(200).send(error);
    })
}
