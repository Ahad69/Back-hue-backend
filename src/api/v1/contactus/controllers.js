const { addContactervices , getContactServices , updateContactervices , deleteContactervices } = require("./services");




exports.addAbout = async (req, res) => {

  const { status, code, message } = await addContactervices({
    body: req.body,
    ...req.body,
  });
  res.status(code).json({ code, status, message });
};

exports.getAbout = async(req , res)=>{
  const {status , code , message, data} = await getContactServices({
    ...req.query,
  });
  if (data.contact) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
}


  // update Abouts
  exports.updateAbouts = async (req, res) => {
    const { status, code, message, data } = await updateContactervices({
      ...req.params,
      ...req.body,
    });
    if (data.contact) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };
  

  // update Abouts
  exports.deleteAbout = async (req, res) => {
    const { status, code, message } = await deleteContactervices({
      ...req.params,
    });
    res.status(code).json({ code, status, message });
  };
  

  

