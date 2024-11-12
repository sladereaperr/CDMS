import React, { useEffect, useState } from "react";
import api from "../../api/posts";
import { useUser } from "../UserContext";

const InputField = ({ label, type, name, value, handleChange, required }) => (
  <div className="mb-4">
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
  const [editCrimeId, setEditCrimeId] = useState(null);
  const [UpdatedDetails, setUpdatedDetails] = useState({
    Type_of_Crime: "",
    Date_of_Crime: "",
    Time_of_Crime: "",
    Location: "",
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
    <div className="space-y-6">
      {crimeData.length === 0 ? (
        <div className="text-lg font-semibold text-gray-600">
          No complaints found.
        </div>
      ) : (
        crimeData.map((crime) => (
          <div key={crime.id} className="bg-white p-6 rounded-lg shadow-md">
            {editCrimeId === crime.id ? (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(crime.id);
                }}
              >
                <h3 className="text-xl font-semibold mb-4">Edit Complaint</h3>
                <InputField
                  label="Type of Crime"
                  type="text"
                  name="Type_of_Crime"
                  value={UpdatedDetails.Type_of_Crime || crime.Type_of_Crime}
                  handleChange={handleInputChange}
                  required
                />
                <InputField
                  label="Date of Crime"
                  type="date"
                  name="Date_of_Crime"
                  value={UpdatedDetails.Date_of_Crime || crime.Date_of_Crime}
                  handleChange={handleInputChange}
                  required
                />
                <InputField
                  label="Time of Crime"
                  type="time"
                  name="Time_of_Crime"
                  value={UpdatedDetails.Time_of_Crime || crime.Time_of_Crime}
                  handleChange={handleInputChange}
                />
                <InputField
                  label="Location"
                  type="text"
                  name="Location"
                  value={UpdatedDetails.Location || crime.Location}
                  handleChange={handleInputChange}
                  required
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditCrimeId(null)}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p className="font-medium text-gray-700">
                  Type of Crime: {crime.Type_of_Crime}
                </p>
                <p className="text-gray-500">Date: {crime.Date_of_Crime}</p>
                <p className="text-gray-500">Location: {crime.Location}</p>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => setEditCrimeId(crime.id)}
                    className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(crime.id)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ShowComplaint;
