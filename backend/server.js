/*
Crime TABLE:
crime_id | officer_ID | user_ID | Type_of_Crime  | Exact_Crime | Date_of_Crime | Time_of_Crime | Location    | Description | Victim_Name   | Victim_Contact | Reported_By | Arrest_Date | Case_Status

Criminal TABLE:
| criminal_id | crime_ID | Name | Date_of_Birth | Status | Gender | Height | Weight | Eye_Color | Hair_Color | Skin_Tone | Build | Tattoos | No_of_Tattoos | Blood_Type | Known_Aliases | Crime_Category | Convictions | Last_Known_Address | Warrant_Status | Phone_Number | Known_Email_Address   

Officer TABLE:
officer_id | ranking    | badge_number | status  

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
const multer = require("multer");
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

app.post("/UserHome", (req, res) => {
  const {
    Type_of_Crime,
    Date_of_Crime,
    Time_of_Crime,
    Location,
    user_id,
    Reported_by,
  } = req.body;

  const sql = `CALL InsertCrimeRecord(?, ?, ?, ?, ?, ?);`;

  db.query(
    sql,
    [
      user_id,
      Type_of_Crime,
      Date_of_Crime,
      Time_of_Crime,
      Location,
      Reported_by,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).send("Server Error: " + err);
      }
      res.json({
        message: "Crime record inserted successfully",
        id: result[0][0].inserted_id, // Getting the last inserted ID from the result set
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

app.delete("/UserHome", (req, res) => {
  const crim_id = req.query.id;
  console.log(crim_id);
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

app.get("/Home", (req, res) => {
  const sql =
    "SELECT crime_id, Type_of_Crime, Exact_Crime, DATE(Date_of_Crime) AS Date_of_Crime, Time_of_Crime, Location, Description, Victim_Name, Victim_Contact, Reported_By, Arrest_Date, Case_Status FROM crime;";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Server Error:" + err);
    }
    res.json(result);
  });
});

app.get("/Assign/Officer", (req, res) => {
  const sql =
    "SELECT o.officer_id, o.ranking, o.badge_number, o.status, COUNT(i.officer_id) AS case_count FROM officer o LEFT JOIN investigates i ON o.officer_id = i.officer_id GROUP BY o.officer_id HAVING case_count <= 4 AND o.status = 'Active' LIMIT 0, 1000;";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Server Error:" + err);
    }
    res.json(result);
  });
});

app.get("/Assign/Investigates", (req, res) => {
  const sql = "SELECT officer_ID, crime_ID FROM Investigates;";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Server Error:" + err);
    }
    res.json(result);
  });
});

app.post("/Assign", async (req, res) => {
  const { crime_id, officers } = req.body;
  if (!crime_id || officers.length === 0) {
    return res
      .status(400)
      .send("Please select a crime and at least one officer.");
  }

  const sql = `INSERT INTO investigates (officer_id, crime_id) VALUES ?`;
  const values = officers.map((officer_id) => [officer_id, crime_id]);

  try {
    // Using promise-based query execution
    await db.promise().query(sql, [values]);

    // Send success response
    console.log("Officers assigned successfully");
    return res
      .status(200)
      .json({ success: true, message: "Officers assigned successfully." });
  } catch (error) {
    // Handle error
    console.error("Error assigning officers:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error assigning officers." });
  }
});

app.get("/Investigations", (req, res) => {
  const sql = "SELECT crime_ID FROM Investigates WHERE officer_ID = ?;";
  const id = req.query.id;
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send("Server Error:" + err);
    }
    res.json(result);
  });
});

app.get("/Investigations/CrimeRec", (req, res) => {
  const sql =
    "SELECT c.crime_ID, c.Type_of_Crime, c.Exact_Crime, DATE(c.Date_of_Crime) AS Date_of_Crime, c.Time_of_Crime, c.Location, c.Description, c.Victim_Name, c.Victim_Contact, c.Reported_By, c.Arrest_Date, c.Case_Status FROM Crime c JOIN Investigates i ON c.crime_ID = i.crime_ID WHERE i.officer_ID = ?;";
  const id = req.query.id;
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send("Server Error:" + err);
    }
    res.json(result);
  });
});

app.post("/Investigations", (req, res) => {
  const {
    Name,
    Date_of_Birth,
    Status,
    Gender,
    Height,
    Weight,
    Eye_Color,
    Hair_Color,
    Skin_Tone,
    Build,
    Tattoos,
    No_of_Tattoos,
    Blood_Type,
    Crime_Category,
    Convictions,
    Last_Known_Address,
    Warrant_Status,
    Phone_Number,
    Known_Email_Address,
    Crime_ID,
  } = req.body;

  const insertCriminalSql =
    "SELECT InsertCriminal(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

  // Insert into the Criminal table
  db.query(
    insertCriminalSql,
    [
      Crime_ID,
      Name,
      Date_of_Birth,
      Status,
      Gender,
      Height,
      Weight,
      Eye_Color,
      Hair_Color,
      Skin_Tone,
      Build,
      Tattoos,
      No_of_Tattoos,
      Blood_Type,
      Crime_Category,
      Convictions,
      Last_Known_Address,
      Warrant_Status,
      Phone_Number,
      Known_Email_Address,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).send("Server Error: " + err);
      }

      // Get the inserted criminal's ID (auto-incremented value)
      const criminal_id = result.insertId;

      // Now insert into commits_crime table using the criminal_id and Crime_ID
      const insertCommitsCrimeSql =
        "INSERT INTO commits_crime (crime_id, criminal_id) VALUES (?, ?);";

      db.query(
        insertCommitsCrimeSql,
        [Crime_ID, criminal_id],
        (err2, result2) => {
          if (err2) {
            return res
              .status(500)
              .send("Error inserting into commits_crime: " + err2);
          }

          res.json({
            message:
              "Crime record inserted successfully, and commits_crime updated",
            criminal_id: criminal_id,
          });
        }
      );
    }
  );
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/evidence", upload.single("storage_location"), (req, res) => {
  const { officer_id, evidence_type, description, crime_id } = req.body;
  const storage_location = req.file ? req.file.path : null;
  const collection_date = new Date(); // Or accept from the frontend if it's user-defined

  // SQL query to insert data
  const sql = `INSERT INTO Evidence (officer_id, evidence_type, collection_date, storage_location, description, crime_id)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      officer_id,
      evidence_type,
      collection_date,
      storage_location,
      description,
      crime_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting evidence:", err);
        res.status(500).json({ error: "Error inserting evidence" });
      } else {
        res.status(200).json({
          message: "Evidence added successfully!",
          id: result.insertId,
        });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on Port ${port}`);
});
