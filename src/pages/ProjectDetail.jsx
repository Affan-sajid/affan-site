import { Link, useParams } from 'react-router-dom'
import MarkdownBody from '../components/MarkdownBody'
import { projects } from '../data/dummy'

export default function ProjectDetail({ light }) {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  const muted = light ? 'text-[#666]' : 'text-[#888]'
  const titleText = light ? 'text-[#111]' : 'text-[#e8e8e8]'
  const metaText = light ? 'text-[#888]' : 'text-[#666]'
  const bodyFallback = light ? 'text-[#333]' : 'text-[#999]'

  if (!project) {
    return (
      <main className="max-w-2xl mx-auto px-8 pb-24">
        <p className={`text-[15px] mb-6 ${muted}`}>This project isn&apos;t here.</p>
        <Link
          to="/projects"
          className={`text-[14px] font-medium underline underline-offset-2 ${light ? 'text-[#111]' : 'text-[#ccc]'}`}
        >
          ← Back to projects
        </Link>
      </main>
    )
  }

  const md =
    typeof project.content === 'string' && project.content.trim().length > 0 ? project.content : ''

  return (
    <main className="max-w-2xl mx-auto px-8 pb-24">
      <Link
        to="/projects"
        className={`inline-block text-[13px] font-medium mb-10 underline underline-offset-2 transition-colors ${
          light ? 'text-[#888] hover:text-[#111]' : 'text-[#555] hover:text-[#bbb]'
        }`}
      >
        ← Projects
      </Link>

      <article>
        <header className="mb-10">
          {project.created ? (
            <p className={`text-[12px] mb-3 ${metaText}`}>Created {project.created}</p>
          ) : null}
          <h1 className={`text-2xl sm:text-[1.65rem] font-semibold leading-snug tracking-tight ${titleText}`}>
            {project.title}
          </h1>
        </header>

        {md ? (
          <MarkdownBody light={light}>{md}</MarkdownBody>
        ) : (
          <p className={`text-[15px] leading-[1.7] ${bodyFallback}`}>{project.description}</p>
        )}
      </article>
    </main>
  )
}
