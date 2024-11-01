import React, { useState, useEffect } from "react";
import api from "./../../api/posts";

const CriminalsTable = ({ criminals }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedCriminals, setSortedCriminals] = useState([]);

  const criminalsPerPage = 10;

  useEffect(() => {
    const sortedData = [...criminals].sort((a, b) =>
      a.Name.localeCompare(b.Name)
    );
    setSortedCriminals(sortedData);
  }, [criminals]);

  const indexOfLastCriminal = currentPage * criminalsPerPage;
  const indexOfFirstCriminal = indexOfLastCriminal - criminalsPerPage;
  const currentCriminals = sortedCriminals.slice(
    indexOfFirstCriminal,
    indexOfLastCriminal
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Criminal Records</h2>
      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Date of Birth</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Gender</th>
            <th className="py-2 px-4 border-b">Crime Category</th>
          </tr>
        </thead>
        <tbody>
          {currentCriminals.map((criminal) => (
            <tr key={criminal.criminal_id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{criminal.Name}</td>
              <td className="py-2 px-4 border-b">{criminal.Date_of_Birth}</td>
              <td className="py-2 px-4 border-b">{criminal.Status}</td>
              <td className="py-2 px-4 border-b">{criminal.Gender}</td>
              <td className="py-2 px-4 border-b">{criminal.Crime_Category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4">
        {Array.from(
          { length: Math.ceil(sortedCriminals.length / criminalsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className="mx-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

// Example usage of the component
const Officer = () => {
  const [criminals, setCriminals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/Officer");
        setCriminals(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return <CriminalsTable criminals={criminals} />;
};

export default Officer;
