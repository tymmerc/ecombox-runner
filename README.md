# 🛒 Ecombox Runner

Projet fullstack en **Node.js** et **React** avec **TailwindCSS** – conçu pour un usage pédagogique ou une démo de formulaire connecté.

---

## 🗂️ Structure du projet

ecombox-runner/
├── backend/
│ ├── index.js
│ ├── noms_stacks.txt
│ ├── package.json
│ └── ...
└── frontend/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── src/
├── App.jsx
├── main.jsx
├── ScriptForm.jsx
└── index.css

---

## 🚀 Lancer le projet en local

### 📦 Prérequis

- Node.js ≥ 16
- npm
- (Optionnel) Vite installé globalement : `npm install -g vite`

---

### 1. Backend

```bash
cd backend
npm install
node index.js
➡️ Cela démarre ton serveur backend (sur le port défini dans index.js).

2. Frontend
bash
Copier
Modifier
cd ../frontend
npm install
npm run dev
➡️ Cela démarre le frontend React avec Vite.
Accès par défaut : http://localhost:5173

🧰 Stack technique
Frontend : React, TailwindCSS, Vite

Backend : Node.js (Express non précisé, mais probable)

Langage : JavaScript

Style : CSS via Tailwind (postcss.config.js présent)

📦 Déploiement (optionnel)
🌐 Backend possible sur Render

