import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-20">

      {/* Hero */}
      <section className="min-h-[80vh] flex flex-col justify-center pb-16">
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30
                        rounded-full px-4 py-1.5 text-xs text-accent font-semibold mb-8 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-accent [animation:pulse2_2s_infinite]" />
          AI-powered solutions — Sunderland
        </div>

        <h1 className="font-display text-[clamp(42px,7vw,80px)] font-extrabold
                       leading-[1.05] tracking-[-2px] mb-6">
          Accelerate your<br />
          <span className="text-white/30" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
            digital employee
          </span>
          <br />
          <span className="bg-gradient-to-r from-accent to-[#00D4AA] bg-clip-text text-transparent">
            experience
          </span>
        </h1>

        <p className="text-lg text-[#8A8FA8] leading-relaxed max-w-xl mb-10">
          We leverage artificial intelligence to help industries solve complex problems
          faster — prototyping solutions that are affordable, scalable, and future-ready.
        </p>

        <div className="flex gap-4 flex-wrap">
          <Link to="/contact"><button className="btn-primary">Get in touch</button></Link>
          <Link to="/past-work"><button className="btn-ghost">See our work</button></Link>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-16 pt-10 border-t border-white/10">
          {[
            { val: '40+',  label: 'Industries served'    },
            { val: '98%',  label: 'Client satisfaction'  },
            { val: '3×',   label: 'Faster prototyping'   },
          ].map(({ val, label }) => (
            <div key={label}>
              <div className="font-display text-3xl font-bold">{val}</div>
              <div className="text-sm text-[#8A8FA8] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento */}
      <section className="grid grid-cols-3 gap-4">
        <div className="glass-card col-span-2 p-7
                        bg-gradient-to-br from-accent/10 to-[#00D4AA]/5">
          <p className="section-label">Core capability</p>
          <h3 className="font-display text-2xl font-bold mb-3">AI Virtual Assistant</h3>
          <p className="text-sm text-[#8A8FA8] leading-relaxed mb-5">
            Our embedded AI assistant answers visitor queries in real time, restricted
            to your company's knowledge scope — services, solutions, and upcoming events.
          </p>
          <div className="flex gap-2 flex-wrap">
            {['Always on', 'Scope-restricted', 'Fallback to Contact Us'].map(tag => (
              <span key={tag}
                className="text-[11px] font-semibold px-3 py-1 rounded-full
                           bg-accent/10 text-accent border border-accent/25">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card p-7 flex flex-col justify-between">
          <p className="section-label">Reach out</p>
          <div className="font-display text-4xl font-bold text-accent leading-tight">
            No account<br />needed
          </div>
          <p className="text-sm text-[#8A8FA8] mt-3 mb-5">
            Submit your job requirements directly. We'll respond within 24 hours.
          </p>
          <Link to="/contact">
            <button className="btn-primary w-full text-sm py-2.5">
              Start a conversation →
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
