// ── Utilities ─────────────────────────────────────────────
const $ = id => document.getElementById(id);

function fileCategory(ext) {
  if (['pdf'].includes(ext)) return 'pdf';
  if (['png','jpg','jpeg','gif','webp','svg','bmp'].includes(ext)) return 'image';
  if (['doc','docx','odt','rtf'].includes(ext)) return 'doc';
  if (['txt','md','csv','json','xml','html','htm'].includes(ext)) return 'text';
  return 'other';
}

function fileEmoji(ext) {
  const map = {
    pdf:'📄', doc:'📝', docx:'📝', odt:'📝', txt:'📃', md:'📃',
    png:'🖼️', jpg:'🖼️', jpeg:'🖼️', gif:'🖼️', webp:'🖼️', svg:'🖼️',
    csv:'📊', json:'📦', xml:'📦', zip:'🗜️', rar:'🗜️', '7z':'🗜️',
    mp3:'🎵', mp4:'🎬', mov:'🎬', ppt:'📊', pptx:'📊', xls:'📊', xlsx:'📊',
  };
  return map[ext] || '📎';
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(1) + ' MB';
}

// ── Load posts ─────────────────────────────────────────────
let allPosts = [];

async function loadPosts() {
  try {
    const r = await fetch('posts.json?v=' + Date.now());
    if (!r.ok) throw new Error();
    allPosts = await r.json();
  } catch {
    allPosts = [];
  }
  renderGrid('all');
  $('footerYear').textContent = new Date().getFullYear();
}

// ── Render ─────────────────────────────────────────────────
function renderGrid(filter) {
  const grid = $('postsGrid');
  const empty = $('emptyState');
  const filtered = filter === 'all' ? allPosts : allPosts.filter(p => fileCategory(p.ext) === filter);

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = filtered.map(cardHTML).join('');

  // attach click
  grid.querySelectorAll('.post-card').forEach(card => {
    const slug = card.dataset.slug;
    card.addEventListener('click', () => openModal(allPosts.find(p => p.slug === slug)));
  });
}

function cardHTML(post) {
  const cat = fileCategory(post.ext);
  const thumbInner = thumbHTML(post, cat);
  return `
  <div class="post-card" data-slug="${post.slug}">
    <div class="card-thumb">${thumbInner}</div>
    <div class="card-body">
      <div class="card-title" title="${post.title}">${post.title}</div>
      <div class="card-meta">
        <span>${formatDate(post.date)}</span>
        <span class="card-tag">${post.ext.toUpperCase()}</span>
      </div>
    </div>
  </div>`;
}

function thumbHTML(post, cat) {
  const path = 'uploads/' + post.filename;
  if (cat === 'image') {
    return `<img src="${path}" alt="${post.title}" loading="lazy" />`;
  }
  if (cat === 'pdf') {
    return `
      <div class="file-icon-thumb">
        <span style="font-size:42px">📄</span>
        <span class="ext-badge">${post.ext}</span>
      </div>
      <div class="pdf-preview-hover">
        <iframe src="${path}#page=1&view=FitH&toolbar=0&navpanes=0" loading="lazy"></iframe>
      </div>`;
  }
  return `
    <div class="file-icon-thumb">
      <span style="font-size:42px">${fileEmoji(post.ext)}</span>
      <span class="ext-badge">${post.ext}</span>
    </div>`;
}

// ── Modal ──────────────────────────────────────────────────
function openModal(post) {
  if (!post) return;
  const overlay = $('modalOverlay');
  const body = $('modalBody');
  const footer = $('modalFooter');
  const path = 'uploads/' + post.filename;
  const cat = fileCategory(post.ext);

  if (cat === 'image') {
    body.innerHTML = `<img src="${path}" alt="${post.title}" />`;
  } else if (cat === 'pdf') {
    body.innerHTML = `<iframe src="${path}" title="${post.title}"></iframe>`;
  } else if (cat === 'text') {
    body.innerHTML = `<div class="text-viewer" id="textContent">Carregando…</div>`;
    fetch(path).then(r => r.text()).then(t => { $('textContent').textContent = t; });
  } else {
    body.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:300px;gap:16px;color:var(--muted)">
        <span style="font-size:64px">${fileEmoji(post.ext)}</span>
        <p style="font-size:15px">Pré-visualização não disponível para este tipo de arquivo.</p>
      </div>`;
  }

  footer.innerHTML = `
    <div>
      <strong>${post.title}</strong>
      <p class="meta">${formatDate(post.date)}${post.description ? ' · ' + post.description : ''}${post.size ? ' · ' + formatSize(post.size) : ''}</p>
    </div>
    <a class="btn-download" href="${path}" download="${post.filename}">⬇ Baixar</a>`;

  overlay.classList.add('open');
}

$('modalClose').addEventListener('click', () => $('modalOverlay').classList.remove('open'));
$('modalOverlay').addEventListener('click', e => { if (e.target === $('modalOverlay')) $('modalOverlay').classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('modalOverlay').classList.remove('open'); });

// ── Filters ────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGrid(btn.dataset.filter);
  });
});

// ── Boot ───────────────────────────────────────────────────
loadPosts();
