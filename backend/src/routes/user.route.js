const { Router } = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
} = require("../controllers/user.controller");
const { UserAuth } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/getUserData", UserAuth, getUser);
router.post("/auth/logout", UserAuth, logoutUser);

module.exports = router;
