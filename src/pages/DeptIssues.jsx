import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function DeptIssues() {

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/issues/dept/issues",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIssues(res.data);

      // refresh drawer issue also
      if (selectedIssue) {
        const updated = res.data.find(i => i._id === selectedIssue._id);
        if (updated) setSelectedIssue(updated);
      }

    } catch (err) {
      console.error("Failed to load issues", err);
    }
  };

  /* ---------- START WORK ---------- */
  const startWork = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/issues/dept/issues/${id}/status`,
        { status: "In Progress" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Work started");

      await fetchIssues();

    } catch (err) {
      console.log(err);
    }
  };

  /* ---------- UPLOAD PROOF ---------- */
  const uploadProof = async (file, id) => {

    const formData = new FormData();
    formData.append("image", file);

    try {

      const res = await axios.put(
        `http://localhost:5000/api/issues/dept/issues/${id}/proof`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Proof uploaded");

      await fetchIssues();

    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    }
  };

  /* ---------- SEND FOR VERIFICATION ---------- */
  const sendForVerification = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/issues/dept/issues/${id}/status`,
        { status: "Pending Verification" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Sent to admin for verification");

      await fetchIssues();

    } catch (err) {
      console.error("Completion failed", err);
    }
  };

  const openIssue = (issue) => {
    setSelectedIssue(issue);
  };

  return (

    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Department Issues</h2>

      {issues.map((issue) => (

        <div
          key={issue._id}
          onClick={() => openIssue(issue)}
          className="
              cursor-pointer
              bg-gradient-to-b from-[#1e293b] to-[#020617]
              border border-slate-700/40
              rounded-3xl p-6
              shadow-xl
              flex gap-6
              hover:scale-[1.02]
              transition
          "
        >

          <img
            src={issue.imageUrl}
            alt="issue"
            className="h-40 w-56 object-cover rounded-xl"
          />

          <div>

            <h3 className="text-xl font-semibold">{issue.title}</h3>

            <p className="text-slate-400 text-sm">
              {issue.location?.address}
            </p>

            <div className="text-indigo-400 text-sm">
              Status: {issue.status}
            </div>

          </div>

        </div>

      ))}


{/* ===== RIGHT DRAWER ===== */}

{selectedIssue && (

<div className="fixed inset-0 z-50 flex">

  <div
    className="flex-1 bg-black/50"
    onClick={() => setSelectedIssue(null)}
  />

  <div className="w-[550px] bg-[#020617] h-full p-6 overflow-y-auto">

    <button
      onClick={() => setSelectedIssue(null)}
      className="text-slate-400 mb-4"
    >
      ✕ Close
    </button>

    <h2 className="text-2xl font-bold mb-4">
      {selectedIssue.title}
    </h2>

    <img
      src={selectedIssue.imageUrl}
      alt="issue"
      className="rounded-xl h-56 w-full object-cover mb-4"
    />

    {selectedIssue.location?.coordinates && (

      <div className="h-44 rounded-xl overflow-hidden mb-4">

        <MapContainer
          center={[
            selectedIssue.location.coordinates[1],
            selectedIssue.location.coordinates[0],
          ]}
          zoom={15}
          className="h-full w-full"
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker
            position={[
              selectedIssue.location.coordinates[1],
              selectedIssue.location.coordinates[0],
            ]}
          >
            <Popup>{selectedIssue.title}</Popup>
          </Marker>

        </MapContainer>

      </div>

    )}

    {selectedIssue.departmentProofImage && (

      <div className="mb-4">
        <p className="text-sm text-slate-400 mb-2">
          Department Proof
        </p>
        <img
          src={selectedIssue.departmentProofImage}
          alt="proof"
          className="h-40 rounded-xl object-cover"
        />
      </div>

    )}

    <div className="flex gap-3">

      {selectedIssue.status === "Approved" && (

        <button
          onClick={() => startWork(selectedIssue._id)}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold"
        >
          Start Work
        </button>

      )}

      {selectedIssue.status === "In Progress" &&
        !selectedIssue.departmentProofImage && (

        <label className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold cursor-pointer">

          Upload Proof

          <input
            type="file"
            hidden
            onChange={(e) =>
              uploadProof(
                e.target.files[0],
                selectedIssue._id
              )
            }
          />

        </label>

      )}

      {selectedIssue.departmentProofImage &&
        selectedIssue.status !== "Completed" && (

        <button
          onClick={() =>
            sendForVerification(selectedIssue._id)
          }
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
        >
          Send For Verification
        </button>

      )}

      {selectedIssue.status === "Completed" && (
        <div className="text-green-400 font-bold">
          ✅ Completed by Admin
        </div>
      )}

    </div>

  </div>

</div>

)}

    </div>
  );
}

export default DeptIssues;
