import React, { useState } from 'react';

export default function ScriptForm({ scripts }) {
  const [scriptName, setScriptName] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (flag, type, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [flag]: type === 'checkbox' ? !prev[flag] : value
    }));
  };

  const buildCommandOptions = () => {
    return Object.entries(selectedOptions)
      .filter(([_, val]) => val !== false && val !== '')
      .map(([flag, val]) => (typeof val === 'boolean' ? flag : `${flag} "${val}"`))
      .join(' ');
  };

  const runScript = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');

    const options = buildCommandOptions();

    const res = await fetch('http://localhost:3000/run-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scriptName, options })
    });

    const text = await res.text();
    setOutput(text);
    setLoading(false);
  };

  const currentScript = scripts[scriptName];

  return (
    <div>
      <style>{`
        @keyframes rocketLaunch {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          20% {
            transform: translateY(-5px) scale(1.1);
            opacity: 1;
          }
          50% {
            transform: translateY(-30px) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-80px) scale(0.6);
            opacity: 0;
          }
        }

        @keyframes rocketTrail {
          0% {
            opacity: 0;
            transform: scaleY(0);
          }
          30% {
            opacity: 1;
            transform: scaleY(0.5);
          }
          70% {
            opacity: 1;
            transform: scaleY(1);
          }
          100% {
            opacity: 0;
            transform: scaleY(1.5);
          }
        }

        @keyframes buttonGlow {
          0% {
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
          }
          50% {
            box-shadow: 0 4px 25px rgba(99, 102, 241, 0.8);
          }
          100% {
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        .rocket-launch {
          animation: rocketLaunch 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .rocket-trail {
          animation: rocketTrail 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .button-glow {
          animation: buttonGlow 1.8s ease-in-out;
        }

        .sparkle-1 {
          animation: sparkle 1.8s ease-in-out;
        }

        .sparkle-2 {
          animation: sparkle 1.8s ease-in-out 0.3s;
        }

        .sparkle-3 {
          animation: sparkle 1.8s ease-in-out 0.6s;
        }
      `}</style>

      <form onSubmit={runScript} className="space-y-6">
        <label className="block">
          <span className="text-gray-700 font-semibold">🛠️ Choix du script</span>
          <select
            className="mt-2 block w-full border rounded-full p-2 px-4 shadow hover:shadow-md transition text-lg"
            value={scriptName}
            onChange={(e) => {
              setScriptName(e.target.value);
              setSelectedOptions({});
            }}
          >
            <option value="">-- Sélectionner un script de maintenance --</option>
            {Object.entries(scripts).map(([name]) => {
              const scriptNames = {
                'update_ecb.sh': '🔄 Mise à jour e-comBox',
                'sauv_sites.sh': '💾 Sauvegarde complète',
                'restaure_sites.sh': '📁 Restauration de sauvegarde',
                'nettoyage_volumes.sh': '🧹 Nettoyage des logs',
                'reinitialise_application.sh': '🔄 Réinitialisation complète'
              };
              return (
                <option key={name} value={name}>
                  {scriptNames[name] || name.replace('.sh', '').replace(/_/g, ' ')}
                </option>
              );
            })}
          </select>
        </label>

        {currentScript && (
          <>
            <p className="text-gray-600 italic">{currentScript.description}</p>

            <div className="space-y-4 mt-4">
              {currentScript.options?.map((opt) => (
                <div key={opt.flag} className="flex flex-col">
                  {opt.type === 'checkbox' ? (
                    <label className="inline-flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-full shadow-sm hover:bg-gray-200 cursor-pointer transition">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-indigo-600"
                        checked={!!selectedOptions[opt.flag]}
                        onChange={() => handleOptionChange(opt.flag, 'checkbox')}
                      />
                      <span className="text-gray-800">{opt.label}</span>
                    </label>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-gray-700 font-medium">{opt.label}</span>
                      <input
                        type="text"
                        placeholder={opt.placeholder || ''}
                        className="mt-1 block w-full border rounded-full p-2 px-4 shadow-sm"
                        value={selectedOptions[opt.flag] || ''}
                        onChange={(e) => handleOptionChange(opt.flag, 'text', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={!scriptName || loading}
          className={`
            relative overflow-hidden
            bg-indigo-600 hover:bg-indigo-700 
            text-white font-bold py-3 px-6 rounded-full 
            transition duration-300 
            disabled:opacity-50 
            text-lg
            ${loading ? 'button-glow' : ''}
          `}
        >
          <div 
            className={`
              absolute left-1/2 bottom-4 transform -translate-x-1/2 
              w-1 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent 
              rounded-full opacity-0
              ${loading ? 'rocket-trail' : ''}
            `}
          />
          
          <div className="flex items-center gap-3 relative z-10">
            <span 
              className={`
                text-2xl transition-all duration-300 inline-block
                ${loading ? 'rocket-launch' : ''}
              `}
            >
              🚀
            </span>
            <span>
              {loading ? '⏳ Exécution en cours...' : 'Lancer le script'}
            </span>
          </div>

          {loading && (
            <>
              <div className="absolute top-1 left-6 text-yellow-300 text-sm sparkle-1">✨</div>
              <div className="absolute top-1 right-6 text-yellow-300 text-sm sparkle-1">✨</div>
              <div className="absolute bottom-2 left-8 text-yellow-300 text-xs sparkle-2">⭐</div>
            </>
          )}
        </button>

        {output && (
          <pre className="mt-6 bg-black text-green-400 p-4 rounded-xl overflow-auto max-h-96 text-sm">
            {output}
          </pre>
        )}
      </form>
    </div>
  );
}
