const Repository = require("../repositories/card-repository");
const ctrlbase = require("../bin/base/controller-base");

const repo = new Repository();

function cardController() {}

cardController.prototype.get = async (req, res) => {
  ctrlbase.getMyAll(repo, req, res);
};

cardController.prototype.delete = async (req, res) => {
  ctrlbase.delete(repo, req, res);
};

module.exports = cardController;
