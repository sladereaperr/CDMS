import React, { useEffect, useState } from "react";
import api from "../../api/posts";
import { useUser } from "../UserContext";

const InputField = ({ label, type, name, value, handleChange, required }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={handleChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const ShowComplaint = ({ refresh, onDelete }) => {
  const [crimeData, setCrimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const id = user.id;
  const [editCrimeId, setEditCrimeId] = useState(null); // Track which crime is being edited
  const [UpdatedDetails, setUpdatedDetails] = useState({
    Type_of_Crime: "",
    Exact_Crime: "",
    Date_of_Crime: "",
    Time_of_Crime: "",
    Location: "",
    Victim_Name: "",
    Victim_Contact: "",
    user_id: id,
  });

  useEffect(() => {
    const fetchCrimeData = async () => {
      if (!user.id) {
        console.log("User not logged in.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/UserHome?id=${id}`);
        const formattedData = response.data.map((crime) => ({
          ...crime,
          Date_of_Crime: new Date(crime.Date_of_Crime).toLocaleDateString(
            "en-CA"
          ),
        }));
        setCrimeData(formattedData);
      } catch (error) {
        console.error("Error fetching crime data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrimeData();
  }, [refresh, user?.id, id]);

  const handleDelete = async (crimeId) => {
    try {
      await api.delete(`/UserHome/${crimeId}`);
      onDelete();
    } catch (error) {
      console.error("Error deleting crime record:", error);
    }
  };

  const handleUpdate = async (crimeId) => {
    try {
      const response = await api.put(`/UserHome/${crimeId}`, UpdatedDetails);
      console.log(response);
      setEditCrimeId(null);
      onDelete();
    } catch (err) {
      console.error("Error updating crime record:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
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
          {crimeData.map((crime) => (
            <div
              key={crime.crime_id}
              className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-lg"
            >
              {editCrimeId === crime.crime_id ? (
                // Render form for editing
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Update Crime Record
                  </h3>
                  <form>
                    <div className="mb-4">
                      <label
                        htmlFor="Type_of_Crime"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Type of Crime
                      </label>
                      <select
                        name="Type_of_Crime"
                        id="Type_of_Crime"
                        value={UpdatedDetails.Type_of_Crime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Crime Type</option>
                        <option value="Violent Crime">Violent Crime</option>
                        <option value="Property Crime">Property Crime</option>
                        <option value="White-Collar Crime">
                          White-Collar Crime
                        </option>
                        <option value="Organized Crime">Organized Crime</option>
                        <option value="Cyber Crime">Cyber Crime</option>
                        <option value="Drug-Related Crime">
                          Drug-Related Crime
                        </option>
                        <option value="Public Order Crime">
                          Public Order Crime
                        </option>
                        <option value="Environmental Crime">
                          Environmental Crime
                        </option>
                        <option value="Traffic Violations">
                          Traffic Violations
                        </option>
                        <option value="Terrorism and National Security Crimes">
                          Terrorism and National Security Crimes
                        </option>
                        <option value="Hate Crime">Hate Crime</option>
                        <option value="Other Crime">Other Crime</option>
                      </select>
                    </div>
                    <InputField
                      label="Date of Crime"
                      type="date"
                      name="Date_of_Crime"
                      value={UpdatedDetails.Date_of_Crime}
                      handleChange={handleInputChange}
                      required={true}
                    />

                    <InputField
                      label="Time of Crime"
                      type="time"
                      name="Time_of_Crime"
                      value={UpdatedDetails.Time_of_Crime}
                      handleChange={handleInputChange}
                      required={false}
                    />

                    <InputField
                      label="Location"
                      type="text"
                      name="Location"
                      value={UpdatedDetails.Location}
                      handleChange={handleInputChange}
                      required={true}
                    />
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => handleUpdate(crime.crime_id)}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-150 ease-in-out mr-2"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditCrimeId(null)} // Cancel editing
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600 transition duration-150 ease-in-out"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
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
                      onClick={() => {
                        setEditCrimeId(crime.crime_id);
                        setUpdatedDetails({
                          Type_of_Crime: crime.Type_of_Crime,
                          Exact_Crime: crime.Exact_Crime,
                          Date_of_Crime: crime.Date_of_Crime,
                          Time_of_Crime: crime.Time_of_Crime,
                          Location: crime.Location,
                          Victim_Name: crime.Victim_Name,
                          Victim_Contact: crime.Victim_Contact,
                          user_id: id,
                        });
                      }}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-150 ease-in-out mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(crime.crime_id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700 transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
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
