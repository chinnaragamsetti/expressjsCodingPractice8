const express = require("express");
const path = require("path");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbpath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDb = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite.Database,
    });
    app.listen(3000, () => {
      console.log("server running at port");
    });
  } catch (error) {
    console.llog(error.message);
  }
};
initializeDb();

app.get("/todos/", async (request, response) => {
  const { status } = request.query;

  const getstatusQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE
    status='${status}';
    `;
  const responsedb = await db.all(getstatusQuery);
  response.send(responsedb);
});

app.get("/todos/", async (request, response) => {
  const { priority } = request.query;

  const getstatusQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE
    priority='${priority}';
    `;
  const responsedb = await db.all(getstatusQuery);
  response.send(responsedb);
});

app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;

  const getstatusQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE
    priority='${priority}'
    status='${status}';
    `;
  const responsedb = await db.all(getstatusQuery);
  response.send(responsedb);
});

app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;

  const getstatusQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE
    todo='${search_q}';
    `;
  const responsedb = await db.all(getstatusQuery);
  response.send(responsedb);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const getstatusQuery = ` 
    SELECT
    *
    FROM 
    todo
    WHERE 
    id='${todoId}';
    `;
  const responsedb = await db.all(getstatusQuery);
  response.send(responsedb);
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
  const { bookId } = request.params;
  const todoDetails=request.body;
  const {status}=todoDetails;

  const addQuery = `UPDATE
  todo
  SET 
  status='${status};`;
    I
  await db.run(addQuery);
  response.send("Todo Updated");
});

app.delete('/todos/:todiId/',(request,response)=>{

    const {todoId}=request.params;
    const deletetodoQuery=`
    DELETE FROM
    todo
    WHERE 
    id=${todoId};
    `;
    await db.run(deletetodoQuery);
    response.send('Todo Deleted');

});
