const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb+srv://admin-emory:N!5HNTO$4m0P@cluster0.kfgjy.mongodb.net/toDoListDB?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology: true });


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const default1 = new Item ({
  name: "Welcome to your to do list",
});

const default2 = new Item ({
  name: "Hit the + button to add a new item",
});

const default3 = new Item ({
  name: "<-- Hit this to delete an item",
});

const defaultItems = [default1, default2, default3];

const listSchema = {
  name: String,
  items: [itemsSchema],
}

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  Item.find({}, function(err,results) {
    if (err) {
      console.log(err);
    } else {
      if (results.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default items to DB");
            res.redirect("/")
          }
        });
      }
      res.render("list", {listTitle: "Today", listItems: results});
    }
  });

});

app.post("/", function(req, res) {

  const newItemName = req.body.toDoEntry;
  const listName = req.body.list;

  const newItem = new Item ({
    name: newItemName,
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
});

app.post("/delete", function(req, res) {

  const checkedItemName = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.deleteOne({name: checkedItemName}, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Succesfully deleted checked item");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {name: checkedItemName}}}, function(err, foundList) {
      if(!err) {
        res.redirect("/" + listName);
      }
    }
    )
  }

});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();

        res.redirect("/" + customListName);
      } else {
        res.render("list", {listTitle: foundList.name, listItems: foundList.items});
      }
    }
  });
});

let port = proccess.env.PORT;
if (port === null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("server has started succesfully");
});
