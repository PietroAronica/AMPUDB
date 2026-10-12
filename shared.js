// Helpers shared by index.html and glossary.html -- both pages open the same
// entry-detail modal, so the master-format logic lives here once.

// mic_summary (v191+) replaced the old flat MIC_min_reported column: it's a
// JSON string per row, e.g. {"min":{"value":4,"unit":"µg/ml",...}, ...}.
function micSummaryObj(e) {
  if (!e.mic_summary) return null;
  try { return JSON.parse(e.mic_summary); } catch (err) { return null; }
}
function micMinDisplay(e) {
  const s = micSummaryObj(e);
  if (!s || !s.min || s.min.value == null) return '—';
  return `${s.min.value} ${s.min.unit || ''}`.trim();
}
function micMinSortValue(e) {
  const s = micSummaryObj(e);
  return (s && s.min && s.min.value != null) ? s.min.value : null;
}

// Ref (100% filled as of v190+) is PMID:nnnnn, a DOI, a patent number, or a
// full free-text citation -- not always a DOI, so build the right link per row
// rather than assuming https://doi.org/<Ref> always resolves.
function refKind(ref) {
  if (!ref) return null;
  const first = ref.split(';')[0].trim();
  if (!first) return null;
  const pmid = first.match(/^PMID:\s*(\d+)/i);
  if (pmid) return { type: 'pmid', id: pmid[1], full: ref };
  if (/^10\.\d{4,9}\/\S+$/.test(first)) return { type: 'doi', id: first, full: ref };
  return { type: 'other', id: first, full: ref };
}
function refLink(ref) {
  const k = refKind(ref);
  if (!k) return '—';
  if (k.type === 'doi')
    return `<a href="https://doi.org/${k.id}" target="_blank" rel="noopener" title="${k.full}"
      onclick="event.stopPropagation()">↗</a>`;
  if (k.type === 'pmid')
    return `<a href="https://pubmed.ncbi.nlm.nih.gov/${k.id}/" target="_blank" rel="noopener" title="${k.full}"
      onclick="event.stopPropagation()">↗</a>`;
  return `<span title="${k.full}">—</span>`;
}
function refDetailHtml(ref) {
  const k = refKind(ref);
  if (!k) return '—';
  if (k.type === 'doi') return `<a href="https://doi.org/${k.id}" target="_blank" rel="noopener">${ref}</a>`;
  if (k.type === 'pmid') return `<a href="https://pubmed.ncbi.nlm.nih.gov/${k.id}/" target="_blank" rel="noopener">${ref}</a>`;
  return ref; // patent number or free-text citation -- no single reliable URL
}
// Modal footer buttons: "Open DOI" only for a DOI; "PubMed" links the PMID
// directly, or searches PubMed for anything else.
function setRefButtons(ref) {
  const k = refKind(ref);
  const doiLink = document.getElementById('modal-doi-link');
  if (k && k.type === 'doi') { doiLink.href = 'https://doi.org/' + k.id; doiLink.style.display = ''; }
  else doiLink.style.display = 'none';
  const pmLink = document.getElementById('modal-pubmed-link');
  if (k && k.type === 'pmid') { pmLink.href = 'https://pubmed.ncbi.nlm.nih.gov/' + k.id + '/'; pmLink.style.display = ''; }
  else if (k) { pmLink.href = 'https://pubmed.ncbi.nlm.nih.gov/?term=' + encodeURIComponent(k.id); pmLink.style.display = ''; }
  else pmLink.style.display = 'none';
}

// Structure columns (master v52+ termini/topology, v285 terminus classes,
// v291 parentage class). The blank conventions differ per column and must
// not be collapsed into one "—":
//   Topology:        blank = linear (DATA_DICTIONARY §11)
//   N-/C-terminus:   blank = not stated -- never "free"
//   Parentage class: blank = not yet classified -- never "no parent"
const muted = s => `<span class="muted">${s}</span>`;
function topologyDisplay(e) {
  return e.Topology || 'linear';
}
function terminusDisplay(value, cls) {
  if (!value) return muted('not stated');
  return (cls && cls !== value) ? `${value} ${muted('(' + cls + ')')}` : value;
}
function parentageDisplay(e) {
  const c = e['Parentage class'];
  return c ? c.replace(/_/g, ' ') : muted('not yet classified');
}
function structureRows(e, row) {
  return [
    row('Topology', topologyDisplay(e)),
    row('Parentage', parentageDisplay(e)),
    row('N-terminus', terminusDisplay(e['N-terminus'], e['N-terminus class'])),
    row('C-terminus', terminusDisplay(e['C-terminus'], e['C-terminus class'])),
    e['Topology notes'] ? row('Topology notes', e['Topology notes'], true) : '',
  ].join('');
}
