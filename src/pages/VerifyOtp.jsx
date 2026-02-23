import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtp() {

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  const inputs = useRef([]);

  // countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const t = setTimeout(()=>setTimer(timer-1),1000);
    return ()=>clearTimeout(t);
  },[timer]);

  // auto focus next box
  const handleChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index+1].focus();
    }
  };

  // backspace focus previous
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index>0){
      inputs.current[index-1].focus();
    }
  };

  // verify OTP
  const handleVerify = async () => {

    const finalOtp = otp.join("");

    try {

      await axios.post("http://localhost:5000/api/verify-otp",{
        email,
        otp: finalOtp
      });

      alert("Email verified!");
      navigate("/user");

    } catch(err){
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  // resend OTP
  const handleResend = async () => {

    try {

      await axios.post("http://localhost:5000/api/resend-otp",{ email });

      alert("New OTP sent!");
      setTimer(30);
      setError("");

    } catch(err){
      setError("Failed to resend OTP");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">

      <div className="bg-white p-8 rounded-xl w-96 text-center">

        <h2 className="text-xl font-bold mb-4">Verify Email</h2>

        <p className="text-sm mb-4 text-gray-500">
          OTP sent to <b>{email}</b>
        </p>

        {/* OTP BOXES */}
        <div className="flex justify-center gap-2 mb-4">

          {otp.map((data,index)=>(
            <input
              key={index}
              ref={el=>inputs.current[index]=el}
              value={data}
              onChange={(e)=>handleChange(e.target.value,index)}
              onKeyDown={(e)=>handleKeyDown(e,index)}
              maxLength="1"
              className="w-10 h-10 border text-center text-lg rounded"
            />
          ))}

        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleVerify}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Verify OTP
        </button>

        {/* TIMER + RESEND */}
        {timer>0 ? (

          <p className="text-gray-500 mt-3 text-sm">
            Resend available in {timer}s
          </p>

        ) : (

          <button
            onClick={handleResend}
            className="text-blue-600 mt-3 underline"
          >
            Resend OTP
          </button>

        )}

      </div>

    </div>
  );
}