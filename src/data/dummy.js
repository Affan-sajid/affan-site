export const posts = [
  {
    id: 1,
    type: 'writing',
    title: 'Why I stopped asking "how" and started asking "why"',
    date: 'Mar 28, 2026',
    excerpt:
      'Most tutorials teach you how to build things. Rarely do they ask why the thing needs to exist. That shift in framing changed how I approach every problem.',
    slug: 'why-not-how',
  },
  {
    id: 2,
    type: 'project',
    title: 'Context Engine — a memory layer for AI assistants',
    date: 'Mar 14, 2026',
    excerpt:
      'I wanted an AI that remembers what matters across sessions. So I built a lightweight context engine that surfaces relevant history without spamming the prompt.',
    slug: 'context-engine',
  },
  {
    id: 3,
    type: 'writing',
    title: 'Learning by building, not by watching',
    date: 'Feb 22, 2026',
    excerpt:
      'Watching 10 hours of video gave me a false sense of progress. Shipping something broken in two hours taught me more than any course ever did.',
    slug: 'learning-by-building',
  },
  {
    id: 4,
    type: 'project',
    title: 'Thought Log — daily reasoning journal',
    date: 'Feb 8, 2026',
    excerpt:
      'A simple CLI tool that prompts me with a daily question, stores the answer, and surfaces old entries to see how my thinking has shifted.',
    slug: 'thought-log',
  },
  {
    id: 5,
    type: 'writing',
    title: 'The cost of keeping options open',
    date: 'Jan 19, 2026',
    excerpt:
      'Optionality feels like freedom until you realize every open option requires maintenance. Closing doors deliberately can be more productive than keeping them all ajar.',
    slug: 'cost-of-optionality',
    content: [
      'Keeping every path open sounds like flexibility. In practice it often means mental overhead: tools you might use, projects you might return to, commitments you have not declined.',
      'Each open option steals a little attention, even when you are not actively working on it. The cost is subtle until you notice you are busy but not moving anything meaningful forward.',
      'Deliberately closing a door — saying no, archiving a repo, picking one stack — is uncomfortable because it feels like loss. It is also what frees capacity to go deep on the things that remain.',
    ],
  },
  {
    id: 6,
    type: 'project',
    title: 'Signal — a personal feed aggregator',
    date: 'Jan 5, 2026',
    excerpt:
      'Pulled together RSS feeds, newsletters, and bookmarks into one quiet feed. No algorithms, no engagement loops — just things I actually want to read.',
    slug: 'signal',
  },
];

export const projects = [
  {
    id: 1,
    slug: 'spiderman-into-the-valentine',
    title: 'Spiderman-Into-The-Valentine',
    description:
      'A playful browser experiment blending comic panels with a minimal valentine narrative. Built to learn motion and layout in the DOM.',
    created: 'Feb 2026',
    tags: ['TypeScript', 'HTML'],
    github: 'https://github.com/example/spiderman-valentine',
    live: 'https://example.com/spiderman-valentine',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
    status: 'shipped',
    content: `## What it is

A single-page experiment: comic-style panels, light **CSS motion**, and a tiny narrative loop. No framework beyond what the page needs.

## Why I built it

I wanted to practice **layout + timing** without reaching for animation libraries. The valentine hook was arbitrary — constraints make experiments finish.

## Stack

- TypeScript for small modules and safer DOM touches
- Plain HTML/CSS for structure and keyframes`,
  },
  {
    id: 2,
    slug: 'context-engine',
    title: 'Context Engine',
    description:
      'A memory layer for AI assistants. Stores, indexes, and surfaces relevant context across sessions without bloating the prompt.',
    created: 'Mar 2026',
    tags: ['AI', 'Python', 'Vector DB'],
    github: 'https://github.com/example/context-engine',
    status: 'active',
    content: `## Problem

Assistants forget everything between sessions unless you paste the same context every time. That does not scale.

## Approach

1. **Ingest** notes, chats, and structured snippets.
2. **Embed** and index them in a vector store.
3. **Retrieve** only what scores highly for the current task, capped by token budget.

## Status

Active — tuning retrieval and pruning so answers stay grounded without noisy dumps.`,
  },
  {
    id: 3,
    title: 'Thought Log',
    description:
      'A daily reasoning journal in your terminal. Prompts you with a question, stores answers, and resurfaces past entries.',
    created: 'Feb 2026',
    live: 'https://example.com/thought-log',
    status: 'shipped',
  },
  {
    id: 4,
    title: 'Signal',
    description:
      'Personal feed aggregator. No algorithm, no noise — just curated sources delivered quietly.',
    created: 'Jan 2026',
    tags: ['RSS', 'React', 'Node.js'],
    github: 'https://github.com/example/signal',
    live: 'https://signal.example.com',
    thumbnail: '/IMG_4176.jpeg',
    status: 'shipped',
  },
  {
    id: 5,
    title: 'Night Transit',
    description:
      'Generative city skylines from SVG and CSS. No canvas — just layers, blur, and a lot of gradients.',
    created: 'Dec 2025',
    tags: ['CSS', 'SVG'],
    live: 'https://example.com/night-transit',
  },
  {
    id: 6,
    title: 'Ledger Lite',
    description:
      'Double-entry bookkeeping in a spreadsheet-shaped UI. Local-first; exports to CSV.',
    created: 'Nov 2025',
    github: 'https://github.com/example/ledger-lite',
  },
  {
    id: 7,
    title: 'Micro Experiments',
    description:
      'A collection of small standalone experiments — logic probes, UI explorations, and ideas too small for a full repo.',
    created: 'Ongoing',
    status: 'ongoing',
  },
];
