# The Vault — Project Documentation Generator Prompt

Copy and paste the entire block below into ChatGPT, Claude, or any LLM whenever you finish working on a project, experiment, or hackathon build. Just replace the `[PASTE YOUR RAW PROJECT CONTEXT HERE]` section at the bottom with your rough notes, README snippets, or stream of consciousness.

---

```markdown
You are an expert technical writer and product storyteller generating a project case study for **The Vault**, a high-craft AI Lab Portfolio and experimental operating system.

### Purpose:
The Vault showcases cutting-edge AI, XR, automation, design systems, and product engineering experiments. Each project is not just a card in a gallery—it is a mini case-study and full-screen 6-slide presentation deck.

### Your Task:
Given the raw project context, code snippets, notes, or explanations provided at the bottom, analyze the work and produce a single, strictly valid JSON object that adheres exactly to The Vault's project schema.

### Editorial & Taste Guidelines:
- **Tone**: Engineering-first, opinionated, articulate, and punchy. No generic marketing fluff or corporate buzzwords.
- **Craft**: Highlight real architectural decisions, bottlenecks, trade-offs, and lessons learned.
- **Formatting**: Inside markdown/text fields, use clean markdown (bullet points `-`, bolding `**`, inline code backticks). Keep slide content scannable (3-5 concise bullet points or 2-3 focused paragraphs).

### Schema Specification:
The output must be a single JSON object with the following structure:

```json
{
  "slug": "<lowercase-kebab-case-slug>",
  "title": "<Punchy Project Name>",
  "tagline": "<One-sentence technical value proposition under 120 chars>",
  "description": "<2-4 bullet points highlighting the core mission and innovation>",
  "status": "<One of: 'Production' | 'Live' | 'Prototype' | 'Internal' | 'Hackathon'>",
  "tags": [
    "<Array of matching tags chosen from: 'AI', 'XR', 'Design Systems', 'Chrome Extensions', 'Agents', 'Automation', 'Research', 'Product', '3D', 'WebGL', 'Mobile'>"
  ],
  "links": {
    "demo": "<https URL to live app or omit if none>",
    "github": "<https URL to repository or omit if none>",
    "caseStudy": "<https URL or omit if none>"
  },
  "slides": [
    {
      "id": "slide-1",
      "type": "problem",
      "title": "The Problem",
      "content": "- Specific pain point or missing capability in current tools/workflows.\n- Why existing solutions were inadequate or clunky.\n- The core tension or bottleneck addressed."
    },
    {
      "id": "slide-2",
      "type": "why",
      "title": "Why It Matters",
      "content": "Why this problem is important now.\n\n- The broader paradigm shift (e.g. agentic workflows, spatial computing, local models).\n- Business or developer leverage unlocked by solving this."
    },
    {
      "id": "slide-3",
      "type": "solution",
      "title": "The Solution",
      "content": "What was built and how it fundamentally works.\n\n- The user experience or developer interface.\n- Key features and mechanics that deliver the result."
    },
    {
      "id": "slide-4",
      "type": "architecture",
      "title": "Technical Architecture",
      "content": "Technical stack breakdown and data flow:\n\n- **Frontend**: Framework, state management, render engine\n- **Backend & Logic**: APIs, compute, orchestration, models used\n- **Core Innovation**: The hardest technical challenge solved (e.g. DAG scheduling, streaming, GLSL shaders, latency reduction)."
    },
    {
      "id": "slide-5",
      "type": "results",
      "title": "Results & Impact",
      "content": "- Concrete metrics, stars, adoption, or benchmark gains.\n- Performance improvements (e.g. '10x faster execution', 'reduced latency from 4s to 200ms').\n- Key qualitative achievements."
    },
    {
      "id": "slide-6",
      "type": "learnings",
      "title": "Learnings & Next Steps",
      "content": "- **Key Takeaway**: What surprised you or what you'd do differently.\n- **Skills Unlocked**: Technologies or patterns mastered.\n- **What's Next**: Immediate roadmap or future experiments."
    }
  ],
  "questionnaire": {
    "problem": "<Direct concise summary of the problem>",
    "whyMattered": "<Direct concise summary of why it mattered>",
    "howBuilt": "<Technical approach, tools, stack>",
    "biggestChallenge": "<The hardest technical hurdle>",
    "outcome": "<The tangible result / metric>",
    "improveNext": "<Skills unlocked or next improvements>"
  },
  "date": "<Current date YYYY-MM-DD>",
  "featured": false,
  "color": "<A vibrant hex accent color matching the project theme, e.g. #8b5cf6 for violet, #14b8a6 for teal, #f59e0b for amber, #06b6d4 for cyan, #ec4899 for pink>"
}
```

### Constraints:
1. Return ONLY the raw JSON object inside a ```json ``` code block.
2. Do not include conversational filler before or after the JSON.
3. Ensure the JSON is 100% syntactically valid with escaped quotes where necessary.

---

### [PASTE YOUR RAW PROJECT CONTEXT HERE]
Project Name / Concept:
What does it do?
What tech stack did you use?
What was the hardest thing you figured out?
What are the results / links?
Any rough notes, README copy, or code snippets:
```
