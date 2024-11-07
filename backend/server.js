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

    await createDBProcedures();
    await createDBTriggers();

    console.log("Finished reading and executing SQL file.");
  } catch (err) {
    console.error("Error reading or executing SQL file:", err);
  }
}

const createDBProcedures = async () => {
  try {
    const createProcedure = `
      CREATE PROCEDURE InsertCrimeRecord (
          IN p_user_id INT,
          IN p_Type_of_Crime VARCHAR(50),
          IN p_Exact_Crime VARCHAR(100),
          IN p_Date_of_Crime DATE,
          IN p_Time_of_Crime TIME,
          IN p_Location VARCHAR(255),
          IN p_Victim_Name VARCHAR(255),
          IN p_Victim_Contact VARCHAR(100)
      )
      BEGIN
          INSERT INTO Crime (
              user_id, officer_ID, Type_of_Crime, Exact_Crime, Date_of_Crime, 
              Time_of_Crime, Location, Description, Victim_Name, Victim_Contact, 
              Reported_By, Arrest_Date, Case_Status
          ) 
          VALUES (
              p_user_id, NULL, p_Type_of_Crime, p_Exact_Crime, p_Date_of_Crime, 
              p_Time_of_Crime, p_Location, NULL, p_Victim_Name, p_Victim_Contact, 
              NULL, NULL, NULL
          );
          
          SELECT LAST_INSERT_ID() AS inserted_id;
      END;
      `;

    // Execute the procedure creation
    await executeQuery(createProcedure);
    console.log("Procedure created successfully");
  } catch (err) {
    console.error("Error:", err);
  }
};

const createDBTriggers = async () => {
  try {
    const createInsertTriggerCrime = `
      CREATE TRIGGER log_crime_insert
      AFTER INSERT ON Crime
      FOR EACH ROW
      BEGIN
          IF (NEW.crime_ID IS NOT NULL) THEN
              INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
              VALUES (NEW.user_id, 
                      'INSERT', 
                      NOW(), 'Success', 
                      CONCAT('New Crime ID: ', NEW.crime_ID));
          END IF;
      END;
      `;

    const createUpdateTriggerCrime = `
      CREATE TRIGGER log_crime_update
      AFTER UPDATE ON Crime
      FOR EACH ROW
      BEGIN
          IF (NEW.crime_ID IS NOT NULL) THEN
              INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
              VALUES (NEW.user_id, 
                      'UPDATE', 
                      NOW(), 'Success', 
                      CONCAT('Updated Crime ID: ', NEW.crime_ID));
          END IF;
      END;
      `;

    const createDeleteTriggerCrime = `
      CREATE TRIGGER log_crime_delete
      AFTER DELETE ON Crime
      FOR EACH ROW
      BEGIN
          IF (OLD.crime_ID IS NOT NULL) THEN
              INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
              VALUES (OLD.user_id, 
                      'DELETE', 
                      NOW(), 'Success', 
                      CONCAT('Deleted Crime ID: ', OLD.crime_ID));
          END IF;
      END;
      `;

    // const createInsertTriggerCriminal = `
    //   CREATE TRIGGER log_criminal_insert
    //   AFTER INSERT ON Criminal
    //   FOR EACH ROW
    //   BEGIN
    //       IF (NEW.criminal_ID IS NOT NULL) THEN
    //           INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
    //           VALUES (NEW.user_id,
    //                   'INSERT',
    //                   NOW(), 'Success',
    //                   CONCAT('New Criminal ID: ', NEW.criminal_ID));
    //       END IF;
    //   END;`;

    // const createUpdateTriggerCriminal = `
    //   CREATE TRIGGER log_criminal_update
    //   AFTER UPDATE ON Criminal
    //   FOR EACH ROW
    //   BEGIN
    //       IF (NEW.criminal_ID IS NOT NULL) THEN
    //           INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
    //           VALUES (NEW.user_id,
    //                   'UPDATE',
    //                   NOW(), 'Success',
    //                   CONCAT('Updated Criminal ID: ', NEW.criminal_ID));
    //       END IF;
    //   END;`;

    // const createDeleteTriggerCriminal = `
    //   CREATE TRIGGER log_criminal_delete
    //   AFTER DELETE ON Criminal
    //   FOR EACH ROW
    //   BEGIN
    //       IF (OLD.criminal_ID IS NOT NULL) THEN
    //           INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
    //           VALUES (OLD.user_id,
    //                   'DELETE',
    //                   NOW(), 'Success',
    //                   CONCAT('Deleted Criminal ID: ', OLD.criminal_ID));
    //       END IF;
    //   END;`;

    // const createInsertTriggerUser = `
    //   CREATE TRIGGER log_user_insert
    //   AFTER INSERT ON User
    //   FOR EACH ROW
    //   BEGIN
    //       IF (NEW.user_ID IS NOT NULL) THEN
    //           INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
    //           VALUES (NEW.user_ID,
    //                   'INSERT',
    //                   NOW(), 'Success',
    //                   CONCAT('New User ID: ', NEW.user_ID));
    //       END IF;
    //   END;`;

    // const createUpdateTriggerUser = `
    //   CREATE TRIGGER log_user_update
    //   AFTER UPDATE ON User
    //   FOR EACH ROW
    //   BEGIN
    //       IF (NEW.user_ID IS NOT NULL) THEN
    //           INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
    //           VALUES (NEW.user_ID,
    //                   'UPDATE',
    //                   NOW(), 'Success',
    //                   CONCAT('Updated User ID: ', NEW.user_ID));
    //       END IF;
    //   END;`;

    // const createDeleteTriggerUser = `
    //   CREATE TRIGGER log_user_delete
    //   AFTER DELETE ON User
    //   FOR EACH ROW
    //   BEGIN
    //       IF (OLD.user_ID IS NOT NULL) THEN
    //           INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
    //           VALUES (OLD.user_ID,
    //                   'DELETE',
    //                   NOW(), 'Success',
    //                   CONCAT('Deleted User ID: ', OLD.user_ID));
    //       END IF;
    //   END;`;

    // const createInsertTriggerEvidence = `
    //   CREATE TRIGGER log_evidence_insert
    //   AFTER INSERT ON Evidence
    //   FOR EACH ROW
    //   BEGIN
    //       IF (NEW.evidence_ID IS NOT NULL) THEN
    //           INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
    //           VALUES (NEW.user_id,
    //                   'INSERT',
    //                   NOW(), 'Success',
    //                   CONCAT('New Evidence ID: ', NEW.evidence_ID));
    //       END IF;
    //   END;`;

    // const createUpdateTriggerEvidence = `
    //   CREATE TRIGGER log_evidence_update
    //   AFTER UPDATE ON Evidence
    //   FOR EACH ROW
    //   BEGIN
    //       IF (NEW.evidence_ID IS NOT NULL) THEN
    //           INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
    //           VALUES (NEW.user_id,
    //                   'UPDATE',
    //                   NOW(), 'Success',
    //                   CONCAT('Updated Evidence ID: ', NEW.evidence_ID));
    //       END IF;
    //   END;`;

    // const createDeleteTriggerEvidence = `
    //   CREATE TRIGGER log_evidence_delete
    //   AFTER DELETE ON Evidence
    //   FOR EACH ROW
    //   BEGIN
    //       IF (OLD.evidence_ID IS NOT NULL) THEN
    //           INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
    //           VALUES (OLD.user_id,
    //                   'DELETE',
    //                   NOW(), 'Success',
    //                   CONCAT('Deleted Evidence ID: ', OLD.evidence_ID));
    //       END IF;
    //   END;`;

    // Execute the insert trigger creation
    await executeQuery(createInsertTriggerCrime);
    await executeQuery(createUpdateTriggerCrime);
    await executeQuery(createDeleteTriggerCrime);
    // await executeQuery(createInsertTriggerCriminal);
    // await executeQuery(createUpdateTriggerCriminal);
    // await executeQuery(createDeleteTriggerCriminal);
    // await executeQuery(createInsertTriggerUser);
    // await executeQuery(createUpdateTriggerUser);
    // await executeQuery(createDeleteTriggerUser);
    // await executeQuery(createInsertTriggerEvidence);
    // await executeQuery(createUpdateTriggerEvidence);
    // await executeQuery(createDeleteTriggerEvidence);
  } catch (err) {
    console.error("Error:", err);
  }
};

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
    Exact_Crime,
    Date_of_Crime,
    Time_of_Crime,
    Location,
    Victim_Name,
    Victim_Contact,
    user_id,
  } = req.body;

  const sql = `CALL InsertCrimeRecord(?, ?, ?, ?, ?, ?, ?, ?);`;

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
