const { addAboutServices, getAboutsServices, updateAboutServices , deleteAboutServices } = require("./services");




exports.addAbout = async (req, res) => {

  const { status, code, message } = await addAboutServices({
    body: req.body,
    ...req.body,
  });
  res.status(code).json({ code, status, message });
};

exports.getAbout = async(req , res)=>{
  const {status , code , message, data} = await getAboutsServices({
    ...req.query,
  });
  if (data.abouts) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
}


  // update Abouts
  exports.updateAbouts = async (req, res) => {
    const { status, code, message, data } = await updateAboutServices({
      ...req.params,
      ...req.body,
    });
    if (data.abouts) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };
  

  // update Abouts
  exports.deleteAbout = async (req, res) => {
    const { status, code, message } = await deleteAboutServices({
      ...req.params,
    });
    res.status(code).json({ code, status, message });
  };
  

  

