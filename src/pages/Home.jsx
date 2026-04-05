import { Link } from 'react-router-dom'

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m2 7 10 6 10-6"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

export default function Home({ light }) {
  const bodyText = light ? 'text-[#333]' : 'text-[#999]'
  const leadText = light ? 'text-[#111]' : 'text-[#bbb]'
  const linkColor = light ? 'text-[#111] decoration-[#999] hover:decoration-[#333]' : 'text-[#ccc] decoration-[#444] hover:decoration-[#888]'
  const contactColor = light ? 'text-[#666] hover:text-[#111]' : 'text-[#555] hover:text-[#bbb]'

  return (
    <main className="max-w-2xl mx-auto px-8 pb-24">
      {/* Greeting */}
      <div className="mb-12">
        <p className="text-5xl sm:text-6xl mb-4">👋</p>
        <h1 className={`text-5xl font-bold tracking-tight leading-tight ${light ? 'text-[#111]' : 'text-[#e8e8e8]'}`}>
          Hi, Affan here.
        </h1>
      </div>

      {/* Bio */}
      <div className="space-y-4 mb-8">
        <p className={`text-[16px] leading-relaxed ${leadText}`}>
          I&apos;m obsessed with problems.
        </p>
        <p className={`text-[16px] leading-relaxed ${bodyText}`}>
          Not just solving them, but understanding why they exist in the first place.
        </p>
        <p className={`text-[16px] leading-relaxed ${bodyText}`}>
          I chose to step away from the traditional school path to learn by building real things.
          These days, that means working on AI systems and small experiments that help me think better.
        </p>
        <p className={`text-[16px] leading-relaxed ${bodyText}`}>
          This space documents that journey. Projects, writing, and ideas in progress.
        </p>
      </div>

      {/* Inline links */}
      <p className={`text-[16px] leading-relaxed mb-8 ${bodyText}`}>
        This is my space where I share{' '}
        <Link to="/projects" className={`font-semibold underline underline-offset-2 decoration-2 transition-colors ${linkColor}`}>
          projects
        </Link>
        {', '}
        <Link to="/writings" className={`font-semibold underline underline-offset-2 decoration-2 transition-colors ${linkColor}`}>
          writings
        </Link>
        {' & '}
        <Link to="/features" className={`font-semibold underline underline-offset-2 decoration-2 transition-colors ${linkColor}`}>
          features
        </Link>
        {'. Open to weird ideas and long conversations.'}
      </p>

      {/* Contact */}
      <div className="flex flex-wrap items-center gap-6">
        <a href="mailto:affan.palath@gmail.com" className={`flex items-center gap-2 text-[13px] transition-colors ${contactColor}`}>
          <EmailIcon />
          <span>Email</span>
        </a>
        <a href="https://x.com/Affan_Sajid_" target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-[13px] transition-colors ${contactColor}`}>
          <TwitterIcon />
          <span>Twitter/X</span>
        </a>
        <a href="https://www.linkedin.com/in/affan-sajid/" target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-[13px] transition-colors ${contactColor}`}>
          <LinkedInIcon />
          <span>LinkedIn</span>
        </a>
        <a href="https://github.com/affan-sajid" target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-[13px] transition-colors ${contactColor}`}>
          <GithubIcon />
          <span>GitHub</span>
        </a>
      </div>
    </main>
  )
}
