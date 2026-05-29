import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─────────────────────────────────────────────────────────────────────────────
// LocationPicker Component
// A headless Leaflet component (renders nothing visible) that listens for
// map click events and updates the parent form's latitude / longitude fields.
// It must be rendered INSIDE a <MapContainer> to access the Leaflet map context.
// ─────────────────────────────────────────────────────────────────────────────
function LocationPicker({ setForm }) {
  const map = useMapEvents({
    click(e) {
      setForm((f) => ({
        ...f,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      }));
    },
  });

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SignUp Page Component
// Handles user registration for both "Citizen" (user) and "Company" roles.
// Company accounts have extra fields: phone number and a map-based location picker.
// After a successful registration the user is redirected based on their role:
//   admin   → /admin/dashboard
//   company → /company
//   user    → /user/dashboard
// ─────────────────────────────────────────────────────────────────────────────
export default function SignUn() {
  
  const navigate = useNavigate();
  // register() comes from AuthContext — it calls the API and returns the new user object
  const { register } = useAuth();

  // ── Form State ──────────────────────────────────────────────────────────────
  // Holds every field the form needs. company-only fields (phone, lat, lng)
  // are always present but only validated / sent when role === "company".
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "user",
    city_id: "",
    phone: "",        
    latitude: "",    
    longitude: ""     
  });

  // ── UI State ─────────────────────────────────────────────────────────────────
  const [errors, setErrors]       = useState({});   // field-level validation errors
  const [apiError, setApiError]   = useState("");    // top-level API / network error
  const [loading, setLoading]     = useState(false); // disables inputs & button while fetching
  const [showPass, setShowPass]   = useState(false); // toggle password visibility
  const [showConfirm, setShowConfirm] = useState(false); // toggle confirm-password visibility

  // ── Generic field setter ─────────────────────────────────────────────────────
  // Updates a single form field and clears its error so validation feedback
  // disappears as soon as the user starts correcting their input.
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
    setApiError("");
  };

  // ── Client-side Validation ───────────────────────────────────────────────────
  // Returns an object of field-key → error-message pairs.
  // An empty object means the form is valid and can be submitted.
  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Required";

    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";

    if (!form.password) e.password = "Required";
    else if (form.password.length < 6) e.password = "At least 6 characters";

    if (!form.confirm) e.confirm = "Required";
    else if (form.confirm !== form.password)
      e.confirm = "Passwords do not match";

    // City is required for every role
    if (!form.city_id) e.city_id = "City is required";

    // Extra validation only for company accounts
    if (form.role === "company") {
      if (!form.phone) e.phone = "Phone is required";
      if (!form.latitude) e.latitude = "Location required";
      if (!form.longitude) e.longitude = "Location required";
    }

    return e;
  };

  // ── GPS Auto-fill ────────────────────────────────────────────────────────────
  // Uses the browser's Geolocation API to pre-fill lat/lng for company users
  // so they don't have to click the map manually.
  const getLocation = () => {
    if (!navigator.geolocation) {
      setApiError("Geolocation is not supported in your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((f) => ({
          ...f,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      () => {
        setApiError("Failed to get location. Please enable GPS.");
      }
    );
  };

  // ── Form Submit Handler ──────────────────────────────────────────────────────
  // 1. Runs client-side validation; aborts early if there are errors.
  // 2. Builds the request payload — includes a nested `company` object only
  //    when the selected role is "company" (otherwise sends null).
  // 3. Calls register() from AuthContext which handles the actual API request.
  // 4. Redirects to the correct dashboard based on the returned user role.
  // 5. On a 422 (Unprocessable Entity) response the server returns field-level
  //    errors which are mapped back onto the form; any other error shows a
  //    generic message.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      // Build the payload that matches what the Laravel backend expects
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
        role: form.role,
        city_id: form.city_id,

        // The `company` key is only populated for company registrations
        company: form.role === "company"
          ? {
              name: form.name + " Company",
              city_id: form.city_id,
              phone: form.phone,
              coverage_areas: [],
              latitude: form.latitude ? parseFloat(form.latitude) : null,
              longitude: form.longitude ? parseFloat(form.longitude) : null,
            }
          : null
      };

      const user = await register(payload);

      // Redirect based on the role returned by the server
      if (user.role === 'admin') return navigate('/admin/dashboard', { replace: true })
      if (user.role === 'company') return navigate('/company', { replace: true })
      return navigate('/user/dashboard', { replace: true })

    } catch (err) {

      // 422 → server-side validation errors; map them to form fields
      if (err.response?.status === 422) {
        const e = err.response.data?.errors ?? {};
        setErrors({
          name: e.name?.[0] ?? "",
          email: e.email?.[0] ?? "",
          password: e.password?.[0] ?? "",
          confirm: e.password_confirmation?.[0] ?? "",
        });
      } else {
        // Any other error (network, 500, etc.)
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  // Two-column layout:
  //   LEFT  — decorative branding panel (hidden on mobile via d-none d-lg-flex)
  //   RIGHT — the actual registration form
  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      {/* ── LEFT: Branding / Decorative Panel ─────────────────────────────── */}
      {/* Only visible on large screens (≥992 px). Pure cosmetic — no logic. */}
      <div
        className="d-none d-lg-flex flex-column justify-content-between p-5"
        style={{
          width: "48%",
          background:
            "linear-gradient(160deg, #064e3b 0%, #065f46 50%, #047857 100%)",
          borderRadius: "0 32px 32px 0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Brand logo / name */}
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
            style={{
              width: 36,
              height: 36,
              background: "rgba(255,255,255,.2)",
              fontSize: ".8rem",
            }}
          >
            CC
          </div>
          <span className="fw-bold text-white" style={{ fontSize: "1rem" }}>
            CleanCity
          </span>
        </div>

        {/* Fake phone mockup showing the app UI */}
        <div className="d-flex justify-content-center">
          <div
            style={{
              width: 220,
              background: "#111827",
              borderRadius: 32,
              padding: "12px 10px",
              boxShadow: "0 24px 60px rgba(0,0,0,.5)",
            }}
          >
            {/* Phone notch */}
            <div
              style={{
                width: 55,
                height: 8,
                background: "#000",
                borderRadius: 99,
                margin: "0 auto 8px",
              }}
            />
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                height: 320,
                position: "relative",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
                alt="cleanup"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.85,
                }}
              />
              {/* App header overlay */}
              <div
                className="position-absolute top-0 w-100 d-flex align-items-center justify-content-between px-3 py-2"
                style={{ background: "rgba(0,0,0,.35)" }}
              >
                <span
                  className="text-white fw-bold"
                  style={{ fontSize: ".65rem" }}
                >
                  CleanCity
                </span>
                <span className="text-white" style={{ fontSize: ".6rem" }}>
                  Reports
                </span>
              </div>
              {/* App footer overlay */}
              <div
                className="position-absolute bottom-0 w-100 px-3 py-2"
                style={{
                  background: "linear-gradient(transparent,rgba(0,0,0,.6))",
                }}
              >
                <div
                  className="text-white fw-semibold"
                  style={{ fontSize: ".72rem" }}
                >
                  🌿 Keep Egypt Clean
                </div>
              </div>
            </div>
            {/* Fake bottom navigation bar */}
            <div className="d-flex justify-content-around py-2">
              {["🏠", "📋", "📍", "🔔", "👤"].map((ic, i) => (
                <span
                  key={i}
                  style={{ fontSize: ".85rem", opacity: i === 0 ? 1 : 0.4 }}
                >
                  {ic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tagline copy */}
        <div className="text-white">
          <h3 className="fw-bold mb-2" style={{ fontSize: "1.4rem" }}>
            CleanCity
          </h3>
          <p
            style={{
              fontSize: ".85rem",
              opacity: 0.8,
              lineHeight: 1.6,
              maxWidth: 300,
            }}
          >
            Join thousands of citizens making our cities cleaner, greener, and
            more sustainable every day.
          </p>
        </div>
      </div>

      {/* ── RIGHT: Registration Form ───────────────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-center flex-grow-1 p-4">
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h3
            className="fw-bold mb-1"
            style={{ fontSize: "1.6rem", color: "#0f172a" }}
          >
            Create Account
          </h3>
          <p className="text-secondary mb-4" style={{ fontSize: ".88rem" }}>
            By registering you help keep Egypt clean
          </p>

          {/* ── Top-level API / Network Error Banner ──────────────────────── */}
          {/* Shown only when apiError has a value */}
          {apiError && (
            <div
              className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3"
              style={{ fontSize: ".85rem" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
              </svg>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* ── Full Name Field ──────────────────────────────────────────── */}
            <div className="mb-3">
              <label
                className="form-label fw-semibold"
                style={{ fontSize: ".83rem" }}
              >
                Full Name
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="#94a3b8"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z" />
                  </svg>
                </span>
                <input
                  className={`form-control bg-light border-start-0 ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Ahmad Hassan"
                  style={{ fontSize: ".87rem" }}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  disabled={loading}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>
            </div>

            {/* ── Email Field ─────────────────────────────────────────────── */}
            <div className="mb-3">
              <label
                className="form-label fw-semibold"
                style={{ fontSize: ".83rem" }}
              >
                Email
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="#94a3b8"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z" />
                  </svg>
                </span>
                <input
                  type="email"
                  className={`form-control bg-light border-start-0 ${errors.email ? "is-invalid" : ""}`}
                  placeholder="ahmad@example.com"
                  style={{ fontSize: ".87rem" }}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  disabled={loading}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
            </div>

            {/* ── Role / Account Type Selector ────────────────────────────── */}
            {/* Changing this toggles the company-only section below */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Account Type</label>
              <select
                className="form-control bg-light"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              >
                <option value="user">Citizen</option>
                <option value="company">Company</option>
              </select>
            </div>

            {/* ── Company-only Fields ──────────────────────────────────────── */}
            {/* Conditionally rendered when role === "company".
                Includes a phone number input and an interactive Leaflet map
                so the company owner can pin their business location. */}
            {form.role === "company" && (
              <>
                {/* Phone number */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    className="form-control bg-light"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="01000000000"
                  />
                </div>

                {/* Leaflet map — click anywhere to drop a pin and capture lat/lng */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Pick Location</label>

                  <div style={{ height: "250px", borderRadius: "12px", overflow: "hidden" }}>
                    <MapContainer
                      center={[30.0444, 31.2357]} // Default center: Cairo, Egypt
                      zoom={10}
                      style={{ height: "100%", width: "100%" }}
                    >
                      {/* OpenStreetMap tile layer (free, no API key needed) */}
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* Headless click-listener component */}
                      <LocationPicker setForm={setForm} />

                      {/* Show a marker only after the user has clicked the map */}
                      {form.latitude && form.longitude && (
                        <Marker position={[form.latitude, form.longitude]} />
                      )}
                    </MapContainer>
                  </div>

                  {/* Display the selected coordinates as a human-readable confirmation */}
                  {form.latitude && form.longitude && (
                    <div className="mt-2 text-success" style={{ fontSize: ".8rem" }}>
                      Selected: {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── City Dropdown ────────────────────────────────────────────── */}
            {/* city_id maps to the cities table in the backend database.
                Currently hardcoded to 3 cities; consider fetching from an API
                endpoint in the future to avoid updating the frontend on city changes. */}
            <div className="mb-3">
              <label
                className="form-label fw-semibold"
                style={{ fontSize: ".83rem" }}
              >
                City
              </label>

              <select
                className={`form-control bg-light ${errors.city_id ? "is-invalid" : ""}`}
                value={form.city_id}
                onChange={(e) => set("city_id", e.target.value)}
                disabled={loading}
              >
                <option value="">Select City</option>
                <option value="1">Cairo</option>
                <option value="2">Giza</option>
                <option value="3">Sharqia</option>
              </select>

              {errors.city_id && (
                <div className="invalid-feedback">{errors.city_id}</div>
              )}
            </div>

            {/* ── Password Field ───────────────────────────────────────────── */}
            {/* The eye icon toggles between type="password" and type="text"
                via the showPass state flag */}
            <div className="mb-3">
              <label
                className="form-label fw-semibold"
                style={{ fontSize: ".83rem" }}
              >
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="#94a3b8"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  </svg>
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  className={`form-control bg-light border-start-0 border-end-0 ${errors.password ? "is-invalid" : ""}`}
                  placeholder="••••••••"
                  style={{ fontSize: ".87rem" }}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  disabled={loading}
                />
                {/* Toggle password visibility */}
                <span
                  className="input-group-text bg-light"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPass(!showPass)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="#94a3b8"
                    viewBox="0 0 16 16"
                  >
                    {showPass ? (
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                    ) : (
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709zm-2.283 1.73A7.028 7.028 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709C1.84 6.771 1 7.88 1.172 8c.058.087.122.183.195.288.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772zm-2.943-2.602a2.5 2.5 0 0 1-2.829-2.829l.822.822a1.5 1.5 0 0 0 1.185 1.185l.822.822zm1.646-4.474a2.5 2.5 0 0 1 2.829 2.829l-.822-.822a1.5 1.5 0 0 0-1.185-1.185l-.822-.822zM1.172 1.172l13.656 13.656-.708.708L.464 1.88l.708-.708z" />
                    )}
                  </svg>
                </span>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
            </div>

            {/* ── Confirm Password Field ───────────────────────────────────── */}
            {/* Same pattern as the password field above; uses showConfirm state */}
            <div className="mb-4">
              <label
                className="form-label fw-semibold"
                style={{ fontSize: ".83rem" }}
              >
                Confirm Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="#94a3b8"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                  </svg>
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  className={`form-control bg-light border-start-0 border-end-0 ${errors.confirm ? "is-invalid" : ""}`}
                  placeholder="••••••••"
                  style={{ fontSize: ".87rem" }}
                  value={form.confirm}
                  onChange={(e) => set("confirm", e.target.value)}
                  disabled={loading}
                />
                {/* Toggle confirm-password visibility */}
                <span
                  className="input-group-text bg-light"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="#94a3b8"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                  </svg>
                </span>
                {errors.confirm && (
                  <div className="invalid-feedback">{errors.confirm}</div>
                )}
              </div>
            </div>

            {/* ── Submit Button ────────────────────────────────────────────── */}
            {/* Shows a spinner and "Creating account..." text while loading
                and is disabled to prevent duplicate submissions */}
            <button
              type="submit"
              disabled={loading}
              className="btn w-100 fw-bold py-2 mb-4 d-flex align-items-center justify-content-center gap-2"
              style={{
                background: "#16a34a",
                color: "#fff",
                fontSize: ".95rem",
                borderRadius: 10,
                border: "none",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <hr className="my-3" />

          {/* ── Footer Links ──────────────────────────────────────────────── */}
          <div
            className="text-center mb-2"
            style={{ fontSize: ".85rem", color: "#64748b" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="fw-bold text-decoration-none"
              style={{ color: "#16a34a" }}
            >
              Log In
            </Link>
          </div>
          <div className="d-flex justify-content-center gap-3">
            <Link
              to="/privacy"
              className="text-secondary text-decoration-none"
              style={{ fontSize: ".78rem" }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-secondary text-decoration-none"
              style={{ fontSize: ".78rem" }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}