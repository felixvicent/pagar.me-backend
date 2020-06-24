const express = require("express");

const Controller = require("../controllers/user-controller");
const auth = require("../middlewares/authentication");

const router = express.Router();

const ctrl = new Controller();

router.post("/register", ctrl.post);
router.post("/authenticate", ctrl.authenticate);

router.get("/", auth, ctrl.get);
router.put("/:id", auth, ctrl.put);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
