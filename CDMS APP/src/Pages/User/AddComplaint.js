import React, { useState } from "react";
import api from "../../api/posts";
import { useUser } from "../UserContext";

// Reusable input field component
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

const AddComplaint = ({ onComplaintAdded }) => {
  const { user } = useUser();
  const id = user.id;
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    Type_of_Crime: "",
    Exact_Crime: "",
    Date_of_Crime: "",
    Time_of_Crime: "",
    Location: "",
    Victim_Name: "",
    Victim_Contact: "",
    user_id: id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/UserHome", formData);
      console.log(response.data);

      // Notify parent component to refresh data
      onComplaintAdded();

      // Reset form after submission
      setFormData({
        Type_of_Crime: "",
        Exact_Crime: "",
        Date_of_Crime: "",
        Time_of_Crime: "",
        Location: "",
        Victim_Name: "",
        Victim_Contact: "",
        user_id: id,
      });
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData);
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-150 ease-in-out"
      >
        {showForm ? "Cancel" : "Add Complaint"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto space-y-4"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            New Complaint
          </h2>

          {/* Crime Type */}
          <div>
            <label
              htmlFor="Type_of_Crime"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Type of Crime
            </label>
            <select
              name="Type_of_Crime"
              id="Type_of_Crime"
              value={formData.Type_of_Crime}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Crime Type</option>
              <option value="Violent Crime">Violent Crime</option>
              <option value="Property Crime">Property Crime</option>
              <option value="White-Collar Crime">White-Collar Crime</option>
              <option value="Organized Crime">Organized Crime</option>
              <option value="Cyber Crime">Cyber Crime</option>
              <option value="Drug-Related Crime">Drug-Related Crime</option>
              <option value="Public Order Crime">Public Order Crime</option>
              <option value="Environmental Crime">Environmental Crime</option>
              <option value="Traffic Violations">Traffic Violations</option>
              <option value="Terrorism and National Security Crimes">
                Terrorism and National Security Crimes
              </option>
              <option value="Hate Crime">Hate Crime</option>
              <option value="Other Crime">Other Crime</option>
            </select>
          </div>

          <InputField
            label="Exact Crime"
            type="text"
            name="Exact_Crime"
            value={formData.Exact_Crime}
            handleChange={handleInputChange}
            required={true}
          />

          <InputField
            label="Date of Crime"
            type="date"
            name="Date_of_Crime"
            value={formData.Date_of_Crime}
            handleChange={handleInputChange}
            required={true}
          />

          <InputField
            label="Time of Crime"
            type="time"
            name="Time_of_Crime"
            value={formData.Time_of_Crime}
            handleChange={handleInputChange}
            required={false}
          />

          <InputField
            label="Location"
            type="text"
            name="Location"
            value={formData.Location}
            handleChange={handleInputChange}
            required={true}
          />

          <InputField
            label="Victim Name"
            type="text"
            name="Victim_Name"
            value={formData.Victim_Name}
            handleChange={handleInputChange}
            required={true}
          />

          <InputField
            label="Victim Contact"
            type="text"
            name="Victim_Contact"
            value={formData.Victim_Contact}
            handleChange={handleInputChange}
            required={true}
          />

          <div>
            <input
              type="submit"
              value="Submit Complaint"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-150 ease-in-out"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default AddComplaint;
