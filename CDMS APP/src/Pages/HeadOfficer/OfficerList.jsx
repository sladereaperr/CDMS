import React, { useState, useEffect } from "react";
import api from "../../api/posts";

const OfficerList = ({ setSelectedOfficers }) => {
  const [OfficerData, setOfficerData] = useState([]);

  const handleCheckboxChange = (officerId) => {
    setSelectedOfficers((prevSelected) => {
      if (prevSelected.includes(officerId)) {
        // Remove officer from selected list if already selected
        return prevSelected.filter((id) => id !== officerId);
      } else {
        // Add officer to selected list
        return [...prevSelected, officerId];
      }
    });
  };

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const response = await api.get("/Assign/Officer");
        setOfficerData(response.data); // State will update asynchronously
      } catch (error) {
        console.error("Error fetching officer data:", error);
      }
    };

    fetchOfficerData();
  }, []); // Only run this effect once on component mount

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Officer Records
      </h2>

      {OfficerData.length > 0 ? (
        <table className="min-w-full table-auto bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="px-4 py-2 font-semibold text-gray-800"></th>{" "}
              {/* Empty column for checkboxes */}
              <th className="px-4 py-2 font-semibold text-gray-800">
                Officer ID
              </th>
              <th className="px-4 py-2 font-semibold text-gray-800">Ranking</th>
              <th className="px-4 py-2 font-semibold text-gray-800">
                Badge Number
              </th>
              <th className="px-4 py-2 font-semibold text-gray-800">Status</th>
              <th className="px-4 py-2 font-semibold text-gray-800">
                Case Count
              </th>
            </tr>
          </thead>
          <tbody>
            {OfficerData.map((officer) => (
              <tr key={officer.officer_id} className="border-b border-gray-200">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    value={officer.officer_id}
                    onChange={() => handleCheckboxChange(officer.officer_id)}
                  />
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {officer.officer_id}
                </td>
                <td className="px-4 py-2 text-gray-600">{officer.ranking}</td>
                <td className="px-4 py-2 text-gray-600">
                  {officer.badge_number}
                </td>
                <td className="px-4 py-2 text-gray-600">{officer.status}</td>
                <td className="px-4 py-2 text-gray-600">
                  {officer.case_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500 text-lg">
          No officers available with less than 4 cases.
        </div>
      )}
    </div>
  );
};

export default OfficerList;
