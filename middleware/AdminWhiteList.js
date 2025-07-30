const allowedUsers = [
  { username: "Agnes", password: "Vision001" }
];

const AdminWhiteListMiddleware = (req, res, next) => {
  const { username, password } = req.body;

  const isAllowed = allowedUsers.some(
    user => user.username === username && user.password === password
  );

  if (isAllowed) {
    return next();
  } else {
    return res.status(403).json({ message: "User not allowed" });
  }
};

module.exports = AdminWhiteListMiddleware;
