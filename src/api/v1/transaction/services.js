const { Transactions } = require("../models");

exports.addTransactionServices = async ({ body }) => {
  const response = {
    code: 201,
    status: "success",
    message: "Transaction added successfully",
  };

  try {
    const newTransaction = new Transactions(body);
    await newTransaction.save();
    return response;
  } catch (error) {
    console.log(error);
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

exports.getTransactionsServices = async ({ q }) => {
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
        $or: [{ email: regex }, { date: regex } ,  { invoice: regex }],
      };
    }

    response.data.transactions = await Transactions.find(query)
      .populate("userId")
      .select("-__v -isDelete")
      .sort({ _id: -1 });

    if (response.data.transactions.length == 0) {
      response.code = 404;
      response.status = "failed";
      response.message = "No User data found";
	return response
    }
	
    return response;
  } catch (error) {
    console.log(error);
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again a";
    return response;
  }
};

// update Transactions
exports.updateTransactionServices = async ({ id, isRead }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Transaction  updated successfully",
    data: {},
  };

  try {
    const transactions = await Transactions.findOne({
      _id: id,
    }).exec();
    if (!Transactions) {
      response.code = 422;
      response.status = "failed";
      response.message = "No Product data found";
      return response;
    }

    transactions.isRead = isRead ? isRead : transactions.isRead;

    await transactions.save();

    response.data.transactions = transactions;

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

exports.deleteTransactionServices = async ({ id }) => {
  const response = {
    code: 200,
    status: "success",
    message: "Delete Product successfully",
  };

  try {
    const Transactions = await Transactions.findOne({
      _id: id,
      isDelete: false,
    });
    if (!Transactions) {
      response.code = 404;
      response.status = "failed";
      response.message = "No Product data found";
      return response;
    }

    await Transactions.remove();

    return response;
  } catch (error) {
    response.code = 500;
    response.status = "failed";
    response.message = "Error. Try again";
    return response;
  }
};

// exports.updatedTransactionStatus = async (id, isCompleted) => {
 
//   console.log(id, isCompleted)

//   const trans = await Transactions.findOne({
//     userId: id,

//   }).exec();

//   // trans.isCompleted = isCompleted ?  isCompleted : trans.isCompleted;
//   console.log(trans)
//   // await user.save();
// };
