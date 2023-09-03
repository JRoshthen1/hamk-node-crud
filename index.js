const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
var jsonDB = require("@syamdanda/json-base");
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Define the Database and Table name
const options = {
  database: "tasksDB",
  tableName: "tasksTable"
}
// serve the static content
app.get("/", (req, res) => {
  res.sendFile("index.html");
});
// ENDPOINT TO FETCH ALL TASKS FROM DATABSE

app.get("/fetch-tasks", async (req, res) => {
  try {
    jsonDB.getAllRecords(
      { database: "tasksDB", tableName: "tasksTable" },
      (response) => {
      res.status(200).send(response); // client message
      }
    );
  } catch (error) {
    console.error("Error occurred while fetching tasks:", error);
    res.status(500).send(error)
  }
});

// ENDPOINT TO CREATE TASK
app.post("/create-task", async (req, res) => {
  const data = req.body;
  options["record"] = data
  try {
    jsonDB.insertRecord(options, (response) => {
      res.status(200).send({ msg: response }); // client message
    });
  } catch (error) {
      res.status(500).send(error); // client message
  }
});

// ENDPOINT TO UPDATE TASK
app.post("/update-task", async (req, res) => {
  const data = req.body;
  options["recordId"] = data.id
  delete data.id
  options["recordObj"] = data
  try {
    jsonDB.updateRecordById(options, (response) => {
      res.status(200).json({ msg: response }); // client message
    });
  } catch (error) {
      res.status(500).send(error); // client message
  }
});


// ENDPOINT TO DELETE TASK
app.post("/delete-task", async (req, res) => {
  const id = req.body.id;
  options["recordId"] = id
  try {
    jsonDB.deleteRecordById(options, (response) => {
      res.status(200).json({ msg: response }); // client message
    });
  } catch (error) {
      res.status(500).send(error); // client message
  }
});


// // ENDPOINT TO CHECK THE DATABASE AND CREATE IT IF NEEDED
// app.get("/check-db", async (req, res) => {
//   const jsonFileName = "./tasksDB/jsonDB-config.json";
//   if (!fs.existsSync(jsonFileName)) {
//     try {
//       const responseCreateDb = await new Promise((resolve, reject) => {
//         jsonDB.createDatabase({ name: options.database }, resolve, reject);
//       });
//       console.info("Database has been successfully created!", responseCreateDb);
//       //only continue with the table generation once we have confirmed the db was created
//       const responseCreateTable = await new Promise((resolve, reject) => {
//         jsonDB.createTable(options,
//           resolve,
//           reject
//         );
//       });
//       console.info(
//         "Table has also been successfully created!",
//         responseCreateTable
//       );
//     } catch (error) {
//         throw error;
//     } finally {
//       res.status(200).json({ msg: "" })
//     }
//   } else {
//     res.send("The Database already exists.");
//   }
// });

// app.get("/delete-db", async (req, res) => {
//   const jsonFileName = "./tasksDB/jsonDB-config.json";
//   if (fs.existsSync(jsonFileName)) {
//     try {
//       jsonDB.dropDatabase({name: options.database}, (response) =>{
//         res.send("Database was Deleted")
//       });
//     } catch (error) {
//       throw error;
//     }
//   }
//   })




app.listen(42424, () => {
  console.log("App running on 42424");
});
