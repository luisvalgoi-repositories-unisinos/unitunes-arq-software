const express = require('express');
const routes = express.Router();
const MediaController = require('../controllers/MediaController');

const auth = require('../middleware/auth');

routes.get('/', MediaController.getAll);
routes.get('/news', MediaController.getAllNews);
routes.get('/recents', MediaController.getAllRecents);
routes.get('/released', MediaController.getAllReleased);
routes.get('/authored', auth, MediaController.getAllAuthored);
routes.get('/:id', MediaController.getById);
routes.post('/', MediaController.insert);
routes.put('/:id', MediaController.update);
routes.delete('/:id', MediaController.remove);
routes.get('/:id/content', MediaController.getContent);
routes.put('/:id/release', MediaController.release);
routes.get('/:id/download', MediaController.download);
routes.post('/:id/buy', MediaController.buy);

module.exports = routes;

/*
getAll                - retornarTodas
getAllAvailables      - retornarTodasDisponibilizadas
getById               - retornar
insert                - criar
update                - atualizar
remove                - remover
getContent            - executarConteudo
release               - disponibilizar
download              - baixar
buy                   - comprar
*/