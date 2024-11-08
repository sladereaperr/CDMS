import { Link } from "react-router-dom";

const NotFound = ({ user }) => {
  // Determine the appropriate redirect path based on the user's role
  const getRedirectPath = () => {
    if (user) {
      if (user.role === "Officer") {
        return "/Officer";
      } else if (user.role === "User") {
        return "/UserHome";
      } else if (user.role === "HeadOfficer") {
        return "/Home";
      }
    } else {
      return "/login";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="text-xl text-gray-700 mt-4">Page Not Found</p>
      {/* Use Link for redirection based on user's role */}
      <Link
        to={getRedirectPath()}
        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
