import { Link, useParams } from 'react-router-dom'
import MarkdownBody from '../components/MarkdownBody'
import { useWriting } from '../hooks/useWritings'

export default function WritingDetail({ light }) {
  const { slug } = useParams()
  const { writing, loading, error } = useWriting(slug)

  const p         = light ? 'text-[#333]'     : 'text-[#999]'
  const titleText = light ? 'text-[#111]'     : 'text-[#e8e8e8]'
  const metaText  = light ? 'text-[#888]'     : 'text-[#666]'
  const backClass = `inline-block text-[13px] font-medium mb-10 underline underline-offset-2 transition-colors ${
    light ? 'text-[#888] hover:text-[#111]' : 'text-[#555] hover:text-[#bbb]'
  }`

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-8 pb-24">
        <p className={`text-[14px] ${metaText}`}>Loading…</p>
      </main>
    )
  }

  if (error || !writing) {
    return (
      <main className="max-w-2xl mx-auto px-8 pb-24">
        <p className={`text-[15px] mb-6 ${light ? 'text-[#666]' : 'text-[#888]'}`}>
          This piece isn&apos;t here.
        </p>
        <Link to="/writings" className={backClass}>
          ← Back to writings
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-8 pb-24">
      <Link to="/writings" className={backClass}>
        ← Writings
      </Link>

      <article>
        {writing.cover_url && (
          <div className="w-full h-52 sm:h-64 rounded-sm overflow-hidden mb-10 -mx-0">
            <img
              src={writing.cover_url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="mb-10">
          {writing.date && (
            <time className={`block text-[12px] mb-3 ${metaText}`}>{writing.date}</time>
          )}
          <h1 className={`text-2xl sm:text-[1.65rem] font-semibold leading-snug tracking-tight ${titleText}`}>
            {writing.title}
          </h1>
        </header>

        {writing.content ? (
          <MarkdownBody light={light}>{writing.content}</MarkdownBody>
        ) : (
          <p className={`text-[15px] leading-[1.7] ${p}`}>{writing.excerpt}</p>
        )}
      </article>
    </main>
  )
}
