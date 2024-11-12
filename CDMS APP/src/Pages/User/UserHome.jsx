import { React, useState } from "react";
import AddComplaint from "./AddComplaint";
import ShowComplaint from "./ShowComplaint";

const UserHome = () => {
  const [RefreshComponent, setRefreshComponent] = useState(false);
  const onComplaintAdded = () => {
    setRefreshComponent((prev) => !prev);
  };

  return (
    <div className="p-6 space-y-8">
      <ShowComplaint refresh={RefreshComponent} onDelete={onComplaintAdded} />
      <AddComplaint onComplaintAdded={onComplaintAdded} />
    </div>
  );
};

export default UserHome;
