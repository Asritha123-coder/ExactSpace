# 📸 Photo Gallery

A responsive React-based photo gallery application that allows users to explore images, view image details, like their favorite photos, and browse content through infinite scrolling.

## ✨ Features

- **Image Gallery:** Displays images fetched from the Openverse API.
- **Infinite Scrolling:** Automatically loads more images as the user scrolls down.
- **Like Functionality:** Like your favorite images and view their like counts.
- **Image Attribution:** Displays image author information.
- **Responsive Design:** Adapts to different screen sizes and devices.
- **Dynamic Content:** Fetches images from the API as needed.

## 🛠️ Tech Stack

- React.js
- Vite
- JavaScript
- CSS
- Openverse API
- Intersection Observer API

## 📂 Project Structure

```text
photo-gallery/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Asritha123-coder/ExactSpace.git
```

2. Navigate to the project directory:

```bash
cd ExactSpace/photo-gallery
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 🌐 API Used

This project uses the **Openverse API** to retrieve publicly available images.

API endpoint:

```text
https://api.openverse.org/v1/images/
```

Images are fetched using pagination to support infinite scrolling.

## 🎯 Learning Outcomes

- Working with external REST APIs.
- Implementing infinite scrolling in React.
- Managing component state using React Hooks.
- Handling dynamic data rendering.
- Building responsive user interfaces.
