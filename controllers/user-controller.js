'use strict';

const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');

const repository = require('../repositories/user-repository');
const validation = require('../bin/helpers/validation');
const ctrlBase = require('../bin/base/controller-base');
const variables = require('../bin/configuration/variables');

const _repo = new repository();

function userController(){};

userController.prototype.post = async(req, res) => {
  let _validationContract = new validation();

  _validationContract.isRequired(req.body.name, 'Informe seu nome')
  _validationContract.isRequired(req.body.email, 'Informe seu email')
  _validationContract.isRequired(req.body.password, 'Informe sua senha')
  _validationContract.isRequired(req.body.passwordConfirm, 'Confirme sua senha');
  _validationContract.isTrue(req.body.password !== req.body.passwordConfirm, 'Senhas diferentes');
  _validationContract.isEmail(req.body.email, 'Informe um email válido');

  try{
    let usuarioEmailExiste = await _repo.isEmailExiste(req.body.email);

    if(usuarioEmailExiste){
      _validationContract.isTrue(usuarioEmailExiste.nome !== undefined, `Já existe um usuário cadastrado com o email ${req.body.email}`);
    }

    var salt = await bcript.genSaltSync(10);

    req.body.password = await bcript.hashSync(req.body.password, salt);

    ctrlBase.post(_repo, _validationContract, req, res);
  }
  catch(e){
    res.status(500).send({ message: 'Internal server error' });
  }
};

userController.prototype.put = async(req, res) => {
  let _validationContract = new validation();

  _validationContract.isRequired(req.params.id, 'Informe seu id');
  _validationContract.isRequired(req.body.name, 'Informe seu nome');
  _validationContract.isRequired(req.body.email, 'Informe seu email');
  _validationContract.isRequired(req.body.password, 'Informe sua senha');
  _validationContract.isRequired(req.body.passwordConfirm, 'Confirme sua senha');
  _validationContract.isTrue(req.body.password !== req.body.passwordConfirm, 'Senhas diferentes');
  _validationContract.isEmail(req.body.email, 'Informe um email válido');

  try{
    let usuarioEmailExiste = await _repo.isEmailExiste(req.body.email);

    if(usuarioEmailExiste){
      _validationContract.isTue(usuarioEmailExiste.nome !== undefined && usuarioEmailExiste._id !== req.params.id, `Já existe um usuário cadastrado com o email ${req.body.email}`);
    }

    var salt = await bcript.genSaltSync(10);

    req.body.password = await bcript.hashSync(req.body.password, salt);

    ctrlBase.put(_repo, _validationContract, req, res);
  }
  catch(e){
    res.status(500).send({ message: 'Internal server error' });
  }
};

userController.prototype.get = async (req, res) => {
  ctrlBase.get(_repo, req, res);
}

userController.prototype.delete = async (req, res) => {
  _validationContract.isRequired(req.params.id, 'Informe seu id');
  ctrlBase.delete(_repo, req, res);
};

userController.prototype.authenticate = async (req, res) => {
  let _validationContract = new validation();

  _validationContract.isRequired(req.body.email, 'Informe seu email');
  _validationContract.isRequired(req.body.password, 'Informe sua senha');
  _validationContract.isRequired(req.body.passwordConfirm, 'Confirme sua senha');
  _validationContract.isTrue(req.body.password !== req.body.passwordConfirm, 'Senhas diferentes');
  _validationContract.isEmail(req.body.email, 'Informe um email válido');

  if(!_validationContract.isValid()) {
    res.status(400).send({
      message: 'Não foi possivel efetuar o login',
      validation: _validationContract.erros(),
    });
    return ;
  }

  let usuarioEncontrado = await _repo.authenticate(req.body.email, req.body.password, false);

  if(usuarioEncontrado === null){
    res.status(404).send({ message: 'Usuário ou senha informados são inválidos' })
  }
  if(usuarioEncontrado){
    res.status(200).send({
      usuario: usuarioEncontrado,
      token: jwt.sign({ user: usuarioEncontrado }, variables.Security.secretKey)
    });
  }
  else {
    res.status(404).send({ message: 'Usuário ou senha informados são inválidos' })
  }
};

module.exports = userController;