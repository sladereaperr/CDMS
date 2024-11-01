import React, { useState } from "react";

const CriminalsTable = ({ criminals }) => {
  // State to store current page
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedCriminals, setSortedCriminals] = useState([]);

  // Number of criminals to show per page
  const criminalsPerPage = 10;

  // Calculate indices for pagination
  const indexOfLastCriminal = currentPage * criminalsPerPage;
  const indexOfFirstCriminal = indexOfLastCriminal - criminalsPerPage;
  const currentCriminals = sortedCriminals.slice(
    indexOfFirstCriminal,
    indexOfLastCriminal
  );

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Criminal Records</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Status</th>
            <th>Gender</th>
            <th>Crime Category</th>
          </tr>
        </thead>
        <tbody>
          {currentCriminals.map((criminal) => (
            <tr key={criminal.criminal_id}>
              <td>{criminal.Name}</td>
              <td>{criminal.Date_of_Birth}</td>
              <td>{criminal.Status}</td>
              <td>{criminal.Gender}</td>
              <td>{criminal.Crime_Category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        {Array.from(
          { length: Math.ceil(sortedCriminals.length / criminalsPerPage) },
          (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

// Example usage of the component
const ShowCriminals = () => {
  const criminals = [
    {
      criminal_id: 1,
      Name: "Tom Richards",
      Date_of_Birth: "1990-03-22",
      Status: "Incarcerated",
      Gender: "Male",
      Crime_Category: "Violent Crime",
    },
    {
      criminal_id: 2,
      Name: "Mark Thompson",
      Date_of_Birth: "1985-07-10",
      Status: "Free",
      Gender: "Male",
      Crime_Category: "Property Crime",
    },
    // Add more criminal records here...
  ];

  return <CriminalsTable criminals={criminals} />;
};

export default ShowCriminals;
