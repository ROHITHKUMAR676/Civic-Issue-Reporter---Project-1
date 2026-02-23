import { HiBell, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


export default function Inbox() {

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    const fetchNotifications = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(res.data);

      } catch (err) {

        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchNotifications();

  }, []);




  return (
    <div className="min-h-screen bg-gradient-to-br 
    from-slate-950 via-indigo-950 to-slate-900
    flex items-center justify-center px-6">

      <div className="relative w-full max-w-3xl 
      bg-white/5 backdrop-blur-2xl
      border border-white/10
      rounded-3xl shadow-2xl p-10">

        <button
          onClick={() => {

  const role = localStorage.getItem("role");

  if (role === "admin") navigate("/admin");
  else if (role === "dept") navigate("/dept");
  else navigate("/user");

}}

          className="absolute top-6 right-6 
          text-gray-400 hover:text-white transition"
        >
          <HiX size={26} />
        </button>

        <div className="flex items-center gap-3 mb-8">

          <HiBell className="text-indigo-400" size={28} />

          <h2 className="text-3xl font-bold text-white">
            Inbox
          </h2>

        </div>


        {notifications.length === 0 ? (

          <div className="text-center py-20">

            <HiBell size={50} className="mx-auto text-gray-600 mb-4" />

            <p className="text-gray-400 text-lg">
              No notifications yet
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Updates about your complaints will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

           {notifications.map((note) => (

  <div
    key={note._id}
    className="
      relative
      bg-gradient-to-r from-indigo-950/70 to-slate-900/80
      border border-indigo-500/20
      rounded-2xl
      p-6
      shadow-lg
      hover:border-indigo-400/60
      hover:scale-[1.01]
      transition
    "
  >

    {/* LEFT GLOW BAR */}
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400 rounded-l-2xl"/>

    {/* TITLE + TIME */}
    <div className="flex justify-between items-start mb-2">

      <h3 className="font-semibold text-green-400 text-lg">
        {note.title}
      </h3>

      <span className="text-gray-500 text-xs whitespace-nowrap">
        {new Date(note.createdAt).toLocaleString()}
      </span>

    </div>

    {/* MESSAGE */}
    <p className="text-gray-300 leading-relaxed">
      {note.message}
    </p>

  </div>

))}
          </div>

        )}

      </div>
    </div>
  );
}
