// ── Helpers ────────────────────────────────────────────────
const $ = id => document.getElementById(id);

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatSize(bytes) {
  if (bytes == null) return '';
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(1) + ' MB';
}

function fileEmoji(ext) {
  const map = {
    pdf:'📄', doc:'📝', docx:'📝', txt:'📃', md:'📃',
    png:'🖼️', jpg:'🖼️', jpeg:'🖼️', gif:'🖼️', webp:'🖼️',
    csv:'📊', json:'📦', zip:'🗜️', mp3:'🎵', mp4:'🎬',
    ppt:'📊', pptx:'📊', xls:'📊', xlsx:'📊',
  };
  return map[ext] || '📎';
}

// ── State: load from localStorage ─────────────────────────
let posts = [];
try {
  const saved = localStorage.getItem('acervo_posts');
  if (saved) posts = JSON.parse(saved);
} catch {}

// Also try to load from posts.json on server (sync on first run)
async function syncFromServer() {
  try {
    const r = await fetch('../posts.json?v=' + Date.now());
    if (!r.ok) return;
    const serverPosts = await r.json();
    if (serverPosts.length > 0 && posts.length === 0) {
      posts = serverPosts;
      save();
    }
  } catch {}
  renderList();
}

function save() {
  localStorage.setItem('acervo_posts', JSON.stringify(posts));
}

// ── Upload zone ────────────────────────────────────────────
let selectedFile = null;

const zone = $('uploadZone');
const input = $('fileInput');

zone.addEventListener('click', (e) => {
  if (e.target !== input) {
    input.click();
  }
});
zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
zone.addEventListener('drop', e => {
  e.preventDefault();
  zone.classList.remove('drag-over');
  if (e.dataTransfer.files[0]) selectFile(e.dataTransfer.files[0]);
});
input.addEventListener('change', () => { if (input.files[0]) selectFile(input.files[0]); });

function selectFile(file) {
  selectedFile = file;
  const ext = file.name.split('.').pop().toLowerCase();
  $('fileInfoName').textContent = file.name;
  $('fileInfoSize').textContent = '(' + formatSize(file.size) + ')';
  $('fileInfo').style.display = 'block';
  if (!$('postTitle').value) {
    $('postTitle').value = file.name.replace(/\.[^.]+$/, '');
  }
}

// ── Add post ───────────────────────────────────────────────
$('btnAdd').addEventListener('click', () => {
  const notice = $('addNotice');
  if (!selectedFile) {
    notice.innerHTML = '<div class="notice error">Selecione um arquivo primeiro.</div>';
    return;
  }
  const title = $('postTitle').value.trim();
  if (!title) {
    notice.innerHTML = '<div class="notice error">Preencha o título.</div>';
    return;
  }

  const ext = selectedFile.name.split('.').pop().toLowerCase();
  const baseSlug = slugify(title);
  const slug = baseSlug + '-' + Date.now();
  const filename = slug + '.' + ext;

  const post = {
    slug,
    title,
    description: $('postDesc').value.trim(),
    filename,
    ext,
    size: selectedFile.size,
    date: new Date().toISOString(),
  };

  posts.unshift(post);
  save();
  renderList();
  showExport();

  notice.innerHTML = `
    <div class="notice success">
      ✅ Publicação preparada! Agora:<br>
      1. Baixe o <strong>posts.json</strong> abaixo.<br>
      2. Suba o arquivo <strong>${selectedFile.name}</strong> para <code>uploads/${filename}</code> no GitHub.<br>
      3. Substitua o <code>posts.json</code> na raiz do repositório.
    </div>`;

  // Reset form
  selectedFile = null;
  input.value = '';
  $('fileInfo').style.display = 'none';
  $('postTitle').value = '';
  $('postDesc').value = '';
});

// ── Render list ────────────────────────────────────────────
function renderList() {
  const list = $('postList');
  if (posts.length === 0) {
    list.innerHTML = '<p style="color:var(--muted);font-size:14px">Nenhuma publicação cadastrada.</p>';
    $('exportZone').style.display = 'none';
    return;
  }
  list.innerHTML = posts.map((p, i) => `
    <div class="post-list-item">
      <span class="post-list-icon">${fileEmoji(p.ext)}</span>
      <div class="post-list-info">
        <strong>${p.title}</strong>
        <span>${p.filename} · ${new Date(p.date).toLocaleDateString('pt-BR')}${p.size ? ' · ' + formatSize(p.size) : ''}</span>
      </div>
      <button class="btn-danger" data-i="${i}">Remover</button>
    </div>`).join('');

  list.querySelectorAll('[data-i]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.i);
      const removed = posts[i];
      posts.splice(i, 1);
      save();
      renderList();
      showExport();
      $('addNotice').innerHTML = `
        <div class="notice info">
          "${removed.title}" removido da lista. Baixe o novo posts.json e faça commit para aplicar.
          <br>Lembre também de deletar o arquivo <code>uploads/${removed.filename}</code> no GitHub se desejar.
        </div>`;
    });
  });
  showExport();
}

// ── Export ─────────────────────────────────────────────────
function showExport() {
  $('exportZone').style.display = posts.length > 0 ? 'block' : 'none';
}

$('btnExport').addEventListener('click', () => {
  const json = JSON.stringify(posts, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'posts.json';
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  setTimeout(() => URL.revokeObjectURL(url), 150);
});

// ── Boot ───────────────────────────────────────────────────
$('footerYear').textContent = new Date().getFullYear();
syncFromServer();
