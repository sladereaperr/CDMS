import React, { useEffect, useState } from "react";
import api from "../../api/posts";
import { useUser } from "../UserContext";

const ShowComplaint = ({ refresh }) => {
  const [crimeData, setCrimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchCrimeData = async () => {
      if (!user.id) {
        console.log("User not logged in.");
        setLoading(false);
        return;
      }

      const id = user.id;

      try {
        const response = await api.get(`/UserHome?id=${id}`);
        setCrimeData(response.data);
      } catch (error) {
        console.error("Error fetching crime data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrimeData();
  }, [refresh, user?.id]); // Refetch the data whenever refresh or user ID changes

  const handleDelete = async (crimeId) => {
    try {
      await api.delete(`/UserHome/${crimeId}`); // Include the ID in the URL
      // Update state to remove deleted crime directly
      setCrimeData(crimeData.filter((crime) => crime.id !== crimeId));
    } catch (error) {
      console.error("Error deleting crime record:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Crime Records
      </h2>
      {crimeData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Exact Crime
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {crimeData.map((crime) => (
                <tr key={crime.crime_id} className="hover:bg-gray-100">
                  {" "}
                  {/* Use crime.crime_id if that's the unique identifier */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {crime.Exact_Crime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {crime.Location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    <button
                      onClick={() => handleDelete(crime.crime_id)} // Ensure this matches your unique ID property
                      className="bg-red-600 text-white py-1 px-3 rounded-lg shadow hover:bg-red-700 transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
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

export default ShowComplaint;
