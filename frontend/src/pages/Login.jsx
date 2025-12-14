import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthShell from "../component/AuthShell";

const Login = () => {
 
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_APP_BACKENDURL}/api/auth/login`, {
        email, password
      },
  { withCredentials: true }
);
      navigate("/home")
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Login failed!");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Login"
      subtitle="Welcome back. Manage sweets, purchase items, and keep inventory updated."
      altText="Not registered?"
      altHref="/"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input mt-1"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Password</label>
          <input
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full py-3"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-xs text-slate-500">
          Tip: If you just registered, login with the same email and password.
        </div>
      </form>
    </AuthShell>
  );
}

export default Login
