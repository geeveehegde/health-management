'use client'
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Select from "react-select";
import axios from "axios";


export default function StaffPage() {
 const [formState, setFormState] = useState(false);
 const [shifts, setShifts] = useState([]);
 const [formData, setFormData] = useState({
   shiftName: '',
   shiftDate: '',
   shiftType: '',
   maxCapacity: ''
 });

 const fetchShifts = async() => {
  try{
    const response=await axios.get('http://localhost:3000/api/shiftShedule')
    console.log("response",response)

  }catch(err){
          console.error('Error fetching shifts:', err);

  };
 };

 useEffect(() => {
  fetchShifts();
 },[]);

 const handleInputChange = (e: any) => {
   const { name, value } = e.target;
   setFormData(prev => ({
     ...prev,
     [name]: value
   }));
 };

 const handleSelectChange = (selectedOption: any) => {
   setFormData(prev => ({
     ...prev,
     shiftType: selectedOption.value
   }));
 };

const handleSubmit = async (e: any) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:3000/api/shiftShedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shiftName: formData.shiftName,
        date: formData.shiftDate,
        type: formData.shiftType,
        capacity: parseInt(formData.maxCapacity),
      }),
    });

    if (response.ok) {
      setFormData({
        shiftName: '',
        shiftDate: '',
        shiftType: '',
        maxCapacity: '',
      });
      setFormState(false);
      fetchShifts();
    } else {
      console.error('Error creating shift:', response.statusText);
    }
  } catch (error) {
    console.error('Error creating shift:', error);
  }
};

  return (
    <div className="w-screen text-gray-900">
        <div className="w-screen h-30 flex items-center justify-between px-6">
            <h1 className="text-2xl font-bold text-gray-900">Shifts</h1>
            <div className="flex items-center gap-4">
                <Select
                    className="w-48"
                    options={[
                        { value: 'all', label: 'All Shifts' },
                        { value: 'morning', label: 'Morning Shift' },
                        { value: 'evening', label: 'Evening Shift' },
                        { value: 'night', label: 'Night Shift' },
                    ]}
                    placeholder="Filter by shift"
                    isSearchable={true}
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: 'white',
                            borderColor: 'gray',
                            boxShadow: 'none',
                            '&:hover': {
                                borderColor: 'gray',
                            },
                        }),
                    }}
                />
                <button onClick={() => setFormState(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors">Add new shift</button>
            </div>
            <Modal setIsOpen={setFormState} isOpen={formState} title={"Add New Shift"} description={<>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="text-sm font-medium text-gray-700">Shift Name</label>
                <input 
                  type="text" 
                  name="shiftName"
                  value={formData.shiftName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-2" 
                  placeholder="Enter shift name" 
                  required
                />
                
                <label className="text-sm font-medium text-gray-700">Shift Date</label>
                <input 
                  type="date" 
                  name="shiftDate"
                  value={formData.shiftDate}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-2" 
                  required
                />
                <label className="text-sm font-medium text-gray-700">Shift Type</label>
                <Select
                  className="w-full"
                  value={formData.shiftType ? { value: formData.shiftType, label: formData.shiftType.charAt(0).toUpperCase() + formData.shiftType.slice(1) + ' Shift' } : null}
                  onChange={handleSelectChange}
                  options={[
                    { value: 'morning', label: 'Morning Shift' },
                    { value: 'evening', label: 'Evening Shift' },
                    { value: 'night', label: 'Night Shift' },
                  ]}  
                  placeholder="Select shift type"
                  isSearchable={true}
                  styles={{
                    control: (base) => ({
                        ...base,
                        backgroundColor: 'white',
                        borderColor: 'gray',
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: 'gray',
                        },
                    }),
                  }}
                />
                <label className="text-sm font-medium text-gray-700">Maximum Capacity</label>
                <input 
                  type="number" 
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-2" 
                  placeholder="Enter maximum capacity" 
                  required
                  min="1"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">Add Shift</button>
              </form>
              </>}/>
        </div>
        <ul role="list" className="divide-y divide-gray-100">
        {shifts.map((shift: any) => (
            <li key={shift._id || shift.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
                <div className="size-12 flex-none rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {shift.type?.charAt(0).toUpperCase() || 'S'}
                  </span>
                </div>
                <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">{shift.name}</p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">{shift.date}</p>
                </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm/6 text-gray-900">{shift.type} Shift</p>
                <p className="mt-1 text-xs/5 text-gray-500">
                    Capacity: {shift.maxCapacity}
                </p>
            </div>
            </li>
        ))}
        </ul>
    </div>
    
  )
}
