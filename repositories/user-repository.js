const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const base = require('../bin/base/repository-base');
require('../models/user-model');

class userRepository{
  constructor(){
    this._base = new base('User');
    this._projection = 'name email';
  }

  async authenticate(email, password, flag){
    let user = await this._base._model.findOne({ email: email });
    let userR = await this._base._model.findOne({ email: email }, this._projection);

    if(await bcrypt.compareSync(password, user.password)){
      return userR;
    }

    return null;
  }

  async isEmailExiste(email){
    return await this._base._model.findOne({ email: email }, this._projection);
  }

  async create(data, req){
    let userCriado = await this._base.create(data);
    let userR = await this._base._model.findOne({ _id: userCriado._id }, this._projection);

    return userR;
  }

  async update(id, data, usuarioLogado){
    if(usuarioLogado._id === id){
      if(data.oldPassword !== data.password && data.oldPassword && data.password !== undefined & data.passwordConfirm !== undefined && data.password === data.passwordConfirm) {
        let user = await this._base._model.findOne({ _id: id });

        if(await bcrypt.compareSync(data.oldPassword, user.password)){
          var salt = await bcrypt.genSaltSync(10);
          let hashPassword = await bcrypt.hashSync(data.password, salt);
          let name = user.name;
          let email = user.email;
          
          if(data.email){
            email = data.email;
          }
          if(data.name){
            name = data.name;
          }
          
          let usuarioAtualizado = await this._base.update(id, {
            name: name,
            email: email,
            password: hashPassword,
          })

          return this._base._model.findById(usuarioAtualizado._id, this._projection);
        }
        else{
          return { message: 'Senha inválida' }
        }
      }
    }
    else{
      return { message: 'Você não tem permissão para editar esse usuário' };
    }
  }

  async getAll(){
    return await this._base._model.find({}, this._projection);
  }
  
  async delete(id){
    return await this._base.delete(id);
  }
}

module.exports = userRepository;