# Text Flow

Text Flow is a web-based visual programming tool designed for text processing. It allows users to create workflows by connecting different nodes in a graph-based editor. Each node performs a specific text manipulation task, such as encoding/decoding, hashing, or regular expression matching. The processed output of one node can be piped as input to another, creating a dynamic "flow" of text transformations.

## Features

The application provides a variety of nodes to handle different text processing needs:

*   **Text Input:** Enter custom text to start a flow.
*   **Text Display:** Visualize the output from any node.
*   **Base64:** Encode text to Base64 or decode Base64 strings.
*   **Hash:** Generate hashes for your text using algorithms like SHA256, MD5, and others (powered by `crypto-js`).
*   **JSON:** Utilities for JSON data including formatting (pretty-print), compressing, escaping, and unescaping.
*   **Regex Match:** Apply regular expressions to filter or extract patterns from text.
*   **Encrypt/Decrypt:** Securely encrypt or decrypt text using AES with a custom key.

## Tech Stack

*   **Frontend Framework:** [React](https://react.dev/) (v19) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Visual Editor:** [React Flow](https://reactflow.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Cryptography:** [CryptoJS](https://cryptojs.gitbook.io/docs/)

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd text-flow
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running in Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

Compile the TypeScript code and bundle the application for production:

```bash
npm run build
```

The output files will be generated in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
text-flow/
├── src/
│   ├── components/
│   │   ├── layout/       # Layout components (e.g., Sidebar)
│   │   ├── nodes/        # Individual node components (e.g., Base64Node)
│   │   └── ui/           # Reusable UI components
│   ├── contexts/         # React Contexts (e.g., NodeContext)
│   ├── lib/              # Core logic and utility functions
│   │   └── nodes.ts      # Node definitions and processor logic
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
├── .eslintrc.cjs         # ESLint configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request