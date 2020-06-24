const mongoose = require("mongoose");

class baseRepository {
  constructor(model) {
    this.model = mongoose.model(model);
  }

  async create(data) {
    // eslint-disable-next-line new-cap
    const modelo = new this.model(data);
    const resultado = await modelo.save();

    return resultado;
  }

  async update(id, data) {
    await this.model.findByIdAndUpdate(id, { $set: data });

    const resultado = await this.model.findById(id);

    return resultado;
  }

  async getAll() {
    return this.model.find({});
  }

  async getMyAll(user) {
    // eslint-disable-next-line no-underscore-dangle
    return this.model.find({ userId: user._id });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }

  async getById(id) {
    return this.model.findById(id);
  }
}

module.exports = baseRepository;
