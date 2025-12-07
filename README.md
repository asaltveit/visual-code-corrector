# Multi-Modal Code Refactorer with Visual Verification

An AI-powered tool to refactor code, generate unit tests, and create visual verification mockups using **Gemini 3** (Code Reasoning) and **Nano Banana Pro** (Visual Generation).

Created during the Gemini 3 Hackathon SF hackathon 12/06/25.

## Features

*   **Semantic Refactoring**: Uses Gemini 3 to analyze messy/legacy code, improve logic, accessibility, and modern practices.
*   **Automated Unit Tests**: Generates a comprehensive test suite for the refactored code.
*   **Visual Verification (New!)**:
    *   Generates a "Before" render of the original messy code.
    *   Generates an "After" render of the cleaned refactored code.
    *   Displays them side-by-side to visually confirm that the visual output remains consistent (or improves) while the underlying code quality increases.
*   **Client-Side Only**: No database or backend required. Runs entirely in the browser using the Gemini API.
*   **History**: Persists your refactoring sessions in LocalStorage.

## Tech Stack

*   **Framework**: Next.js 14 (App Router) / React
*   **Styling**: TailwindCSS + Lucide React Icons
*   **AI Models**:
    *   `gemini-3-pro-preview`: Code logic, refactoring, tests.
    *   `gemini-3-pro-image-preview` (Nano Banana Pro): Visual rendering of code components.

## Setup

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Create a `.env.local` file with your Gemini API Key:
    ```bash
    NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
    ```
4.  Run locally: `npm run dev`

## How it Works

1.  **Input**: Paste your React/HTML/CSS component into the left panel.
2.  **Process**:
    *   Gemini 3 refactors the code structure.
    *   Simultaneously, Nano Banana Pro renders the "Before" state image.
    *   Once refactoring is complete, Nano Banana Pro renders the "After" state image.
3.  **Verify**: Switch to the "Visual Verify" tab to compare the renders side-by-side. Check the "Refactored Code" tab to see the clean syntax.

## License

MIT
