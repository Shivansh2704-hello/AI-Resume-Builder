import Layout from "../components/Layout";
import { useEffect, useState } from "react";

function Result() {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("atsResult");

      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("ATS RESULT:", parsed);
        setData(parsed);
      }
    } catch (err) {
      console.error("Error reading result:", err);
    }
  }, []);

  // ✅ If no data
  if (!data) {
    return (
      <Layout>
        <div className="text-white p-6">
          No Data Found ⚠️
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">ATS Result</h1>

      {/* TOP SECTION */}
      <div className="grid grid-cols-2 gap-6">

        {/* SCORE */}
        <div className="bg-[#0f172a] p-6 rounded-xl text-center">
          <h2 className="text-gray-400">ATS Score</h2>
          <p className="text-5xl font-bold text-blue-400 mt-2">
            {data.score || 0}%
          </p>

          <p className="mt-4 text-lg">
            {data.score >= 80 && "🔥 Excellent"}
            {data.score >= 60 && data.score < 80 && "👍 Good"}
            {data.score < 60 && "⚠️ Needs Improvement"}
          </p>
        </div>

        {/* SUGGESTION */}
        <div className="bg-[#0f172a] p-6 rounded-xl">
          <h2 className="text-lg mb-3">Suggestions 💡</h2>
          <p className="text-gray-300">
            {data.suggestion || "No suggestions available"}
          </p>
        </div>

      </div>

      {/* KEYWORDS SECTION */}
      <div className="grid grid-cols-2 gap-6 mt-6">

        {/* MATCHED */}
        <div className="bg-[#0f172a] p-6 rounded-xl">
          <h2 className="text-green-400 mb-3">Matched Keywords ✅</h2>

          {data.matchedKeywords && data.matchedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.matchedKeywords.map((k, i) => (
                <span
                  key={i}
                  className="bg-green-600 px-3 py-1 rounded text-sm"
                >
                  {k}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No matched keywords</p>
          )}
        </div>

        {/* MISSING */}
        <div className="bg-[#0f172a] p-6 rounded-xl">
          <h2 className="text-red-400 mb-3">Missing Keywords ❌</h2>

          {data.missingKeywords && data.missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.missingKeywords.map((k, i) => (
                <span
                  key={i}
                  className="bg-red-600 px-3 py-1 rounded text-sm"
                >
                  {k}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No missing keywords</p>
          )}
        </div>

      </div>

    </Layout>
  );
}

export default Result;