import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/posts";
import { useUser } from "./UserContext";

const Login = () => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const login = { Username, Password };

    try {
      const response = await api.post("/login", login);
      if (response.data.role) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        navigate(
          response.data.role === "User" ? "/UserHome" : `/${response.data.role}`
        );
      } else {
        alert("Incorrect Login Details");
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Login
      </h2>

      <form id="loginForm" className="space-y-6" onSubmit={handleSubmit}>
        {/* Username Field */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            value={Username}
            id="username"
            name="username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your username"
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={Password}
            name="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 transition duration-150 ease-in-out"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
