const { Blogs } = require("../models");

exports.addBlogServices = async ({ body }) => {
  const response = {
    code: 201,
    status: "success",
    message: "Blog added successfully",
  };

  try {
    const newProduct = new Blogs(body);
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

exports.getBlogsServices = async ({ q, page, cat }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch Blog list successfully",
    data: {},
    page: 0,
  };

  const regex = new RegExp(q, "i");
  const catregex = new RegExp(cat, "i");

  console.log(cat);

  try {
    const pageNumber = page ? parseInt(page) : 1;
    const limit = 6;
    const skipCount = (pageNumber - 1) * limit;

    let forPage = {};
    if (q && cat) {
      forPage = {
        category: catregex,
        title: regex,
      };
    } else if (q) {
      forPage = { title: regex };
    } else if (cat) {
      forPage = { category: catregex };
    } else {
      forPage = {};
    }

    let matchStage = {};
    if (q && cat) {
      matchStage.$match = {
        category: catregex,
        title: regex,
      };
    } else if (q) {
      matchStage.$match = { title: regex };
    } else if (cat) {
      matchStage.$match = { category: catregex };
    } else {
      matchStage.$match = {};
    }

    const blogs = await Blogs.aggregate([
      matchStage,
      {
        $sort: { _id: -1 },
      },
      { $skip: skipCount },
      {
        $limit: limit,
      },
      {
        $project: {
          permalink: 1,
          title: 1,
          category: 1,
          image: 1,
        },
      },
    ]);

    if (blogs.length === 0) {
      response.code = 404;
      response.status = "failded";
      response.message = "No Product data found";
      return response;
    }

    // const totalBlogs = await Blogs.countDocuments({}, { maxTimeMS: 20000 });
    const totalBlogs = await Blogs.find(forPage).countDocuments({});
    response.page = totalBlogs;
    response.data = {
      blogs,
    };

    return response;
  } catch (error) {
    console.log(error);
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

exports.singleBlogServices = async ({ q }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch Blog list successfully",
    data: {},
  };

  try {
    const blog = await Blogs.find({ permalink: q });
    if (!blog) {
      response.code = 404;
      response.status = "failed";
      response.message = "Error. Try again";
      return response;
    }

    response.data = { blog };

    return response;
  } catch (error) {
    console.log(error);
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again a";
    return response;
  }
};

// update blogs
exports.updateBlogServices = async ({
  id,
  title,
  category,
  subCategory,
  desc,
  image,
  writer,
  status,
  permalink,
  metaDesc,
  metaKey,
}) => {
  const response = {
    code: 200,
    status: "success",
    message: "Blog  updated successfully",
    data: {},
  };

  try {
    const blog = await Blogs.findOne({
      _id: id,
    }).exec();
    if (!blog) {
      response.code = 422;
      response.status = "failed";
      response.message = "No Product data found";
      return response;
    }

    blog.title = title ? title : blog.title;
    blog.permalink = permalink ? permalink : blog.permalink;
    blog.category = category ? category : blog.category;
    blog.subCategory = subCategory ? subCategory : blog.subCategory;
    blog.desc = desc ? desc : blog.desc;
    blog.image = image ? image : blog.image;
    blog.writer = writer ? writer : blog.writer;
    blog.status = status ? status : blog.status;
    blog.metaDesc = metaDesc ? metaDesc : blog.metaDesc;
    blog.metaKey = metaKey ? metaKey : blog.metaKey;

    await blog.save();

    response.data.blog = blog;

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

exports.deleteBlogServices = async ({ id }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Delete Product successfully",
  };

  try {
    const blog = await Blogs.findOne({
      _id: id,
      isDelete: false,
    });
    if (!blog) {
      response.code = 404;
      response.status = "failed";
      response.message = "No Product data found";
      return response;
    }

    await blog.remove();

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

exports.deleteMany = async (req, res) => {
  const ids = req.body;

  try {
    await Blogs.deleteMany(
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

exports.updatePauseMany = async (req, res) => {
  const response = {
    code: 200,
    status: "success",
    message: "Product updated successfully",
    data: {},
  };

  const { data } = req.body;

  try {
    data.map((a) => {
      const f = Blogs.findByIdAndUpdate(
        a,
        { $set: { status: "paused" } },
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

exports.updatePablishMany = async (req, res) => {
  const response = {
    code: 200,
    status: "success",
    message: "Product updated successfully",
    data: {},
  };

  const { data } = req.body;
  try {
    data.map((a) => {
      const f = Blogs.findByIdAndUpdate(
        a,
        { $set: { status: "published" } },
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
