import { Link } from 'react-router-dom'

export default function FeedCard({ post, light }) {
  const articleClass = `group py-5 border-b last:border-0 ${
    post.type === 'writing' ? 'cursor-pointer' : ''
  } ${light ? 'border-[#e5e5e2]' : 'border-[#1a1a1a]'}`

  const inner = (
    <article className={articleClass}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {post.featured && (
              <span
                title="Pinned"
                className={`text-[11px] ${light ? 'text-[#aaa]' : 'text-[#555]'}`}
              >
                📌
              </span>
            )}
            <span className={`text-[11px] ${light ? 'text-[#aaa]' : 'text-[#555]'}`}>{post.date}</span>
          </div>
          <h3 className={`text-[15px] font-medium leading-snug mb-1.5 transition-colors ${light ? 'text-[#222] group-hover:text-[#000]' : 'text-[#ddd] group-hover:text-white'}`}>
            {post.title}
          </h3>
          <p className={`text-[13px] leading-relaxed line-clamp-2 ${light ? 'text-[#888]' : 'text-[#666]'}`}>
            {post.excerpt}
          </p>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${
                    light ? 'bg-[#f0f0ee] text-[#888]' : 'bg-[#1a1a1a] text-[#555]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {post.cover_url ? (
          <div className="shrink-0 relative w-16 h-16 rounded-sm overflow-hidden">
            <img
              src={post.cover_url}
              alt=""
              className="w-full h-full object-cover"
            />
            <span className={`absolute bottom-1 right-1.5 text-xs transition-colors ${light ? 'text-white/70 group-hover:text-white' : 'text-white/40 group-hover:text-white/80'}`}>
              →
            </span>
          </div>
        ) : (
          <span className={`transition-colors text-sm mt-0.5 shrink-0 ${light ? 'text-[#ccc] group-hover:text-[#555]' : 'text-[#333] group-hover:text-[#666]'}`}>
            →
          </span>
        )}
      </div>
    </article>
  )

  if (post.type === 'writing') {
    return (
      <Link to={`/writings/${post.slug}`} className="block no-underline text-inherit">
        {inner}
      </Link>
    )
  }

  return inner
}
