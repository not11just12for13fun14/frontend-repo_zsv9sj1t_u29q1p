import { useEffect, useState } from 'react'

function App() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [experience, setExperience] = useState([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, prRes, exRes] = await Promise.all([
          fetch(`${baseUrl}/api/profile`).then(r => r.json()).catch(() => null),
          fetch(`${baseUrl}/api/projects`).then(r => r.json()).catch(() => []),
          fetch(`${baseUrl}/api/experience`).then(r => r.json()).catch(() => []),
        ])
        setProfile(pRes)
        setProjects(Array.isArray(prRes) ? prRes : [])
        setExperience(Array.isArray(exRes) ? exRes : [])
      } catch (e) {
        // fallbacks below
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleContact = async (e) => {
    e.preventDefault()
    setSent(null)
    setSending(true)
    const form = new FormData(e.currentTarget)
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      message: form.get('message'),
    }
    try {
      const res = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setSent({ ok: true, msg: 'Message sent successfully. Thank you!' })
        e.currentTarget.reset()
      } else {
        const err = await res.json().catch(() => ({}))
        setSent({ ok: false, msg: err.detail || 'Failed to send. Please try again.' })
      }
    } catch (err) {
      setSent({ ok: false, msg: 'Network error. Please try later.' })
    } finally {
      setSending(false)
    }
  }

  const fallbackProfile = {
    full_name: 'FAHRUZI ILMI',
    title: 'Software Engineer',
    bio: 'I build clean, modern web experiences and practical software products.',
    location: 'Indonesia',
    socials: {
      GitHub: '#',
      LinkedIn: '#',
      X: '#',
    },
  }

  const p = profile || fallbackProfile

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800">
      {/* Header / Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                {p.full_name}
              </h1>
              <p className="mt-3 text-xl text-blue-700 font-semibold">{p.title}</p>
              <p className="mt-4 text-slate-600 max-w-2xl">{p.bio}</p>
              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                {p.location && (
                  <span className="px-3 py-1 rounded-full bg-white shadow text-sm">📍 {p.location}</span>
                )}
                <a href="/test" className="px-3 py-1 rounded-full bg-slate-900 text-white text-sm hover:bg-slate-800 transition">Check System</a>
              </div>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="h-40 w-40 md:h-56 md:w-56 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-xl flex items-center justify-center text-white text-5xl font-bold select-none">
                {p.full_name?.split(' ').map(s=>s[0]).join('').slice(0,2) || 'FI'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Socials */}
      <section className="max-w-6xl mx-auto px-6 pb-6">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {p.socials && Object.entries(p.socials).map(([k,v]) => (
            <a key={k} href={v || '#'} target="_blank" className="px-4 py-2 bg-white rounded-full shadow hover:shadow-md transition text-sm">
              {k}
            </a>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Projects</h2>
          {loading && <span className="text-sm text-slate-500">Loading…</span>}
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(projects && projects.length ? projects : [
            { name: 'Personal Portfolio', description: 'The site you are viewing right now.', tech: ['React','FastAPI','Tailwind'] },
            { name: 'Project Two', description: 'Another sample project.', tech: ['Node','MongoDB'] },
            { name: 'Project Three', description: 'Mobile-first UI concept.', tech: ['React Native'] },
          ]).map((pr, idx) => (
            <a key={idx} href={pr.url || pr.repo || '#'} target={pr.url||pr.repo ? '_blank' : undefined} className="group bg-white rounded-xl p-5 shadow hover:shadow-lg transition block">
              <div className="h-36 w-full rounded-lg bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-slate-500">
                {pr.image_url ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <img src={pr.image_url} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <span className="text-sm">{pr.name}</span>
                )}
              </div>
              <h3 className="mt-4 font-semibold text-lg group-hover:text-blue-700 transition">{pr.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{pr.description}</p>
              {pr.tech && pr.tech.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {pr.tech.slice(0,5).map((t,i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-700">{t}</span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl md:text-3xl font-bold">Experience</h2>
        <div className="mt-6 space-y-4">
          {(experience && experience.length ? experience : [
            { company: 'Example Corp', role: 'Software Engineer', start_date: '2022-01', end_date: 'Present', description: 'Building web apps and services.' }
          ]).map((ex, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 shadow">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold text-lg">{ex.role} • {ex.company}</h3>
                  <p className="text-sm text-slate-500">{ex.start_date} — {ex.end_date || 'Present'}</p>
                </div>
              </div>
              {ex.description && <p className="mt-3 text-sm text-slate-700">{ex.description}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="bg-white rounded-2xl shadow p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold">Contact</h2>
          <p className="mt-2 text-slate-600">Have a question or want to work together? Send a message.</p>
          <form onSubmit={handleContact} className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm mb-1">Name</label>
              <input name="name" required placeholder="Your name" className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm mb-1">Email</label>
              <input type="email" name="email" required placeholder="you@mail.com" className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Message</label>
              <textarea name="message" required rows={4} placeholder="Write your message..." className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <button disabled={sending} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60">
                {sending ? 'Sending...' : 'Send Message'}
              </button>
              {sent && (
                <span className={`${sent.ok ? 'text-green-600' : 'text-red-600'} text-sm`}>
                  {sent.msg}
                </span>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-10 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {p.full_name}. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
