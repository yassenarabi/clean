import { useState, useRef } from "react";

const INITIAL_ZONES = [
  "Downtown Central",
  "Highland Park",
  "West End",
  "Industrial Zone",
  "Northside",
];

export default function CompanyProfile() {
  const coverRef = useRef(null);
  const logoRef = useRef(null);

  const [cover, setCover] = useState(null);
  const [logo, setLogo] = useState(null);
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [newZone, setNewZone] = useState("");
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({
    name: "CleanCity Metro Operations Ltd.",
    regNum: "CC-45092-EG",
    email: "ops@cleancity.metro",
    phone: "+20 10 2345 6789",
    website: "www.cleancity.metro",
    founded: "2018",
  });

  const removeZone = (z) => setZones((prev) => prev.filter((x) => x !== z));
  const addZone = () => {
    if (newZone.trim() && !zones.includes(newZone.trim())) {
      setZones((prev) => [...prev, newZone.trim()]);
      setNewZone("");
    }
  };

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      {/* Topbar */}
      <div
        className="d-flex align-items-center justify-content-between bg-white border-bottom px-4 sticky-top"
        style={{ height: 56, zIndex: 100 }}
      >
        <span className="fw-bold text-primary" style={{ fontSize: "1.1rem" }}>
          Company Profile
        </span>
        <div className="d-flex align-items-center gap-2">
          <button className="btn p-1 border-0 bg-transparent position-relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="#6c757d"
              viewBox="0 0 16 16"
            >
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z" />
            </svg>
            <span
              className="position-absolute bg-danger rounded-circle border border-white"
              style={{ width: 7, height: 7, top: 2, right: 2 }}
            />
          </button>
          <div
            className="d-flex align-items-center gap-2 bg-light border rounded-pill"
            style={{ padding: "3px 12px 3px 3px" }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{
                width: 30,
                height: 30,
                fontSize: ".68rem",
                background: "linear-gradient(135deg,#0d6efd,#6f42c1)",
              }}
            >
              OL
            </div>
            <div style={{ lineHeight: 1.25 }}>
              <div className="fw-semibold" style={{ fontSize: ".8rem" }}>
                Ops Lead
              </div>
              <div className="text-secondary" style={{ fontSize: ".65rem" }}>
                Metro Division
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="row g-3">
          {/* ── LEFT COLUMN ── */}
          <div className="col-lg-7">
            {/* Cover + Logo */}
            <div className="card border shadow-none mb-3 overflow-hidden">
              {/* Cover */}
              <div
                className="position-relative"
                style={{
                  height: 140,
                  background: cover
                    ? `url(${cover}) center/cover`
                    : "linear-gradient(135deg,#1d4ed8,#2563eb)",
                  cursor: "pointer",
                }}
                onClick={() => coverRef.current.click()}
              >
                <input
                  ref={coverRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) setCover(URL.createObjectURL(f));
                  }}
                />
              </div>

              {/* Logo + Name */}
              <div className="px-4 pb-3">
                <div
                  className="d-flex align-items-end justify-content-between"
                  style={{ marginTop: -36 }}
                >
                  <div
                    className="rounded-circle border border-white overflow-hidden flex-shrink-0"
                    style={{
                      width: 72,
                      height: 72,
                      background: "#fff",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,.15)",
                      border: "3px solid #fff",
                      zIndex: 10,
                      position: "relative",
                    }}
                    onClick={() => logoRef.current.click()}
                  >
                    {logo ? (
                      <img
                        src={logo}
                        alt="logo"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="w-100 h-100 d-flex align-items-center justify-content-center fw-bold text-white"
                        style={{
                          background: "linear-gradient(135deg,#0d6efd,#16a34a)",
                          fontSize: "1.1rem",
                        }}
                      >
                        CC
                      </div>
                    )}
                    <input
                      ref={logoRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files[0];
                        if (f) setLogo(URL.createObjectURL(f));
                      }}
                    />
                  </div>

                  <button
                    className="btn btn-outline-primary btn-sm fw-semibold d-flex align-items-center gap-1 mb-1"
                    onClick={() => setEditing(!editing)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>

                <div className="mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="fw-bold"
                      style={{ fontSize: "1.2rem", color: "#0f172a" }}
                    >
                      CleanCity Metro Operations
                    </span>
                    <span
                      className="badge fw-semibold rounded-pill d-flex align-items-center gap-1"
                      style={{
                        background: "#dcfce7",
                        color: "#16a34a",
                        fontSize: ".72rem",
                      }}
                    >
                      ✓ Verified
                    </span>
                  </div>
                  <div
                    className="text-secondary"
                    style={{ fontSize: ".83rem" }}
                  >
                    Premier Waste & Logistics Management
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="card border shadow-none mb-3">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <span className="fw-bold" style={{ fontSize: ".95rem" }}>
                    Company Information
                  </span>
                  <button
                    className="btn p-1 border-0 bg-transparent"
                    onClick={() => setEditing(!editing)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      fill="#64748b"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                    </svg>
                  </button>
                </div>

                <div className="row g-3">
                  {[
                    { label: "Company Name", key: "name", col: 6 },
                    { label: "Registration Number", key: "regNum", col: 6 },
                    { label: "Contact Email", key: "email", col: 6 },
                    { label: "Phone Number", key: "phone", col: 6 },
                    { label: "Website", key: "website", col: 6 },
                    { label: "Founded Year", key: "founded", col: 6 },
                  ].map((f) => (
                    <div key={f.key} className={`col-md-${f.col}`}>
                      <div
                        className="text-secondary mb-1"
                        style={{ fontSize: ".75rem", fontWeight: 600 }}
                      >
                        {f.label}
                      </div>
                      {editing ? (
                        <input
                          className="form-control form-control-sm"
                          style={{ fontSize: ".87rem" }}
                          value={info[f.key]}
                          onChange={(e) =>
                            setInfo((i) => ({ ...i, [f.key]: e.target.value }))
                          }
                        />
                      ) : (
                        <div
                          style={{
                            fontSize: ".87rem",
                            color: f.key === "website" ? "#0d6efd" : "#1e293b",
                            cursor: f.key === "website" ? "pointer" : "default",
                          }}
                        >
                          {info[f.key]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {editing && (
                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary btn-sm fw-semibold"
                      onClick={() => setEditing(false)}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Operational Coverage */}
            <div className="card border shadow-none">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-bold" style={{ fontSize: ".95rem" }}>
                    Operational Coverage
                  </span>
                  <button
                    className="btn btn-link btn-sm p-0 text-primary fw-semibold text-decoration-none"
                    style={{ fontSize: ".82rem" }}
                    onClick={() =>
                      document.getElementById("zone-input").focus()
                    }
                  >
                    + Add Zone
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {zones.map((z) => (
                    <span
                      key={z}
                      className="d-flex align-items-center gap-1 border rounded-pill px-3 py-1"
                      style={{
                        fontSize: ".82rem",
                        background: "#fff",
                        color: "#334155",
                      }}
                    >
                      {z}
                      <button
                        className="btn p-0 border-0 bg-transparent ms-1"
                        style={{
                          lineHeight: 1,
                          color: "#94a3b8",
                          fontSize: ".8rem",
                        }}
                        onClick={() => removeZone(z)}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add zone inline */}
                <div className="d-flex gap-2 mt-3">
                  <input
                    id="zone-input"
                    className="form-control form-control-sm"
                    placeholder="New zone name..."
                    style={{ fontSize: ".83rem", maxWidth: 200 }}
                    value={newZone}
                    onChange={(e) => setNewZone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addZone()}
                  />
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={addZone}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="col-lg-5 d-flex flex-column gap-3">
            {/* Quick Statistics */}
            <div className="card border shadow-none">
              <div className="card-body p-3">
                <div className="fw-bold mb-3" style={{ fontSize: ".95rem" }}>
                  Quick Statistics
                </div>
                <div className="row g-2">
                  {[
                    { label: "Total Reports", value: "4,820" },
                    { label: "Active Team", value: "24" },
                    { label: "Avg Resolution", value: "3.8h" },
                    { label: "Satisfaction", value: "4.8 ★", color: "#f59e0b" },
                  ].map((s, i) => (
                    <div key={i} className="col-6">
                      <div
                        className="p-3 rounded-3 border"
                        style={{ background: "#f8fafc" }}
                      >
                        <div
                          className="text-secondary mb-1"
                          style={{
                            fontSize: ".65rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: ".06em",
                          }}
                        >
                          {s.label}
                        </div>
                        <div
                          className="fw-bold"
                          style={{
                            fontSize: "1.4rem",
                            color: s.color || "#0f172a",
                          }}
                        >
                          {s.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subscription Plan */}
            <div className="card border shadow-none">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fw-bold" style={{ fontSize: ".95rem" }}>
                    Subscription Plan
                  </span>
                  <span
                    className="badge fw-bold px-2 py-1 rounded-2"
                    style={{ background: "#6f42c1", fontSize: ".72rem" }}
                  >
                    Pro
                  </span>
                </div>
                <div
                  className="text-secondary mb-3"
                  style={{ fontSize: ".78rem" }}
                >
                  Next renewal: Oct 15, 2025
                </div>

                <div className="d-flex justify-content-between mb-1">
                  <span
                    className="text-secondary"
                    style={{ fontSize: ".75rem" }}
                  >
                    Reports this month
                  </span>
                  <span
                    className="text-secondary"
                    style={{ fontSize: ".75rem" }}
                  >
                    75% used
                  </span>
                </div>
                <div
                  className="progress mb-1"
                  style={{ height: 6, borderRadius: 99 }}
                >
                  <div className="progress-bar" style={{ width: "75%" }} />
                </div>
                <div
                  className="text-end text-secondary mb-3"
                  style={{ fontSize: ".73rem" }}
                >
                  750 / 1000 reports
                </div>

                <button className="btn btn-primary w-100 fw-bold">
                  Upgrade Plan
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div
              className="card shadow-none"
              style={{ border: "1.5px solid #fca5a5", background: "#fff5f5" }}
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#ef4444"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>
                  <span
                    className="fw-bold text-danger"
                    style={{ fontSize: ".95rem" }}
                  >
                    Danger Zone
                  </span>
                </div>

                <div
                  className="mb-3 pb-3 border-bottom"
                  style={{ borderColor: "#fca5a5 !important" }}
                >
                  <div
                    className="fw-semibold mb-1"
                    style={{ fontSize: ".87rem", color: "#1e293b" }}
                  >
                    Deactivate Account
                  </div>
                  <div
                    className="text-secondary mb-2"
                    style={{ fontSize: ".75rem" }}
                  >
                    Temporarily disable your company profile and all active team
                    access.
                  </div>
                  <button className="btn btn-outline-danger btn-sm fw-semibold">
                    Deactivate Account
                  </button>
                </div>

                <div>
                  <div
                    className="fw-semibold text-danger mb-1"
                    style={{ fontSize: ".87rem" }}
                  >
                    Delete All Data
                  </div>
                  <div
                    className="text-secondary mb-2"
                    style={{ fontSize: ".75rem" }}
                  >
                    Permanently remove all historical reports, team logs, and
                    company records. This action is irreversible.
                  </div>
                  <button className="btn btn-danger btn-sm fw-semibold">
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
