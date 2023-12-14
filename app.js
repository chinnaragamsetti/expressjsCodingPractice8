const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbpath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDb = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at port");
    });
  } catch (error) {
    console.log(error.message);
  }
};
initializeDb();

const hasPriorityAndStatusPropertied(requestQuery)=()=>{
    return requestQuery.status!==undefined & requestQuery.priority!==undefinde
}

const hasPriorityProperty(requestQuery)=()=>{
    return requestQuery.priority!==undefined
}

const hasStatusProperty(requestQuery)=()=>{
return requestQuery.status!==undefined
}
const hasTodoProperty(requestQuery)=()=>{
return requestQuery.todo!==undefined
}

app.get("/todos/", async (request, response) => {
  const {todo,priority,status}=request.query;
 let gettodoQuery=null;
 let responsedata=null;


switch (true){
    case hasPriorityAndStatusPropertied(request.query):
    gettodoQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE
    priority ='${priority}'AND status='${status}';
    `;

    case hasPriorityProperty(request.query):
    gettodoQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE
    priority ='${priority}';
    `;
    case hasStatusProperty(request.query):
    gettodoQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE
    status='${status}';
    `;

    case hasTodoProperty(request.query):
    gettodoQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE
    todo='${todo}';
    `;

}

  
  const responsedata= await db.all(gettodoQuery);
  response.send(responsedata);
});

app.post("/todos/", async (request, response) => {
  const todoDetails = request.body;
  const { id, todo, priority, status } = todoDetails;
  const addQuery = `
    INSERT INTO 
    todo{id,todo,priority,status}
    VALUES 
    (
        '${id}',
         '${todo}',
          '${priority}',
           '${status}'
    );`;
  await db.run(addQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { status,todo,priority} = todoDetails;
  let responsestring=null;
let addQuery=null;
switch (true){
case status!==undefined:
    responsestring=status;
    addQuery = `UPDATE
    todo
    SET 
    status='${status};`;
case priority!==undefined:
    responsestring=priority;
    addQuery = `UPDATE
    todo
    SET 
    priority='${priority};`;

case todo!==undefined:
    responsestring=todo;
    addQuery = `UPDATE
    todo
    SET
    todo='${todo};`;

  }
 
  await db.run(addQuery);
  response.send(`${responsestring} Updated`);
});

app.delete("/todos/:todiId/", async (request, response) => {
  const { todoId } = request.params;
  const deletetodoQuery = `
    DELETE FROM
    todo
    WHERE 
    id=${todoId};
    `;
  await db.run(deletetodoQuery);
  response.send("Todo Deleted");
});
module.exports = app;
