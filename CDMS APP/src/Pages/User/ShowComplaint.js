import React, { useEffect, useState } from "react";
import api from "../../api/posts";
import { useUser } from "../UserContext";

const ShowComplaint = ({ refresh, onDelete }) => {
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
  }, [refresh, user?.id]);

  const handleDelete = async (crimeId) => {
    try {
      await api.delete(`/UserHome/${crimeId}`);
      onDelete();
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
        <div className="space-y-8">
          {" "}
          {/* Space between each crime record */}
          {crimeData.map((crime) => (
            <div
              key={crime.crime_id}
              className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-lg"
            >
              <table className="min-w-full table-auto bg-white border border-gray-300">
                <tbody>
                  {crime.Type_of_Crime && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold text-gray-800">
                        Type of Crime:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {crime.Type_of_Crime}
                      </td>
                    </tr>
                  )}
                  {crime.Exact_Crime && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold text-gray-800">
                        Exact Crime:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {crime.Exact_Crime}
                      </td>
                    </tr>
                  )}
                  {crime.Date_of_Crime && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold text-gray-800">
                        Date of Crime:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {crime.Date_of_Crime}
                      </td>
                    </tr>
                  )}
                  {crime.Time_of_Crime !== "00:00:00" && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold text-gray-800">
                        Time of Crime:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {crime.Time_of_Crime}
                      </td>
                    </tr>
                  )}
                  {crime.Location && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold text-gray-800">
                        Location:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {crime.Location}
                      </td>
                    </tr>
                  )}
                  {crime.Description && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold text-gray-800">
                        Description:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {crime.Description}
                      </td>
                    </tr>
                  )}
                  {crime.Victim_Name && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold text-gray-800">
                        Victim Name:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {crime.Victim_Name}
                      </td>
                    </tr>
                  )}
                  {crime.Victim_Contact && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold text-gray-800">
                        Victim Contact:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {crime.Victim_Contact}
                      </td>
                    </tr>
                  )}
                  {crime.Reported_By && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold text-gray-800">
                        Reported By:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {crime.Reported_By}
                      </td>
                    </tr>
                  )}
                  {crime.Arrest_Date && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold text-gray-800">
                        Arrest Date:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {crime.Arrest_Date}
                      </td>
                    </tr>
                  )}
                  {crime.Case_Status && (
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold text-gray-800">
                        Case Status:
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {crime.Case_Status}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="text-right mt-6">
                <button
                  onClick={() => handleDelete(crime.crime_id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700 transition duration-150 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
