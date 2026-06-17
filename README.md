Here is a comprehensive, professional, and detailed `README.md` file tailored to your app. You can copy and paste this directly into your `README.md` file.

***

# 📌 Local Project Whiteboard

A **100% local, offline-first, browser-based** note-taking and mind-mapping application. Built with pure HTML, CSS, and Vanilla JavaScript, this app requires no installation, no backend servers, and no internet connection to function. Your data stays entirely on your machine, giving you complete privacy and control.

*(Built with the assistance of Qwen)*

---

## 🚀 Key Features

### 📝 Project Management
- Create, edit, and manage multiple distinct whiteboard projects.
- Each project maintains its own unique set of notes, images, and connections.

### 🎨 Infinite-Style Canvas
- A massive 3000x3000px workspace to brainstorm freely.
- Smooth zoom in/out (`Ctrl + Scroll` or toolbar buttons) and reset view functionality.

### 🧩 Interactive Elements
- **Sticky Notes**: Drag, drop, and type freely. Choose from 5 pastel colors (Yellow, Blue, Green, Pink, Red).
- **Group Boxes**: Resizable, draggable containers to organize related notes. Customizable titles.
- **Image Support**: Add images via file upload or simply **Copy & Paste** (`Ctrl+V`) directly onto the canvas.
- **Connections**: Link any two elements together with clean, directional arrow lines. Click a line to delete it.

### 🌈 Deep Customization
- **Themes**: Seamless Light and Dark mode toggling.
- **Custom Colors**: Personalize the Global Text, Primary Buttons, Toolbar, Cards, and Canvas backgrounds via a built-in color picker.
- **Dynamic Backgrounds**: Choose from 7 unique canvas styles:
  - Dot Grid (Default)
  - Graph Paper
  - Blank
  - Live Animated Gradients
  - ✨ Falling Stars
  - 🌠 Shooting Stars (Canvas-rendered)
  - 🌀 Animated Patterns

### 🎵 Built-in Lofi Radio
- A sleek, collapsible radio player in the bottom-right corner.
- Features an animated EQ visualizer that reacts when music is playing.
- Pre-loaded with reliable, direct-streaming Lofi stations (Lofi Cafe, Hotmix, etc.).
- Full play/pause, next/previous, and volume controls.

### ⌨️ Keyboard Shortcuts
- `N` : Add new Sticky Note
- `G` : Add new Group Box
- `C` : Toggle Connect Mode
- `1-5` : Change the color of the most recently added note
- `Ctrl + S` : Export current project to JSON
- `Ctrl + +/-` : Zoom In / Out
- `Ctrl + 0` : Reset Zoom
- `Esc` : Cancel connection mode or close modals

---

## 🔒 100% Local & Privacy-First

This application is designed with a **zero-trust, privacy-first** philosophy:
- **No Cloud**: Your data is never uploaded to any server.
- **No Tracking**: No analytics, no cookies, and no external scripts (other than the optional radio audio streams).
- **No Installation**: It runs entirely from a single `.html` file. You can run it straight from your desktop or a USB drive.
- **Offline Capable**: Once loaded, you can disconnect your internet, and the app will function perfectly.

---

## 💾 Where is my data stored?

Because this app is 100% local, your data is stored securely inside your web browser's internal memory. It is **not** saved as standard files on your hard drive unless you explicitly export it.

### 1. Projects & Whiteboard Data (IndexedDB)
All notes, images, connections, and project metadata are stored in the browser's **IndexedDB** under the database name `LocalWhiteboardDB`.
**How to view your raw data (Opera GX / Chrome / Edge):**
1. Press `F12` or `Ctrl + Shift + I` to open Developer Tools.
2. Navigate to the **Application** tab.
3. In the left sidebar, expand **Storage** > **IndexedDB**.
4. Click on `LocalWhiteboardDB` > `projects`. You will see a table of all your saved projects and their raw JSON data.

### 2. App Settings (Local Storage)
Your theme preferences, background choices, and custom color palettes are saved in the browser's **Local Storage**.
**How to view:**
1. In the same **Application** tab in Developer Tools.
2. Expand **Local Storage** in the left sidebar.
3. Click on your file's URL (e.g., `file://...` or `localhost`).
4. You will see keys named `wb_settings` and `wb_colours`.

> ⚠️ **Important:** Because data is tied to your specific browser, clearing your browser's "Site Data" or "Cookies and Site Data" will delete your projects. Opening the HTML file in a *different* browser will also start with a blank slate.

---

## 💡 How to Back Up Your Data

To ensure you never lose your work, the app includes a built-in export feature:
1. Open the project you want to save.
2. Click the **Export Project** icon (⬇️ arrow) in the top-right toolbar.
3. A `.json` file will immediately download to your computer's Downloads folder. 
4. *Note: While there is no "Import" button in the current UI, this JSON file contains all your notes, coordinates, colors, and base64-encoded images, serving as a permanent, portable backup.*

---

## 🛠️ Getting Started

1. Download or save the `index.html` file to your computer.
2. Double-click the file to open it in your preferred modern web browser (Chrome, Opera GX, Firefox, Edge, etc.).
3. Click **"+ New Project"** to start brainstorming!

---

## 📜 Credits
- **Development**: Crafted with the assistance of **Qwen** (Alibaba Cloud).
- **Icons**: Custom inline SVGs (no external icon libraries required).
- **Audio Streams**: Publicly available Lofi radio stream URLs.

***

### Why this README is effective:
1. **Clear Value Proposition**: Immediately tells the user *what* it is and *why* it's safe (100% local).
2. **Feature-Rich**: Breaks down the UI into logical, easy-to-read categories.
3. **Actionable Data Instructions**: Gives exact, step-by-step instructions for Opera GX/Chrome users to find their data, demystifying where it goes.
4. **Safety Warning**: Clearly warns the user about clearing browser data, preventing accidental data loss.
5. **Professional Polish**: Uses emojis, bolding, and clean Markdown formatting to make it highly readable.