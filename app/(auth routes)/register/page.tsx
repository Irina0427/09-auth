"use client";

import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("/api/auth/signup", { email, password });
      alert("✅ Реєстрація успішна!");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Щось пішло не так");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Sign up</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />

      <button onClick={handleRegister}>Register</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
