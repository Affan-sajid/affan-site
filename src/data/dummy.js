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
    title: 'Context Engine, a memory layer for AI assistants',
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
    title: 'Thought Log, daily reasoning journal',
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
      'Deliberately closing a door (saying no, archiving a repo, picking one stack) is uncomfortable because it feels like loss. It is also what frees capacity to go deep on the things that remain.',
    ],
  },
  {
    id: 6,
    type: 'project',
    title: 'Signal, a personal feed aggregator',
    date: 'Jan 5, 2026',
    excerpt:
      'Pulled together RSS feeds, newsletters, and bookmarks into one quiet feed. No algorithms, no engagement loops. Just things I actually want to read.',
    slug: 'signal',
  },
];

export const projects = [
  {
    id: 1,
    slug: 'context-engine',
    title: 'Context Engine',
    description:
      'A memory layer for AI assistants. Stores, indexes, and surfaces relevant context across sessions without bloating the prompt.',
    created: 'Mar 2026',
    tags: ['AI', 'Python', 'Vector DB'],
    github: '#',
    status: 'active',
    content: `## Problem

Assistants forget everything between sessions unless you paste the same context every time. That does not scale.

## Approach

1. **Ingest** notes, chats, and structured snippets.
2. **Embed** and index them in a vector store.
3. **Retrieve** only what scores highly for the current task, capped by token budget.

## Status

Active. Tuning retrieval and pruning so answers stay grounded without noisy dumps.`,
  },
];
