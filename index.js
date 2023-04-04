const app = require('./app');
const { PORT, HOST } = require('./src/api/v1/config');

app.listen(PORT, HOST, () => {
  console.log(`Server started on ${HOST}:${PORT}, url http://${HOST}:${PORT}`);
});

module.exports = (req, res) => {
  // res.send("Hello, World!")
  // res.status(500).json({message: "Something went wrong!"}) 
  res.json({message: "Hellos, World!"})
}
