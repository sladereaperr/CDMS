/*
Crime TABLE:
crime_id | officer_ID | user_ID | Type_of_Crime  | Exact_Crime | Date_of_Crime | Time_of_Crime | Location    | Description | Victim_Name   | Victim_Contact | Reported_By | Arrest_Date | Case_Status

Criminal TABLE:
| criminal_id | crime_ID | Name | Date_of_Birth | Status | Gender | Height | Weight | Eye_Color | Hair_Color | Skin_Tone | Build | Tattoos | No_of_Tattoos | Blood_Type | Known_Aliases | Crime_Category | Convictions | Last_Known_Address | Warrant_Status | Phone_Number | Known_Email_Address   

Officer TABLE:
officer_id | ranking    | badge_number | status   | assigned_cases

User TABLE:
user_id | username | password |  email | phone_number | role | status

UserProfile TABLE:
user_id | first_name | last_name | phone_number | profile_picture | address | date_of_birth

Evidence TABLE:
evidence_id | crime_id | report_id | officer_id | evidence_type | collection_date     | storage_location            | description

Report TABLE:
report_id | officer_id | details | report_date | summary

AuditLog TABLE:
log_id | user_id | action_type | action_timestamp    | status  | details

Commits_Crime TABLE:
crime_id | criminal_id

Investigates TABLE:
officer_ID | crime_ID
*/

const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const app = express();
const port = 3001;
const cors = require("cors");
app.use(cors());
app.use(express.json());
var fs = require("fs");
var readline = require("readline");

const sql_password = process.env.SQL_PASSWORD;
const dbname = "CDMS";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: sql_password,
});

db.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");

  checkDatabaseExists(dbname);
});

async function checkDatabaseExists(dbname) {
  try {
    // Query to check if the database exists in the information_schema
    const results = await queryDatabase(
      `SELECT COUNT(*) AS dbExists FROM information_schema.schemata WHERE schema_name = ?`,
      [dbname]
    );

    const dbExists = results[0].dbExists > 0;

    if (!dbExists) {
      console.log("Database doesn't exist, creating it...");
      await createDB(); // Create the database if it doesn't exist
    } else {
      console.log("Database already exists.");
      // Now that the database exists, reconnect to it
      db.changeUser({ database: dbname }, (err) => {
        if (err) {
          console.error("Error switching to the database:", err);
        } else {
          console.log(`Successfully switched to the ${dbname} database.`);
        }
      });
    }
  } catch (err) {
    console.error("Error checking database:", err);
  }
}

// Helper function to execute a query
function queryDatabase(query, params) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Function to create the database and run the setup SQL script
async function createDB() {
  try {
    // Create the database if it doesn't exist
    await executeQuery(`CREATE DATABASE IF NOT EXISTS ${dbname}`);
    console.log(`Database ${dbname} created successfully.`);

    // Now switch to the new database
    db.changeUser({ database: dbname }, (err) => {
      if (err) {
        console.error("Error switching to the new database:", err);
      } else {
        console.log(`Successfully switched to the ${dbname} database.`);
      }
    });

    // Now execute the setup SQL script
    const rl = readline.createInterface({
      input: fs.createReadStream("./setup.sql"),
      terminal: false,
    });

    let buffer = "";

    for await (const chunk of rl) {
      buffer += chunk;
      if (buffer.trim().endsWith(";")) {
        await executeQuery(buffer); // Ensure execution waits for completion
        buffer = "";
      }
    }

    if (buffer.trim()) {
      await executeQuery(buffer); // In case the last part doesn't end with a semicolon
    }

    console.log("Finished reading and executing SQL file.");
  } catch (err) {
    console.error("Error reading or executing SQL file:", err);
  }
}

// Function to execute a query
function executeQuery(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

app.post("/login", (req, res) => {
  const { Username, Password } = req.body;
  const sql =
    "SELECT u.role, up.first_name, u.user_id FROM User u JOIN UserProfile up ON u.user_id = up.user_id WHERE u.username = ? AND u.password = ?;";

  db.query(sql, [Username, Password], (err, result) => {
    if (err) {
      return res.status(500).send("Server Error" + err);
    }
    if (result.length > 0) {
      const user = result[0];
      res.json({
        role: user.role,
        firstName: user.first_name,
        id: user.user_id,
      });
    } else {
      res.json({ role: "", firstName: "", id: "" });
    }
  });
});

app.post("/", (req, res) => {
  const { Username, Password } = req.body;
  const sql =
    "select role, first_name from user where username = ? and password = ?";
  db.query(sql, [Username, Password], (err, result) => {
    if (err) {
      return res.status(500).send("Server Error");
    }
    if (result.length > 0) {
      const user = result[0]; // Get the first user object
      res.json({ role: user.role, firstName: user.first_name }); // Send only the necessary data
    } else {
      res.json({ role: "", firstName: "" }); // Also return firstName as an empty string
    }
  });
});

app.post("/UserHome", (req, res) => {
  const {
    Type_of_Crime,
    Exact_Crime,
    Date_of_Crime,
    Time_of_Crime,
    Location,
    Victim_Name,
    Victim_Contact,
    user_id,
  } = req.body;

  const sql = `INSERT INTO Crime (user_id, officer_ID, Type_of_Crime, Exact_Crime, Date_of_Crime, Time_of_Crime, Location, Description, Victim_Name, Victim_Contact, Reported_By, Arrest_Date, Case_Status) VALUES (?, NULL, ?, ?, ?, ?, ?, NULL, ?, ?, NULL, NULL, NULL);`;

  db.query(
    sql,
    [
      user_id,
      Type_of_Crime,
      Exact_Crime,
      Date_of_Crime,
      Time_of_Crime,
      Location,
      Victim_Name,
      Victim_Contact,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).send("Server Error: " + err);
      }
      res.json({
        message: "Crime record inserted successfully",
        id: result.insertId,
      });
    }
  );
});

app.get("/UserHome", (req, res) => {
  const id = req.query.id; // Use req.query to get the user ID from query parameters
  const sql =
    "SELECT crime_id, Type_of_Crime, Exact_Crime, DATE(Date_of_Crime) AS Date_of_Crime, Time_of_Crime, Location, Description, Victim_Name, Victim_Contact, Reported_By, Arrest_Date, Case_Status FROM Crime WHERE user_ID = ?;";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).send("Server Error: " + err);
    }
    res.json(results); // Send the results back as JSON
  });
});

app.delete("/UserHome/:id", (req, res) => {
  const crim_id = req.params.id;
  if (!crim_id) {
    return res.status(400).send("Crime ID is required.");
  }

  const sql = "DELETE FROM Crime WHERE crime_id = ?;";

  db.query(sql, [crim_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server Error: " + err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Crime record not found.");
    }

    res.status(200).send({ message: "Crime record deleted successfully." });
  });
});

app.put("/UserHome/:id", (req, res) => {
  const crim_id = req.params.id;
  const {
    Type_of_Crime,
    Exact_Crime,
    Date_of_Crime,
    Time_of_Crime,
    Location,
    Victim_Name,
    Victim_Contact,
  } = req.body;
  const sql =
    "Update crime set Type_of_Crime = ?, Exact_Crime = ?, Date_of_Crime = ?, Time_of_Crime = ?, Location = ?, Victim_Name = ?, Victim_Contact = ? where crime_id = ?";

  db.query(
    sql,
    [
      Type_of_Crime,
      Exact_Crime,
      Date_of_Crime,
      Time_of_Crime,
      Location,
      Victim_Name,
      Victim_Contact,
      crim_id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Server Error:" + err);
      }
      res.status(200).send({ message: "Crime record Updated Successfully" });
    }
  );
});

app.get("/Officer", (req, res) => {
  const sql = "Select * from Criminal order by name desc";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send("Server Error: " + err);
    }
    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Server running on Port ${port}`);
});
