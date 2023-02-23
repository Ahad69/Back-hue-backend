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

exports.getBlogsServices = async ({}) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch Blog list successfully",
    data: {},
  };

  try {
    const blogs = await Blogs.aggregate([{ $sort: { _id: -1 } }]);

    if (blogs.length === 0) {
      response.code = 404;
      response.status = "failded";
      response.message = "No Product data found";
      return response;
    }

    response.data = {
      blogs,
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

// update blogs
exports.updateBlogServices = async ({
  id,
  title,
  category,
  desc,
  image,
  writer,
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
    blog.category = category ? category : blog.category;
    blog.desc = desc ? desc : blog.desc;
    blog.image = image ? image : blog.image;
    blog.writer = writer ? writer : blog.writer;

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
