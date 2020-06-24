'use strict'

const repository = require('../repositories/card-repository');
const ctrlbase = require('../bin/base/controller-base');
const validation = require('../bin/helpers/validation');

const _repo = new repository();

function cardController(){}

cardController.prototype.get = async (req, res) =>{
  ctrlbase.getMyAll(_repo, req, res);
};

cardController.prototype.delete = async (req, res) => {
  ctrlbase.delete(_repo, req, res);
};

module.exports = cardController;