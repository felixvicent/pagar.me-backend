const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Repository = require("../repositories/user-repository");
const Validation = require("../bin/helpers/validation");
const ctrlBase = require("../bin/base/controller-base");
const variables = require("../bin/configuration/variables");

const repo = new Repository();

function userController() {}

userController.prototype.post = async (req, res) => {
  const validationContract = new Validation();

  validationContract.isRequired(req.body.name, "Informe seu nome");
  validationContract.isRequired(req.body.email, "Informe seu email");
  validationContract.isRequired(req.body.password, "Informe sua senha");
  validationContract.isRequired(req.body.passwordConfirm, "Confirme sua senha");
  validationContract.isTrue(
    req.body.password !== req.body.passwordConfirm,
    "Senhas diferentes"
  );
  validationContract.isEmail(req.body.email, "Informe um email válido");

  try {
    const usuarioEmailExiste = await repo.isEmailExiste(req.body.email);

    if (usuarioEmailExiste) {
      validationContract.isTrue(
        usuarioEmailExiste.nome !== undefined,
        `Já existe um usuário cadastrado com o email ${req.body.email}`
      );
    }

    const salt = await bcript.genSaltSync(10);

    req.body.password = await bcript.hashSync(req.body.password, salt);

    ctrlBase.post(repo, validationContract, req, res);
  } catch (e) {
    res.status(500).send({
      message: "Internal server error",
      erro: e.toString(),
    });
  }
};

userController.prototype.put = async (req, res) => {
  const validationContract = new Validation();

  validationContract.isRequired(req.params.id, "Informe seu id");
  validationContract.isRequired(req.body.name, "Informe seu nome");
  validationContract.isRequired(req.body.email, "Informe seu email");
  validationContract.isRequired(req.body.password, "Informe sua senha");
  validationContract.isRequired(req.body.passwordConfirm, "Confirme sua senha");
  validationContract.isTrue(
    req.body.password !== req.body.passwordConfirm,
    "Senhas diferentes"
  );
  validationContract.isEmail(req.body.email, "Informe um email válido");

  try {
    const usuarioEmailExiste = await repo.isEmailExiste(req.body.email);

    if (usuarioEmailExiste) {
      validationContract.isTue(
        usuarioEmailExiste.nome !== undefined &&
          // eslint-disable-next-line no-underscore-dangle
          usuarioEmailExiste._id !== req.params.id,
        `Já existe um usuário cadastrado com o email ${req.body.email}`
      );
    }

    const salt = await bcript.genSaltSync(10);

    req.body.password = await bcript.hashSync(req.body.password, salt);

    ctrlBase.put(repo, validationContract, req, res);
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
};

userController.prototype.get = async (req, res) => {
  ctrlBase.get(repo, req, res);
};

userController.prototype.delete = async (req, res) => {
  const validationContract = new Validation();

  validationContract.isRequired(req.params.id, "Informe seu id");
  ctrlBase.delete(repo, req, res);
};

userController.prototype.authenticate = async (req, res) => {
  const validationContract = new Validation();

  validationContract.isRequired(req.body.email, "Informe seu email");
  validationContract.isRequired(req.body.password, "Informe sua senha");
  validationContract.isRequired(req.body.passwordConfirm, "Confirme sua senha");
  validationContract.isTrue(
    req.body.password !== req.body.passwordConfirm,
    "Senhas diferentes"
  );
  validationContract.isEmail(req.body.email, "Informe um email válido");

  if (!validationContract.isValid()) {
    res.status(400).send({
      message: "Não foi possivel efetuar o login",
      validation: validationContract.erros(),
    });
    return;
  }

  const usuarioEncontrado = await repo.authenticate(
    req.body.email,
    req.body.password,
    false
  );

  if (usuarioEncontrado === null) {
    res
      .status(404)
      .send({ message: "Usuário ou senha informados são inválidos" });
  }
  if (usuarioEncontrado) {
    res.status(200).send({
      usuario: usuarioEncontrado,
      token: jwt.sign(
        { user: usuarioEncontrado },
        variables.Security.secretKey
      ),
    });
  } else {
    res
      .status(404)
      .send({ message: "Usuário ou senha informados são inválidos" });
  }
};

module.exports = userController;
