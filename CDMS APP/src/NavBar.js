import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./Pages/UserContext"; // Import useUser hook

const NavBar = () => {
  const { user, setUser } = useUser(); // Destructure setUser from context
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const role = user.role;
  const name = user.firstName;

  // Function to handle logout
  const handleLogout = async () => {
    localStorage.removeItem("user");
    setUser(null); // Clear the user state
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-blue-500 text-white">
      <h1 className="text-2xl font-bold">CDMS</h1>

      <div className="links space-x-4">
        {role === "User" && (
          <>
            <Link to="/UserHome" className="hover:text-gray-300">
              Home
            </Link>
            <Link to="/Updates" className="hover:text-gray-300">
              Updates
            </Link>
          </>
        )}
        {role === "Officer" && (
          <>
            <Link to="/Officer" className="hover:text-gray-300">
              Home
            </Link>
            <Link to="/Investigations" className="hover:text-gray-300">
              Investigations
            </Link>
          </>
        )}
        {role === "HeadOfficer" && (
          <>
            <Link to="/Home" className="hover:text-gray-300">
              Home
            </Link>
            <Link to="/Assign" className="hover:text-gray-300">
              Assign
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <span
          className="cursor-pointer"
          onClick={() => setShowLogout(!showLogout)}
        >
          {name}
        </span>

        {showLogout && (
          <button
            className="ml-4 text-red-400 hover:text-red-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
