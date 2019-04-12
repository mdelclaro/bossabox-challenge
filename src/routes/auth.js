const express = require("express");
const { body } = require("express-validator/check");

const authController = require("../controllers/auth");

const router = express.Router();

// POST /auth
router.post(
  "/",
  [
    body("username")
      .not()
      .isEmpty(),
    body("senha")
      .not()
      .isEmpty()
  ],
  authController.login
);

// POST /auth/refreshToken
router.post(
  "/refreshToken",
  [
    body("refreshToken")
      .not()
      .isEmpty()
  ],
  authController.refreshToken
);

module.exports = router;
