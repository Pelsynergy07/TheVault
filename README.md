# The Vault — AI Lab Portfolio

A premium portfolio website for showcasing AI, XR, automation, design, and product experiments. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, custom WebGL shaders, and @dnd-kit for drag-and-drop reordering.

Designed with a taste-first philosophy: sharp geometry, deep dark canvases, glass-morphism depth, spring-physics motion, and a violet/teal accent palette.

## Features

- **WebGL Bioluminescence Background** — Custom GLSL fragment shader with wave physics, plankton sparks, caustics, foam, and mouse-reactive glow
- **Digital Rain Preloader** — Matrix-style katakana animation with water surface, ripples, and wave simulation (plays once per session)
- **Project Cards** — Filterable, searchable, drag-and-drop reorderable grid with status badges and quick action links
- **Full-Screen Presentation** — Per-project slide show with 6 slides (Problem, Why, Solution, Architecture, Results, Learnings), arrow key navigation, Interview Mode
- **Project Details Editor** — Inline editing for title, tagline, description, status, tags, links, and slide content — saves without page reload
- **Admin Questionnaire** — 12-field form that auto-generates a structured project page from your answers
- **Command Palette** — `⌘K` to switch themes, navigate, create new projects
- **Dark/Light Theme** — next-themes with persisted preference
- **Responsive** — Full mobile/tablet/desktop support

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
content/projects/          # Project JSON files (one per project)
src/
  app/                     # Next.js App Router pages
    page.tsx               # Homepage
    admin/page.tsx         # Admin questionnaire
    projects/[slug]/       # Project detail + presentation pages
    api/projects/          # CRUD API routes
  components/
    webgl/                 # Bioluminescence WebGL shader
    presentation/          # PresentationView + DetailsView + SlideRenderer
    DigitalRainPreloader   # Preloader animation
    ProjectCard            # Sortable project card with drag handle
    ProjectGrid            # Filterable/sortable grid with dnd-kit
    Header                 # Site header with glassmorphism
    CommandPalette         # Cmd+K command menu
    ThemeToggle            # Dark/light switch
  lib/
    projects.ts            # File-based project CRUD
    utils.ts               # cn() utility
  types/
    index.ts               # TypeScript types
```

## Connecting to Supabase

The current setup stores project data in local JSON files (`content/projects/*.json`). This works for local development but **will not persist writes on Vercel** (serverless filesystem is read-only for deployed code).

### Step 1: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Name it `the-vault` and choose a strong database password
4. Select a region close to you
5. Wait for the database to provision

### Step 2: Set up the database schema

In the Supabase SQL Editor, run:

```sql
create table projects (
  slug text primary key,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table project_order (
  id serial primary key,
  slugs text[] not null default '{}'
);

-- Insert a default order row
insert into project_order (slugs) values ('{}');
```

### Step 3: Install Supabase client

```bash
npm install @supabase/supabase-js
```

### Step 4: Add environment variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in your Supabase project dashboard under **Settings → API**.

### Step 5: Create a Supabase client

Create `src/lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Step 6: Update `src/lib/projects.ts`

Replace the file-based functions with Supabase queries:

| File function | Supabase equivalent |
|---|---|
| `getAllProjects()` | `supabase.from('projects').select('data').order('created_at')` |
| `getProjectBySlug(slug)` | `supabase.from('projects').select('data').eq('slug', slug).single()` |
| `saveProject(project)` | `supabase.from('projects').upsert({ slug: project.slug, data: project })` |
| `saveProjectOrder(slugs)` | `supabase.from('project_order').update({ slugs }).eq('id', 1)` |

Example for `getAllProjects`:

```ts
export async function getAllProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('project_order')
    .select('slugs')
    .eq('id', 1)
    .single()

  const orderMap = new Map<string, number>()
  const order = (data?.slugs as string[]) ?? []
  order.forEach((slug, i) => orderMap.set(slug, i))

  const { data: rows } = await supabase
    .from('projects')
    .select('data')

  const projects = (rows ?? []).map((r) => r.data as Project)
  projects.sort((a, b) => {
    const ai = orderMap.get(a.slug)
    const bi = orderMap.get(b.slug)
    if (ai === undefined && bi === undefined) return 0
    if (ai === undefined) return 1
    if (bi === undefined) return -1
    return ai - bi
  })

  return projects
}
```

### Step 7: Seed your data

Create a seed script or use the admin page to add projects. To migrate existing JSON data, run a script in the Supabase SQL Editor inserting rows from your JSON files.

### Step 8: Deploy to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add the two Supabase env vars in Vercel's dashboard
4. Deploy

## License

MIT
