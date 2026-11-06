import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT || 3000);
const fixturePath = join(ROOT, 'content', 'sample-story.json');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const json = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
};

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 200_000) throw new Error('Request too large');
  }
  return raw ? JSON.parse(raw) : {};
}

function fixtureFor(input, base) {
  const topic = String(input.topic || 'Mughal Empire').trim() || 'Mughal Empire';
  const sourceRange = input.sourceRange || base.sourceRange;
  const isMughal = topic.toLowerCase() === 'mughal empire';
  if (!isMughal) {
    return {
      id: `story-${Date.now()}`,
      title: `A story route for ${topic}`,
      topic,
      sourceLabel: input.materialMode === 'material' ? `Selected study material · ${sourceRange}` : 'Offline story scaffold · awaiting verified content',
      sourceRange,
      language: input.language || 'English',
      level: input.level || 'Intermediate',
      mode: input.mode || 'hybrid',
      fallbackNotice: 'This offline scaffold has no topic facts. Connect the learning assistant or provide verified material before treating it as a factual lesson.',
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'offline-ep-1', number: 1, title: `The question inside ${topic}`,
          summary: `A safe story scaffold that helps you frame ${topic} before verified content is added.`,
          facts: [],
          scenes: [
            { id: 'offline-sc-1', type: 'narration', title: 'Start with a question', narration: `What would you most like to understand about ${topic}? A strong question gives the next source something to answer.`, dialogue: [], background: 'open-notebook', source: sourceRange, interpretation: 'Learning scaffold only; no factual claim is made.' },
            { id: 'offline-sc-2', type: 'narration', title: 'Bring the right page', narration: `Choose a chapter, page range or trusted reference about ${topic}. The finished story will keep that source context attached to each scene.`, dialogue: [], background: 'source-map', source: sourceRange, interpretation: 'Learning scaffold only; no factual claim is made.' }
          ],
          quiz: [{ id: 'offline-q-1', question: 'What should you confirm before using an offline scaffold as a factual lesson?', options: ['A verified source or selected material', 'Only the colour theme', 'A longer title', 'A new animation'], answer: 0, explanation: 'The scaffold is not a factual lesson until verified material or a connected learning assistant supplies the content.' }]
        }
      ]
    };
  }
  return {
    ...base,
    id: `story-${Date.now()}`,
    topic,
    title: base.title,
    sourceLabel: input.materialMode === 'material'
      ? `Selected study material · ${sourceRange}`
      : 'Topic studio · generated learning path',
    sourceRange,
    language: input.language || base.language,
    level: input.level || base.level,
    mode: input.mode || base.mode,
    createdAt: new Date().toISOString(),
    episodes: base.episodes.map((episode, episodeIndex) => ({
      ...episode,
      title: episodeIndex === 0 && topic.toLowerCase() !== 'mughal empire'
        ? `The first question about ${topic}`
        : episode.title,
      summary: episodeIndex === 0 && topic.toLowerCase() !== 'mughal empire'
        ? `A guided opening that turns ${topic} into a memorable learning journey.`
        : episode.summary,
      scenes: episode.scenes.map((scene) => ({
        ...scene,
        source: sourceRange,
        interpretation: scene.interpretation || 'Narrative framing for learning.'
      }))
    }))
  };
}

async function generateWithManus(input, base) {
  const apiUrl = process.env.MANUS_API_URL;
  const apiKey = process.env.MANUS_API_KEY;
  if (!apiUrl || !apiKey) return null;

  const prompt = `Create a concise educational story for the topic "${input.topic}". Return valid JSON with this shape: {title, topic, sourceLabel, sourceRange, episodes:[{number,title,summary,facts:[string],scenes:[{type,title,narration,dialogue:[{speaker,text}],source,interpretation}],quiz:[{question,options:[string],answer:number,explanation:string}]}]}. Keep historical/scientific claims cautious, identify fictional dialogue as fictional, and do not invent sources. Use ${input.language || 'English'}, ${input.level || 'Intermediate'} level, ${input.length || 'Short'} length. The user selected ${input.materialMode === 'material' ? `material range ${input.sourceRange || 'selected pages'}` : 'a topic-only path'}.`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/v1/chat/completions`, {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a careful educational story planner. Output only valid JSON.' },
          { role: 'user', content: prompt }
        ]
      })
    });
    const payload = await response.json();
    if (!response.ok || payload.error) return null;
    const content = payload?.choices?.[0]?.message?.content;
    if (!content) return null;
    const cleaned = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const generated = JSON.parse(cleaned);
    if (!generated.episodes?.length) return null;
    return {
      ...base,
      ...generated,
      id: `story-${Date.now()}`,
      topic: input.topic,
      language: input.language || 'English',
      level: input.level || 'Intermediate',
      mode: input.mode || 'hybrid',
      sourceRange: input.sourceRange || generated.sourceRange || 'Topic research',
      createdAt: new Date().toISOString()
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function serveStatic(req, res) {
  const requestPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const relative = requestPath === '/'
    ? 'src/index.html'
    : requestPath === '/manus-routes.json'
      ? 'public/manus-routes.json'
      : requestPath.replace(/^\/+/, '');
  const candidate = normalize(join(ROOT, relative));
  if (!candidate.startsWith(ROOT)) return json(res, 403, { error: 'Forbidden' });
  try {
    const info = await stat(candidate);
    if (!info.isFile()) throw new Error('Not a file');
    res.writeHead(200, { 'content-type': mime[extname(candidate)] || 'application/octet-stream' });
    res.end(await readFile(candidate));
  } catch {
    return json(res, 404, { error: 'Not found' });
  }
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/health') return json(res, 200, { ok: true, service: 'storyapp' });
    if (req.method === 'POST' && req.url === '/api/generate-story') {
      const input = await readBody(req);
      const base = JSON.parse(await readFile(fixturePath, 'utf8'));
      const generated = await generateWithManus(input, base);
      return json(res, 200, { story: generated || fixtureFor(input, base), provider: generated ? 'manus' : 'fixture' });
    }
    if (req.method === 'GET') return serveStatic(req, res);
    return json(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    return json(res, 400, { error: error.message || 'Request failed' });
  }
});

server.listen(PORT, '0.0.0.0', () => console.log(`Storyapp listening on ${PORT}`));
