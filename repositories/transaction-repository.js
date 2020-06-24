require("../models/transaction-model");

const Base = require("../bin/base/repository-base");

class transactionRepositoy {
  constructor() {
    this.base = new Base("Transaction");
  }

  async getMyAll(user) {
    return this.base.getMyAll(user);
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
    const transaction = await this.base.create(data);

    return transaction;
  }
}

module.exports = transactionRepositoy;
