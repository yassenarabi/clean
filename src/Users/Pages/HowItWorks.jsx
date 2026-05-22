import { useNavigate } from 'react-router-dom'

const STEPS = [
  {
    step: '01',
    icon: 'bi-camera-fill',
    title: 'Spot & Photograph',
    desc: 'See a waste or civic issue in your neighborhood? Take a clear photo of the problem to help our teams locate it accurately.',
    color: '#16a34a',
    bg: '#dcfce7',
  },
  {
    step: '02',
    icon: 'bi-geo-alt-fill',
    title: 'Pin the Location',
    desc: 'Use auto-detect or manually enter the address. The more precise the location, the faster the response from local authorities.',
    color: '#2563eb',
    bg: '#dbeafe',
  },
  {
    step: '03',
    icon: 'bi-send-fill',
    title: 'Submit Your Report',
    desc: 'Choose a category, add a description, and hit submit. Your report is instantly forwarded to the responsible cleanup team.',
    color: '#d97706',
    bg: '#fef3c7',
  },
  {
    step: '04',
    icon: 'bi-bell-fill',
    title: 'Track & Get Notified',
    desc: 'Follow your report in real-time. You\'ll receive updates when your report is assigned, in progress, or resolved.',
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    step: '05',
    icon: 'bi-star-fill',
    title: 'Earn Points & Badges',
    desc: 'Every verified report earns you points. Climb the leaderboard, unlock civic badges, and become a Community Champion.',
    color: '#dc2626',
    bg: '#fee2e2',
  },
  {
    step: '06',
    icon: 'bi-people-fill',
    title: 'Build Community Impact',
    desc: 'Your contributions add up. Together, citizens are making Cairo, Alexandria, and Giza cleaner, safer, and more livable.',
    color: '#0891b2',
    bg: '#e0f2fe',
  },
]

const FAQS = [
  { q: 'Is CleanCity free to use?',                      a: 'Yes, CleanCity is completely free for all citizens.' },
  { q: 'How long does it take to resolve a report?',     a: 'Resolution time varies by severity. Critical issues are typically addressed within 24–48 hours.' },
  { q: 'Can I report anonymously?',                      a: 'You can submit reports without an account, but creating one lets you track progress and earn points.' },
  { q: 'What types of issues can I report?',             a: 'Waste overflow, broken infrastructure, hazardous materials, flooding, graffiti, and more.' },
  { q: 'How are points calculated?',                     a: 'You earn points for submitting reports, getting upvotes, referring friends, and having reports resolved.' },
]

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#f8f9fa' }}>

      {/* ── Hero ── */}
      <div
        className="text-center py-5"
        style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderBottom: '1px solid #bbf7d0' }}
      >
        <div className="container" style={{ maxWidth: 680 }}>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 64, height: 64, background: '#16a34a' }}
          >
            <i className="bi bi-question-circle-fill text-white" style={{ fontSize: '1.8rem' }} />
          </div>
          <h2 className="fw-bold mb-2" style={{ fontSize: '2rem', color: '#0f172a' }}>How It Works</h2>
          <p className="text-secondary" style={{ fontSize: '.95rem', lineHeight: 1.7 }}>
            CleanCity makes it easy for every citizen to report, track, and resolve civic issues in their neighborhood. Here's everything you need to know.
          </p>
        </div>
      </div>

      {/* ── Steps ── */}
      <div className="container py-5" style={{ maxWidth: 960 }}>
        <div className="text-center mb-5">
          <h3 className="fw-bold mb-2" style={{ fontSize: '1.5rem', color: '#0f172a' }}>6 Simple Steps</h3>
          <div style={{ width: 48, height: 3, background: '#16a34a', borderRadius: 99, margin: '0 auto' }} />
        </div>

        <div className="row g-4">
          {STEPS.map((s, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className="card border shadow-none h-100 p-4" style={{ borderRadius: 14 }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 52, height: 52, background: s.bg }}
                  >
                    <i className={`bi ${s.icon}`} style={{ fontSize: '1.3rem', color: s.color }} />
                  </div>
                  <span className="fw-bold" style={{ fontSize: '1.1rem', color: '#e2e8f0' }}>{s.step}</span>
                </div>
                <div className="fw-bold mb-2" style={{ fontSize: '.95rem', color: '#0f172a' }}>{s.title}</div>
                <div className="text-secondary" style={{ fontSize: '.85rem', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container py-5" style={{ maxWidth: 720 }}>
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-2" style={{ fontSize: '1.4rem', color: '#0f172a' }}>Frequently Asked Questions</h3>
            <div style={{ width: 48, height: 3, background: '#16a34a', borderRadius: 99, margin: '0 auto' }} />
          </div>

          <div className="d-flex flex-column gap-3">
            {FAQS.map((f, i) => (
              <div key={i} className="card border shadow-none p-4" style={{ borderRadius: 12 }}>
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1"
                    style={{ width: 28, height: 28, background: '#dcfce7' }}
                  >
                    <i className="bi bi-question-lg" style={{ fontSize: '.75rem', color: '#16a34a' }} />
                  </div>
                  <div>
                    <div className="fw-semibold mb-1" style={{ fontSize: '.9rem', color: '#0f172a' }}>{f.q}</div>
                    <div className="text-secondary" style={{ fontSize: '.85rem', lineHeight: 1.6 }}>{f.a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="container py-5 text-center" style={{ maxWidth: 600 }}>
        <h3 className="fw-bold mb-2" style={{ fontSize: '1.4rem', color: '#0f172a' }}>Ready to Make a Difference?</h3>
        <p className="text-secondary mb-4" style={{ fontSize: '.9rem' }}>
          Join thousands of citizens already making their cities cleaner.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <button
            className="btn fw-bold px-5 py-2"
            style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.9rem' }}
            onClick={() => navigate('/user/report')}
          >
            Submit a Report
          </button>
          <button
            className="btn fw-semibold px-5 py-2"
            style={{ border: '1.5px solid #e2e8f0', background: '#fff', color: '#334155', borderRadius: 8, fontSize: '.9rem' }}
            onClick={() => navigate('/user/dashboard')}
          >
            View Dashboard
          </button>
        </div>
      </div>

    </div>
  )
}