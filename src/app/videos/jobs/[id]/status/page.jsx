"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getStatus, getCsv } from "../../../../api/apiFunctions";

export default function StatusPage({ params }) {
  const { id } = use(params);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const downloadCsv = async () => {
    try {
      const blob = await getCsv(id);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = status.result || `result-${id}.csv`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading CSV:", err);
      setError("Failed to download CSV.");
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getStatus(id);
        setStatus(data);
      } catch (err) {
        console.error("Failed to fetch status:", err.message);
        setError("Failed to load status.");
      }
    };

    if (id) {
      fetchStatus();
      // Poll every 5 seconds
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [id]);

  return (
    <div>
      <h1>Job Status</h1>
      <p>
        Job ID: <strong>{id}</strong>
      </p>

      {status && !status.result && <p>Processing...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {status && (
        <div>
          <p>
            Status: <span>{status.status || "Unknown"}</span>
          </p>

          {status.status === "done" && status.result && (
            <>
              <p>Result: {status.result}</p>
              <button onClick={downloadCsv}>Download CSV</button>
            </>
          )}

          {status.status === "error" && status.error && (
            <p>Error: {status.error}</p>
          )}
        </div>
      )}

      <Link href="/videos">Back to Videos</Link>
    </div>
  );
}
