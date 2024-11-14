import React, { useState, useEffect } from "react";
import api from "../../api/posts";
import { useUser } from "../UserContext";

// Reusable input field component
const InputField = ({
  label,
  type,
  name,
  value,
  handleChange,
  required,
  readOnly,
}) => (
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
      readOnly={readOnly} // Ensure readOnly is passed here
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const getCurrentDateTime = () => {
  const now = new Date();
  return now.toISOString().slice(0, 16); // Removes the seconds and milliseconds to fit `datetime-local` format
};

const AddEvidence = () => {
  const { user } = useUser();
  const id = user.id;
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    officer_id: id,
    evidence_type: "",
    collection_date: getCurrentDateTime(),
    storage_location: null, // For file input
    description: "",
    crime_id: "", // Field to store selected crime ID
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      storage_location: e.target.files[0], // Storing the file in the state
    });
  };

  const handleCrimeSelection = (e) => {
    setFormData({
      ...formData,
      crime_id: e.target.value, // Set selected crime ID
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("evidence_type", formData.evidence_type);
    formDataToSubmit.append("storage_location", formData.storage_location); // Appending the file
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("crime_id", formData.crime_id); // Append selected crime ID

    try {
      const response = await api.post("/Evidence", formDataToSubmit);
      console.log(response);

      // Reset form fields
      setFormData((prevFormData) => ({
        ...prevFormData,
        evidence_type: "",
        storage_location: null,
        description: "",
        crime_ID: "",
      }));
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

  return (
    <div className="p-8">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-150 ease-in-out"
      >
        {showForm ? "Cancel" : "Add Evidence"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto space-y-4"
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            New Evidence Record
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
                    onChange={handleCrimeSelection}
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

          <div>
            <label
              htmlFor="evidence_type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Evidence Type
            </label>
            <select
              name="evidence_type"
              id="evidence_type"
              value={formData.evidence_type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Evidence Type</option>
              <option value="Physical">Physical</option>
              <option value="Photographic">Photographic</option>
              <option value="Video">Video</option>
              <option value="Audio">Audio</option>
              <option value="Testimonial">Testimonial</option>
              <option value="Forensic">Forensic</option>
              <option value="Documentary">Documentary</option>
            </select>
          </div>

          <InputField
            label="Collection Date"
            type="datetime-local"
            name="collection_date"
            value={formData.collection_date}
            handleChange={handleInputChange}
            required={true}
            readOnly // Make it read-only
          />

          <div>
            <label
              htmlFor="storage_location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Evidence File
            </label>
            <input
              type="file"
              name="storage_location"
              id="storage_location"
              accept=".pdf, .jpg, .jpeg, .png, .mp4, .mp3"
              onChange={handleFileChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <InputField
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            handleChange={handleInputChange}
            required={false}
          />

          <div>
            <input
              type="submit"
              value={loading ? "Submitting..." : "Submit Evidence"}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-150 ease-in-out"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default AddEvidence;
