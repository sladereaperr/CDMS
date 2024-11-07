Create database if not exists CDMS;
use CDMS;

CREATE TABLE Criminal (
criminal_ID INT PRIMARY KEY auto_increment,
crime_ID INT,
Name VARCHAR(100),
Date_of_Birth DATE,
Status ENUM('Incarcerated', 'Free'),
Gender ENUM('Male', 'Female'),
Height DECIMAL(4,1),
Weight DECIMAL(4,1),
Eye_Color VARCHAR(10),
Hair_Color VARCHAR(10),
Skin_Tone ENUM('Dark', 'Light', 'Medium'),
Build VARCHAR(50),
Tattoos ENUM('Yes', 'No'),
No_of_Tattoos INT,
Blood_Type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
Crime_Category VARCHAR(100),
Convictions INT DEFAULT 0,
Last_Known_Address TEXT,
Warrant_Status ENUM('Active', 'Inactive'),
Phone_Number VARCHAR(50),
Known_Email_Address VARCHAR(100)
);

CREATE TABLE Crime (
    crime_ID INT PRIMARY KEY auto_increment,
    officer_ID INT,
    user_ID INT,
    Type_of_Crime ENUM (
    'Violent Crime',
    'Property Crime',
    'White-Collar Crime',
    'Organized Crime',
    'Cyber Crime',
    'Drug-Related Crime',
    'Public Order Crime',
    'Environmental Crime',
    'Traffic Violations',
    'Terrorism and National Security Crimes',
    'Hate Crime',
    'Other Crime'
	),
    Exact_Crime VARCHAR(100),
    Date_of_Crime DATE,
    Time_of_Crime TIME,
    Location VARCHAR(255),
    Description TEXT,
    Victim_Name VARCHAR(255),
    Victim_Contact VARCHAR(100),
    Reported_By VARCHAR(100),
    Arrest_Date DATE,
    Case_Status ENUM('Under Investigation', 'Closed', 'Solved')
);


CREATE TABLE Officer (
    officer_id INT PRIMARY KEY auto_increment,
    ranking VARCHAR(50),
    badge_number VARCHAR(50) UNIQUE,
    status enum('Active', 'InActive', 'On Leave')
);


CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('HeadOfficer', 'Officer', 'User') NOT NULL,
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active'
);

CREATE TABLE UserProfile (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    profile_picture VARCHAR(255),
    address VARCHAR(255),
    date_of_birth DATE,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);


CREATE TABLE AuditLog (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,                           
    action_type VARCHAR(50), 
    action_timestamp DATETIME,
    status ENUM('Success', 'Failure'),      
    details TEXT,
    foreign key (user_id) references User(user_id)
);

CREATE TABLE Report (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    officer_id INT,                         
    details TEXT,
    report_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    summary TEXT,
    foreign key (officer_id) references Officer(officer_id)			
);

CREATE TABLE Evidence (
    evidence_id INT PRIMARY KEY AUTO_INCREMENT,
    crime_id INT,
    report_id INT,
    officer_id INT,
    evidence_type ENUM('Physical', 'Photographic', 'Video', 'Audio', 'Testimonial', 'Forensic', 'Biometric', 'Electronic Device', 'Handwritten'),
    collection_date DATETIME NOT NULL,
    storage_location VARCHAR(255),
    description TEXT,
    foreign key (crime_id) references Crime(Crime_ID),	
    foreign key (report_id) references Report(Report_ID)
);


CREATE TABLE Commits_Crime (
	crime_id INT,
	criminal_id INT,
    foreign key (crime_id) references Crime(crime_id),
    foreign key (criminal_id) references Criminal(criminal_id)
);

CREATE TABLE Investigates (
	officer_ID INT,
    crime_ID INT,
    foreign key (crime_id) references Crime(crime_id),
    foreign key (officer_id) references Officer(officer_id)
);


alter table criminal add foreign key (crime_ID) references Crime(crime_ID);
alter table crime add foreign key (officer_ID) references Officer(officer_ID);
alter table crime add foreign key (user_ID) references User(user_ID);



INSERT INTO User (user_id, username, password, email, role, status)
VALUES
(1, 'john_doe', 'password123', 'john.doe@example.com', 'HeadOfficer', 'Active'),
(2, 'jane_smith', 'password456', 'jane.smith@example.com', 'Officer', 'Active'),
(3, 'alice_jones', 'password789', 'alice.jones@example.com', 'User', 'Active'),
(4, 'bob_brown', 'password012', 'bob.brown@example.com', 'Officer', 'Inactive'),
(5, 'charlie_white', 'password345', 'charlie.white@example.com', 'User', 'Active'),
(6, 'david_black', 'password678', 'david.black@example.com', 'Officer', 'Active'),
(7, 'emily_green', 'password901', 'emily.green@example.com', 'User', 'Active'),
(8, 'frank_blue', 'password234', 'frank.blue@example.com', 'Officer', 'Inactive'),
(9, 'grace_red', 'password567', 'grace.red@example.com', 'User', 'Active'),
(10, 'hannah_yellow', 'password890', 'hannah.yellow@example.com', 'Officer', 'Active'),
(11, 'ian_purple', 'password123', 'ian.purple@example.com', 'HeadOfficer', 'Active');


INSERT INTO UserProfile (user_id, first_name, last_name, phone_number, profile_picture, address, date_of_birth)
VALUES
(1, 'John', 'Doe', '1234567890', 'profile1.jpg', '123 Main St', '1980-05-15'),
(2, 'Jane', 'Smith', '0987654321', 'profile2.jpg', '456 Elm St', '1990-10-10'),
(3, 'Alice', 'Jones', '5678901234', 'profile3.jpg', '789 Oak St', '1985-08-20'),
(4, 'Bob', 'Brown', '3456789012', 'profile4.jpg', '101 Pine St', '1982-03-12'),
(5, 'Charlie', 'White', '2345678901', 'profile5.jpg', '202 Maple St', '1992-06-25'),
(6, 'David', 'Black', '6789012345', 'profile6.jpg', '303 Cedar St', '1988-07-08'),
(7, 'Emily', 'Green', '7890123456', 'profile7.jpg', '404 Birch St', '1995-09-01'),
(8, 'Frank', 'Blue', '8901234567', 'profile8.jpg', '505 Redwood St', '1980-01-18'),
(9, 'Grace', 'Red', '9012345678', 'profile9.jpg', '606 Fir St', '1991-12-14'),
(10, 'Hannah', 'Yellow', '0123456789', 'profile10.jpg', '707 Spruce St', '1983-11-22'),
(11, 'Ian', 'Purple', '1234987650', 'profile11.jpg', '808 Ash St', '1975-10-30');


INSERT INTO Officer (officer_id, ranking, badge_number, status)
VALUES 
(1, 'Sergeant', '1234A', 'Active'),
(2, 'Lieutenant', '5678B', 'Active'),
(3, 'Detective', '9012C', 'On Leave'),
(4, 'Captain', '3456D', 'Active'),
(5, 'Inspector', '7890E', 'Inactive'),
(6, 'Sergeant', '2345F', 'Active'),
(7, 'Lieutenant', '6789G', 'On Leave'),
(8, 'Detective', '0123H', 'Active'),
(9, 'Captain', '4567I', 'Active'),
(10, 'Inspector', '8901J', 'Inactive'),
(11, 'Sergeant', '1357K', 'Active');


INSERT INTO Crime (crime_ID, officer_ID, user_ID, Type_of_Crime, Exact_Crime, Date_of_Crime, Time_of_Crime, Location, Description, Victim_Name, Victim_Contact, Reported_By, Arrest_Date, Case_Status)
VALUES 
(101, 1, 3, 'Violent Crime', 'Assault', '2023-01-15', '14:30:00', '789 Main St', 'Victim was assaulted with a weapon.', 'Michael Brown', '1234567890', 'Alice Jones', '2023-01-20', 'Solved'),
(102, 2, 2, 'Property Crime', 'Burglary', '2023-02-12', '02:45:00', '456 Elm St', 'Home burglary reported by neighbor.', 'Sarah Green', '0987654321', 'Jane Smith', NULL, 'Under Investigation'),
(103, 3, 4, 'Property Crime', 'Vandalism', '2023-03-10', '18:30:00', '123 Oak St', 'Graffiti on the wall of a store.', 'Jessica White', '2345678901', 'Bob Brown', '2023-03-12', 'Under Investigation'),
(104, 4, 5, 'White-Collar Crime', 'Fraud', '2023-04-25', '10:15:00', '321 Birch St', 'Suspicious transactions involving stolen credit cards.', 'Mark Harris', '3456789012', 'David Black', '2023-05-01', 'Solved'),
(105, 5, 6, 'Drug-Related Crime', 'Possession', '2023-06-05', '23:40:00', '654 Pine St', 'Possession of illegal substances.', 'Rachel Lee', '5678901234', 'Emily Green', NULL, 'Under Investigation'),
(106, 6, 7, 'Violent Crime', 'Assault', '2023-07-20', '01:00:00', '987 Elm St', 'Assault with a weapon reported.', 'Tom Ford', '6789012345', 'Frank Blue', NULL, 'Under Investigation'),
(107, 7, 8, 'Public Order Crime', 'Shoplifting', '2023-08-10', '16:00:00', '234 Cedar St', 'Stolen goods from a supermarket.', 'Nancy Clark', '7890123456', 'Grace Red', '2023-08-12', 'Solved'),
(108, 8, 9, 'Organized Crime', 'Armed Robbery', '2023-09-18', '03:30:00', '543 Oak St', 'Armed robbery in a convenience store.', 'George Wilson', '8901234567', 'Hannah Yellow', NULL, 'Under Investigation'),
(109, 9, 10, 'White-Collar Crime', 'Identity Theft', '2023-10-01', '08:45:00', '678 Maple St', 'Suspected identity theft in financial transactions.', 'Linda Brown', '9012345678', 'Ian Purple', '2023-10-03', 'Under Investigation'),
(110, 10, 11, 'Property Crime', 'Vandalism', '2023-11-04', '12:00:00', '890 Ash St', 'Damage to public property.', 'Jack Turner', '0123456789', 'John Doe', '2023-11-05', 'Under Investigation');

INSERT INTO Criminal (crime_ID, Name, Date_of_Birth, Status, Gender, Height, Weight, Eye_Color, Hair_Color, Skin_Tone, Build, Tattoos, No_of_Tattoos, Blood_Type, Crime_Category, Convictions, Last_Known_Address, Warrant_Status, Phone_Number, Known_Email_Address)
VALUES 
(101, 'Michael Brown', '1985-08-12', 'Incarcerated', 'Male', 5.9, 160.5, 'Brown', 'Black', 'Medium', 'Athletic', 'Yes', 2, 'O+', 'Violent Crime', 1, '789 Main St', 'Active', '1234567890', 'michaelb@gmail.com'),
(102, 'Sarah Green', '1990-04-22', 'Free', 'Female', 5.6, 135.3, 'Blue', 'Blonde', 'Light', 'Slim', 'No', 0, 'A-', 'Property Crime', 0, '456 Elm St', 'Inactive', '0987654321', 'sarahg@yahoo.com'),
(103, 'Jessica White', '1988-11-30', 'Incarcerated', 'Female', 5.7, 140.2, 'Green', 'Brown', 'Light', 'Medium', 'Yes', 1, 'B+', 'Property Crime', 2, '123 Oak St', 'Active', '2345678901', 'jessicaw@outlook.com'),
(104, 'Mark Harris', '1975-02-10', 'Free', 'Male', 6.1, 185.0, 'Brown', 'Black', 'Medium', 'Muscular', 'No', 0, 'AB+', 'White-Collar Crime', 0, '321 Birch St', 'Inactive', '3456789012', 'markh@aol.com'),
(105, 'Rachel Lee', '1987-07-25', 'Incarcerated', 'Female', 5.5, 130.4, 'Black', 'Blonde', 'Medium', 'Athletic', 'Yes', 3, 'O-', 'Drug-Related Crime', 1, '654 Pine St', 'Active', '5678901234', 'rachell@icloud.com'),
(106, 'Tom Ford', '1992-03-14', 'Free', 'Male', 5.8, 170.0, 'Hazel', 'Brown', 'Dark', 'Lean', 'No', 0, 'A+', 'Violent Crime', 0, '987 Elm St', 'Inactive', '6789012345', 'tomf@outlook.com'),
(107, 'Nancy Clark', '1995-06-30', 'Free', 'Female', 5.6, 145.0, 'Blue', 'Red', 'Light', 'Slim', 'No', 0, 'B-', 'Public Order Crime', 0, '234 Cedar St', 'Active', '7890123456', 'nancyc@gmail.com'),
(108, 'George Wilson', '1980-12-01', 'Incarcerated', 'Male', 6.0, 175.3, 'Brown', 'Black', 'Dark', 'Stocky', 'Yes', 5, 'O+', 'Organized Crime', 3, '543 Oak St', 'Active', '8901234567', 'georgew@yahoo.com'),
(109, 'Linda Brown', '1993-05-18', 'Free', 'Female', 5.4, 125.6, 'Green', 'Blonde', 'Light', 'Slim', 'No', 0, 'AB-', 'White-Collar Crime', 1, '678 Maple St', 'Inactive', '9012345678', 'lindab@outlook.com'),
(110, 'Jack Turner', '1989-09-03', 'Incarcerated', 'Male', 6.2, 180.7, 'Brown', 'Brown', 'Medium', 'Athletic', 'Yes', 2, 'A-', 'Property Crime', 2, '890 Ash St', 'Active', '0123456789', 'jackt@gmail.com');


INSERT INTO Commits_Crime (crime_id, criminal_id)
VALUES 
(101, 1),
(102, 2),
(103, 3),
(104, 4),
(105, 5),
(106, 6),
(107, 7),
(108, 8),
(109, 9),
(110, 10),
(101, 5);

INSERT INTO Investigates (officer_ID, crime_ID)
VALUES 
(1, 101),
(2, 102),
(3, 103),
(4, 104),
(5, 105),
(6, 106),
(7, 107),
(8, 108),
(9, 109),
(10, 110),
(1, 106);

INSERT INTO AuditLog (user_id, action_type, action_timestamp, status, details)
VALUES 
(1, 'Login', '2023-10-15 10:00:00', 'Success', 'Head Officer John Doe logged in successfully'),
(2, 'Update', '2023-10-15 11:00:00', 'Success', 'Officer Jane Smith updated a crime report.'),
(3, 'Login', '2023-10-16 09:30:00', 'Success', 'Alice Jones logged in successfully.'),
(4, 'Update', '2023-10-16 10:45:00', 'Success', 'Bob Brown updated a profile picture.'),
(5, 'Login', '2023-10-17 08:00:00', 'Success', 'Charlie White logged in successfully.'),
(6, 'Logout', '2023-10-17 12:15:00', 'Success', 'David Black logged out successfully.'),
(7, 'Login', '2023-10-18 11:20:00', 'Success', 'Emily Green logged in successfully.'),
(8, 'Update', '2023-10-18 13:30:00', 'Success', 'Frank Blue updated a crime report.'),
(9, 'Login', '2023-10-19 14:00:00', 'Success', 'Grace Red logged in successfully.'),
(10, 'Update', '2023-10-19 15:20:00', 'Success', 'Hannah Yellow updated a profile.'),
(11, 'Login', '2023-10-20 09:10:00', 'Success', 'Ian Purple logged in successfully.');

INSERT INTO Report (officer_id, details, summary)
VALUES 
(1, 'Detailed report on violent crime.', 'Summary of the crime scene and victim statement.'),
(2, 'Detailed report on burglary.', 'Summary of the stolen items and witness statements.'),
(3, 'Report on vandalism.', 'Summary of the damage caused and potential suspects.'),
(4, 'Financial crime report.', 'Detailed information on fraudulent activity and transactions.'),
(5, 'Drug crime report.', 'Details on the drug-related crime scene and evidence.'),
(6, 'Assault report.', 'Summary of the assault details and witness accounts.'),
(7, 'Shoplifting report.', 'Details on stolen goods and suspect profile.'),
(8, 'Armed robbery report.', 'Details on armed robbery incident and victim statements.'),
(9, 'Fraudulent transaction report.', 'Summary of the fraudulent activities and evidence.'),
(10, 'Property damage report.', 'Summary of public property damage and investigative actions.'),
(1, 'Report on crime scene processing.', 'Detailed analysis of the crime scene and evidence collection.');

INSERT INTO Evidence (crime_id, report_id, officer_id, evidence_type, collection_date, storage_location, description)
VALUES 
(101, 1, 1, 'Physical', '2023-01-15 14:30:00', 'Evidence Locker 1', 'Assault weapon found at the crime scene.'),
(102, 2, 2, 'Photographic', '2023-02-12 02:45:00', 'Evidence Locker 2', 'Photograph of the burglary scene showing broken windows.'),
(103, 3, 3, 'Video', '2023-03-10 18:30:00', 'Evidence Locker 3', 'Surveillance video showing vandalism at the store.'),
(104, 4, 4, 'Forensic', '2023-04-25 10:15:00', 'Evidence Locker 4', 'Forensic analysis of stolen credit card transactions.'),
(105, 5, 5, 'Biometric', '2023-06-05 23:40:00', 'Evidence Locker 5', 'Fingerprint analysis from the crime scene related to drug possession.'),
(106, 6, 6, 'Audio', '2023-07-20 01:00:00', 'Evidence Locker 6', 'Audio recording of the assault incident.'),
(107, 7, 7, 'Electronic Device', '2023-08-10 16:00:00', 'Evidence Locker 7', 'Stolen laptop recovered from the supermarket theft incident.'),
(108, 8, 8, 'Testimonial', '2023-09-18 03:30:00', 'Evidence Locker 8', 'Eyewitness testimony regarding armed robbery at a convenience store.'),
(109, 9, 9, 'Photographic', '2023-10-01 08:45:00', 'Evidence Locker 9', 'Photograph of identity theft victim’s financial documents.'),
(110, 10, 10, 'Handwritten', '2023-11-04 12:00:00', 'Evidence Locker 10', 'Handwritten notes found at the scene of the vandalism.');
