import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthShell from "../component/AuthShell";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return alert("Password must be at least 6 characters");

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_APP_BACKENDURL}/api/auth/register`, {
        name, email, password, contact, address
      });
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed!");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Register"
      subtitle="Create an account to explore sweets and manage inventory." 
      altText="Already registered?"
      altHref="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input mt-1"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Contact</label>
            <input
              type="text"
              placeholder="Phone"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="input mt-1"
              required
            />
          </div>
        </div>

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

        <div>
          <label className="text-xs font-semibold text-slate-600">Address</label>
          <input
            type="text"
            placeholder="House/Street/City"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input mt-1"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="text-xs text-slate-500">
          By continuing, you agree to follow the shop rules and keep your credentials secure.
        </div>
      </form>
    </AuthShell>
  );
};

export default Register;
