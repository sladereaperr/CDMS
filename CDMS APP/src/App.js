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

const App = () => {
  // Safely parse and check user data from localStorage
  const { user } = useUser();

  return (
    <Router>
      <div className="App">
        {/* Conditionally render NavBar only if user is logged in */}
        {user && <NavBar />}

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/UserHome" /> : <Login />}
          />
          {user && user.role === "User" && (
            <>
              <Route path="/UserHome" element={<UserHome />} />
              <Route path="/Updates" element={<Updates />} />
            </>
          )}
          {user && user.role === "Officer" && (
            <>
              <Route path="/Officer" element={<Officer />} />
              <Route path="/Investigations" element={<Investigations />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
