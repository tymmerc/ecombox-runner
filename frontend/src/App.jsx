import React, { useEffect, useState } from 'react';
import ScriptForm from './ScriptForm';

export default function App() {
  const [scripts, setScripts] = useState({});

  useEffect(() => {
    fetch('http://localhost:3000/scripts')
      .then((res) => res.json())
      .then((data) => setScripts(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">⚙️ Entretien de l'Ecombox</h1>
        <ScriptForm scripts={scripts} />
      </div>
    </div>
  );
}
