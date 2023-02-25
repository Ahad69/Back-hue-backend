const {  addProductService , getProductsService  , searchProductService , getProductService , deleteProductService , updateProductService, updateApproveService, getOnlyUserPosts, getUnApprovedService, getApprovedService, getQueryService } = require("./service")

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
  exports.updateApprove = async (req, res) => {
    const { status, code, message, data } = await updateApproveService({
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
  exports.getAdminPost = async (req, res) => {
    const { status, code, message, data } = await getUnApprovedService({
      ...req.query,
    });
    if (data.products) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };

  // get all Products
  exports.getPosts = async (req, res) => {
    const { status, code, message, data } = await getApprovedService({
      ...req.query,
    });
    if (data.products) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };
  // get all Products
  exports.getQuery = async (req, res) => {
    const { status, code, message, data } = await getQueryService({
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