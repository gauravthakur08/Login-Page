 import { useState } from "react";
import axios from "axios";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

 const API_BASE = import.meta.env.VITE_API_URL;
// Palette (ledger / passbook theme)
const paper = "#F3ECDA";
const paperDark = "#EBE1C9";
const ink = "#242B24";
const inkMuted = "#7A7360";
const ruleRed = "#A33B3B";
const seal = "#8A6D3B";

export default function AuthForm() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isSignup = mode === "signup";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "/register" : "/login";
      const payload = isSignup
        ? formData
        : { email: formData.email, password: formData.password };

      const res = await axios.post(`${API_BASE}${endpoint}`, payload);

      // Save the token so future requests can prove the user is logged in
      localStorage.setItem("token", res.data.token);

      setSuccess(isSignup ? "Account created successfully." : "Signed in successfully.");
      console.log("Server response:", res.data);

      // TODO: redirect to a dashboard page here, e.g. using react-router-dom's useNavigate()
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{ backgroundColor: paperDark }}
    >
      <div
        className="w-full max-w-md relative rounded-sm shadow-2xl overflow-hidden"
        style={{ backgroundColor: paper }}
      >
        <div
          className="absolute left-10 top-0 bottom-0 w-px"
          style={{ backgroundColor: ruleRed, opacity: 0.55 }}
        />
        <div
          className="absolute left-10 top-0 bottom-0 w-px ml-1"
          style={{ backgroundColor: ruleRed, opacity: 0.25 }}
        />

        <div className="pt-10 pb-6 px-12 relative">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[11px] tracking-[0.25em] uppercase mb-1"
                style={{ color: inkMuted, fontFamily: "ui-monospace, monospace" }}
              >
                Account Ledger
              </p>
              <h1
                className="text-3xl leading-tight"
                style={{ color: ink, fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {isSignup ? "New Entry" : "Welcome Back"}
              </h1>
            </div>

            <div
              className="w-11 h-11 rounded-full flex items-center justify-center border-2 shrink-0"
              style={{ borderColor: seal, color: seal }}
            >
              <span className="text-xs tracking-wider" style={{ fontFamily: "Georgia, serif" }}>
                {isSignup ? "N" : "R"}
              </span>
            </div>
          </div>

          <p className="text-sm mt-3" style={{ color: inkMuted }}>
            {isSignup
              ? "Record your details to open an account."
              : "Enter your credentials to access your account."}
          </p>
        </div>

        <div className="px-12 flex gap-6 relative" style={{ borderBottom: `1px solid ${paperDark}` }}>
          <button
            type="button"
            onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
            className="pb-3 text-sm tracking-wide transition-colors relative"
            style={{ color: !isSignup ? ink : inkMuted, fontFamily: "ui-monospace, monospace" }}
          >
            SIGN IN
            {!isSignup && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px]" style={{ backgroundColor: ruleRed }} />
            )}
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
            className="pb-3 text-sm tracking-wide transition-colors relative"
            style={{ color: isSignup ? ink : inkMuted, fontFamily: "ui-monospace, monospace" }}
          >
            CREATE ACCOUNT
            {isSignup && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px]" style={{ backgroundColor: ruleRed }} />
            )}
          </button>
        </div>

        <form className="px-12 pt-8 pb-10 space-y-6" onSubmit={handleSubmit}>
          {isSignup && (
            <Field
              index="01"
              label="Full Name"
              name="name"
              type="text"
              placeholder="Jordan Blake"
              icon={<User size={16} />}
              value={formData.name}
              onChange={handleChange}
              ink={ink}
              inkMuted={inkMuted}
              ruleRed={ruleRed}
            />
          )}

          <Field
            index={isSignup ? "02" : "01"}
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={16} />}
            value={formData.email}
            onChange={handleChange}
            ink={ink}
            inkMuted={inkMuted}
            ruleRed={ruleRed}
          />

          <Field
            index={isSignup ? "03" : "02"}
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={<Lock size={16} />}
            value={formData.password}
            onChange={handleChange}
            ink={ink}
            inkMuted={inkMuted}
            ruleRed={ruleRed}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: ink }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {error && (
            <p className="text-xs" style={{ color: ruleRed }}>{error}</p>
          )}
          {success && (
            <p className="text-xs" style={{ color: "#3B7A3B" }}>{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-sm text-sm tracking-[0.15em] uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            style={{ backgroundColor: ink, color: paper, fontFamily: "ui-monospace, monospace" }}
          >
            {loading ? "Please wait…" : isSignup ? "Open Account" : "Sign In"}
            {!loading && <ArrowRight size={15} />}
          </button>

          <p className="text-center text-xs pt-2" style={{ color: inkMuted }}>
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(isSignup ? "signin" : "signup")}
              className="underline underline-offset-2 hover:opacity-70"
              style={{ color: ruleRed }}
            >
              {isSignup ? "Sign in" : "Create one"}
            </button>
          </p>
        </form>

        <div
          className="px-12 py-4 text-center text-[10px] tracking-[0.2em] uppercase"
          style={{ color: inkMuted, backgroundColor: paperDark, fontFamily: "ui-monospace, monospace" }}
        >
          Entries Verified &amp; Secured
        </div>
      </div>
    </div>
  );
}

function Field({ index, label, name, type, placeholder, icon, trailing, value, onChange, ink, inkMuted, ruleRed }) {
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="flex items-baseline gap-2 text-[11px] tracking-[0.2em] uppercase mb-2"
        style={{ color: inkMuted, fontFamily: "ui-monospace, monospace" }}
      >
        <span style={{ color: ruleRed }}>{index}</span>
        {label}
      </label>
      <div className="flex items-center gap-3 pb-2" style={{ borderBottom: `1px solid ${inkMuted}55` }}>
        <span style={{ color: inkMuted }}>{icon}</span>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="w-full bg-transparent outline-none text-[15px] placeholder:opacity-40"
          style={{ color: ink }}
        />
        {trailing}
      </div>
    </div>
  );
}