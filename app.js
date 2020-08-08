const express = require("express");
const bodyParser = require("body-parser");


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {

  var today = new Date();

  var options = {
    weekday: "long",
    day : "numeric",
    month: "long"
  };

  var date = today.toLocaleDateString("en-US", options);

  res.render("list", {date: date})
})

app.post("/", function(req, res) {
  console.log(req.body.toDoEntry);
})


app.listen(3000, function() {
  console.log("server running on port 3000");
})
