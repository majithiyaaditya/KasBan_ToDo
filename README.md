# KasBan — Project Command Center

A modern, tactile, and aesthetic Kanban workspace designed to make task management effortless and visually captivating.

Built with a curated **Warm Paper & Copper** palette, frosted glassmorphism, and fluid interactive animations, KasBan bridges the gap between productivity and state-of-the-art web design.

---

## 📖 Introduction

**KasBan** is an interactive project management application inspired by physical stationery and modern digital minimalism. 

Traditional task management tools often feel rigid, cold, or overly utilitarian. KasBan re-imagines the workflow experience by combining:

- **Tactile Aesthetics**: Organic parchment textures, soft shadows, and warm terracotta accents.
- **Dynamic Living Interface**: WebGL liquid fluids, responsive cursor lights, and rubber-spring navigation controls.
- **Efficient Workflows**: Seamless transitions between Kanban columns, detailed task lists, and visual productivity analytics.

Whether tracking personal milestones or managing sprint tasks, KasBan provides a focused, clutter-free environment.

---

## ✨ Key Features

- **📋 Multi-View Workspace**  
  Switch instantly between **Kanban Board**, **List View**, and **Analytics** with fluid animated transitions.

- **🖐️ Tactile Drag & Drop**  
  Effortlessly organize tasks across workflow columns: *To Do*, *In Progress*, *In Review*, and *Done*.

- **🎨 Dynamic Visuals & Ambient Animations**  
  - Real-time WebGL fluid background powered by Three.js shaders.
  - Interactive frosted-glass sidebar with fluid orbs and cursor tracking.
  - Cohesive gradient flows across the authentication screens.

- **🔍 Search, Filtering & Sorting**  
  Filter tasks instantly by title, description, workflow status, or priority level (*High*, *Medium*, *Low*).

- **📊 Visual Analytics**  
  View real-time workspace metrics including task completion rates, status breakdown, and activity distribution.

- **🔐 User Authentication**  
  Client-side user registration, secure session simulation, and instant profile management.

---

## 🛠️ Technologies Used

### Core Framework & Runtime
- **React 19** — Modern component-driven user interface with latest concurrent features.
- **TypeScript** — Full type-safety across stores, components, and schemas.
- **Vite** — Next-generation frontend tooling providing lightning-fast HMR and bundling.
- **Bun** — Ultra-fast JavaScript runtime and package manager.

### Styling & Design System
- **Tailwind CSS v4** — Utility-first styling with modern CSS variable color tokens.
- **Custom Warm Paper System** — Tailored palette featuring Warm Paper (`#F5F2EA`), Deep Ocean (`#173B4A`), and Copper (`#B9683E`).

### Motion & Visual Effects
- **Three.js & @react-three/fiber** — GPU-accelerated GLSL shader simulations for the organic liquid backdrop.
- **Motion** — Spring micro-interactions and smooth component entrances.
- **GSAP** — High-performance transitions between dashboard view layouts.

### State & Routing
- **Zustand** — Lightweight, centralized state management for tasks, filters, and user auth.
- **TanStack Router** — Fully type-safe client-side routing.

### Forms & Validation
- **React Hook Form** — Performant, uncontrolled form validation with minimal re-renders.
- **Zod** — Strict schema validation for task creation and authentication.

### Icons
- **Lucide React** — Clean, consistent, and lightweight icon library.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have one of the following installed:
- **Bun** *(Recommended)*
- **Node.js** *(v18 or higher)*


---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/majithiyaaditya/KasBan_ToDo.git
   cd KasBan_ToDo
   ```

2. **Install project dependencies:**
   ```bash
   # Using Bun (Recommended)
   bun install

   # Or using npm
   npm install
   ```

---

### Running the App

Start the local development server:

```bash
# Using Bun
bun dev

# Or using npm
npm run dev
```

Once started, open your browser and navigate to:
```
http://localhost:5173
```

---

## 📦 Production Build

To test and compile the production bundle:

```bash
# Using Bun
bun run build

# Or using npm
npm run build
```

To preview the production build locally:

```bash
# Using Bun
bun run preview

# Or using npm
npm run preview
```
