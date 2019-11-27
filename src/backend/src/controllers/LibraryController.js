const LibraryService = require('../services/LibraryService');
const BaseController = require('./BaseController')(LibraryService);

BaseController.getAllByUser = async function (req, res) {
  try {
    let userId = req.user['_id'];
    let data = await LibraryService.getAllByUser(userId);

    return res.json(data);
  } catch (e) {
    Thrower.redirect(res, e);
  }
};

module.exports = BaseController;

/*
getAllByUser          - retornaMidiasCompradasPorUsuario
*/