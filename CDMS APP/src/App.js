import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useUser } from "./Pages/UserContext";
import Login from "./Pages/Login";
import UserHome from "./Pages/User/UserHome";
import NavBar from "./NavBar";
import Updates from "./Pages/User/Updates";
import Officer from "./Pages/Officer/Officer";
import Investigations from "./Pages/Officer/Investigations";
import HeadOfficerHome from "./Pages/HeadOfficer/HeadOfficerHome";
import NotFound from "./Pages/NotFound";
import Assign from "./Pages/HeadOfficer/Assign";

// Function to determine whether to show the NavBar
export const shouldShowNavBar = (user, currentPath) => {
  if (!user || currentPath === "/login") return false;

  // If the user is logged in, we show the NavBar unless they are on a random/404 page
  const validRoutesForRole = {
    Officer: ["/Officer", "/Investigations"],
    User: ["/UserHome", "/Updates"],
    HeadOfficer: ["/Home"],
  };

  // Check if the current path is valid for the user's role
  return validRoutesForRole[user.role]?.includes(currentPath) || true;
};

const App = () => {
  const { user } = useUser();
  const currentPath = window.location.pathname;

  return (
    <Router>
      <div className="App">
        {/* Conditionally render the NavBar if user is logged in and not on the login or NotFound page */}
        {shouldShowNavBar(user, currentPath) && <NavBar />}

        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Prevent access to login page if user is already logged in */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate
                  to={
                    user.role === "Officer"
                      ? "/Officer"
                      : user.role === "User"
                      ? "/UserHome"
                      : "/Home"
                  }
                  replace
                />
              ) : (
                <Login />
              )
            }
          />

          {/* Routes for User */}
          {user && user.role === "User" && (
            <>
              <Route path="/UserHome" element={<UserHome />} />
              <Route path="/Updates" element={<Updates />} />
            </>
          )}

          {/* Routes for Officer */}
          {user && user.role === "Officer" && (
            <>
              <Route path="/Officer" element={<Officer />} />
              <Route path="/Investigations" element={<Investigations />} />
            </>
          )}

          {/* Routes for HeadOfficer */}
          {user && user.role === "HeadOfficer" && (
            <>
              <Route path="/Home" element={<HeadOfficerHome />} />
              <Route path="/Assign" element={<Assign />} />
            </>
          )}

          {/* NotFound Route */}
          <Route path="*" element={<NotFound user={user} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
