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

exports.getApprovedService = async ({ page }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch Product list successfully",
    data: {},
    totalPost: 0,
    postPerMonth: 0,
  };


  try {
    const totalPost = await Product.countDocuments({});

    // const todaypost = await Product.find({});
    // const year = new Date().getFullYear();
    // const todayDay = new Date().getDate();
    // const query = (posts) => {
    //   const Jan = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "1" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const Feb = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "2" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const Mar = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "3" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const Apr = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "4" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const May = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "5" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const Jun = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "6" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const Jul = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "7" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const Aug = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "8" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const Oct = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "9" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const Sep = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "10" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const Nov = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "11" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const Dec = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[0] == "12" &&
    //       new Date(a.createdAt).toLocaleDateString().split("/")[2] == year
    //   );
    //   const today = posts.filter(
    //     (a) =>
    //       new Date(a.createdAt).toLocaleDateString().split("/")[1] == todayDay
    //   );

    //   const month = [
    //     Jan.length,
    //     Feb.length,
    //     Mar.length,
    //     Apr.length,
    //     May.length,
    //     Jun.length,
    //     Jul.length,
    //     Aug.length,
    //     Sep.length,
    //     Oct.length,
    //     Nov.length,
    //     Dec.length,
    //     { today: today.length },
    //   ];

    //   return month;
    // };
    // const perMonthPost = query(todaypost);



    const pageNumber = page ? parseInt(page) : 1;
    const limit = 10;

    const products = await Product.aggregate([
      { $sort: { isPremium: -1, _id : -1 } },
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
      { $skip: (pageNumber - 1) * limit },
      { $limit: limit },
    ]);

    if (products.length === 0) {
      response.code = 404;
      response.status = "failded";
      response.message = "No Product data found";
      return response;
    }

    // response.postPerMonth = perMonthPost;
    response.totalPost = totalPost;
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

exports.getAllPosts = async ({ page, category }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch Product list successfully",
    data: {},
  };

  try {
    const pageNumber = page ? parseInt(page) : 1;
    const limit = 50;
    const totalDocs = await Product.countDocuments({});
    const totalPage = Math.ceil(totalDocs / limit);

    const products = await Product.aggregate([
      {
        $match: {
          isApproved: true,
        },
      },
      {
        $match: {
          subCategory: category,
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
      { $sort: { isPremium: -1, _id: -1 } },
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
