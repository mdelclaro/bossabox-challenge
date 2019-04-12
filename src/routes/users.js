const express = require("express");
const { body } = require("express-validator/check");

const userController = require("../controllers/users");

const router = express.Router();

// POST /user/signup
router.post("/", [
  body("username")
    .not()
    .isEmpty(),
  body("email").isEmail(),
  body("senha").isLength({ min: 6 }),
  userController.createUser
]);

module.exports = router;
