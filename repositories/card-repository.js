require("../models/card-model");

const Base = require("../bin/base/repository-base");

class cardRepositoy {
  constructor() {
    this.base = new Base("Card");
  }

  async getMyAll(user) {
    return this.base.getMyAll(user);
  }

  async getById(id) {
    return this.base.getById(id);
  }

  async delete(id, user) {
    const model = await this.base.getById(id);

    // eslint-disable-next-line no-underscore-dangle
    if (model.userId.toString() === user._id) {
      return this.base.delete(id);
    }

    return "Operação inválida";
  }

  async create(data) {
    const card = await this.base.create(data);

    return card;
  }
}

module.exports = cardRepositoy;
