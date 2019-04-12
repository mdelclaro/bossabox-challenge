const express = require("express");
const { body, param } = require("express-validator/check");

const ferramentaController = require("../controllers/tools");
const auth = require("../middlewares/auth");
const router = express.Router();

// GET /tools
router.get("/", ferramentaController.getFerramentas);

// GET /tools/:idFerramenta
router.get("/:idFerramenta", auth, ferramentaController.getFerramenta);

// POST /tools
router.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 2 }),
    body("link")
      .trim()
      .isLength({ min: 10 }),
    body("description")
      .trim()
      .isLength({ min: 8 }),
    body("tags").isArray()
  ],
  auth,
  ferramentaController.createFerramenta
);

// PUT /tools/:idFerramenta
router.put(
  "/:idFerramenta",
  [
    param("idFerramenta")
      .not()
      .isEmpty(),
    body("title")
      .trim()
      .isLength({ min: 2 })
      .optional(),
    body("link")
      .trim()
      .isLength({ min: 10 })
      .optional(),
    body("description")
      .trim()
      .isLength({ min: 8 })
      .optional(),
    body("tags")
      .isArray()
      .optional()
  ],
  // auth,
  ferramentaController.updateFerramenta
);

// DELETE /tools/:idFerramenta
router.delete(
  "/:idFerramenta",
  [
    param("idFerramenta")
      .not()
      .isEmpty()
  ],
  auth,
  ferramentaController.deleteFerramenta
);

module.exports = router;
