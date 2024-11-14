import React from "react";
import AddCriminal from "./AddCriminal";
import CrimeRec from "./CrimeRec";
import AddEvidence from "./AddEvidence";

const Investigations = () => {
  return (
    <>
      <CrimeRec />
      <AddCriminal />
      <AddEvidence />
    </>
  );
};

export default Investigations;
