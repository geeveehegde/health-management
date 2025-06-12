"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RoleForm() {
  const [roleName, setRoleName] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:3000/api/role", { roleName }); // Replace with your actual endpoint
    console.log("Role created:", response.data);
    alert("Role created successfully!")
    toast.success("Role created successfully!");
    setRoleName(""); // Clear input
  } catch (error) {
    console.error("Error creating role:", error);
    toast.error("Failed to create role.");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-black">Role Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="roleName" className="block text-black font-medium mb-2">
            Role Name
          </label>
          <input
            type="text"
            id="roleName"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
