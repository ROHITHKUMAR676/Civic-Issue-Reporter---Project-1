import { useState, useEffect } from "react";
import LocationModal from "../components/LocationModal";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { HiOutlineMap } from "react-icons/hi";
import { HiBell } from "react-icons/hi";
import axios from "axios";

export default function UserDashboard() {

  const navigate = useNavigate();

  // ⭐ IMPORTANT CHANGE
  const [showLocation, setShowLocation] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [latestIssue, setLatestIssue] = useState(null);
  /* ⭐ STATUS STEPS */
const steps = [
  "Pending",
  "Approved",
  "In Progress",
  "Pending Verification",
  "Completed"
];

const currentStep = latestIssue
  ? steps.indexOf(latestIssue.status)
  : -1;

/* ✅ CHECK LOCATION PERMISSION ONLY ONCE */
useEffect(() => {

  const locationAllowed = localStorage.getItem("locationAllowed");

  if (!locationAllowed) {
    setShowLocation(true);
  }

}, []);


useEffect(() => {

  const fetchLatest = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/issues/my-latest",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLatestIssue(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  fetchLatest();

}, []);


/* ✅ FETCH USER */
useEffect(() => {

  const fetchUser = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserName(res.data.name);
      setUserEmail(res.data.email);

    } catch (err) {

      localStorage.removeItem("token");
      navigate("/");
    }
  };

  fetchUser();

}, []);




/* ✅ SAFE LOGOUT */
const handleLogout = () => {

  localStorage.removeItem("token");

  // ⭐ ALSO CLEAR LOCATION
  localStorage.removeItem("locationAllowed");
  localStorage.removeItem("userLat");
  localStorage.removeItem("userLng");

  navigate("/");

};




  return (
    <>

      {/* DASHBOARD (BLURRED WHEN MODAL OPENS) */}
      <div className={showLocation ? "blur-sm pointer-events-none select-none" : ""}>

        <div className="min-h-screen bg-slate-950 text-white">

          {/* NAVBAR */}
          <div className="flex justify-between items-center px-10 py-5 border-b border-white/10">

            <h1 className="text-2xl font-bold tracking-wide">
              CivicAI
            </h1>

            <div className="flex items-center gap-8">

              <button className="hover:text-indigo-400 transition">
                Dashboard
              </button>

              <button
                onClick={() => navigate("/account")}
                className="hover:text-indigo-400 transition"
              >
                Account
              </button>

              <button
                onClick={() => navigate("/inbox")}
                className="relative hover:text-indigo-400 transition">
                <HiBell size={22} />
                <span className="absolute -top-1 -right-2 bg-red-500 w-2 h-2 rounded-full"></span>
              </button>

              <button
                onClick={handleLogout}
                className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Logout
              </button>

            </div>
          </div>


          {/* MAIN */}
          <div className="px-10 py-10">

            {/* HERO */}
            <div className="mb-10">

              <h2 className="text-4xl font-bold mb-2">
                Welcome back, {userName} 👋
              </h2>

              <p className="text-gray-400">
                You are signed in as{" "}
                <span className="text-indigo-400">{userEmail}</span>
              </p>

            </div>


           {/* STATUS TRACKER */}
<div className="bg-slate-900 p-8 rounded-2xl mb-12 border border-white/5">

  <h3 className="text-xl mb-8 font-semibold">
    Complaint Status
  </h3>

  {latestIssue ? (

    <div className="flex items-center justify-between relative">

      {["Pending","Approved","In Progress","Pending Verification","Completed"].map((step, i) => {

        const steps = ["Pending","Approved","In Progress","Pending Verification","Completed"];
        const currentIndex = steps.indexOf(latestIssue.status);

        const completed = i <= currentIndex;

        return (

          <div key={i} className="flex-1 flex flex-col items-center relative">

            {/* LINE */}
            {i !== 0 && (
              <div className={`
                absolute top-6 -left-1/2 w-full h-1
                transition-all duration-700
                ${i <= currentIndex ? "bg-green-500" : "bg-slate-700"}
              `}/>
            )}

            {/* CIRCLE */}
            <div className={`
              w-12 h-12 flex items-center justify-center rounded-full
              font-bold text-lg z-10
              transition-all duration-500
              ${completed ? "bg-green-500 scale-110 shadow-lg shadow-green-500/40" : "bg-slate-700"}
            `}>
              {i+1}
            </div>

            {/* TEXT */}
            <p className={`mt-2 text-sm ${completed ? "text-green-400" : "text-gray-400"}`}>
              {step}
            </p>

          </div>

        );

      })}

    </div>

  ) : (

    <p className="text-gray-400">No complaints submitted yet</p>

  )}

</div>


            {/* ACTION CARDS */}
            <div className="grid md:grid-cols-2 gap-8">

              {/* REPORT ISSUE */}
              <div
                onClick={() => navigate("/report")}
                className="bg-gradient-to-br from-indigo-600 to-indigo-800
                p-8 rounded-2xl cursor-pointer
                hover:scale-105 hover:shadow-indigo-500/30
                transition duration-300 shadow-xl">

                <HiOutlineExclamationCircle size={40} />

                <h3 className="text-2xl font-semibold mt-4">
                  Report an Issue
                </h3>

                <p className="text-indigo-200 mt-2">
                  Notify authorities about civic problems in seconds.
                </p>

              </div>


              {/* COMMUNITY */}
              <div
                onClick={() => navigate("/nearby")}
                className="bg-slate-900 border border-white/5
                p-8 rounded-2xl cursor-pointer
                hover:scale-105 hover:border-indigo-500
                transition duration-300 shadow-xl">

                <HiOutlineMap size={40} className="text-indigo-400" />

                <h3 className="text-2xl font-semibold mt-4">
                  Community Issues
                </h3>

                <p className="text-gray-400 mt-2">
                  Explore problems reported near your location.
                </p>

              </div>

            </div>

          </div>
        </div>

      </div>


      {/* LOCATION MODAL */}
      {showLocation && (
        <LocationModal
          onAllow={() => {
            localStorage.setItem("locationAllowed", "true");
            setShowLocation(false);
          }}
        />
      )}

    </>
  );

}
