const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwtToken = ({
  _id,
  firstName,
  lastName,
  avater,
  email,
  role,
}) => {
  return jwt.sign(
    { _id, firstName, lastName, avater, email, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

exports.addUserService = async (req, res) => {
  const { firstName, lastName, email, address, password, avater , month } = req.body;
  try {
    User.findOne({ email: email }).exec(async (error, user) => {
      if (user)
        return res.status(400).json({
          error: "User already registered",
        });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
		month,
        avater,
        password: hashedPassword,
        address,
      });

      await newUser.save();
      return res.status(201).json({ message: "success", newUser });
    });
  } catch (error) {
    res.status(500).json({ message: "Invalid" });
  }
};

exports.signinUsers = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).json({
        Success: false,
        code: 401,
        message: "User Not Found",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (isPasswordMatched) {
      const token = generateJwtToken({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avater: user.avater,
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        message: "success",
        token,
        user,
      });
    } else {
      return res.status(422).json({
        Success: false,
        code: 422,
        message: "Invalid password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      Success: false,
      code: 401,
      message: "Invalid Credential a",
      error: error,
    });
  }
};

// get all Users
exports.getUsersService = async (req, res) => {
  const { q } = req.query;

  let query = { isDelete: false };
  if (q !== "undefined" || q !== undefined || q) {
    let regex = new RegExp(q, "i");
    query = {
      ...query,
      $or: [{ firstName: regex }, { email: regex }, { lastName: regex }],
    };
  }

  const totalDocuments = await User.countDocuments(query);

  User.find(query)
    .select("-__v -isDelete ")
    .sort({ _id: -1 })
    .lean()
    .exec((error, users) => {
      if (error) return res.status(400).json({ error });
      if (users) {
        res.status(200).json({ users, totalDocuments });
      }
    });
};

// update Users
exports.updateUserAddressService = async ({
  id,
  city,
  zipCode,
  regionName,
  country,
}) => {
  const response = {
    code: 200,
    status: "success",
    message: "User updated successfully",
    data: {},
  };

  console.log(id, city, zipCode, regionName, country);
  try {
    const user = await User.findOne({
      _id: id,
    }).exec();
    if (!User) {
      response.code = 422;
      response.status = "failed";
      response.message = "No User data found";
      return response;
    }

    user.address.country = country ? country : user.address.country;
    user.address.zipCode = zipCode ? zipCode : user.address.zipCode;
    user.address.city = city ? city : user.address.city;
    user.address.regionName = regionName ? regionName : user.address.regionName;

    await user.save();

    response.data.user = user;

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

exports.updateUserService = async ({
  id,
  firstName,
  lastName,
  email,
  phone,
  avater,
}) => {
  const response = {
    code: 200,
    status: "success",
    message: "User updated successfully",
    data: {},
  };

  try {
    const user = await User.findOne({
      _id: id,
    }).exec();
    if (!User) {
      response.code = 422;
      response.status = "failed";
      response.message = "No User data found";
      return response;
    }

    user.firstName = firstName ? firstName : user.firstName;
    user.lastName = lastName ? lastName : user.lastName;
    user.email = email ? email : user.email;
    user.phone = phone ? phone : user.phone;
    user.avater = avater ? avater : user.avater;

    await user.save();

    response.data.user = user;

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

// update Users
exports.updatePassordService = async ({ id, password , oldPassword}) => {
  const response = {
    code: 200,
    status: "success",
    message: "User updated successfully",
    data: {},
  };

  try {
    const user = await User.findOne({
      _id: id,
    }).exec();
    if (!user) {
      response.code = 422;
      response.status = "failed";
      response.message = "No User data found";
      return response;
    }

    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

    if(isPasswordMatched){
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword ? hashedPassword : user.password;
  
      await user.save();
  
      response.data.user = user;
  
      return response;
    }else{

      response.code = 422;
      response.status = "failed";
      response.message = "Old pass is wrong";
      return response;
    }
 
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};



// delete Users
exports.deleteUserService = async ({ id }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Delete User successfully",
  };

  try {
    const user = await User.findOne({
      _id: id,
      isDelete: false,
    });
    if (!user) {
      response.code = 404;
      response.status = "failed";
      response.message = "No User data found";
      return response;
    }

    await user.remove();

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

// get Users by search
exports.searchUserService = async ({ q }) => {
  const response = {
    code: 200,
    status: "success",
    message: "User data found successfully",
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

    response.data.Users = await User.find(query)
      .select("-__v -isDelete")
      .sort({ _id: -1 });

    if (response.data.Users.length === 0) {
      response.code = 404;
      response.status = "failed";
      response.message = "No User data found";
    }

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

// get one Users by id
exports.getUserService = async ({ id }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Fetch deatiled User successfully",
    data: {},
  };

  try {
    response.data.user = await User.findOne({
      _id: id,
      isDelete: false,
    })
      .select("-__v -isDelete")
      .exec();

    if (!response.data.user) {
      response.code = 404;
      response.status = "failed";
      response.message = "No User found";
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



exports.increaseUserCredit = async (id, amount) => {
  console.log(id, amount);
  const user = await User.findOne({
    _id: id,
  }).exec();
  console.log({ user })

  user.credit = user.credit ? parseFloat(user.credit) + amount : amount;

  await user.save();
};