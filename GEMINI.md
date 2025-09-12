# GEMINI.md

## Project Overview

This project is a web-based visual programming tool for text processing. It allows users to create workflows by connecting different nodes in a graph-based editor. Each node performs a specific text manipulation task, such as encoding/decoding, hashing, or regular expression matching. The processed output of one node can be piped as input to another, creating a "flow" of text transformations.

The application is built with a modern web stack:

*   **Frontend Framework:** React with TypeScript
*   **Build Tool:** Vite
*   **UI Components:** Custom components built with `reactflow` for the node editor, and `tailwindcss` for styling.
*   **Core Logic:** The text processing logic is implemented in TypeScript.

## Building and Running

The project uses `npm` for package management. The following commands are available in `package.json`:

*   **`npm run dev`**: Starts the development server with hot module replacement.
*   **`npm run build`**: Compiles the TypeScript code and bundles the application for production.
*   **`npm run lint`**: Lints the codebase using ESLint.
*   **`npm run preview`**: Starts a local server to preview the production build.

### Development

To run the application in development mode, execute:

```bash
npm install
npm run dev
```

### Production

To build the application for production, execute:

```bash
npm install
npm run build
```

The production-ready files will be located in the `dist` directory.

## Development Conventions

*   **Component-Based Architecture:** The UI is built with React components, located in `src/components`.
*   **Node-Based Processing:** The core text processing functionality is organized into "nodes". Each node is defined in `src/lib/nodes.ts` and has a corresponding UI component in `src/components/nodes`.
*   **Styling:** The application uses `tailwindcss` for styling. Utility classes are preferred over custom CSS.
*   **State Management:** The state of the nodes and edges in the editor is managed using `reactflow`'s built-in state management and React's `useState` and `useCallback` hooks. A custom `NodeContext` is used to provide a way for nodes to update their internal state.
*   **Linting:** The project uses ESLint with a configuration that enforces a consistent coding style.
