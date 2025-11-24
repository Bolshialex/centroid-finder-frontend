"use client";

import { use, useEffect, useState } from "react";
import { getStatus } from "../../../../api/apiFunctions";

export default function StatusPage({ params }) {
  const { id } = use(params);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

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
      <p>Job ID: <strong>{id}</strong></p>
      
      {status && !status.result && <p>Processing...</p>}
      {error && <p>{error.message}</p>}
      
      {status && (
        <div>
          <p>
            Status: <span>
              {status.status || "Unknown"}
            </span>
          </p>
          {status.status === "done" && status.result && (
              <p>Result: {status.result}</p>
          )}
          {status.status === "error" && status.error && (
              <p>Error: {status.error}</p>
          )}
        </div>
      )}
      
      <Link href="/videos">
        Back to Videos
      </Link>
    </div>
  );
}
