import React, { useEffect, useState } from "react";
import api from "../../api/posts";
import { useUser } from "../UserContext";

const CrimeRecords = ({ selectedCrime, setSelectedCrime }) => {
  const [crimeData, setCrimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const id = user.id;

  useEffect(() => {
    const fetchCrimeData = async () => {
      if (!user.id) {
        console.log("User not logged in.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/Home");
        const formattedData = response.data.map((crime) => ({
          ...crime,
          Date_of_Crime: new Date(crime.Date_of_Crime).toLocaleDateString(
            "en-CA"
          ),
        }));
        const reqData = formattedData.filter(
          (crime) =>
            crime.Case_Status !== "Closed" && crime.Case_Status !== "Solved"
        );
        setCrimeData(reqData);
      } catch (error) {
        console.error("Error fetching crime data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrimeData();
  }, [user?.id, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleCheckboxChange = (crimeId) => {
    // Set the selected crime to the clicked crime ID (ensure only one can be selected)
    if (selectedCrime === crimeId) {
      setSelectedCrime(null); // Unselect if the same crime is clicked again
    } else {
      setSelectedCrime(crimeId); // Set to the new crime ID
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Crime Records
      </h2>

      {crimeData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2 font-semibold text-gray-800">
                  Type of Crime
                </th>
                <th className="px-4 py-2 font-semibold text-gray-800">
                  Exact Crime
                </th>
                <th className="px-4 py-2 font-semibold text-gray-800">
                  Date of Crime
                </th>
                <th className="px-4 py-2 font-semibold text-gray-800">
                  Time of Crime
                </th>
                <th className="px-4 py-2 font-semibold text-gray-800">
                  Location
                </th>
                <th className="px-4 py-2 font-semibold text-gray-800">
                  Description
                </th>
                <th className="px-4 py-2 font-semibold text-gray-800">
                  Victim Name
                </th>
                <th className="px-4 py-2 font-semibold text-gray-800">
                  Victim Contact
                </th>
                <th className="px-4 py-2 font-semibold text-gray-800">
                  Reported By
                </th>
                <th className="px-4 py-2 font-semibold text-gray-800">
                  Arrest Date
                </th>
                <th className="px-4 py-2 font-semibold text-gray-800">
                  Case Status
                </th>
              </tr>
            </thead>
            <tbody>
              {crimeData.map((crime) => (
                <tr key={crime.crime_id} className="border-b border-gray-200">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCrime === crime.crime_id} // Only check if the crime_id matches selectedCrime
                      onChange={() => handleCheckboxChange(crime.crime_id)} // Toggle selection
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {crime.Type_of_Crime || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {crime.Exact_Crime || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {crime.Date_of_Crime || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {crime.Time_of_Crime !== "00:00:00"
                      ? crime.Time_of_Crime
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {crime.Location || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {crime.Description || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {crime.Victim_Name || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {crime.Victim_Contact || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {crime.Reported_By || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {crime.Arrest_Date || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {crime.Case_Status || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">
          No crime records found.
        </div>
      )}
    </div>
  );
};

export default CrimeRecords;
