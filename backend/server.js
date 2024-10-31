/*
Crime TABLE:
crime_id | officer_ID | user_ID | Type_of_Crime  | Exact_Crime | Date_of_Crime | Time_of_Crime | Location    | Description | Victim_Name   | Victim_Contact | Reported_By | Arrest_Date | Case_Status

Criminal TABLE:
| criminal_id | crime_ID | Name | Date_of_Birth | Status | Gender | Height | Weight | Eye_Color | Hair_Color | Skin_Tone | Build | Tattoos | No_of_Tattoos | Blood_Type | Known_Aliases | Crime_Category | Convictions | Last_Known_Address | Warrant_Status | Phone_Number | Known_Email_Address   

Officer TABLE:
officer_id | ranking    | badge_number | status   | assigned_cases

User TABLE:
user_id | username | password | first_name | last_name | email | phone_number | role | status | profile_picture | address | date_of_birth

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

const sql_password = process.env.SQL_PASSWORD;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: sql_password,
  database: "CDMS",
});

app.post("/login", (req, res) => {
  const { Username, Password } = req.body;
  const sql =
    "select role, first_name, user_id from user where username = ? and password = ?";
  db.query(sql, [Username, Password], (err, result) => {
    if (err) {
      return res.status(500).send("Server Error" + err);
    }
    if (result.length > 0) {
      const user = result[0]; // Get the first user object
      res.json({
        role: user.role,
        firstName: user.first_name,
        id: user.user_id,
      }); // Send only the necessary data
    } else {
      res.json({ role: "", firstName: "", id: "" }); // Also return firstName as an empty string
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
      console.log(result);
      res.status(200).send({ message: "Crime record Updated Successfully" });
    }
  );
});

// app.get("/officer/:id", (req, res) => {
//   const officerId = req.params.id; // Get officer ID from the request query

//   const crimesQuery = `
//     SELECT * FROM Crime WHERE officer_ID = ?;
//   `;
//   const criminalsQuery = `
//     SELECT * FROM Criminal;
//   `;

//   // Execute the two queries in parallel
//   db.query(crimesQuery, [officerId], (err, crimesResults) => {
//     if (err) {
//       return res.status(500).json({ error: "Error fetching crimes" });
//     }

//     db.query(criminalsQuery, (err, criminalsResults) => {
//       if (err) {
//         return res.status(500).json({ error: "Error fetching criminals" });
//       }

//       // Return both results in one response
//       res.json({
//         crimes: crimesResults,
//         criminals: criminalsResults,
//       });
//     });
//   });
// });

app.listen(port, () => {
  console.log(`Server running on Port ${port}`);
});
