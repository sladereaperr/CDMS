import React, { useState, useEffect } from "react";

const CriminalsTable = ({ criminals }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedCriminals, setSortedCriminals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    gender: "",
    crimeCategory: "",
  });

  const criminalsPerPage = 10;

  // Filter and sort criminals
  useEffect(() => {
    const filteredData = criminals
      .filter((criminal) =>
        criminal.Name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((criminal) =>
        filters.status ? criminal.Status === filters.status : true
      )
      .filter((criminal) =>
        filters.gender ? criminal.Gender === filters.gender : true
      )
      .filter((criminal) =>
        filters.crimeCategory
          ? criminal.Crime_Category === filters.crimeCategory
          : true
      )
      .sort((a, b) => a.Name.localeCompare(b.Name));

    setSortedCriminals(filteredData);
  }, [criminals, searchTerm, filters]);

  const indexOfLastCriminal = currentPage * criminalsPerPage;
  const indexOfFirstCriminal = indexOfLastCriminal - criminalsPerPage;
  const currentCriminals = sortedCriminals.slice(
    indexOfFirstCriminal,
    indexOfLastCriminal
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleResetFilters = () => {
    setFilters({
      status: "",
      gender: "",
      crimeCategory: "",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Criminal Records</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          className="border p-2 flex-grow"
          placeholder="Search by Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={() => setSearchTerm("")}
        >
          X
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2"
        >
          <option value="">Filter by Status</option>
          <option value="Incarcerated">Incarcerated</option>
          <option value="Free">Free</option>
        </select>
        <select
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
          className="border p-2"
        >
          <option value="">Filter by Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          value={filters.crimeCategory}
          onChange={(e) =>
            setFilters({ ...filters, crimeCategory: e.target.value })
          }
          className="border p-2"
        >
          <option value="">Filter by Crime Category</option>
          <option value="Theft">Theft</option>
          <option value="Burglary">Burglary</option>
          <option value="Cyber Crime">Cyber Crime</option>
          <option value="Assault">Assault</option>
          {/* Add more categories as needed */}
        </select>

        <button
          onClick={handleResetFilters}
          className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Reset Filters
        </button>
      </div>

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
          {currentCriminals.length > 0 ? (
            currentCriminals.map((criminal, index) => (
              <tr
                key={criminal.criminal_id || index}
                className="hover:bg-gray-100"
              >
                <td className="py-2 px-4 border-b">{criminal.Name}</td>
                <td className="py-2 px-4 border-b">{criminal.Date_of_Birth}</td>
                <td className="py-2 px-4 border-b">{criminal.Status}</td>
                <td className="py-2 px-4 border-b">{criminal.Gender}</td>
                <td className="py-2 px-4 border-b">
                  {criminal.Crime_Category}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No records found
              </td>
            </tr>
          )}
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

export default CriminalsTable;
