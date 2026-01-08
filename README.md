# PicPhrase 🎨🧩

**PicPhrase** is a modern, AI-powered phrase guessing game. Users guess common idioms, movies, or compound words based on two AI-generated images.

![PicPhrase Gameplay](https://via.placeholder.com/800x400?text=PicPhrase+Gameplay+Banner)

## 🚀 Features

-   **Infinite AI Mode**: Never run out of levels. Powered by **Groq (Llama 3)** to generate unique puzzles on the fly.
-   **Smart Image Generation**:
    -   Primary: **Pollinations.ai** (Real-time AI generation).
    -   **Robust Fallback System**: If AI images are blocked (firewall/network), the app automatically tunnels requests through a global proxy (`wsrv.nl`) or falls back to context-aware stock photos.
-   **Persistence**: The game "remembers" every puzzle you've played (using `localStorage`) to ensure you never see the same puzzle twice, even after refreshing.
-   **Dynamic Categories**: Puzzles switch between "Idioms", "Movies", "Superheroes", and more.
-   **Sleek UI**: Built with **Tailwind CSS**, Glassmorphism effects, and smooth animations (`framer-motion`).

## 🛠️ Tech Stack

-   **Frontend**: React (Vite)
-   **Styling**: Tailwind CSS
-   **AI Logic**: Groq SDK (Llama 3-70b)
-   **Image Generation**: Pollinations.ai API
-   **Icons**: Lucide React

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/picphrase.git
    cd picphrase
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    VITE_GROQ_API_KEY=your_groq_api_key_here
    ```
    *Get a free key from [console.groq.com](https://console.groq.com).*

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` to play!

## 📂 Project Structure

-   `src/components/`
    -   `Play.jsx`: Core game loop, input handling, and image rendering w/ fallback logic.
    -   `AiPlayWrapper.jsx`: Manages the "Infinite Mode" state, persistence, and AI fetching.
-   `src/services/`
    -   `groq.js`: Handles communication with the LLM (Groq).
-   `src/utils/`
    -   `levelGenerator.js`: Prompts the AI to create valid JSON puzzle data.
    -   `imageGenerator.js`: Constructs optimized URLs for image generation.

## 🤖 How It Works

1.  **Generation**: The app asks Groq for a "PicPhrase" puzzle (JSON).
2.  **Visualization**: It extracts keywords (e.g., "clock", "wings") and asks Pollinations.ai for images.
3.  **Fallback**: If the image fails to load (403/Error), the `onError` handler triggers a proxy or stock photo replacement instantly.
4.  **Persistence**: The answer is saved to `localStorage`. The next prompt includes a list of "Avoid these phrases" to ensure novelty.

---

*Built for fun, optimized for resilience.*
