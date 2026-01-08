# 🌟 PicPhrase Architecture: A Visual Puzzle Game

PicPhrase is a modern, visual puzzle game built as a single-page application (SPA) that challenges players to decode common phrases, idioms, or sayings from a set of images. It features a unique **Hybrid Data Source** architecture, allowing it to operate in both standard, curated mode and an endless, AI-generated "Infinite" mode.

---

## 💻 Technology Stack

| Category | Technology | Purpose & Details |
| :--- | :--- | :--- |
| **Core Framework** | **React 19** (via Vite) | Fast development, component-based UI. |
| **Styling** | **Tailwind CSS** | Utility-first CSS for rapid, consistent styling, emphasizing Glassmorphism aesthetics. |
| **Animations** | **Framer Motion** | Smooth, modern transitions, hover effects, and entrance animations. |
| **Routing** | **React Router Dom** | Handles navigation between the Landing Page, Game Engine, and static pages. |
| **Icons** | **Lucide React** | Clean, scalable vector icons. |
| **AI Engine** | **Groq SDK** | **Brain of the Infinite Mode**. Uses the ultra-fast **`llama-3.3-70b-versatile`** model to generate puzzles in milliseconds. |
| **Image Synthesis** | **Pollinations.ai** + **Proxies** | Converts text descriptions into on-the-fly images, with a robust multi-layer fallback system. |

---

## 🏗️ Architecture and Game Modes

The application is structured around a central, data-agnostic **Game Engine** that supports two distinct operational modes:

### 1. Standard Mode (Curated)
*   **Source**: Static data from `src/data/levels.json` (30 pre-built levels).
*   **Trigger**: User selects Casual, Thinker, or Genius difficulty on the Landing Page.
*   **Flow**: `PlayWrapper` mounts and passes the static level data directly to the `Play.jsx` Game Engine.

### 2. Infinite Mode (AI-Generated)
*   **Source**: Real-time generation via **Groq** and **Pollinations.ai**.
*   **Trigger**: User selects **Infinite** on the Landing Page.
*   **Flow**: Managed by the sophisticated **AI Buffering Pipeline** within `AiPlayWrapper.jsx`.

---

## 🧠 The AI Integration Pipeline (Infinite Mode)

This pipeline is the most critical feature, designed to make the AI generation delay imperceptible to the user through background buffering and persistence.

### Infinite Mode Data Flow

1.  **The Brain (`src/services/groq.js`)**:
    *   Initializes the Groq SDK client.
    *   **Model**: Uses `llama-3.3-70b-versatile` for high creativity and logic.
    *   **Prompting**: Sets `temperature: 0.9` for maximum variety.

2.  **The Generator (`src/utils/levelGenerator.js`)**:
    *   **Category Randomization**: Before asking the AI, it randomly selects a target category (e.g., *"Superhero"*, *"Food Item"*, *"Song Title"*) to prevent repetitive topics.
    *   **Prompt Engineering**: Sends a structured prompt to Groq to generate a JSON object.
    *   **Context/Exclusion**: It injects a list of **previously seen answers** (from history) into the prompt, explicitly instructing the AI: *"Avoid these phrases"*.
    *   **Image Synthesis**: It uses `src/utils/imageGenerator.js` to convert the AI's textual descriptions into optimized Pollinations.ai URLs.

3.  **The Buffer & Memory (`src/components/AiPlayWrapper.jsx`)**:
    *   **Persistence**: Loads the user's entire play history from `localStorage` (`picphrase_seen_answers`).
    *   **Background Fetching**: While the user plays Level 1, the system quietly fetches Level 2 using the history to ensure uniqueness.
    *   **The "Trick"**: It manages the queue in its state and passes the current level to the data-agnostic `Play.jsx`.

---

## 👁️ The "Eyes": Robust Image Fallback System

Generating images in real-time is risky (due to network blocks, API limits, or strict firewalls). PicPhrase employs a **Multi-Stage Fallback Chains** in `Play.jsx` to ensure the user *always* sees an image.

**The Chain of Survival:**

1.  **Primary**: **Pollinations.ai (Direct)**
    *   *Attempt*: Load image directly from `image.pollinations.ai`.
    *   *Status*: Best quality, fastest.

2.  **Fallback 1**: **Global Proxy (`wsrv.nl`)**
    *   *Trigger*: If Primary fails (e.g., Content Security Policy or Firewall block).
    *   *Action*: The app rewrites the URL to route through `wsrv.nl`. The proxy fetches the image and serves it to the user.

3.  **Fallback 2**: **Context-Aware Stock Photo (Proxied)**
    *   *Trigger*: If AI generation is completely down.
    *   *Action*: The app extracts the "Main Keyword" (e.g., "Clock") and requests a specific stock photo from **LoremFlickr**.
    *   *Routing*: This is also sent through the proxy to maximize success rates.

4.  **Fallback 3**: **Safe Mode (Picsum)**
    *   *Trigger*: If specific keyword searches fail.
    *   *Action*: Loads a purely random, high-quality scenic image from **Picsum**.

5.  **Fallback 4**: **Visual Error UI** (Last Resort)
    *   *Action*: Displays a specialized error card ("Network Blocked"), preventing a "broken image icon" from ruining the UI.

---

## 🎯 The Game Engine (`src/components/Play.jsx`)

This component is the heart of the game and is agnostic to the data source.

*   **Core State**: Tracks current level index, user input, score, and hint usage.
*   **Key Logic**:
    *   **Image Resets**: Uses unique React keys (`key={`${currentLevel.id}-${i}`}`) to force a complete breakdown and recreation of image components when levels change. This prevents "stale" images from persisting.
    *   **Fuzzy Matching (`src/utils/gameUtils.js`)**:
        *   Normalizes inputs (lowercase, remove punctuation).
        *   Ignores common articles ("the", "a").
        *   Example: Input *"The Cat"* matches Answer *"Cat"*.

---

## 📂 Project Structure Highlights

| Path | Role | Key Functions |
| :--- | :--- | :--- |
| `src/components/AiPlayWrapper.jsx` | **Manager** | Buffers AI levels, manages `localStorage` persistence, and handles the "infinite" queue. |
| `src/components/Play.jsx` | **Game UI** | Renders the game, handles the **Image Fallback Chain**, and processes user input. |
| `src/services/groq.js` | **AI Client** | Initializes the **Groq API** and handles raw LLM requests. |
| `src/utils/levelGenerator.js` | **Builder** | Randomizes categories, builds prompts, constructs JSON, and cleans outputs. |
| `src/utils/imageGenerator.js` | **Url Builder**| Creates optimized, safe URLs for the image APIs. |
| `src/data/levels.json` | **Static DB** | Contains all curated levels for Standard Mode. |

---

## 🔍 How Infinite Mode Prevents Repetition

1.  **User plays "Time Flies"**.
2.  **Save**: "Time Flies" is added to `localStorage`.
3.  **Next Request**: The app sends a prompt to Groq:
    > *"Create a new puzzle. Target Category: Superhero. DO NOT use the phrase 'Time Flies'."*
4.  **Result**: The AI *must* generate something new, like "Spider Man".
5.  **Loop**: The list of "avoid phrases" grows as you play, forcing the AI to dig deeper into its knowledge base for obscure and interesting puzzles.
