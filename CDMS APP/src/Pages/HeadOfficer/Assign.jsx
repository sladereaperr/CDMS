import { React, useState } from "react";
import CrimeRecords from "./CrimeRecords";
import OfficerList from "./OfficerList";
import api from "../../api/posts"; // Assuming you are using axios or similar for API calls

const Assign = () => {
  const [selectedCrime, setSelectedCrime] = useState(null); // Crime can only be one, so initialize as null
  const [selectedOfficers, setSelectedOfficers] = useState([]);

  const assignOfficersToCrime = async () => {
    if (!selectedCrime || selectedOfficers.length === 0) {
      alert("Please select a crime and at least one officer.");
      return;
    }

    try {
      // Send the data to the backend API for inserting into the investigations table
      const response = await api.post("/Assign", {
        crime_id: selectedCrime,
        officers: selectedOfficers,
      });

      if (response.data.success) {
        console.log("Officers assigned successfully!");
      } else {
        console.log("Error assigning officers. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning officers:", error);
      alert("Error assigning officers. Please try again.");
    }
  };

  return (
    <>
      <CrimeRecords
        selectedCrime={selectedCrime} // This is correct
        setSelectedCrime={setSelectedCrime} // Change this to singular
      />
      <OfficerList setSelectedOfficers={setSelectedOfficers} />

      <div className="mt-4">
        <button
          onClick={assignOfficersToCrime}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Assign Officers to Crime
        </button>
      </div>
    </>
  );
};

export default Assign;
