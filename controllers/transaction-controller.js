const pagarme = require("pagarme");
const CryptoJS = require("react-native-crypto-js");
const moment = require("moment");

const Repository = require("../repositories/transaction-repository");
const RepositoryCard = require("../repositories/card-repository");
const RepositoryUser = require("../repositories/user-repository");
const ctrlBase = require("../bin/base/controller-base");
const Validation = require("../bin/helpers/validation");
const variables = require("../bin/configuration/variables");

const repo = new Repository();
const repoCard = new RepositoryCard();
const repoUser = new RepositoryUser();

function transactionController() {}

transactionController.prototype.post = async (req, res) => {
  try {
    const validationContract = new Validation();

    validationContract.isRequired(req.body.cpf, "Informe seu CPF");

    const data = req.body;
    const encryptionKey = variables.Pagarme.pagarmeKey;

    const client = await pagarme.client.connect({ api_key: encryptionKey });

    if (data.card_id) {
      const card = await repoCard.getById(data.card_id);
      const pagarmeTransaction = await client.transactions.create({
        amount: 6000,
        payment_method: "credit_card",
        card_id: card.card_id,
        customer: {
          name: card.name,
          external_id: "#3333",
          email: card.email,
          type: "individual",
          country: "br",
          phone_numbers: [`+${card.phone}`],
          documents: [
            {
              type: "cpf",
              number: card.cpf,
            },
          ],
        },
        billing: {
          name: card.name,
          address: {
            country: "br",
            state: card.state,
            city: card.city,
            neighborhood: card.neighborhood,
            street: card.street,
            street_number: card.street_number,
            zipcode: card.zipcode,
          },
        },
        items: [
          {
            id: "1",
            title: "Parcela mensal",
            unit_price: 30,
            quantity: 1,
            tangible: true,
          },
        ],
        metadata: { idProduto: "1" },
      });

      const transaction = {
        status: pagarmeTransaction.status,
        authorization_code: pagarmeTransaction.authorization_code,
        risk_level: pagarmeTransaction.risk_level,
        // eslint-disable-next-line no-underscore-dangle
        card: card._id,
        // eslint-disable-next-line no-underscore-dangle
        userId: req.usuarioLogado.user._id,
        acquirer_id: pagarmeTransaction.acquirer_id,
      };

      const transactionCreated = await repo.create(transaction);

      // eslint-disable-next-line no-underscore-dangle
      const datav = new Date(moment().add(30, "days")._d.toISOString());

      // eslint-disable-next-line no-underscore-dangle
      await repoUser.updatePayment(datav, req.usuarioLogado.user._id);

      res.status(200).send(transactionCreated);
    } else {
      const bytes = CryptoJS.AES.decrypt(
        data.card_hash,
        "hdfudhuidfhudhudah9d8s8f9d8a98as9d8s9d89as"
      );
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const cardToHash = {
        card_number: decryptedData.card_number,
        card_holder_name: decryptedData.card_holder_name,
        card_cvv: decryptedData.card_cvv,
        card_expiration_date: decryptedData.card_expiration_date,
      };

      const cardHash = await client.security.encrypt(cardToHash);
      const pagarmeTransaction = await client.transactions.create({
        amount: 6000,
        payment_method: "credit_card",
        card_hash: cardHash,
        customer: {
          name: data.name,
          external_id: "#3333",
          email: data.email,
          type: "individual",
          country: "br",
          phone_numbers: [`+${data.phone}`],
          documents: [
            {
              type: "cpf",
              number: data.cpf,
            },
          ],
        },
        billing: {
          name: data.name,
          address: {
            country: "br",
            state: data.state,
            city: data.city,
            neighborhood: data.neighborhood,
            street: data.street,
            street_number: data.street_number,
            zipcode: data.zipcode,
          },
        },
        items: [
          {
            id: "1",
            title: "Parcela mensal",
            unit_price: 30,
            quantity: 1,
            tangible: true,
          },
        ],
        metadata: { idProduto: "1" },
      });

      const cardAux = pagarmeTransaction.card;
      const card = {
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        street: data.street,
        street_number: data.street_number,
        date: data.date,
        cpf: data.cpf,
        phone: data.phone,
        email: data.email,
        zipcode: data.zipcode,
        card_id: cardAux.id,
        brand: cardAux.brand,
        card_holder_name: cardAux.card_holder_name,
        cardNumber: `${cardAux.first_digits}******${cardAux.last_digits}`,
        // eslint-disable-next-line no-underscore-dangle
        userId: req.usuarioLogado.user._id,
      };

      await repoCard.create(card);

      const transaction = {
        status: pagarmeTransaction.status,
        authorization_code: pagarmeTransaction.authorization_code,
        risk_level: pagarmeTransaction.risk_level,
        // eslint-disable-next-line no-underscore-dangle
        card: card._id,
        // eslint-disable-next-line no-underscore-dangle
        userId: req.usuarioLogado.user._id,
        acquirer_id: pagarmeTransaction.acquirer_id,
      };

      const transactionCreated = await repo.create(transaction);

      // eslint-disable-next-line no-underscore-dangle
      const datav = new Date(moment().add(30, "days")._d.toISOString());

      // eslint-disable-next-line no-underscore-dangle
      await repoUser.updatePayment(datav, req.usuarioLogado.user._id);

      res.status(200).send(transactionCreated);
    }
  } catch (e) {
    let erro = "";

    if (e.response && e.response.errors) {
      erro = e.response.errors;
    } else {
      erro = e.toString();
    }

    res.status(500).send({
      message: "Internal server error",
      erro,
    });
  }
};

transactionController.prototype.get = async (req, res) => {
  ctrlBase.getMyAll(repo, req, res);
};

transactionController.prototype.delete = async (req, res) => {
  ctrlBase.delete(repo, req, res);
};

module.exports = transactionController;
