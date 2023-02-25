const { Abouts } = require("../models");

exports.addAboutServices = async ({ body }) => {
  const response = {
    code: 201,
    status: "success",
    message: "About added successfully",
  };

  try {
    const newAbout = new Abouts(body);
    await newAbout.save();
    return response;
  } catch (error) {
    console.log(error);
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

exports.getAboutsServices = async ({}) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch About list successfully",
    data: {},
  };

  try {
    const abouts = await Abouts.aggregate([
      { $sort: { _id: -1 } },
    
    ]);

    if (abouts.length === 0) {
      response.code = 404;
      response.status = "failded";
      response.message = "No Product data found";
      return response;
    }

    response.data = {
      abouts,
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

// update Abouts
exports.updateAboutServices = async ({
  id,
  text,

}) => {
  const response = {
    code: 200,
    status: "success",
    message: "About  updated successfully",
    data: {},
  };

  try {
    const abouts = await Abouts.findOne({
      _id: id,
    }).exec();
    if (!abouts) {
      response.code = 422;
      response.status = "failed";
      response.message = "No Product data found";
      return response;
    }

    abouts.text = text ? text : abouts.text;


    await abouts.save();

    response.data.abouts = abouts;

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

exports.deleteAboutServices = async ({ id }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Delete Product successfully",
  };

  try {
    const about = await Abouts.findOne({
      _id: id,
      isDelete: false,
    });
    if (!about) {
      response.code = 404;
      response.status = "failed";
      response.message = "No Product data found";
      return response;
    }

    await about.remove();

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};
