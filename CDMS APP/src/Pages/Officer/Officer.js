import React, { useState, useEffect } from "react";
import api from "./../../api/posts";
import CriminalsTable from "./CriminalsTable";

const Officer = () => {
  const [criminals, setCriminals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/Officer");
        setCriminals(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return <CriminalsTable criminals={criminals} />;
};

export default Officer;
