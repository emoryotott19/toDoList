const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const items = [];
const workItems = [];

app.get("/", function(req, res) {

  const day = date.getDate();
  res.render("list", {listTitle: day, items: items});
})

app.post("/", function(req, res) {
  if (req.body.toDoEntry === "Work") {
    items.push(workItems);
  } else {
    items.push(item);
    res.redirect("/");
  }

})

app.get("/work", function(req, res) {
  res.render("list", {listTitle: "Work List", items: items});
})


app.post("/work", function(req,res) {
  const item = req.body.toDoEntry;
  workItems.push(item);
  res.redirect("/work");
})


app.listen(3000, function() {
  console.log("server running on port 3000");
})
