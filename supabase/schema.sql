-- Create posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text not null,
  content text not null,
  category text not null,
  author_name text not null,
  author_avatar text,
  published_at timestamp with time zone default now() not null,
  reading_time integer not null
);

-- Enable Row Level Security (RLS)
alter table public.posts enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
  on public.posts for select
  using (true);

-- Create policy to allow modification by authorized email only
create policy "Allow modification by authorized author only"
  on public.posts for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'pagestudios5@gmail.com')
  with check (auth.jwt() ->> 'email' = 'pagestudios5@gmail.com');

-- Seed posts data
insert into public.posts (title, slug, summary, content, category, author_name, reading_time)
values 
(
  'The Architecture of Simplicity',
  'architecture-of-simplicity',
  'Exploring how design-centric teams leverage white space, minimalist typography, and structural constraint to build experiences that feel natural, premium, and timeless.',
  'Simplicity is not the absence of clutter, but the presence of clarity. In digital layouts, we often conflate simplicity with minimalism. However, true simplicity is structural; it is the alignment of purpose and form.

## The Role of Negative Space

Negative space is not empty space; it is the frame that gives meaning to the elements it surrounds. By allowing wide borders and generous gaps, we signal to the reader what matters. It creates breathing room, lowering cognitive load and creating a premium aesthetic.

When you look at Apple''s product design and editorial layouts, the constraint is visible. Every element has earned its position. By limiting the colors, borders, and noise, we draw the focus directly to the voice of the writer.

<Note>
**Insight on Constraint:** 
"Design is not just what it looks like and feels like. Design is how it works." True structural simplicity occurs when the form of a page aligns completely with its core functionality—in this case, reading.
</Note>

## Formatting with Clean Layouts

Here is an example of setting a clean, styled configuration for minimalist layouts:

```css
/* Styling guidelines for long-form reading */
.article-container {
  max-width: 42rem; /* max-w-2xl */
  margin: 0 auto;
  line-height: 1.75;
  letter-spacing: -0.011em;
}
```

By enforcing these constraints, we ensure that the page feels cohesive and premium.',
  'Design',
  'Sanika Sadre',
  5
),
(
  'Typography as the Interface',
  'typography-as-the-interface',
  'When the primary interaction pattern is reading, font choices are not aesthetic details—they are the user experience itself. Understanding scale, hierarchy, and tracking.',
  'In a text-heavy application or blog, the typography is the user interface. Users do not look at buttons; they read the words on them. They do not interact with animations; they consume the content.

## Font Scale and Weight

The contrast between a bold sans-serif header and a classic serif body text creates immediate visual order. Using Lora or Newsreader for paragraphs ensures that the eye can glide effortlessly along lines without strain.

Selecting appropriate line heights (usually around 1.6 to 1.8 for editorial reading) and keeping the maximum line length between 60 and 70 characters makes long-form text feel premium and highly legible.

```typescript
// Example typography configuration utility
export const getTrackingClass = (fontSize: number) => {
  if (fontSize >= 32) return "tracking-tight";
  if (fontSize <= 12) return "tracking-wide";
  return "tracking-normal";
};
```

When typography works correctly, the visual interface recedes, and the ideas flow.',
  'Typography',
  'Elena Rostova',
  4
),
(
  'Crafting Glassmorphism in Modern CSS',
  'crafting-glassmorphism-modern-css',
  'A deep dive into custom CSS variables, backdrop blurs, and border opacity settings that make web overlays feel physical and premium under different lighting modes.',
  'Glassmorphism is more than just a `backdrop-blur` utility class. It is a simulation of physical depth. To make glass feel real, it needs three components: a semi-transparent background color, a blur radius, and a subtle border that mimics light refraction.

## CSS Custom Variables

Using CSS variables like `--nav-bg` and `--border` allows us to smoothly transition between light and dark themes while maintaining the delicate transparency needed for the glass effect.

```css
/* Custom CSS Variables configuration in globals.css */
:root {
  --border: rgba(0, 0, 0, 0.06);
  --nav-bg: rgba(255, 255, 255, 0.7);
}
@media (prefers-color-scheme: dark) {
  :root {
    --border: rgba(255, 255, 255, 0.08);
    --nav-bg: rgba(0, 0, 0, 0.7);
  }
}
```

Tailwind CSS v4 makes this easier by letting us define color styles directly inside `@theme inline` in `globals.css` and mapping them dynamically. This ensures that the interface remains readable under any theme environment.

<Note>
**Refraction Accent:**
Adding a 1px solid border with dynamic opacity is the single most important detail to make glassmorphism look high-end rather than muddy.
</Note>',
  'Engineering',
  'Marcus Chen',
  7
)
on conflict (slug) do nothing;
