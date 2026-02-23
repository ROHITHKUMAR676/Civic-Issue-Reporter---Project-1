export default function DeptIssueCard({ issue, onUpload }) {
  return (
    <div className="bg-slate-800 rounded-xl p-5 space-y-3">
      
      <img
        src={issue.imageUrl}
        alt=""
        className="h-40 w-full object-cover rounded"
      />

      <h3 className="text-lg font-semibold">{issue.title}</h3>

      <p className="text-sm text-slate-400">
        {issue.location?.address}
      </p>

      <div className="flex justify-between items-center">
        <span className="px-2 py-1 text-sm rounded bg-indigo-600">
          {issue.priority}
        </span>

        <span
          className={`text-sm ${
            issue.slaStatusComputed.includes("Breached")
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {issue.slaStatusComputed}
        </span>
      </div>

      <button
        onClick={() => onUpload(issue)}
        className="w-full bg-green-500 hover:bg-green-600 py-2 rounded"
      >
        Upload Proof
      </button>
    </div>
  );
}
