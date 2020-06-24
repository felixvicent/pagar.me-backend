exports.post = async (repository, validationContract, req, res) => {
  try {
    const data = req.body;

    if (!validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: "Existem dados inválidos na sua requisição",
          validation: validationContract.errors(),
        })
        .end();

      return;
    }

    const response = await repository.create(data, req);

    res.status(201).send(response);
  } catch (e) {
    res.status(500).send({
      message: "Internal server error",
      error: e,
    });
  }
};

exports.put = async (repository, validationContract, req, res) => {
  try {
    const data = req.body;

    if (!validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: "Existem dados inválidos na sua requisição",
          validation: validationContract.errors(),
        })
        .end();

      return;
    }

    const response = await repository.update(
      req.params.id,
      data,
      req.usuarioLogado.user
    );

    res.status(202).send(response);
  } catch (e) {
    res.status(500).send({
      message: "Internal server error",
      error: e,
    });
  }
};

exports.get = async (repository, req, res) => {
  try {
    const response = await repository.getAll();

    res.status(200).send(response);
  } catch (e) {
    res.status(500).send({
      message: "Internal server error",
      error: e,
    });
  }
};

exports.getMyAll = async (repository, req, res) => {
  try {
    const response = await repository.getMyAll(req.usuarioLogado.user);

    res.status(200).send(response);
  } catch (e) {
    res.status(500).send({
      message: "Internal server error",
      error: e,
    });
  }
};

exports.delete = async (repository, validationContract, req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const response = await repository.delete(id, req.usuarioLogado);

      if (response !== "Operação Inválida") {
        res.status(200).send({ message: "Registro excluido" });
      } else {
        res.status(401).send({ message: "Operação inválida" });
      }
    } else {
      res
        .status(500)
        .send({ message: "O paramentro id precisa ser informado" });
    }
  } catch (e) {
    res.status(500).send({
      message: "Internal server error",
      error: e,
    });
  }
};
