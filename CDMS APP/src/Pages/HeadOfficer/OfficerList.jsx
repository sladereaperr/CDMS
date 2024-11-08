import React, { useState, useEffect } from "react";
import api from "../../api/posts";

const OfficerList = ({ setSelectedOfficers }) => {
  const [FilteredOfficers, setFilteredOfficers] = useState([]);
  const [OfficerData, setOfficerData] = useState([]);
  const [InvestigatesData, setInvestigatesData] = useState([]);

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

    const fetchInvestigatesData = async () => {
      try {
        const response = await api.get("/Assign/Investigates");
        setInvestigatesData(response.data); // State will update asynchronously
      } catch (error) {
        console.error("Error fetching investigates data:", error);
      }
    };

    fetchOfficerData();
    fetchInvestigatesData();
  }, []); // Only run this effect once on component mount

  // This effect will run when OfficerData or InvestigatesData updates
  useEffect(() => {
    if (OfficerData.length && InvestigatesData.length) {
      // Create a map to count the number of cases assigned to each officer
      const investigationCounts = InvestigatesData.reduce((acc, record) => {
        acc[record.officer_id] = (acc[record.officer_id] || 0) + 1;
        return acc;
      }, {});

      // Filter officers where the count of cases is 4 or less
      const officersLessThan4Cases = OfficerData.filter((officer) => {
        const caseCount = investigationCounts[officer.officer_id] || 0;
        return caseCount <= 4; // Add officer only if they have 4 or fewer cases
      });

      const remainingofficers = officersLessThan4Cases.filter((officer) => {
        return officer.status === "Active";
      });

      // Update the state with filtered officers
      setFilteredOfficers(remainingofficers);
    }
  }, [OfficerData, InvestigatesData]);

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Officer Records
      </h2>

      {FilteredOfficers.length > 0 ? (
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
            </tr>
          </thead>
          <tbody>
            {FilteredOfficers.map((officer) => (
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
