const express = require("express");

const Controller = require("../controllers/card-controller");
const auth = require("../middlewares/authentication");

const router = express.Router();

const ctrl = new Controller();

router.get("/", auth, ctrl.get);
// router.post('/', auth, ctrl.post);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
