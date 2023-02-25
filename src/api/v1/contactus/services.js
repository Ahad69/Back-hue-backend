const { Contact } = require("../models");

exports.addContactervices = async ({ body }) => {
  const response = {
    code: 201,
    status: "success",
    message: "About added successfully",
  };

  try {
    const newAbout = new Contact(body);
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

exports.getContactServices = async ({}) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch About list successfully",
    data: {},
  };

  try {
    const contact = await Contact.aggregate([
      { $sort: { _id: -1 } },
    
    ]);

    if (contact.length === 0) {
      response.code = 404;
      response.status = "failded";
      response.message = "No Product data found";
      return response;
    }

    response.data = {
      contact,
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

// update Contact
exports.updateContactervices = async ({
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
    const contact = await Contact.findOne({
      _id: id,
    }).exec();
    if (!contact) {
      response.code = 422;
      response.status = "failed";
      response.message = "No Product data found";
      return response;
    }

    contact.text = text ? text : contact.text;


    await contact.save();

    response.data.contact = contact;

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

exports.deleteContactervices = async ({ id }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Delete Product successfully",
  };

  try {
    const about = await Contact.findOne({
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
