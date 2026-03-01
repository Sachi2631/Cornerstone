import React, { useEffect, useState } from "react";
import api, { getToken } from "../services/api";

const AuthProbe: React.FC = () => {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    const t = getToken();
    if (!t) {
      setStatus("no token in storage");
      return;
    }

    api
      .get("/api/auth/me")
      .then((r) => {
        // backend returns { user: ... }
        const u = (r.data as any)?.user ?? r.data;
        setStatus(`ok: ${u?.email ?? "user"}`);
      })
      .catch((e) => {
        setStatus(`fail: ${e?.response?.status ?? "?"} (${e?.message})`);
      });
  }, []);

  return (
    <div style={{ padding: 8, fontFamily: "monospace" }}>
      auth: {status}
    </div>
  );
};

export default AuthProbe;