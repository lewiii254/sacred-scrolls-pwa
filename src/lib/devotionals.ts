export interface Devotional {
  id: string;
  date: string;
  title: string;
  content: string;
  verse: string;
  verse_ref: string;
  author: string;
  theme: string;
}

const DEVOTIONALS: Devotional[] = [
  {
    id: '1',
    date: '2024-01-01',
    title: "God's Unfailing Love",
    content: "This beloved verse reminds us of the incredible depth of God's love for humanity. When we understand that God loved us so much that He gave His only Son, it transforms how we see ourselves and others. This love isn't based on our performance or worthiness - it's unconditional and eternal. Today, let this truth sink deep into your heart. You are loved beyond measure, not because of what you do, but because of who God is. His love never fails, never wavers, and never ends.",
    verse: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    verse_ref: "John 3:16",
    author: "Sacred Scrolls Team",
    theme: "love"
  },
  {
    id: '2',
    date: '2024-01-02',
    title: "Walking Through Dark Valleys",
    content: "Life brings seasons of difficulty, uncertainty, and fear. David understood this when he wrote about walking through 'the darkest valley.' Yet notice he doesn't say 'if' but 'when' - acknowledging that difficult times are part of life. The comfort comes not in avoiding the valley, but in knowing we don't walk alone. God's presence transforms our fear into faith, our anxiety into peace. His rod and staff - symbols of protection and guidance - remind us that we have a Shepherd who cares for us intimately.",
    verse: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
    verse_ref: "Psalm 23:4",
    author: "Sacred Scrolls Team",
    theme: "comfort"
  },
  {
    id: '3',
    date: '2024-01-03',
    title: "Light in the Beginning",
    content: "The very first recorded words of God in Scripture are 'Let there be light.' This wasn't just about physical illumination - it was about bringing order from chaos, hope from emptiness, and purpose from void. In your life today, God continues to speak light into dark places. Where there is confusion, He brings clarity. Where there is despair, He brings hope. Where there is fear, He brings peace. Just as creation began with light, your new beginning starts with God's illuminating presence.",
    verse: "And God said, 'Let there be light,' and there was light.",
    verse_ref: "Genesis 1:3",
    author: "Sacred Scrolls Team",
    theme: "new beginnings"
  },
  {
    id: '4',
    date: '2024-01-04',
    title: "The Good Shepherd's Care",
    content: "When we declare 'The Lord is my shepherd,' we're making a profound statement of trust. Shepherds in ancient times knew each sheep by name, protected them from predators, and ensured they had everything needed for life. David, who was himself a shepherd, understood this relationship intimately. Today, rest in the knowledge that your Shepherd knows your needs before you ask, provides for you abundantly, and will never leave you wanting for anything truly important.",
    verse: "The Lord is my shepherd, I lack nothing.",
    verse_ref: "Psalm 23:1",
    author: "Sacred Scrolls Team",
    theme: "provision"
  },
  {
    id: '5',
    date: '2024-01-05',
    title: "Strength in Weakness",
    content: "God's strength is most clearly displayed when we acknowledge our weakness. This isn't about self-deprecation, but honest recognition that we need divine help. When Paul learned this truth, it transformed his ministry and relationship with God. Our limitations become opportunities for God's unlimited power to work through us. Today, instead of hiding your struggles, bring them to God and watch how His strength becomes perfect in your weakness.",
    verse: "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.'",
    verse_ref: "2 Corinthians 12:9",
    author: "Sacred Scrolls Team",
    theme: "strength"
  },
  {
    id: '6',
    date: '2024-01-06',
    title: "More Than Conquerors",
    content: "Paul didn't just say we are conquerors - he said we are 'more than conquerors.' This suggests not just victory, but overwhelming victory through Christ's love. No matter what challenges you face today - persecution, hardship, danger, or distress - these cannot separate you from God's love. They cannot define you, defeat you, or diminish your worth. In Christ, you don't just survive; you thrive. You don't just overcome; you triumph with abundance.",
    verse: "No, in all these things we are more than conquerors through him who loved us.",
    verse_ref: "Romans 8:37",
    author: "Sacred Scrolls Team",
    theme: "victory"
  },
  {
    id: '7',
    date: '2024-01-07',
    title: "Peace in the Storm",
    content: "Jesus offers a peace that doesn't depend on circumstances. When He says 'Peace I leave with you,' He's not promising a life without storms, but peace within the storm. This peace isn't the absence of conflict, but the presence of Christ in the midst of conflict. Today, whatever chaos surrounds you, invite Jesus to speak His peace into your situation. Let His calm voice be louder than the storm's roar.",
    verse: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    verse_ref: "John 14:27",
    author: "Sacred Scrolls Team",
    theme: "peace"
  }
];

export function getTodaysDevotional(): Devotional {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Cycle through devotionals based on day of year
  const devotionalIndex = (dayOfYear - 1) % DEVOTIONALS.length;
  return DEVOTIONALS[devotionalIndex];
}

export function getDevotionalByDate(date: string): Devotional | null {
  return DEVOTIONALS.find(d => d.date === date) || null;
}

export function getAllDevotionals(): Devotional[] {
  return DEVOTIONALS;
}

export function getDevotionalsByTheme(theme: string): Devotional[] {
  return DEVOTIONALS.filter(d => d.theme.toLowerCase().includes(theme.toLowerCase()));
}

export function getRandomDevotional(): Devotional {
  const randomIndex = Math.floor(Math.random() * DEVOTIONALS.length);
  return DEVOTIONALS[randomIndex];
}