"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ShiftForm() {
  const [formData, setFormData] = useState({
    shiftName: "",
    userName: "",
  });

  const [shiftSearch, setShiftSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [showShiftDropdown, setShowShiftDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const shiftOptions = ["Shift Now", "Shift Later", "Shift Today"];
  const userOptions = ["Alice", "Bob", "Charlie"];

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/assign-shift", formData);
      console.log("Shift assigned successfully:", response.data);
      toast.success("Shift assigned successfully!")
    } catch (error) {
      console.error("Error assigning shift:", error);
      toast.error("Shift assigned successfully!")
    }
  };

  const filteredShiftOptions = shiftOptions.filter((shift) =>
    shift.toLowerCase().includes(shiftSearch.toLowerCase())
  );

  const filteredUserOptions = userOptions.filter((user) =>
    user.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-bold mb-4 text-center text-black">Assign Shift</h2>

      {/* SHIFT NAME */}
      <div className="mb-4 relative">
        <label className="block font-medium mb-1 text-black">Shift Name</label>
        <input
          type="text"
          placeholder="Search shift..."
          value={shiftSearch}
          onChange={(e) => setShiftSearch(e.target.value)}
          onFocus={() => setShowShiftDropdown(true)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
        />
        {showShiftDropdown && (
          <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md max-h-40 overflow-auto">
            {filteredShiftOptions.length > 0 ? (
              filteredShiftOptions.map((shift) => (
                <li
                  key={shift}
                  className="px-3 py-2 hover:bg-yellow-100 cursor-pointer text-black"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, shiftName: shift }));
                    setShiftSearch(shift);
                    setShowShiftDropdown(false);
                  }}
                >
                  {shift}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">No results</li>
            )}
          </ul>
        )}
      </div>

      {/* USER NAME */}
      <div className="mb-4 relative">
        <label className="block font-medium mb-1 text-black">User</label>
        <input
          type="text"
          placeholder="Search user..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          onFocus={() => setShowUserDropdown(true)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
        />
        {showUserDropdown && (
          <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md max-h-40 overflow-auto">
            {filteredUserOptions.length > 0 ? (
              filteredUserOptions.map((user) => (
                <li
                  key={user}
                  className="px-3 py-2 hover:bg-yellow-100 cursor-pointer text-black"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, userName: user }));
                    setUserSearch(user);
                    setShowUserDropdown(false);
                  }}
                >
                  {user}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">No results</li>
            )}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
      >
        Submit
      </button>
    </form>
  );
}
