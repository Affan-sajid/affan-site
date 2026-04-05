import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownBody({ light, children }) {
  const p = light ? 'text-[#333]' : 'text-[#999]'
  const h2 = light ? 'text-[#111] border-[#e0e0dc]' : 'text-[#e0e0e0] border-[#2a2a2a]'
  const h3 = light ? 'text-[#222]' : 'text-[#ccc]'
  const strong = light ? 'text-[#111]' : 'text-[#ddd]'
  const a = light ? 'text-[#2050a0] underline underline-offset-2 decoration-[#aac]' : 'text-[#8ab4ff] underline underline-offset-2 decoration-[#456]'
  const codeBg = light ? 'bg-[#eee] text-[#222]' : 'bg-[#1a1a1a] text-[#ccc]'
  const preBg = light ? 'bg-[#f0f0ec] border-[#e0e0dc]' : 'bg-[#141414] border-[#252525]'
  const blockquote = light ? 'border-[#ccc] text-[#555]' : 'border-[#444] text-[#777]'
  const hr = light ? 'border-[#e0e0dc]' : 'border-[#2a2a2a]'
  const tableBorder = light ? 'border-[#e0e0dc]' : 'border-[#252525]'
  const tableRowBorder = light ? 'border-t border-[#e5e5e2]' : 'border-t border-[#252525]'
  const theadBg = light ? 'bg-[#eee]' : 'bg-[#1a1a1a]'

  const mdComponents = {
    p: ({ children: c }) => <p className={`text-[15px] leading-[1.7] mb-5 last:mb-0 ${p}`}>{c}</p>,
    h2: ({ children: c }) => (
      <h2 className={`text-lg font-semibold mt-10 mb-4 pb-2 border-b ${h2}`}>{c}</h2>
    ),
    h3: ({ children: c }) => <h3 className={`text-[15px] font-semibold mt-8 mb-3 ${h3}`}>{c}</h3>,
    strong: ({ children: c }) => <strong className={`font-semibold ${strong}`}>{c}</strong>,
    em: ({ children: c }) => <em className="italic opacity-90">{c}</em>,
    a: ({ href, children: c }) => {
      if (href?.startsWith('/')) {
        return (
          <Link to={href} className={a}>
            {c}
          </Link>
        )
      }
      const external = href?.startsWith('http')
      return (
        <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className={a}>
          {c}
        </a>
      )
    },
    ul: ({ children: c }) => <ul className={`list-disc pl-5 mb-5 space-y-2 text-[15px] leading-[1.7] ${p}`}>{c}</ul>,
    ol: ({ children: c }) => <ol className={`list-decimal pl-5 mb-5 space-y-2 text-[15px] leading-[1.7] ${p}`}>{c}</ol>,
    li: ({ children: c }) => <li>{c}</li>,
    blockquote: ({ children: c }) => (
      <blockquote className={`border-l-2 pl-4 my-6 italic text-[14px] leading-relaxed ${blockquote}`}>{c}</blockquote>
    ),
    hr: () => <hr className={`my-10 border-0 border-t ${hr}`} />,
    table: ({ children: c }) => (
      <div className={`mb-5 overflow-x-auto rounded-md border ${tableBorder}`}>
        <table className={`w-full text-left text-[14px] ${p}`}>{c}</table>
      </div>
    ),
    thead: ({ children: c }) => <thead className={theadBg}>{c}</thead>,
    tbody: ({ children: c }) => <tbody>{c}</tbody>,
    tr: ({ children: c }) => <tr className={tableRowBorder}>{c}</tr>,
    th: ({ children: c }) => (
      <th className={`px-3 py-2 font-semibold ${strong}`}>{c}</th>
    ),
    td: ({ children: c }) => <td className={`px-3 py-2 align-top ${p}`}>{c}</td>,
    code: ({ className, children: c, ...props }) => {
      const isFence = /language-\w+/.test(className || '')
      if (!isFence) {
        return (
          <code className={`px-1.5 py-0.5 rounded text-[13px] font-mono ${codeBg}`} {...props}>
            {c}
          </code>
        )
      }
      return (
        <code className={`font-mono text-[13px] leading-relaxed whitespace-pre-wrap ${p}`} {...props}>
          {c}
        </code>
      )
    },
    pre: ({ children: c }) => <pre className={`mb-5 p-4 rounded-md border overflow-x-auto ${preBg}`}>{c}</pre>,
  }

  return (
    <div className="writing-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
