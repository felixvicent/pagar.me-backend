'use strict';

const express = require('express');

const controller = require('../controllers/card-controller');
const auth = require('../middlewares/authentication');

const router = express.Router();

let _ctrl = new controller();

router.get('/', auth, _ctrl.get);
// router.post('/', auth, _ctrl.post);
router.delete('/:id', auth, _ctrl.delete);

module.exports = router;