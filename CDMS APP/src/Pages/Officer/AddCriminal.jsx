import React, { useEffect, useState } from "react";
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
      min="0" // Ensure the input value is greater than or equal to 0
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const AddCriminal = () => {
  const { user } = useUser();
  const id = user.id;
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [formData, setFormData] = useState({
    Name: "",
    Date_of_Birth: "",
    Status: "",
    Gender: "",
    Height: "",
    Weight: "",
    Eye_Color: "",
    Hair_Color: "",
    Skin_Tone: "",
    Build: "",
    Tattoos: "",
    No_of_Tattoos: "",
    Blood_Type: "",
    Crime_Category: "",
    Convictions: "",
    Last_Known_Address: "",
    Warrant_Status: "",
    Phone_Number: "",
    Known_Email_Address: "",
    Crime_ID: null,
  });
  const [investigationIds, setInvestigationIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/Investigations`, { params: { id } });
        setInvestigationIds(response.data); // Assuming response contains array of IDs
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSubmit = {
      ...formData,
      Height: formData.Height ? parseFloat(formData.Height) : null,
      Weight: formData.Weight ? parseFloat(formData.Weight) : null,
      No_of_Tattoos: formData.No_of_Tattoos
        ? parseInt(formData.No_of_Tattoos)
        : null,
      Convictions: formData.Convictions ? parseInt(formData.Convictions) : null,
    };

    try {
      const response = await api.post("/Investigations", formDataToSubmit);
      console.log(response);

      setFormData({
        Name: "",
        Date_of_Birth: "",
        Status: "",
        Gender: "",
        Height: "",
        Weight: "",
        Eye_Color: "",
        Hair_Color: "",
        Skin_Tone: "",
        Build: "",
        Tattoos: "",
        No_of_Tattoos: "",
        Blood_Type: "",
        Crime_Category: "",
        Convictions: "",
        Last_Known_Address: "",
        Warrant_Status: "",
        Phone_Number: "",
        Known_Email_Address: "",
        Crime_ID: null,
      });
      setShowForm(false);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the value is not a number or less than 0, prevent the change
    if (name === "No_of_Tattoos" && (value < 0 || isNaN(value))) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-150 ease-in-out"
      >
        {showForm ? "Cancel" : "Add Criminal"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto space-y-4"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            New Criminal Record
          </h2>

          <div>
            <label
              htmlFor="Crime_ID"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Crime ID
            </label>
            {investigationIds && investigationIds.length > 0 ? (
              investigationIds.map((investigation) => (
                <div
                  key={investigation.crime_ID}
                  className="flex items-center mb-2"
                >
                  <input
                    type="radio"
                    id={`investigation-${investigation.crime_ID}`}
                    name="Crime_ID"
                    value={investigation.crime_ID}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`investigation-${investigation.crime_ID}`}
                    className="text-gray-700"
                  >
                    {investigation.crime_ID}
                  </label>
                </div>
              ))
            ) : (
              <p>No available investigations.</p>
            )}
          </div>

          {/* Add fields for each column */}

          <InputField
            label="Name"
            type="text"
            name="Name"
            value={formData.Name}
            handleChange={handleInputChange}
            required={true}
          />

          <InputField
            label="Date of Birth"
            type="date"
            name="Date_of_Birth"
            value={formData.Date_of_Birth}
            handleChange={handleInputChange}
            required={true}
          />

          <div>
            <label
              htmlFor="Status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              name="Status"
              id="Status"
              value={formData.Status}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="*">Select Status</option>
              <option value="Free">Free</option>
              <option value="Incarcerated">Incarcerated</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="Gender"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Gender
            </label>
            <select
              name="Gender"
              id="Gender"
              value={formData.Gender}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="*">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <InputField
            label="Height"
            type="number"
            name="Height"
            value={formData.Height}
            handleChange={handleInputChange}
            required={false}
          />

          <InputField
            label="Weight"
            type="number"
            name="Weight"
            value={formData.Weight}
            handleChange={handleInputChange}
            required={false}
          />

          <InputField
            label="Eye Color"
            type="text"
            name="Eye_Color"
            value={formData.Eye_Color}
            handleChange={handleInputChange}
            required={false}
          />

          <InputField
            label="Hair Color"
            type="text"
            name="Hair_Color"
            value={formData.Hair_Color}
            handleChange={handleInputChange}
            required={false}
          />

          <div>
            <label
              htmlFor="Skin_Tone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Skin Tone
            </label>
            <select
              name="Skin_Tone"
              id="Skin_Tone"
              value={formData.Skin_Tone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="*">Select Skin Tone Type</option>
              <option value="Dark">Dark</option>
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          <InputField
            label="Build"
            type="text"
            name="Build"
            value={formData.Build}
            handleChange={handleInputChange}
            required={false}
          />

          <div>
            <label
              htmlFor="Tattoos"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tattoos
            </label>
            <select
              name="Tattoos"
              id="Tattoos"
              value={formData.Tattoos}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="*">Select Yes/No</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <InputField
            label="Number of Tattoos"
            type="number"
            name="No_of_Tattoos"
            value={formData.No_of_Tattoos}
            handleChange={handleInputChange}
            required={false}
          />

          <div>
            <label
              htmlFor="Blood_Type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Blood Type
            </label>
            <select
              name="Blood_Type"
              id="Blood_Type"
              value={formData.Blood_Type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="*">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="AB+">AB+</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="Crime_Category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Crime Category
            </label>
            <select
              name="Crime_Category"
              id="Crime_Category"
              value={formData.Crime_Category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="*">Select Blood Type</option>
              <option value="A+">Violent Crime</option>
              <option value="A-">Property Crime</option>
              <option value="B+">White-Collar Crime</option>
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
            label="Convictions"
            type="number"
            name="Convictions"
            value={formData.Convictions}
            handleChange={handleInputChange}
            required={false}
          />

          <InputField
            label="Last Known Address"
            type="text"
            name="Last_Known_Address"
            value={formData.Last_Known_Address}
            handleChange={handleInputChange}
            required={false}
          />

          <div>
            <label
              htmlFor="Warrant_Status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Warrant Status
            </label>
            <select
              name="Warrant_Status"
              id="Warrant_Status"
              value={formData.Warrant_Status}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="*">Select Crime Type</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <InputField
            label="Phone Number"
            type="tel"
            name="Phone_Number"
            value={formData.Phone_Number}
            handleChange={handleInputChange}
            required={false}
          />

          <InputField
            label="Known Email Address"
            type="email"
            name="Known_Email_Address"
            value={formData.Known_Email_Address}
            handleChange={handleInputChange}
            required={false}
          />

          <div>
            <input
              type="submit"
              value={loading ? "Submitting..." : "Submit Complaint"} // Change button text when loading
              disabled={loading} // Disable button while loading
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-150 ease-in-out"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default AddCriminal;
