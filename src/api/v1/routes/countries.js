const router = require('express').Router();


const { addMedia , getMedias , searchMedia , getMedia , deleteMedia , updateMedia} = require('../countries/controller');
const { getMediasService, addCountryService } = require('../countries/service');


router.post('/' ,  addCountryService)

router.patch( '/:id' , updateMedia );

router.get('/' ,  getMediasService)

router.delete('/:id' ,  deleteMedia)

router.get('/search' ,    searchMedia)

router.get('/:id',  getMedia)

module.exports = router;