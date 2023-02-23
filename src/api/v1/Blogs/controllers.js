const { addBlogServices, getBlogsServices, updateBlogServices , deleteBlogServices } = require("./services");




exports.addBlog = async (req, res) => {

  const { status, code, message } = await addBlogServices({
    body: req.body,
    ...req.body,
  });
  res.status(code).json({ code, status, message });
};

exports.getBlog = async(req , res)=>{
  const {status , code , message, data} = await getBlogsServices({
    ...req.query,
  });
  if (data.blogs) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
}


  // update Blogs
  exports.updateBlogs = async (req, res) => {
    const { status, code, message, data } = await updateBlogServices({
      ...req.params,
      ...req.body,
    });
    if (data.blog) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };
  

  // update Blogs
  exports.deleteBlog = async (req, res) => {
    const { status, code, message } = await deleteBlogServices({
      ...req.params,
    });
    res.status(code).json({ code, status, message });
  };
  

  

