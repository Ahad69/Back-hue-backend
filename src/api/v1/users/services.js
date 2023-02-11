const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwtToken = ({ _id, firstName, lastName, avater }) => {
  return jwt.sign(
    { _id, firstName, lastName, avater },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

exports.addUserService = async (req, res) => {
  const { firstName, lastName, email, address, password, avater } = req.body;
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
        message: "Invalid password"  ,
      });
    }
  } catch (error) {
    res.status(401).json({
      Success: false,
      code: 401,
      message: "Invalid Credential",
      error : error
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
exports.updateUserService = async ({
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
    message: "User updated successfully",
    data: {},
  };

  try {
    const User = await User.findOne({
      _id: id,
    }).exec();
    if (!User) {
      response.code = 422;
      response.status = "failed";
      response.message = "No User data found";
      return response;
    }

    User.name = name ? name : User.name;
    User.category = category ? category : User.category;
    User.description = description ? description : User.description;
    User.city = city ? city : User.city;
    User.cities = cities ? cities : User.cities;

    await User.save();

    response.data.User = User;

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

// update Users
exports.updatePremiumService = async ({ id, isDelete }) => {
  const response = {
    code: 200,
    status: "success",
    message: "User updated successfully",
    data: {},
  };

  try {
    const User = await User.findOne({
      _id: id,
    }).exec();
    if (!User) {
      response.code = 422;
      response.status = "failed";
      response.message = "No User data found";
      return response;
    }

    console.log(User);

    User.isDelete = isDelete ? isDelete : User.isDelete;

    console.log(User);

    await User.save();

    response.data.User = User;

    return response;
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
  console.log(id);
  try {
    const User = await User.findOne({
      _id: id,
      isDelete: false,
    });
    if (!User) {
      response.code = 404;
      response.status = "failed";
      response.message = "No User data found";
      return response;
    }

    await User.remove();

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
    response.data.User = await User.findOne({
      _id: id,
      isDelete: false,
    })
      .select("-__v -isDelete")
      .exec();

    if (!response.data.User) {
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
