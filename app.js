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

const hasPriorityAndStatusPropertied = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.priority !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};
const hasTodoProperty = (requestQuery) => {
  return requestQuery.todo !== undefined;
};

app.get("/todos/", async (request, response) => {
  const { todo = "", priority, status } = request.query;
  let gettodoQuery = null;
  let responsedata = null;

  switch (true) {
    case hasPriorityAndStatusPropertied(request.query):
      gettodoQuery = ` 
    SELECT
    *
    FROM
    todo
    WHERE todo LIKE '%${todo}%' AND
    priority ='${priority}'AND status='${status}';`;
      break;

    case hasPriorityProperty(request.query):
      gettodoQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE todo LIKE '%${todo}%' AND
    priority ='${priority}';`;
      break;

    case hasStatusProperty(request.query):
      gettodoQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE todo LIKE '%${todo}%' AND
    status='${status}';`;
      break;

    default:
      gettodoQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE 
    todo='${todo}';`;
  }

  responsedata = await db.all(gettodoQuery);
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
        ${id},
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
  const { status, todo, priority } = todoDetails;
  let responsestring = null;
  let addQuery = null;
  switch (true) {
    case status !== undefined:
      responsestring = "Status";
      addQuery = `UPDATE
    todo
    SET 
    status='${status}'
    WHERE id=${todoId};`;
      break;

    case priority !== undefined:
      responsestring = "Priority";
      addQuery = `UPDATE
    todo
    SET 
    priority='${priority}'
     WHERE id=${todoId};`;
      break;

    case todo !== undefined:
      responsestring = "Todo";
      addQuery = `UPDATE
    todo
    SET
    todo='${todo}
     WHERE id=${todoId};`;
      break;
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

app.get("/todos/", async (request, response) => {
  const todoQuery = `SELECT * FROM todo;`;
  const dbtodoQuery = await db.all(todoQuery);
  response.send(dbtodoQuery);
});
module.exports = app;
