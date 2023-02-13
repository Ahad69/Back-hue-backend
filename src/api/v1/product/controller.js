const {  addProductService , getProductsService  , searchProductService , getProductService , deleteProductService , updateProductService, updatePremiumService, getOnlyUserPosts } = require("./service")

// add Products
exports.addProduct = async (req, res) => {
    const { status, code, message } = await addProductService({
      body: req.body,
      ...req.body,
    });
    res.status(code).json({ code, status, message });
  };
  

  // update Products
  exports.updateProduct = async (req, res) => {
    const { status, code, message, data } = await updateProductService({
      ...req.params,
      ...req.body,
    });
    if (data.product) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };

  // update Products
  exports.updatePremium = async (req, res) => {
    const { status, code, message, data } = await updatePremiumService({
      ...req.params,
      ...req.body,
    });
    if (data.product) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };
  

// delete Products
  exports.deleteProduct = async (req, res) => {
    const { status, code, message, data } = await deleteProductService({
      ...req.params,
    });
    res.status(code).json({ code, status, message, data });
  };
  

  // get all Products
  exports.getProducts = async (req, res) => {
    const { status, code, message, data } = await getProductsService({
      ...req.query,
    });
    if (data.products) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };
  

  // get Products by search
  exports.searchProduct = async (req, res) => {
    const { status, code, message, data } = await searchProductService({
      ...req.query,
    });
    if (data.products && data.products.length > 0) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };
  

  // get one Products
  exports.getPosterPost = async (req, res) => {
    const { status, code, message, data } = await getOnlyUserPosts({
      ...req.params,
    });
    if (data.product) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };


  // get one Products
  exports.getProduct = async (req, res) => {
    const { status, code, message, data } = await getProductService({
      ...req.params,
    });
    if (data.product) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };