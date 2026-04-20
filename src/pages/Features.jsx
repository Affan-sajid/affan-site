export default function Features({ light }) {
  return (
    <main className="max-w-2xl mx-auto px-8 pb-24">
      <div className="mb-10">
        <h1 className={`text-lg font-medium mb-2 ${light ? 'text-[#111]' : 'text-[#e8e8e8]'}`}>Features</h1>
        <p className={`text-[13px] ${light ? 'text-[#888]' : 'text-[#666]'}`}>
          Things worth paying attention to — tools, ideas, people, work.
        </p>
      </div>

      <div className="py-12">
        <p className={`text-[14px] leading-relaxed max-w-lg ${light ? 'text-[#555]' : 'text-[#888]'}`}>
          I use this space for curated tools, ideas, people, and work worth a closer look. Short
          write-ups and links are not live yet — I&apos;m adding them soon. Check back later.
        </p>
      </div>
    </main>
  )
}
