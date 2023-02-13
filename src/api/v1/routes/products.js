const router = require('express').Router();


const verifyToken = require('../middleware/checkLogin');
const { addProduct , getProducts , searchProduct , getProduct , deleteProduct , updateProduct , updatePremium, getPosterPost} = require('../product/controller');




router.post('/' ,  addProduct)

router.patch( '/:id' , updateProduct );
router.patch( '/premium/:id' , updatePremium );

router.get('/' ,  getProducts)

router.delete('/:id' ,  deleteProduct)

router.get('/search' ,    searchProduct)

router.get('/:id',  getProduct)

router.get('/posterid/:id', verifyToken,  getPosterPost)

module.exports = router;