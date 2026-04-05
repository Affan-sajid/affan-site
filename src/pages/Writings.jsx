import FeedCard from '../components/FeedCard'
import { useWritings } from '../hooks/useWritings'

export default function Writings({ light }) {
  const { writings, loading, error } = useWritings()

  const mutedText = light ? 'text-[#888]' : 'text-[#666]'
  const titleText = light ? 'text-[#111]' : 'text-[#e8e8e8]'

  return (
    <main className="max-w-2xl mx-auto px-8 pb-24">
      <div className="mb-10">
        <h1 className={`text-lg font-medium mb-2 ${titleText}`}>Writings</h1>
        <p className={`text-[13px] ${mutedText}`}>
          Ideas, observations, and things I&apos;m working through.
        </p>
      </div>

      <div>
        {loading && (
          <p className={`text-[14px] ${mutedText}`}>Loading…</p>
        )}

        {error && (
          <p className="text-[14px] text-red-400">
            Failed to load writings. Check your Firebase config.
          </p>
        )}

        {!loading && !error && writings.length === 0 && (
          <p className={`text-[14px] ${mutedText}`}>Nothing published yet.</p>
        )}

        {[...writings]
          .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
          .map((post) => (
            <FeedCard key={post.slug} post={{ ...post, type: 'writing' }} light={light} />
          ))}
      </div>
    </main>
  )
}
