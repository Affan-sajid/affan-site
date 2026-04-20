export default function Writings({ light }) {
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

      <p className={`text-[14px] leading-relaxed ${mutedText}`}>
        I have written quite a bit but have not synced it up here yet. Working on piping it in from
        Notion. Check back tomorrow.
      </p>
    </main>
  )
}
