module.exports = function (req, res, next) {
  if (process.env.AUTH_ENABLED === 'true') {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
  next();
};
