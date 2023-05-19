const { Product } = require("../models");

const cron = require("node-cron");

const updateDataStatus = async () => {
  const validate = await Product.find({ 
    $and: [
      { isDelete : false },
      { premiumDay : {  $gt: 0  } },
      { $project : {name : 1 , premiumDay : 1 , isPremium : 1}}
   ]
   });

  const minus = validate.map(async(a) => {
    a.premiumDay = a.premiumDay - 12;
    if (a.premiumDay == 0) {
      a.isPremium = true;
    }
    await a.save();
    
  });
};

cron.schedule("0 13 * * *", () => {
  updateDataStatus();

});




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
    console.error(error);

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
  subCategory,
  description,
  city,
  cities,
  email,
  phone,
  imgOne,
  imgTwo,
  imgThree,
  imgFour,
  age,
  link,
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
    product.link = link ? link : product.link;
    product.age = age ? age : product.age;
    product.category = category ? category : product.category;
    product.subCategory = subCategory ? subCategory : product.subCategory;
    product.description = description ? description : product.description;
    product.city = city ? city : product.city;
    product.cities = cities ? cities : product.cities;
    product.email = email ? email : product.email;
    product.phone = phone ? phone : product.phone;
    product.imgOne = imgOne ? imgOne : product.imgOne;
    product.imgTwo = imgTwo ? imgTwo : product.imgTwo;
    product.imgThree = imgThree ? imgThree : product.imgThree;
    product.imgFour = imgFour ? imgFour : product.imgFour;

    console.log(product, "product");

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
          console.log(err);
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

exports.getApprovedService = async ({ page, q }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch Product list successfully",
    data: {},
    totalPost: 0,
    todayPost: 0,
  };

  try {
    let query = { isDelete: false };

    const totalPost = await Product.countDocuments({});
    const today = new Date().toDateString();
    const todayPost = await Product.find({
      createdAt: { $gte: today },
    }).countDocuments({});
    const pageNumber = page ? parseInt(page) : 1;
    const limit = 10;

    if (q !== "undefined" || q !== undefined || q) {
      let regex = new RegExp(q, "i");

      query = {
        ...query,
        $or: [{ category: regex }, { subCategory: regex }],
      };
    }

    const products = await Product.find(query)
      .populate("posterId")
      .sort({ _id: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit);

    if (products.length === 0) {
      response.code = 404;
      response.status = "failded";
      response.message = "No Product data found";
      return response;
    }

    // response.postPerMonth = perMonthPost;
    response.totalPost = totalPost;
    response.todayPost = todayPost;
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

exports.getAllPosts = async ({ page, category, state }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch Product list successfully",
    data: {},
    pages: 0,
  };

  try {
    const pageNumber = page ? parseInt(page) : 1;
    const limit = 50;
    const totalDocs = await Product.find({
      subCategory: category,
      cities: { $elemMatch: { $eq: state } },
    }).countDocuments({});

    const products = await Product.aggregate([
      { $sort: { isPremium: 1, _id: -1 } },
      {
        $match: {
          subCategory: category,
          cities: { $elemMatch: { $eq: state } },
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
      { $skip: (pageNumber - 1) * limit },
      { $limit: limit },
      { $project: { name: 1, _id: 1, updatedAt: 1, isPremium: 1, age: 1 } },
    ]);

    if (products.length === 0) {
      response.code = 404;
      response.status = "failded";
      response.message = "No Product data found";
      return response;
    }

    response.pages = totalDocs;
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
exports.getOnlyUserPosts = async ({ id, page }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch deatiled Product successfully",
    data: {},
    pages: 0,
  };

  try {
    const pageNumber = page ? parseInt(page) : 1;
    const limit = 10;

    const allPosts = await Product.find({
      posterId: id,
      isDelete: false,
    }).countDocuments({});

    const posts = await Product.aggregate([
      { $match: { $expr: { $eq: ["$posterId", { $toObjectId: `${id}` }] } } },
      { $sort: { isPremium: -1, _id: -1 } },
      { $skip: (pageNumber - 1) * limit },
      { $limit: limit },
    ]);

    if (posts.length == 0) {
      response.code = 404;
      response.status = "failed";
      response.message = "No Product found";
      return response;
    }

    response.data = {
      posts,
    };
    response.pages = allPosts;

    return response;
  } catch (error) {
    console.log(error);
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

exports.getAdminUserPosts = async ({ id, page }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch deatiled Product successfully",
    data: {},
    page: 0,
  };
  try {
    const pageNumber = page ? parseInt(page) : 1;
    const limit = 8;

    const allPosts = await Product.find({
      posterId: id,
      isDelete: false,
    }).countDocuments({});

    response.data.product = await Product.find({
      posterId: id,
      isDelete: false,
    })

      .sort({ _id: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .select("-__v -isDelete")
      .exec();

    if (!response.data.product) {
      response.code = 404;
      response.status = "failed";
      response.message = "No Product found";
      return response;
    }

    response.page = allPosts;
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
    response.data.product = await Product.aggregate([
      { $match: { $expr: { $eq: ["$_id", { $toObjectId: `${id}` }] } } },
      {
        $lookup: {
          from: "users",
          localField: "posterId",
          foreignField: "_id",
          as: "owner",
        },
      },
    ]);

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
