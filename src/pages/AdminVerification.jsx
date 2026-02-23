import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Search } from "lucide-react";

function AdminVerification() {

  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  //////////////////////////////////////////////////////
  // FETCH
  //////////////////////////////////////////////////////

  const fetchIssues = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/issues/verification",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setIssues(res.data);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  //////////////////////////////////////////////////////
  // VERIFY
  //////////////////////////////////////////////////////

  const approveIssue = async (id) => {

    await axios.put(
      `http://localhost:5000/api/issues/${id}/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchIssues();
  };

  //////////////////////////////////////////////////////
  // FILTER
  //////////////////////////////////////////////////////

  const filtered = issues.filter(issue =>
    issue.title.toLowerCase().includes(search.toLowerCase())
  );

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="text-white">

      {/* HEADER */}
      <div className="flex justify-between mb-10">

        <h1 className="text-3xl font-bold">
          Completion Verification ✅
        </h1>

        <input
          placeholder="Search completed issues..."
          className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 outline-none"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>

      {/* CARDS */}

      <div className="grid md:grid-cols-2 gap-6">

        {filtered.map(issue => (

          <div
            key={issue._id}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4"
          >

            <h2 className="text-xl font-semibold">
              {issue.title}
            </h2>

            {/* BEFORE / AFTER */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-sm text-slate-400 mb-1">
                  BEFORE
                </p>

                <img
                  src={issue.imageUrl}
                  className="rounded-xl h-40 w-full object-cover"
                />
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-1">
                  AFTER
                </p>

                <img
                  src={issue.departmentProofImage}
                  className="rounded-xl h-40 w-full object-cover"
                />
              </div>

            </div>

            <p className="text-slate-400">
              📍 {issue.location?.address}
            </p>

            <p className="text-indigo-300">
              Dept: {issue.department}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-4">

              <button
                onClick={()=>approveIssue(issue._id)}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-xl flex items-center justify-center gap-2"
              >
                <CheckCircle size={18}/>
                Approve
              </button>

              <button
                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl flex items-center justify-center gap-2"
              >
                <XCircle size={18}/>
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AdminVerification;
