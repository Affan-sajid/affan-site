import { Link } from 'react-router-dom'
import { projects } from '../data/dummy'

const statusColors = {
  active: 'text-[#70c070] bg-[#0f1f0f]',
  shipped: 'text-[#7090c0] bg-[#0f1525]',
  ongoing: 'text-[#c0a070] bg-[#1f1a0f]',
}

const statusColorsLight = {
  active: 'text-[#2a7a2a] bg-[#eaf5ea]',
  shipped: 'text-[#2a50a0] bg-[#eaeefc]',
  ongoing: 'text-[#8a6020] bg-[#faf4ea]',
}

function ProjectLinks({ github, live, learnMoreTo, light }) {
  const linkClass = `text-[13px] font-medium transition-colors inline-flex items-center gap-1 ${
    light
      ? 'text-[#111] hover:text-[#000] underline underline-offset-2 decoration-[#ccc]'
      : 'text-[#e8e8e8] hover:text-white'
  }`

  if (!github && !live && !learnMoreTo) return null

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
      {learnMoreTo ? (
        <Link to={learnMoreTo} className={linkClass}>
          Learn more <span aria-hidden>→</span>
        </Link>
      ) : null}
      {github ? (
        <a href={github} target="_blank" rel="noopener noreferrer" className={linkClass}>
          View on GitHub <span aria-hidden>→</span>
        </a>
      ) : null}
      {live ? (
        <a href={live} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Live Demo <span aria-hidden>→</span>
        </a>
      ) : null}
    </div>
  )
}

export default function Projects({ light }) {
  const cardBorder = light ? 'border-[#e0e0dc] bg-[#fafaf8]' : 'border-[#2a2a2a] bg-[#0a0a0a]'
  const tagPill = light
    ? 'text-[#2a5080] bg-[#e8eef8]'
    : 'text-[#a8bcd8] bg-[#141f33]'

  return (
    <main className="max-w-2xl mx-auto px-8 pb-24">
      <div className="mb-10">
        <h1 className={`text-lg font-medium mb-2 ${light ? 'text-[#111]' : 'text-[#e8e8e8]'}`}>Projects</h1>
        <p className={`text-[13px] ${light ? 'text-[#888]' : 'text-[#666]'}`}>
          Things I&apos;ve built, am building, or will eventually build.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {projects.map((project) => {
          const hasTags = Array.isArray(project.tags) && project.tags.length > 0
          const hasWriteup =
            project.slug &&
            typeof project.content === 'string' &&
            project.content.trim().length > 0
          return (
            <article
              key={project.id}
              className={`rounded-xl border px-4 py-4 sm:px-5 sm:py-5 ${cardBorder}`}
            >
              <div className="flex gap-4">
                {project.thumbnail ? (
                  <div className="shrink-0">
                    <img
                      src={project.thumbnail}
                      alt=""
                      className={`w-[4.5rem] h-[4.5rem] sm:w-24 sm:h-24 rounded-lg object-cover border ${
                        light ? 'border-[#e5e5e2]' : 'border-[#222]'
                      }`}
                      loading="lazy"
                    />
                  </div>
                ) : null}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1 mb-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                      <h2
                        className={`text-[15px] sm:text-base font-semibold leading-snug ${
                          light ? 'text-[#111]' : 'text-[#f0f0f0]'
                        }`}
                      >
                        {project.title}
                      </h2>
                      {hasTags ? (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full ${tagPill}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {project.status ? (
                      <span
                        className={`shrink-0 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm font-medium ${
                          light ? statusColorsLight[project.status] : statusColors[project.status]
                        }`}
                      >
                        {project.status}
                      </span>
                    ) : null}
                  </div>

                  {project.created ? (
                    <p className={`text-[12px] mb-2 ${light ? 'text-[#888]' : 'text-[#666]'}`}>
                      Created {project.created}
                    </p>
                  ) : null}

                  <p className={`text-[13px] leading-relaxed ${light ? 'text-[#555]' : 'text-[#888]'}`}>
                    {project.description}
                  </p>

                  <ProjectLinks
                    github={project.github}
                    live={project.live}
                    learnMoreTo={hasWriteup ? `/projects/${project.slug}` : null}
                    light={light}
                  />
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <p className={`text-[13px] leading-relaxed mt-10 ${light ? 'text-[#888]' : 'text-[#666]'}`}>
        I have a few more projects I have not had time to write up yet. Give it a day or two. ;)
      </p>
    </main>
  )
}
