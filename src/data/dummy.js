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
    slug: 'airtalk',
    title: 'AirTalk',
    description:
      'Gesture-powered assistive communication. Draw words in the air with a wand-shaped device, and it translates them into spoken sentences in real time using IMU sensors, a CNN classifier, and an LLM.',
    created: 'Apr 2026',
    tags: ['Python', 'PyTorch', 'Arduino', 'ML', 'Assistive Tech'],
    github: 'https://github.com/Affan-sajid/airtalk',
    status: 'shipped',
    content: `## What it is

AirTalk is a wand-shaped assistive communication device. You hold it like a pen and draw words in
the air. The device captures those gestures with a high-precision IMU, classifies them with a CNN,
reconstructs a sentence with an LLM, and speaks it aloud. The whole pipeline runs end-to-end on
commodity hardware.

Built at the Google Physical AI Hackathon 2026 with collaborator Sidharth.

![First Prize at Google Physical AI Hackathon, Kochi](/images/airtalk/prize.jpg)

## The problem

Over 430 million people worldwide are deaf, hard of hearing, or speech-impaired. For many, sign
language is the primary mode of communication but it is not universally understood. Camera-based
translators require full body tracking and fixed lighting. Haptic gloves are bulky and expensive.
Neither works naturally in daily life.

The deeper issue is that both existing approaches try to translate a system built for human
perception into a form machines can understand. AirTalk flips that: design a gesture system
optimised for machines from the ground up, then make it intuitive enough for humans to learn.

## How it works

The user holds the wand and draws a word gesture in the air while pressing a button. The IMU
samples motion at 100 Hz and streams gyroscope and accelerometer data over USB. Python renders
the motion as strokes on a virtual canvas in real time. On button release, the canvas is captured
as an image and fed to the classifier. Recognised words accumulate. After a short idle period, the
word list is sent to an LLM for sentence reconstruction and the result is spoken aloud.

No camera, no interpreter, one hand. It works in the dark, in a hospital, in a crowded room, or
in complete silence.

![Hardware prototype — Seeed XIAO + Adafruit ISM330DHCX wired up](/images/airtalk/hardware.jpeg)

## Gesture vocabulary

The gesture system is inspired by Teeline shorthand, a writing system developed for journalists
that strips letters down to their most essential strokes. Letters combine into words efficiently.
The system is learnable in a structured way and the vocabulary is additive.

Version 1 recognises ten word classes: I, affan, and, communicate, mouth, name, not, sidharth,
thank you, we. Enough to demonstrate the full pipeline at a hackathon.

## Machine learning

The classifier is MobileNetV2, a CNN designed for efficient on-device inference. Its depthwise
separable convolutions bring the parameter count from roughly 25 million (ResNet-50) down to about
3.4 million while keeping accuracy competitive. The training dataset is ~421 images captured with
the device itself.

Before classification each canvas is converted to greyscale, a tight bounding box is drawn around
the stroke pixels, the crop is padded and resized to 64x64, then normalised. The bounding box step
is the most important one. It means the model sees the same stroke shape regardless of how large or
small the user drew the gesture, or where on the canvas it landed.

![Augmented training samples after bounding-box crop](/images/airtalk/training-samples.jpeg)

![Training curves — loss and accuracy across both phases](/images/airtalk/training-curves.jpeg)

![Confusion matrix — 84.4% test accuracy across 10 word classes](/images/airtalk/confusion-matrix.jpeg)

![Sample test predictions — green correct, red wrong](/images/airtalk/test-predictions.jpeg)

![Training notebook — MobileNetV2 air-writing classifier](/images/airtalk/notebook.jpeg)

## Engineering decisions worth noting

**Per-press calibration.** Early firmware calibrated on startup and required a two-second hold.
That was awkward and broke whenever the user changed grip. The fix: snapshot the IMU state on the
first frame of every button press. Calibration now happens at the moment of action, automatically,
aligned to the user's current grip. They never think about it.

**Image-based stroke capture.** An alternative would record cursor trajectory as a time series and
classify that sequence directly. The image approach was chosen because it works with any standard
image classification architecture, needs no custom sequence model, and is robust to variation in
drawing speed.

**Phrase shortcuts with unordered matching.** For common demonstration phrases, calling an LLM
adds latency and API dependency. A shortcut dictionary uses Python frozenset keys so words like
{we, not, communicate, mouth} match regardless of the order they were drawn. No enforced word
order is the right default for air-writing.

![Firmware running in Arduino IDE — single snprintf output, per-press calibration](/images/airtalk/firmware.jpeg)

## Stack

- ESP32 / Seeed XIAO for sensor polling and USB serial transmission
- Adafruit ISM330DHCX IMU (6-DoF, 100 Hz)
- Python + pygame for real-time visualisation and stroke capture
- PyTorch + MobileNetV2 for gesture classification
- OpenRouter / Gemini API for sentence reconstruction
- macOS text-to-speech for audio output

## What is next

Version 2 moves from word-by-word classification to direct Teeline shorthand translation. Instead
of recognising discrete word gestures, the model will interpret continuous air-writing and produce
a stream of words, giving the system an unbounded vocabulary. This requires a purpose-built dataset
of continuous Teeline air-writing and a sequence-to-sequence architecture. The approach was
designed at the hackathon but needs dedicated time to build properly.

Hardware gets smaller next. The WiFi UDP layer is architecturally complete. The cable goes away
once latency on the ESP32 power-save settings is tuned.`,
  },
];
