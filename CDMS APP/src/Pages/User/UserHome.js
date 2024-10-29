import { React, useState } from "react";
import AddComplaint from "./AddComplaint";
import ShowComplaint from "./ShowComplaint";

const UserHome = () => {
  const [RefreshComponent, setRefreshComponent] = useState(false);
  const onComplaintAdded = () => {
    setRefreshComponent((prev) => !prev);
  };

  return (
    <div>
      <ShowComplaint refresh={RefreshComponent} />
      <AddComplaint onComplaintAdded={onComplaintAdded} />
    </div>
  );
};

export default UserHome;
