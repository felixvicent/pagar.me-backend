const bcrypt = require("bcryptjs");

const Base = require("../bin/base/repository-base");
require("../models/user-model");

class userRepository {
  constructor() {
    this.base = new Base("User");
    this.projection = "name email";
  }

  async authenticate(email, password) {
    const user = await this.base.model.findOne({ email });
    const userR = await this.base.model.findOne({ email }, this.projection);

    if (await bcrypt.compareSync(password, user.password)) {
      return userR;
    }

    return null;
  }

  async isEmailExiste(email) {
    return this.base.model.findOne({ email }, this.projection);
  }

  async create(data) {
    const userCriado = await this.base.create(data);

    const userR = await this.base.model.findOne(
      // eslint-disable-next-line no-underscore-dangle
      { _id: userCriado._id },
      this.projection
    );
    return userR;
  }

  async updatePayment(data, userId) {
    return this.base.update(userId, { payDay: data });
  }

  // eslint-disable-next-line consistent-return
  async update(id, data, usuarioLogado) {
    // eslint-disable-next-line no-underscore-dangle
    if (usuarioLogado._id === id) {
      if (
        data.oldPassword !== data.password &&
        data.oldPassword &&
        // eslint-disable-next-line no-bitwise
        (data.password !== undefined) & (data.passwordConfirm !== undefined) &&
        data.password === data.passwordConfirm
      ) {
        const user = await this.base.model.findOne({ _id: id });

        if (await bcrypt.compareSync(data.oldPassword, user.password)) {
          const salt = await bcrypt.genSaltSync(10);
          const hashPassword = await bcrypt.hashSync(data.password, salt);
          let { name } = user;
          let { email } = user;

          if (data.email) {
            email = data.email;
          }
          if (data.name) {
            name = data.name;
          }

          const usuarioAtualizado = await this.base.update(id, {
            name,
            email,
            password: hashPassword,
          });

          return this.base.model.findById(
            // eslint-disable-next-line no-underscore-dangle
            usuarioAtualizado._id,
            this.projection
          );
        }

        return { message: "Senha inválida" };
      }
    } else {
      return { message: "Você não tem permissão para editar esse usuário" };
    }
  }

  async getAll() {
    return this.base.model.find({}, this.projection);
  }

  async delete(id) {
    return this.base.delete(id);
  }
}

module.exports = userRepository;
