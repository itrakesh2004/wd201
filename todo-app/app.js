const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const { where } = require("sequelize");
const path=require("path");
app.use(bodyParser.json());
 
// set EJS as view engine
app.set("view engine", "ejs");

 

app.get("/",async(req,res)=>{
  const allTodos = await Todo.getTodos();
  const yesterday = await Todo.Overdue();
  const tomorrow = await Todo.duelater();
  const today = await Todo.duetoday();
 
  if(req.accepts("html")){
   res.render("index",{
    allTodos,yesterday,tomorrow,today,
   } );
  }else {
    res.json({allTodos})
  }

})

app.use(express.static(path.join(__dirname, "public")));

// app.get("/", function (request, response) {
//   response.send("Hello World");
// });

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE

  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  const todos = await Todo.findAll({})
  response.send(todos)
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE

  const id = request.params.id

  const isDeleted = await Todo.destroy({
    where:{
      id
    }
  })

  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  response.send(Boolean(isDeleted))
});


module.exports = app;

