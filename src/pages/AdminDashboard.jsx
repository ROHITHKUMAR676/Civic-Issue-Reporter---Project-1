import { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminMap from "../pages/AdminMap";

function AdminDashboard() {

  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchIssues = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/issues",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIssues(res.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchIssues();

  }, []);

  //////////////////////////////////////////////////////
  // STATS
  //////////////////////////////////////////////////////

  const total = issues.length;
  const pending = issues.filter(i => i.status === "Pending").length;
  const approved = issues.filter(i => i.status === "Approved").length;
  const completed = issues.filter(i => i.status === "Completed").length;

  //////////////////////////////////////////////////////
  // FILTERED DATA
  //////////////////////////////////////////////////////

  const pendingIssues = issues.filter(i => i.status === "Pending");
  const verificationQueue = issues.filter(
    i => i.status === "Pending Verification"
  );

  //////////////////////////////////////////////////////
  // DEPT ANALYTICS
  //////////////////////////////////////////////////////

  const deptStats = {};

  issues.forEach(issue => {

    const dept = issue.department || "Unassigned";

    if (!deptStats[dept]) {
      deptStats[dept] = {
        total: 0,
        completed: 0
      };
    }

    deptStats[dept].total++;

    if(issue.status === "Completed")
      deptStats[dept].completed++;
  });

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="space-y-10">

      {/* HERO */}
      <div>
        <h1 className="text-4xl font-bold">
          Admin Command Center 🧠
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor, manage and resolve civic problems efficiently.
        </p>
      </div>


      {/* STATUS BAR */}
      <div className="
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-3xl
        p-6
        flex flex-wrap
        gap-10
        justify-between
      ">

        <Stat icon={<ClipboardList className="text-indigo-400"/>} label="Total Issues" value={total}/>
        <Stat icon={<Clock className="text-yellow-400"/>} label="Pending" value={pending}/>
        <Stat icon={<AlertTriangle className="text-blue-400"/>} label="Approved" value={approved}/>
        <Stat icon={<CheckCircle className="text-green-400"/>} label="Completed" value={completed}/>

      </div>


      <SectionCard
        title="Reported Issues"
        subtitle="Requires admin action"
        button="Open Control Center →"
        onClick={() => navigate("/admin/issues")}
      >

        <div className="flex gap-6 overflow-x-auto pb-2">

          {pendingIssues.slice(0,6).map(issue => (

            <PreviewCard
              key={issue._id}
              issue={issue}
              onClick={() => navigate("/admin/issues")}
            />

          ))}

        </div>

      </SectionCard>



      {/* GRID */}
      <div className="grid lg:grid-cols-2 gap-8">


        <SectionCard
          title="Awaiting Verification"
          subtitle="Completed by departments"
          button="Open →"
          onClick={() => navigate("/admin/verification")}
        >

          {verificationQueue.length === 0 ? (

            <p className="text-slate-400">
              No issues awaiting approval 🎉
            </p>

          ) : (

            <div className="space-y-4">

              {verificationQueue.slice(0,4).map(issue => (

                <MiniCard
                  key={issue._id}
                  issue={issue}
                  onClick={() => navigate("/admin/verification")}
                />

              ))}

            </div>

          )}

        </SectionCard>




        <SectionCard
          title="Department Performance"
          subtitle="Resolution efficiency"
        >

          <div className="space-y-4">

            {Object.entries(deptStats)
              .sort((a,b)=> b[1].total - a[1].total)
              .map(([dept, data]) => (

              <div
                key={dept}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >

                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{dept}</h3>
                  <span className="text-sm text-slate-400">
                    {data.total} issues
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{
                      width: `${(data.completed / data.total) * 100 || 0}%`
                    }}
                  />
                </div>

              </div>

            ))}

          </div>

        </SectionCard>

      </div>


      {/* MAP */}
      <AdminMap issues={issues} />

    </div>
  );
}

//////////////////////////////////////////////////////
// SMALL COMPONENTS (clean architecture)
//////////////////////////////////////////////////////

const Stat = ({icon, label, value}) => (

  <div className="flex items-center gap-4">
    <div className="p-2 bg-white/5 rounded-xl">
      {icon}
    </div>

    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  </div>

);

const SectionCard = ({title, subtitle, button, onClick, children}) => (

  <div className="
    bg-white/5
    backdrop-blur-xl
    border border-white/10
    rounded-3xl
    p-8
  ">

    <div className="flex justify-between mb-6">

      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-slate-400 text-sm">{subtitle}</p>
        )}
      </div>

      {button && (
        <button
          onClick={onClick}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-xl"
        >
          {button}
        </button>
      )}

    </div>

    {children}

  </div>

);

const PreviewCard = ({issue, onClick}) => (

  <div
    onClick={onClick}
    className="
      min-w-[260px]
      bg-white/5
      hover:bg-white/10
      border border-white/10
      rounded-2xl
      cursor-pointer
      transition
    "
  >

    <img
      src={issue.imageUrl}
      className="h-36 w-full object-cover rounded-t-2xl"
    />

    <div className="p-4">

      <h3 className="font-semibold">
        {issue.title}
      </h3>

      <p className="text-xs text-slate-400 line-clamp-2">
        {issue.description}
      </p>

    </div>

  </div>

);

const MiniCard = ({issue, onClick}) => (

  <div
    onClick={onClick}
    className="
      flex gap-4
      bg-white/5
      hover:bg-white/10
      p-3
      rounded-xl
      cursor-pointer
      transition
    "
  >

    <img
      src={issue.departmentProofImage || issue.imageUrl}
      className="w-16 h-16 rounded-lg object-cover"
    />

    <div>
      <p className="font-semibold">{issue.title}</p>
      <p className="text-xs text-green-400">
        Ready for approval
      </p>
    </div>

  </div>

);

export default AdminDashboard;
