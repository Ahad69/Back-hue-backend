const { Product } = require("../models");

// add Products
exports.addProductService = async ({ body }) => {
  const response = {
    code: 201,
    status: "success",
    message: "Product added successfully",
  };

  try {
    const newProduct = new Product(body);
    await newProduct.save();
    return response;
  } catch (error) {
    console.log(error);
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

// update Products
exports.updateProductService = async ({
  id,
  name,
  category,
  description,
  city,
  cities,
  isDelete,
}) => {
  const response = {
    code: 200,
    status: "success",
    message: "Product updated successfully",
    data: {},
  };

  try {
    const product = await Product.findOne({
      _id: id,
    }).exec();
    if (!product) {
      response.code = 422;
      response.status = "failed";
      response.message = "No Product data found";
      return response;
    }

    product.name = name ? name : product.name;
    product.category = category ? category : product.category;
    product.description = description ? description : product.description;
    product.city = city ? city : product.city;
    product.cities = cities ? cities : product.cities;

    await product.save();

    response.data.product = product;

    console.log(product);

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

// update Product
exports.updateApproveService = async ({ id, isApproved }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Product updated successfully",
    data: {},
  };


  try {
    const product = await Product.findOne({
      _id: id,
    }).exec();
    if (!product) {
      response.code = 422;
      response.status = "failed";
      response.message = "No Product data found";
      return response;
    }
    if (isApproved == false) {
      product.isApproved = false;
      await product.save();
      response.data.product = product;
      return response;
    }
    product.isApproved = isApproved ? isApproved : product.isApproved;

    await product.save();
    response.data.product = product;
    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

exports.updateApproveMany = async (req, res) => {
  const response = {
    code: 200,
    status: "success",
    message: "Product updated successfully",
    data: {},
  };

  const { data } = req.body;

  console.log(data);

  try {
    data.map((a) => {
      const f = Product.findByIdAndUpdate(
        a,
        { $set: { isApproved: true } },
        function (err, docs) {
        console.log(err)
        }
      );
    });
    res
      .status(200)
      .json({ status: "success", message: "Post updated successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong in /edit-order" });
  }
};

exports.deleteMany = async (req, res) => {
  const ids = req.body;

  console.log(ids);

  try {
    await Product.deleteMany(
      {
        _id: {
          $in: ids,
        },
      },
      function (err, result) {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      }
    );

    res
      .status(200)
      .json({ status: "success", message: "Deleted successfully" });
  } catch (e) {
    console.log(e);
    // res.status(500).json({ message: "Something went wrong in /edit-order" });
  }
};

// delete Products
exports.deleteProductService = async ({ id }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Delete Product successfully",
  };

  try {
    const product = await Product.findOne({
      _id: id,
      isDelete: false,
    });
    if (!product) {
      response.code = 404;
      response.status = "failed";
      response.message = "No Product data found";
      return response;
    }

    await product.remove();

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

// get all Products
exports.getUnApprovedService = async ({ page, size }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch Product list successfully",
    data: {},
  };

  try {
    const products = await Product.aggregate([
      { $sort: { isPremium: -1, _id: -1 } },
      {
        $match: {
          isApproved: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "posterId",
          foreignField: "_id",
          as: "owner",
        },
      },
    ]);

    if (products.length === 0) {
      response.code = 404;
      response.status = "failded";
      response.message = "No Product data found";
      return response;
    }

    response.data = {
      products,
    };

    return response;
  } catch (error) {
    console.log(error);
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again a";
    return response;
  }
};

exports.getApprovedService = async ({}) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch Product list successfully",
    data: {},
  };

  try {
    const products = await Product.aggregate([
      { $sort: { isPremium: -1, _id: -1 } },
      {
        $match: {
          isApproved: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "posterId",
          foreignField: "_id",
          as: "owner",
        },
      },
    ]);

    if (products.length === 0) {
      response.code = 404;
      response.status = "failded";
      response.message = "No Product data found";
      return response;
    }

    response.data = {
      products,
    };

    return response;
  } catch (error) {
    console.log(error);
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again a";
    return response;
  }
};

// get Products by search
exports.searchProductService = async ({ q }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Product data found successfully",
    data: {},
  };

  try {
    let query = { isDelete: false };
    if (q !== "undefined" || q !== undefined || q) {
      let regex = new RegExp(q, "i");
      query = {
        ...query,
        $or: [{ name: regex }, { category: regex }],
      };
    }

    response.data.products = await Product.find(query)
      .select("-__v -isDelete")
      .sort({ _id: -1 });

    if (response.data.products.length === 0) {
      response.code = 404;
      response.status = "failed";
      response.message = "No Product data found";
    }

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

// get one Products by id
exports.getOnlyUserPosts = async ({ id }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch deatiled Product successfully",
    data: {},
  };

  try {
    response.data.product = await Product.find({
      posterId: id,
      isDelete: false,
    })
      .sort({ _id: -1 })
      .select("-__v -isDelete")
      .exec();

    if (!response.data.product) {
      response.code = 404;
      response.status = "failed";
      response.message = "No Product found";
      return response;
    }

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

// get one Products by id
exports.getProductService = async ({ id }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch deatiled Product successfully",
    data: {},
  };

  try {
    response.data.product = await Product.findOne({
      _id: id,
      isDelete: false,
    })
      .select("-__v -isDelete")
      .exec();

    if (!response.data.product) {
      response.code = 404;
      response.status = "failed";
      response.message = "No Product found";
      return response;
    }

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};
