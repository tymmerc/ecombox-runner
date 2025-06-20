const express = require('express');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const SCRIPTS_DIR = "/opt/e-combox/";
const scriptsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'scripts.json'), 'utf-8'));

app.get('/scripts', (req, res) => {
  res.json(scriptsConfig);
});

// Endpoint existant (exec)
app.post('/run-script', (req, res) => {
  const { scriptName, options } = req.body;

  if (!scriptsConfig[scriptName]) {
    return res.status(400).send('Script non autorisé');
  }

  const command = `${SCRIPTS_DIR}${scriptName} ${options || ''}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur: ${error}`);
      return res.status(500).send(stderr || 'Erreur inconnue');
    }
    res.send(stdout);
  });
});

// Nouvel endpoint streaming avec spawn et SSE
app.get('/run-script-stream', (req, res) => {
  const { scriptName, options } = req.query;

  if (!scriptsConfig[scriptName]) {
    return res.status(400).send('Script non autorisé');
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const args = options ? options.split(' ') : [];
  const scriptPath = `${SCRIPTS_DIR}${scriptName}`;

  const child = spawn(scriptPath, args);

  child.stdout.on('data', (data) => {
    res.write(`data: ${data.toString()}\n\n`);
  });

  child.stderr.on('data', (data) => {
    res.write(`data: ${data.toString()}\n\n`);
  });

  child.on('close', (code) => {
    res.write(`data: === Process finished with code ${code} ===\n\n`);
    res.write('event: end\n\n');
    res.end();
  });

  req.on('close', () => {
    child.kill();
    res.end();
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Backend sur http://localhost:${PORT}`));
