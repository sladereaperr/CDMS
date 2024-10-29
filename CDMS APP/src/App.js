import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import UserHome from "./Pages/User/UserHome";
import NavBar from "./NavBar";
import Updates from "./Pages/User/Updates";
import { useUser } from "./Pages/UserContext";

const App = () => {
  // Safely parse and check user data from localStorage
  const { user } = useUser();

  return (
    <Router>
      <div className="App">
        {/* Conditionally render NavBar only if user is logged in */}
        {user && <NavBar />}

        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/UserHome" /> : <Login />}
          />
          {/* {data && data.role === "User" && (
            <> */}
          <Route path="/UserHome" element={<UserHome />} />
          <Route path="/Updates" element={<Updates />} />
          {/* </>
          )} */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
