/* Peoples Atlas viewer.

   PeoplesAtlas(data, coast) draws site/data/peoples.json over a coastline and wires the controls.
   It expects elements with these ids: map, year, yearlabel, era, list, detail, play, legend, presets, status.

   How it draws:
   - Two layers, both computed per cell and both on land only.
       The language layer is a dim wash: the language most people spoke. It stays lit when no people
       is named, so a gap in the written record never reads as empty land.
       The peoples layer sits on top, brighter: named peoples, kingdoms and lordships.
   - Each cell takes the colour of the strongest claim in its layer. Where a second claim is nearly as
     strong the two are striped. Where a people and the language under it belong to different families,
     the people is striped with the language.
   - Hue zone is the branch: cool for Celtic, orange and yellow for Germanic, red for Romance. Inside a
     zone each family has a range and each entry its own shade.
   - A known centre draws tight and bright. A loose placement draws wide, dim and stippled.
   - An entry's regions limit its field: every land cell carries a region number, and a field only
     lights cells in the regions its entry lists, so nothing leaks across a sea or a border it did not cross.
   - States are lettered, with no fill of their own until real borders are imported.
   - Each view has its own projection: Equal Earth for the world and the continents, a local one for regions.
   - Groups nest. The world view shows the top-level leads; opening one shows its children.
   No external requests. */
(function () {
  'use strict';

  // Hue ranges by family. The zones are chosen to stay apart under red-green colour-blindness:
  //   Celtic      blue-green to indigo (no pure green, which collapses into orange and red)
  //   Germanic    orange to yellow, kept light
  //   Romance     orchid pink to red, kept darker than Germanic
  //   Arabic      violet
  //   Basque      near-white silver: an isolate, so it takes no colour family
  //   Unclassified  grey-green and grey-teal
  // Each branch also has a shape (SHAPE), so nothing depends on colour alone.
  var RANGE = {
    goid: [158, 170], gaul: [174, 186], brit: [190, 202], hisp: [206, 218], north: [226, 240],
    eng: [34, 42], wgerm: [40, 48], egerm: [46, 54], norse: [54, 62],
    lat: [338, 346], fr: [318, 326], oc: [348, 356], ibrom: [358, 368], itrom: [328, 336], erom: [308, 316],
    slavw: [100, 114], slave: [116, 130], slavs: [132, 146], balt: [72, 88], greek: [232, 246],
    finnic: [182, 192], ugric: [176, 186], turk: [16, 28], iran: [252, 264], pbalk: [286, 300],
    vasc: [40, 60], arab: [266, 282], iber: [70, 90], lus: [165, 185]
  };
  var TONE = {   // saturation, lightness
    goid: [0.78, 0.42], gaul: [0.7, 0.46], brit: [0.8, 0.55], hisp: [0.78, 0.57], north: [0.7, 0.65],
    eng: [0.9, 0.55], wgerm: [0.9, 0.57], egerm: [0.88, 0.6], norse: [0.9, 0.62],
    lat: [0.6, 0.62], fr: [0.62, 0.66], oc: [0.66, 0.56], ibrom: [0.72, 0.52], itrom: [0.62, 0.62], erom: [0.6, 0.6],
    slavw: [0.62, 0.46], slave: [0.6, 0.44], slavs: [0.6, 0.48], balt: [0.62, 0.5], greek: [0.72, 0.64],
    finnic: [0.42, 0.7], ugric: [0.5, 0.66], turk: [0.62, 0.47], iran: [0.3, 0.64], pbalk: [0.5, 0.62],
    vasc: [0.1, 0.74], arab: [0.6, 0.66], iber: [0.22, 0.48], lus: [0.25, 0.5]
  };
  // Families added to the first thirteen branches when the atlas went past Europe.
  var MORE = {
    volga: [184, 194, 0.4, 0.62], samoyed: [190, 200, 0.36, 0.74],
    oghuz: [10, 18, 0.66, 0.52], kipch: [22, 30, 0.6, 0.44], karluk: [26, 34, 0.62, 0.56], sibturk: [14, 22, 0.5, 0.6],
    pers: [244, 254, 0.42, 0.62], wiran: [256, 266, 0.34, 0.56], eiran: [236, 246, 0.3, 0.68],
    anat: [296, 306, 0.4, 0.56],
    aram: [280, 290, 0.5, 0.6], canaan: [258, 266, 0.55, 0.7], sarab: [284, 294, 0.45, 0.5], ethsem: [270, 280, 0.6, 0.52],
    steppeunk: [60, 80, 0.14, 0.5], isolate: [150, 170, 0.12, 0.6]
  };
  Object.keys(MORE).forEach(function (f) { RANGE[f] = [MORE[f][0], MORE[f][1]]; TONE[f] = [MORE[f][2], MORE[f][3]]; });
  // Branches added for the world: hue from, hue to, saturation, lightness, shape. The wheel was full after
  // Europe, so a zone is reused by branches that never share ground (Bantu and Slavic green, Mayan and
  // Tungusic green, Andean and Indo-Aryan gold), and neighbours are kept apart. The families of a branch
  // share out its zone. Shapes are the same thirteen, shared the same way.
  var BRANCH_STYLE = {
    berber: [172, 186, 0.6, 0.5, 'tridown'], egyptian: [40, 50, 0.45, 0.6, 'dome'], cushitic: [338, 352, 0.55, 0.6, 'square'], chadic: [290, 304, 0.5, 0.6, 'star'],
    armenian: [158, 170, 0.5, 0.5, 'diamond'], kartvelian: [48, 58, 0.7, 0.6, 'tridown'], caucasian: [76, 92, 0.55, 0.52, 'dome'],
    tocharian: [52, 62, 0.5, 0.72, 'circle'], indoaryan: [40, 58, 0.85, 0.56, 'circle'], dravidian: [212, 232, 0.62, 0.56, 'triangle'],
    austroasiatic: [22, 38, 0.7, 0.52, 'square'], sinotibetan: [350, 366, 0.72, 0.6, 'diamond'], taikadai: [86, 102, 0.6, 0.5, 'tridown'], hmongmien: [278, 292, 0.5, 0.62, 'circle'],
    austronesian: [160, 204, 0.66, 0.52, 'star'], koreanic: [196, 208, 0.6, 0.66, 'circle'], japonic: [300, 316, 0.55, 0.66, 'triangle'],
    paleosiberian: [200, 216, 0.25, 0.6, 'ring'], mongolic: [208, 226, 0.6, 0.6, 'dome'], tungusic: [130, 150, 0.5, 0.5, 'tridown'],
    nilosaharan: [20, 36, 0.75, 0.52, 'triangle'], mande: [2, 14, 0.7, 0.56, 'diamond'], nigercongo: [46, 64, 0.8, 0.56, 'square'], bantu: [112, 152, 0.55, 0.45, 'circle'], khoisan: [186, 200, 0.5, 0.62, 'tridown'],
    eskaleut: [196, 208, 0.4, 0.72, 'square'], nadene: [232, 248, 0.55, 0.6, 'diamond'], algic: [128, 146, 0.5, 0.5, 'circle'], iroquoian: [268, 282, 0.5, 0.64, 'dome'], siouan: [60, 72, 0.6, 0.52, 'bar'],
    naother: [170, 186, 0.3, 0.56, 'ring'], pacificnw: [206, 220, 0.6, 0.56, 'tridown'], utoaztecan: [164, 178, 0.7, 0.5, 'plus'], mayan: [140, 156, 0.6, 0.47, 'clover'],
    otomanguean: [282, 296, 0.5, 0.62, 'square'], mesoam: [80, 96, 0.55, 0.5, 'dome'], chibchan: [196, 208, 0.6, 0.6, 'tridown'], arawakan: [100, 120, 0.55, 0.48, 'circle'],
    cariban: [262, 276, 0.5, 0.64, 'diamond'], tupian: [66, 82, 0.6, 0.5, 'bar'], je: [22, 34, 0.65, 0.5, 'square'], andean: [44, 56, 0.82, 0.56, 'plus'], amazonother: [150, 170, 0.25, 0.52, 'ring'], southcone: [216, 232, 0.55, 0.6, 'dome'],
    pamanyungan: [2, 16, 0.6, 0.47, 'circle'], ausother: [60, 76, 0.5, 0.5, 'ring'], papuan: [280, 300, 0.45, 0.56, 'square']
  };
  var SHAPE = {
    celtic: 'clover', germanic: 'triangle', romance: 'heart', slavic: 'star', baltic: 'tridown', hellenic: 'circle',
    uralic: 'square', turkic: 'bar', iranian: 'plus', paleobalkan: 'dome', basque: 'diamond', afroasiatic: 'crescent', other: 'ring'
  };
  Object.keys(BRANCH_STYLE).forEach(function (b) { SHAPE[b] = BRANCH_STYLE[b][4]; });
  function styleFamilies(families, branches) {      // give every family without a range a slice of its branch's zone
    var per = {};
    Object.keys(families).forEach(function (f) { if (!RANGE[f] && BRANCH_STYLE[branches[f]]) (per[branches[f]] = per[branches[f]] || []).push(f); });
    Object.keys(per).forEach(function (b) {
      var z = BRANCH_STYLE[b], n = per[b].length, step = (z[1] - z[0]) / n;
      per[b].forEach(function (f, i) {
        RANGE[f] = [z[0] + step * i + (n > 1 ? step * 0.12 : 0), z[0] + step * (i + 1) - (n > 1 ? step * 0.12 : 0)];
        TONE[f] = [z[2], z[3] + (n > 1 ? (i % 2 ? 0.05 : -0.03) : 0)];
      });
    });
  }
  // Equal Earth (Savric, Patterson and Jenny 2018), in units of about one degree at the equator.
  var EA1 = 1.340264, EA2 = -0.081106, EA3 = 0.000893, EA4 = 0.003796, EM = Math.sqrt(3) / 2, RAD = Math.PI / 180;
  function equalEarth(dlon, lat) {
    var t = Math.asin(EM * Math.sin(lat * RAD)), t2 = t * t, t6 = t2 * t2 * t2;
    return [dlon * Math.cos(t) / (EM * (EA1 + 3 * EA2 * t2 + t6 * (7 * EA3 + 9 * EA4 * t2))), t * (EA1 + EA2 * t2 + t6 * (EA3 + EA4 * t2)) / RAD];
  }
  function norm(d) { return ((d % 360) + 540) % 360 - 180; }
  // How many labels of each kind a wide view may carry, so an overview stays an overview: leads, languages, states.
  var CAPS = [[15, 6, 7], [16, 9, 9], [20, 10, 10]];
  var MAX_CELLS = 230000;
  var DISPLAY = '"Space Grotesk", Inter, system-ui, -apple-system, "Segoe UI", sans-serif';   // names on the map: one modern grotesk, upright
  var SANS = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif';
  var CLASS_TEXT = {
    attested: 'Attested: a named centre or record is known',
    reconstructed: 'Reconstructed: placed by later scholarship',
    indicative: 'Indicative: placement is loose'
  };
  var SPREAD = { attested: 0.5, reconstructed: 0.6, indicative: 0.72 };   // field width as a share of the claim radius
  var STRENGTH = { attested: 1, reconstructed: 0.82, indicative: 0.6 };
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function smooth(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function hash(s, salt) { var h = 2166136261 ^ salt; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 997) / 997; }
  function hsl(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360;
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    function f(t) { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; }
    return [f(h + 1 / 3), f(h), f(h - 1 / 3)];
  }
  function css(c, a) { return 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ',' + a + ')'; }

  function glyphPath(c, shape, x, y, r) {
    c.beginPath();
    if (shape === 'triangle') { c.moveTo(x, y - r * 1.1); c.lineTo(x + r * 1.05, y + r * 0.8); c.lineTo(x - r * 1.05, y + r * 0.8); c.closePath(); }
    else if (shape === 'diamond') { c.moveTo(x, y - r * 1.15); c.lineTo(x + r * 1.15, y); c.lineTo(x, y + r * 1.15); c.lineTo(x - r * 1.15, y); c.closePath(); }
    else if (shape === 'clover') {            // three leaves, and a stem when there is room for one
      var lr = r * 0.62, ld = r * 0.6, cy = y - r * 0.08;
      [-90, 150, 30].forEach(function (deg) {
        var t = deg * Math.PI / 180, lx = x + Math.cos(t) * ld, ly = cy + Math.sin(t) * ld;
        c.moveTo(lx + lr, ly); c.arc(lx, ly, lr, 0, 6.2832);
      });
      if (r > 3.6) { c.moveTo(x - r * 0.14, cy); c.lineTo(x + r * 0.14, cy); c.lineTo(x + r * 0.3, y + r * 1.2); c.lineTo(x - r * 0.02, y + r * 1.2); c.closePath(); }
    }
    else if (shape === 'heart') {
      c.moveTo(x, y + r * 1.1);
      c.bezierCurveTo(x - r * 1.6, y - r * 0.05, x - r * 0.8, y - r * 1.35, x, y - r * 0.45);
      c.bezierCurveTo(x + r * 0.8, y - r * 1.35, x + r * 1.6, y - r * 0.05, x, y + r * 1.1);
      c.closePath();
    }
    else if (shape === 'crescent') {          // one outline, so it can be stroked as well as filled
      var R = r * 1.15, d = r * 0.6, ri = r * 0.98, cx = x - r * 0.12;
      var a = (d * d + R * R - ri * ri) / (2 * d), h = Math.sqrt(Math.max(0, R * R - a * a));
      var t0 = Math.atan2(h, a), up = Math.atan2(-h, a - d), dn = Math.atan2(h, a - d);
      c.arc(cx, y, R, t0, 6.2832 - t0, false);
      c.arc(cx + d, y, ri, up, dn, true);
      c.closePath();
    }
    else if (shape === 'square') { c.rect(x - r * 0.9, y - r * 0.9, r * 1.8, r * 1.8); }
    else if (shape === 'plus') { var pa = r * 0.4, pb = r * 1.1; c.rect(x - pa, y - pb, 2 * pa, 2 * pb); c.rect(x - pb, y - pa, 2 * pb, 2 * pa); }
    else if (shape === 'bar') { c.rect(x - r * 1.2, y - r * 0.45, r * 2.4, r * 0.9); }
    else if (shape === 'tridown') { c.moveTo(x, y + r * 1.1); c.lineTo(x + r * 1.05, y - r * 0.8); c.lineTo(x - r * 1.05, y - r * 0.8); c.closePath(); }
    else if (shape === 'dome') { c.arc(x, y + r * 0.45, r * 1.1, Math.PI, 0, false); c.closePath(); }
    else if (shape === 'star') {
      for (var sp = 0; sp < 10; sp++) {
        var sa = -Math.PI / 2 + sp * Math.PI / 5, sr = sp % 2 ? r * 0.52 : r * 1.25;
        if (sp) c.lineTo(x + Math.cos(sa) * sr, y + Math.sin(sa) * sr); else c.moveTo(x + Math.cos(sa) * sr, y + Math.sin(sa) * sr);
      }
      c.closePath();
    }
    else { c.arc(x, y, r, 0, 6.2832); }
  }
  function glyph(branch, color, size) {
    var sz = size || 12, d = Math.min(window.devicePixelRatio || 1, 2), cv = document.createElement('canvas');
    cv.width = cv.height = Math.round(sz * d); cv.style.width = cv.style.height = sz + 'px';
    cv.className = 'glyph'; cv.setAttribute('aria-hidden', 'true');
    var c = cv.getContext('2d'), shape = SHAPE[branch] || 'circle'; c.scale(d, d);
    glyphPath(c, shape, sz / 2, sz / 2, sz * 0.36);
    if (shape === 'ring') { c.lineWidth = sz * 0.17; c.strokeStyle = color; c.stroke(); } else { c.fillStyle = color; c.fill(); }
    return cv;
  }

  window.PeoplesAtlas = function (data, coast, opts) {
    opts = opts || {};
    var V = { proj: 'local', lamc: 0, kx: 1, x0: 0, y1: 0, s: 1 };   // the view: projection, centre meridian, left and top in units, pixels per unit
    var WU, HU, XMID, LATMIN, LATMAX, HALFLON, RX0 = 0, RX1 = 1e9, sizedFor = '';
    var REQ = null, REQP = 'local';    // the box that was asked for and its projection; the box shown may be wider
    function setBox(b, proj) {
      REQ = b.slice();
      REQP = proj === 'equal-earth' || (!proj && (b[3] - b[1] > 42 || b[2] - b[0] > 80)) ? 'ee' : 'local';
    }
    function unit(v, dlon, lat) { return v.proj === 'ee' ? equalEarth(dlon, lat) : [dlon * v.kx, lat]; }
    function applyBox() {
      var b = REQ, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, half = (b[2] - b[0]) / 2, i, q;
      V.proj = REQP; V.lamc = (b[0] + b[2]) / 2; V.kx = Math.cos((b[1] + b[3]) / 2 * RAD);
      for (i = 0; i <= 16; i++) {
        var la = b[1] + (b[3] - b[1]) * i / 16, lo = -half + 2 * half * i / 16;
        [[-half, la], [half, la], [lo, b[1]], [lo, b[3]]].forEach(function (pt) {
          q = unit(V, pt[0], pt[1]);
          if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1];
        });
      }
      WU = x1 - x0; HU = y1 - y0; XMID = (x0 + x1) / 2; V.x0 = x0; V.y1 = y1; LATMIN = b[1]; LATMAX = b[3];
    }
    var viewById = {}, kidsOf = {};
    (data.views || []).forEach(function (v) { viewById[v.id] = v; (kidsOf[v.parent || ''] = kidsOf[v.parent || ''] || []).push(v); });
    var curView = viewById[opts.view] || (data.views || [])[0] || { id: 'all', name: 'All', parent: '', box: [-11, 34.6, 45, 71.2], proj: 'local' };
    function viewLevel(v) { var n = 0; while (v && v.parent && viewById[v.parent]) { v = viewById[v.parent]; n++; } return n; }
    var baseDepth = viewLevel(curView) ? 1 : 0, ERAS = [];
    function periodsFor(v) {
      while (v) { if (data.periods && data.periods[v.id]) return data.periods[v.id]; v = viewById[v.parent]; }
      return [[1, 2026, '', '', 1000]];
    }
    setBox(curView.box, curView.proj); applyBox();
    styleFamilies(data.families || {}, data.branches || {});
    var FAMILY_ORDER = Object.keys(data.families || {}), BRANCH_ORDER = Object.keys(data.branch_names || {});
    var regionNames = data.regions || [], coveredSet = {};
    (data.covered || regionNames).forEach(function (r) { coveredSet[r] = 1; });
    var END = data.window[1];
    var CELL = 1.5;                    // css pixels per field cell; grows on big canvases to hold the frame rate
    var branches = data.branches || {}, branchNames = data.branch_names || {};

    var canvas = $('map'), ctx = canvas.getContext('2d');
    var wide = !!(canvas.closest && canvas.closest('.atlas.wide'));
    var slider = $('year'), yearLabel = $('yearlabel'), eraEl = $('era'), listEl = $('list');
    var detailEl = $('detail'), playBtn = $('play'), legendEl = $('legend'), statusEl = $('status');
    var eraName = $('eraname'), stripEl = $('erastrip'), ticksEl = $('ticks'), motionBtn = $('motion'), prevBtn = $('eraprev'), nextBtn = $('eranext');
    var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var still = REDUCED;   // motion can also be switched off with the Motion button

    function familyColor(f, lift) { return hsl((RANGE[f][0] + RANGE[f][1]) / 2, TONE[f][0], TONE[f][1] + (lift || 0)); }

    // Entries, their colours, and one blob per claim.
    var softOf = {};
    (data.soft || []).forEach(function (cluster) { cluster.forEach(function (ri) { softOf[ri] = cluster; }); });
    var people = data.peoples, blobs = [], seedCount = 0, claimCount = 0;
    people.forEach(function (p, pi) {
      p.branch = branches[p.family] || '';
      p.allow = new Float32Array(regionNames.length + 1);      // 1 in its own regions, four fifths across a soft border, 0 elsewhere
      (p.rs || []).forEach(function (ri) { (softOf[ri] || []).forEach(function (rj) { p.allow[rj + 1] = 0.8; }); });
      (p.rs || []).forEach(function (ri) { p.allow[ri + 1] = 1; });
      p.ft = -1; p.inOpen = false; p.inView = true;
      if (p.type !== 'polity' && RANGE[p.family]) {
        var r = RANGE[p.family], tone = TONE[p.family];
        if (p.type === 'language') { p.hue = r[0] + (r[1] - r[0]) * (0.3 + 0.4 * hash(p.id, 1)); p.rgb = hsl(p.hue, tone[0] * 0.85, tone[1] - 0.01 + 0.03 * hash(p.id, 2)); }   // washes of one family sit close together, so a continent reads as a few flat fields
        else { p.hue = r[0] + (r[1] - r[0]) * hash(p.id, 1); p.rgb = hsl(p.hue, tone[0], tone[1] - 0.05 + 0.12 * hash(p.id, 2)); }
        p.tint = hsl(p.hue, Math.min(0.7, tone[0]), 0.88); p.mark = hsl(p.hue, tone[0], Math.min(0.8, tone[1] + 0.14));
      }
      p.claims.forEach(function (c) {
        claimCount++; if (c.status === 'seed') seedCount++;
        if (c.kind === 'movement') return;
        blobs.push({ pi: pi, c: c, r: Math.max(c.r_km, 12) / 111 });
      });
    });

    // Groups. A group folds its peoples into one shape with one lead label until it is opened.
    var groups = data.groups || {}, gkeys = Object.keys(groups), gpos = {}, gLive = [], gcol = [], gtint = [], gmark = [], gfam = [];
    var gparent = [], gchain = [], gOpen = [];
    var openG = -1, crumbEl = $('crumb');
    gkeys.forEach(function (key, i) { gpos[key] = i; gLive.push(0); gOpen.push(false); });
    gkeys.forEach(function (key) { var par = groups[key].parent; gparent.push(par && gpos[par] != null ? gpos[par] : -1); });
    gkeys.forEach(function (key, i) { var ch = [i], g = i, guard = 0; while (gparent[g] >= 0 && guard++ < 8) { g = gparent[g]; ch.unshift(g); } gchain.push(ch); });
    people.forEach(function (p) {
      p.g = p.type === 'people' && gpos[p.group] != null ? gpos[p.group] : -1;
      p.chain = p.g >= 0 ? gchain[p.g] : [];
    });
    gkeys.forEach(function (key, i) {
      var tally = {}, top = '', topn = 0;
      people.forEach(function (p) { if (p.chain.indexOf(i) >= 0 && RANGE[p.family]) { tally[p.family] = (tally[p.family] || 0) + 1; if (tally[p.family] > topn) { topn = tally[p.family]; top = p.family; } } });
      if (!top) top = 'brit';
      var hue = (RANGE[top][0] + RANGE[top][1]) / 2, tone = TONE[top];
      gfam.push(top); gcol.push(hsl(hue, tone[0] * 0.9, tone[1]));
      gtint.push(hsl(hue, Math.min(0.7, tone[0]), 0.9)); gmark.push(hsl(hue, tone[0], Math.min(0.8, tone[1] + 0.14)));
    });
    // Which group a people folds into right now, or -1 when it stands on its own. The world view folds to the
    // top level and every other view to the level below it. Opening a group unfolds it by one level.
    function refold() {
      for (var i = 0; i < gOpen.length; i++) gOpen[i] = false;
      if (openG >= 0) gchain[openG].forEach(function (g) { gOpen[g] = true; });
      people.forEach(function (p) {
        var ch = p.chain, k = -1, t = -1;
        p.inOpen = openG >= 0 && ch.indexOf(openG) >= 0;
        if (ch.length) {
          for (var j = 0; j < ch.length && gOpen[ch[j]]; j++) k = j;
          if (k < 0) t = ch[Math.min(baseDepth, ch.length - 1)];
          else if (k < ch.length - 1) t = ch[k + 1];
        }
        p.ft = t >= 0 && gLive[t] > 1 ? t : -1;
      });
    }
    function folded(p) { return p.ft >= 0; }

    slider.min = 0; slider.max = END; slider.step = 1;
    var W = 0, H = 0, S = 1, dpr = 1, GW = 0, GH = 0;
    var base, coastLayer, mask, grid, gctx, img, stage, sctx;
    var landCell, pw1, pw2, pb1, pb2, lw1, lw2, lb1, lb2, offX, offY, LUT = new Float32Array(260);
    for (var k = 0; k < 260; k++) LUT[k] = Math.exp(-k / 56);
    var year = +slider.value || 150, selected = -1, focus = '', playing = false, lastKey = '', lastField = -1e9;

    function project(v, lon, lat) { var q = unit(v, norm(lon - v.lamc), lat); return [(q[0] - v.x0) * v.s, (v.y1 - q[1]) * v.s]; }
    function px(lon, lat) { return project(V, lon, lat); }
    function alphaAt(c, y) { return (c.from <= 1 ? 1 : smooth(c.from - 20, c.from + 20, y)) * (c.open || c.to >= END ? 1 : 1 - smooth(c.to - 20, c.to + 20, y)); }   // a claim that starts with the survey, or runs to its end, does not fade there
    function muted(p) { return focus && p.branch !== focus; }

    // Outlines. Every ring carries its bounding box so a regional view only traces what it can see.
    function boxed(rings) {
      return (rings || []).map(function (pts) {
        // Longitudes are unwrapped along the ring, so a ring that crosses the date line (Fiji, or Eurasia
        // with the tip of Chukotka) is one continuous shape with a true west and east end.
        var u = new Float64Array(pts.length), lo = 1e9, hi = -1e9, s0 = 1e9, n = -1e9, x = 0;
        for (var i = 0; i < pts.length; i++) {
          var q = pts[i]; x = i ? x + norm(q[0] - pts[i - 1][0]) : q[0]; u[i] = x;
          if (x < lo) lo = x; if (x > hi) hi = x; if (q[1] < s0) s0 = q[1]; if (q[1] > n) n = q[1];
        }
        return { pts: pts, u: u, lo: lo, hi: hi, s: s0, n: n };
      });
    }
    var fineLand = boxed(coast.polygons), coarseLand = coast.coarse ? boxed(coast.coarse) : fineLand, regionRings = {};
    Object.keys(coast.regions || {}).forEach(function (name) { regionRings[name] = boxed(coast.regions[name]); });
    var EDGE = coast.box || [-180, -90, 180, 90];
    // The whole turns by which a ring has to be shifted to fall inside the view. Usually one; none when the
    // ring is out of sight; two when a ring as wide as Eurasia shows at both edges of a wide view.
    function turnsFor(r) {
      var out = [];
      if (r.n < LATMIN - 3 || r.s > LATMAX + 3) return out;
      for (var k = -2; k <= 2; k++) { var t = k * 360 - V.lamc; if (r.lo + t <= HALFLON && r.hi + t >= -HALFLON) out.push(t); }
      return out;
    }
    // Trace rings into a path at a scale. A ring is unwrapped as it goes, so one that crosses the edge of the
    // map does not streak across it. With `open`, the seams where Natural Earth cuts land at the date line
    // and where this atlas cuts it in the far north are left undrawn, so a coastline never follows a cut.
    function tracePath(rings, scale, open, ext) {
      var path = new Path2D();
      rings.forEach(function (r) {
        turnsFor(r).forEach(function (turn) {
          var pts = r.pts, pcut = false, pen = false;
          for (var i = 0; i <= pts.length; i++) {
            var j = i % pts.length, q = pts[j];
            var u = unit(V, r.u[j] + turn, q[1]), x = (u[0] - V.x0) * V.s * scale, y = (V.y1 - u[1]) * V.s * scale;
            var isCut = open && (Math.abs(q[0]) > 179.99 || q[1] >= EDGE[3] - 0.01 || q[1] <= EDGE[1] + 0.01);
            if (i === pts.length && !open) break;
            if (!pen || (isCut && pcut)) path.moveTo(x, y); else path.lineTo(x, y);
            pen = true; pcut = isCut;
            if (ext) { if (x < ext[0]) ext[0] = x; if (y < ext[1]) ext[1] = y; if (x > ext[2]) ext[2] = x; if (y > ext[3]) ext[3] = y; }
          }
          if (!open) path.closePath();
        });
      });
      return path;
    }
    function layer(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

    function resize() {
      var holder = canvas.parentNode, w = (holder && holder.clientWidth) || canvas.clientWidth || 320;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      applyBox();
      var cap = wide ? Math.max(320, Math.round(window.innerHeight * 0.8)) : 1e9;
      var floor = wide && w < 700 ? Math.round(Math.min(window.innerHeight * 0.56, 480)) : 0;   // a phone gets a map it can read
      W = w; H = Math.round(w * HU / WU); S = W / WU;
      if (H > cap) { H = cap; S = H / HU; V.x0 = XMID - W / (2 * S); }   // too tall for the screen: keep the height and show more to the sides
      else if (H < floor) { H = floor; S = H / HU; W = Math.ceil(WU * S); }   // too short: keep the height and let the map run on sideways
      canvas.style.width = W + 'px';
      if (holder && W > w + 1 && holder.scrollLeft != null && sizedFor !== REQ.join()) holder.scrollLeft = Math.round((W - w) * (curView.parent ? 0.5 : 0.56));
      sizedFor = REQ.join();
      V.s = S; RX0 = W / 2 - WU * S / 2; RX1 = W / 2 + WU * S / 2;      // the part of the canvas the view asked for
      var perDeg = Math.min(Math.abs(unit(V, 1, LATMIN)[0]), Math.abs(unit(V, 1, LATMAX)[0]));
      HALFLON = Math.min(180, W / (2 * S) / Math.max(0.05, perDeg) + 2);
      canvas.style.height = H + 'px';
      var PW = Math.round(W * dpr), PH = Math.round(H * dpr);
      canvas.width = PW; canvas.height = PH;
      var landRings = 1 / S > 0.055 ? coarseLand : fineLand;
      var full = tracePath(landRings, dpr), shore = tracePath(landRings, dpr, true);
      CELL = Math.max(1.5, Math.sqrt(W * H / MAX_CELLS));

      // Static base: sea, engraved waterlines, bare land.
      base = layer(PW, PH);
      var b = base.getContext('2d'), SEA = '#05080e', wl0 = Math.min(1, Math.max(0.42, W / 1100));
      b.fillStyle = SEA; b.fillRect(0, 0, PW, PH);
      b.lineJoin = 'round';
      var step = 1 / S > 0.055 ? 30 : 1 / S > 0.02 ? 10 : 5, grat = new Path2D(), gi2, gj, gq;     // a graticule: the sea is measured, not engraved
      for (gi2 = -180; gi2 < 180; gi2 += step) {
        if (Math.abs(norm(gi2 - V.lamc)) > HALFLON) continue;
        for (gj = -84; gj <= 84; gj += 2) { gq = unit(V, norm(gi2 - V.lamc), gj); if (gj === -84) grat.moveTo((gq[0] - V.x0) * S * dpr, (V.y1 - gq[1]) * S * dpr); else grat.lineTo((gq[0] - V.x0) * S * dpr, (V.y1 - gq[1]) * S * dpr); }
      }
      for (gj = -60; gj <= 80; gj += step) {
        for (gi2 = -HALFLON; gi2 <= HALFLON; gi2 += 2) { gq = unit(V, gi2, gj); if (gi2 === -HALFLON) grat.moveTo((gq[0] - V.x0) * S * dpr, (V.y1 - gq[1]) * S * dpr); else grat.lineTo((gq[0] - V.x0) * S * dpr, (V.y1 - gq[1]) * S * dpr); }
      }
      b.lineWidth = dpr; b.strokeStyle = 'rgba(140,170,200,.075)'; b.stroke(grat);
      [[9, 0.05], [4, 0.09]].forEach(function (wl) {
        b.lineWidth = 2 * wl[0] * wl0 * dpr; b.strokeStyle = 'rgba(120,175,215,' + wl[1] + ')'; b.stroke(shore);
      });
      b.fillStyle = '#0b0e14'; b.fill(full);                      // land outside the survey, hatched
      var hp = layer(8, 8), hc = hp.getContext('2d');
      hc.strokeStyle = 'rgba(150,170,190,.2)'; hc.lineWidth = 1; hc.beginPath();
      hc.moveTo(-2, 10); hc.lineTo(10, -2); hc.moveTo(-2, 2); hc.lineTo(2, -2); hc.moveTo(6, 10); hc.lineTo(10, 6); hc.stroke();
      b.fillStyle = b.createPattern(hp, 'repeat'); b.fill(full);
      var cov = layer(PW, PH), cc = cov.getContext('2d');           // covered land: the surveyed regions, joined up, cut to the coast
      cc.fillStyle = '#151922'; cc.strokeStyle = '#151922'; cc.lineWidth = Math.max(2, 0.09 * S) * dpr; cc.lineJoin = 'round';
      regionNames.forEach(function (name) {
        if (!coveredSet[name] || !regionRings[name]) return;
        var rp = tracePath(regionRings[name], dpr); cc.fill(rp); cc.stroke(rp);
      });
      cc.globalCompositeOperation = 'destination-in'; cc.fillStyle = '#fff'; cc.fill(full);
      b.drawImage(cov, 0, 0);
      var v = b.createRadialGradient(PW * .5, PH * .48, PH * .3, PW * .5, PH * .5, Math.max(PH * .78, PW * .5));
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.28)');
      b.fillStyle = v; b.fillRect(0, 0, PW, PH);

      mask = layer(PW, PH); var m = mask.getContext('2d'); m.fillStyle = '#fff'; m.fill(full);
      coastLayer = layer(PW, PH); var c = coastLayer.getContext('2d');
      c.lineJoin = 'round'; c.lineWidth = 0.8 * dpr; c.strokeStyle = 'rgba(235,244,250,.5)'; c.stroke(shore);
      stage = layer(PW, PH); sctx = stage.getContext('2d'); sctx.imageSmoothingQuality = 'high';

      // Field grid. Each land cell of a surveyed region carries that region's number, counted from 1.
      GW = Math.ceil(W / CELL); GH = Math.ceil(H / CELL);
      var n = GW * GH, i;
      grid = layer(GW, GH); gctx = grid.getContext('2d'); img = gctx.createImageData(GW, GH);
      landCell = new Uint8Array(n);
      var landGrid = layer(GW, GH).getContext('2d'); landGrid.fillStyle = '#fff'; landGrid.fill(tracePath(landRings, 1 / CELL));
      var isLand = landGrid.getImageData(0, 0, GW, GH).data;
      var scratch = layer(GW, GH).getContext('2d', { willReadFrequently: true });
      scratch.fillStyle = '#fff'; scratch.strokeStyle = '#fff'; scratch.lineWidth = Math.max(1.6, 0.07 * S / CELL); scratch.lineJoin = 'round';
      regionNames.forEach(function (name, ri) {
        if (!coveredSet[name] || !regionRings[name]) return;
        var ext = [1e9, 1e9, -1e9, -1e9], rp = tracePath(regionRings[name], 1 / CELL, false, ext);
        var x0 = Math.max(0, Math.floor(ext[0]) - 3), y0 = Math.max(0, Math.floor(ext[1]) - 3);
        var x1 = Math.min(GW, Math.ceil(ext[2]) + 3), y1 = Math.min(GH, Math.ceil(ext[3]) + 3);
        if (x1 <= x0 || y1 <= y0) return;
        scratch.clearRect(x0, y0, x1 - x0, y1 - y0); scratch.fill(rp); scratch.stroke(rp);
        var d = scratch.getImageData(x0, y0, x1 - x0, y1 - y0).data, bw = x1 - x0, bh = y1 - y0;
        for (var yy = 0; yy < bh; yy++) for (var xx = 0; xx < bw; xx++) {
          if (d[(yy * bw + xx) * 4 + 3] > 20) { i = (y0 + yy) * GW + x0 + xx; if (isLand[i * 4 + 3] > 20 && !landCell[i]) landCell[i] = ri + 1; }
        }
        scratch.clearRect(x0, y0, x1 - x0, y1 - y0);
      });
      for (var pass = 0; pass < 2; pass++) {       // the land outline is finer than the region outlines: close the slivers between them
        var grow = [];
        for (i = 0; i < n; i++) {
          if (landCell[i] || isLand[i * 4 + 3] <= 20) continue;
          var nb = (i % GW && landCell[i - 1]) || ((i + 1) % GW && landCell[i + 1]) || (i >= GW && landCell[i - GW]) || (i + GW < n && landCell[i + GW]);
          if (nb) grow.push(i, nb);
        }
        for (i = 0; i < grow.length; i += 2) landCell[grow[i]] = grow[i + 1];
      }
      pw1 = new Float32Array(n); pw2 = new Float32Array(n); pb1 = new Int16Array(n); pb2 = new Int16Array(n);
      lw1 = new Float32Array(n); lw2 = new Float32Array(n); lb1 = new Int16Array(n); lb2 = new Int16Array(n);
      offX = new Float32Array(GH); offY = new Float32Array(GW);
      splatKey = '';                   // the arrays are new and empty: whatever the size, the field must be made again
      lastField = -1e9; draw(performance.now());
    }

    // The colour a layer gives one cell: strongest claim, striped with the runner-up where they are close.
    function groupBox(g) {
      var w = 1e9, s0 = 1e9, e = -1e9, n = -1e9, ref = null;
      blobs.forEach(function (b) {
        if (people[b.pi].chain.indexOf(g) < 0 || alphaAt(b.c, year) < 0.05) return;
        if (ref == null) ref = b.c.lon;
        var lon = ref + norm(b.c.lon - ref), dy = b.r * 1.15, dx = dy / Math.max(0.2, Math.cos(b.c.lat * RAD));
        w = Math.min(w, lon - dx); e = Math.max(e, lon + dx); s0 = Math.min(s0, b.c.lat - dy); n = Math.max(n, b.c.lat + dy);
      });
      if (w > e) return null;
      s0 = Math.max(s0, -58); n = Math.min(n, 80);
      var kx = Math.cos((s0 + n) / 2 * RAD), cx = (w + e) / 2, cy = (s0 + n) / 2;
      var ww = Math.max(2.4, (e - w) * kx * 1.18), hh = Math.max(2.4, (n - s0) * 1.18), asp = W && H ? W / H : 1;
      if (ww / hh < asp) ww = hh * asp; else hh = ww / asp;   // keep the map's shape, so opening a group never changes its height
      hh = Math.min(hh, 130); ww = Math.min(ww, 300 * kx);
      return [cx - ww / 2 / kx, Math.max(-75, cy - hh / 2), cx + ww / 2 / kx, Math.min(86, cy + hh / 2)];
    }
    function backOf(g) { var par = gparent[g]; return par >= 0 && gchain[par].length - 1 >= baseDepth ? par : -1; }
    function showCrumb() {
      if (!crumbEl) return;
      crumbEl.textContent = '';
      if (openG < 0) { crumbEl.hidden = true; return; }
      var g = groups[gkeys[openG]], up = backOf(openG);
      var back = el('button', 'back', '‹ ' + (up >= 0 ? groups[gkeys[up]].name : curView.name)); back.type = 'button';
      back.addEventListener('click', function () { if (up >= 0) openGroup(up); else closeGroup(); });
      var txt = el('div', 'ctext'), h = el('h3');
      h.appendChild(glyph(branches[gfam[openG]], css(gmark[openG], 1), 14));
      h.appendChild(document.createTextNode(g.name + ' · ' + gLive[openG]));
      txt.appendChild(h); if (g.story) txt.appendChild(el('p', null, g.story));
      crumbEl.appendChild(back); crumbEl.appendChild(txt); crumbEl.hidden = false;
    }
    // The glide. The view before and the view after are each drawn once and kept as pictures. In between,
    // both pictures are scaled about the place the closer view looks at and cross-faded, which works whether
    // or not the two views share a projection. The real drawing takes over at the end. With motion off the
    // change is a cut.
    var glide = null, labelHits = [];
    function snap() { var pic = layer(canvas.width, canvas.height); pic.getContext('2d').drawImage(canvas, 0, 0); return pic; }
    function feathered(pic) {      // a copy whose edges fade out, so the picture on top never shows a hard rectangle
      var copy = layer(pic.width, pic.height), c = copy.getContext('2d'), w = pic.width, h = pic.height, m = Math.min(w, h) * 0.1;
      c.drawImage(pic, 0, 0); c.globalCompositeOperation = 'destination-in';
      [[w, 0, m / w], [0, h, m / h]].forEach(function (ax) {
        var g = c.createLinearGradient(0, 0, ax[0], ax[1]);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(ax[2], '#000'); g.addColorStop(1 - ax[2], '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = g; c.fillRect(0, 0, w, h);
      });
      return copy;
    }
    function viewState() {
      return { v: { proj: V.proj, lamc: V.lamc, kx: V.kx, x0: V.x0, y1: V.y1, s: V.s * dpr }, clon: V.lamc, clat: (LATMIN + LATMAX) / 2, w: canvas.width, h: canvas.height };
    }
    function scaleAt(st, lon, lat) {      // device pixels per degree at a place, averaged over both directions
      var p0 = project(st.v, lon, lat), p1 = project(st.v, lon + 0.2, lat), p2 = project(st.v, lon, lat + 0.2);
      var area = Math.abs((p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]));
      return Math.sqrt(area / (0.04 * Math.max(0.1, Math.cos(lat * RAD))));
    }
    function glideTo(apply) {
      if (still || !canvas.width || glide) { glide = null; apply(); return; }
      var A = viewState(), picA = snap();
      apply();
      draw(performance.now());
      var B = viewState(), picB = snap();
      var k = scaleAt(B, B.clon, B.clat) / scaleAt(A, B.clon, B.clat), closing = k > 1.02;
      if (!closing) k = scaleAt(B, A.clon, A.clat) / scaleAt(A, A.clon, A.clat);
      k = Math.max(0.02, Math.min(50, k));
      glide = { A: A, B: B, picA: picA, picB: picB, soft: feathered(closing ? picB : picA), closing: closing, k: k,
        from: closing ? project(A.v, B.clon, B.clat) : [A.w / 2, A.h / 2],      // the anchor, in the first picture
        to: closing ? [B.w / 2, B.h / 2] : project(B.v, A.clon, A.clat),         // the same place, in the second
        t0: performance.now(), dur: 620 };
    }
    function drawGlide(now) {
      var g = glide, u = Math.min(1, (now - g.t0) / g.dur), e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      var PW = canvas.width, PH = canvas.height;
      var sa = Math.pow(g.k, e), sb = Math.pow(g.k, e - 1);        // the first picture grows to k, the second from 1/k to 1
      var ax = g.from[0] + (g.to[0] - g.from[0]) * e, ay = g.from[1] + (g.to[1] - g.from[1]) * e;
      function place(first, pic, alpha) {
        var sc = first ? sa : sb, at = first ? g.from : g.to;
        ctx.globalAlpha = alpha; ctx.drawImage(pic, ax - at[0] * sc, ay - at[1] * sc, pic.width * sc, pic.height * sc);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = '#05080e'; ctx.fillRect(0, 0, PW, PH);
      if (g.closing) {                 // closing in: the detail fades up, soft-edged first, whole at the end
        place(true, g.picA, 1); place(false, g.soft, smooth(0.15, 0.75, e)); place(false, g.picB, smooth(0.8, 1, e));
      } else {                         // pulling back: the detail starts whole, goes soft-edged and fades away
        place(false, g.picB, 1); place(true, g.soft, 1 - smooth(0.2, 0.8, e)); place(true, g.picA, 1 - smooth(0, 0.2, e));
      }
      ctx.globalAlpha = 1;
      if (u >= 1) { glide = null; lastField = -1e9; draw(now); }
    }

    function openGroup(g) {
      var keep = openG; openG = g; refold();          // the box has to hold what the open group will show
      var box = groupBox(g); openG = keep; refold();
      if (!box) return;
      glideTo(function () {
        openG = g; selected = -1; showDetail(-1);
        setBox(box); resize(); lastKey = ''; update(false); showCrumb();
      });
    }
    function closeGroup() {
      glideTo(function () {
        openG = -1; selected = -1; showDetail(-1);
        setBox(curView.box, curView.proj); resize(); lastKey = ''; update(false); showCrumb();
      });
    }
    function setView(v) {
      glideTo(function () {
        curView = v; baseDepth = viewLevel(v) ? 1 : 0; openG = -1; selected = -1; showDetail(-1);
        setBox(v.box, v.proj); resize(); buildEras(); lastKey = ''; update(false); showCrumb();
      });
    }

    var out = [0, 0, 0];
    function pick(W1, W2, B1, B2, i, stripe, striped) {
      var c = blobs[B1[i]].col, sec = B2[i];
      out[0] = c[0]; out[1] = c[1]; out[2] = c[2];
      if (sec < 0) return;
      var ratio = W2[i] / W1[i], c2 = blobs[sec].col;
      if (striped && ratio > 0.93) { if (stripe) { out[0] += (c2[0] - out[0]) * 0.8; out[1] += (c2[1] - out[1]) * 0.8; out[2] += (c2[2] - out[2]) * 0.8; } }
      else if (ratio > 0.52) { var mx = Math.min(0.5, (ratio - 0.52) / 0.3 * 0.5); out[0] += (c2[0] - out[0]) * mx; out[1] += (c2[1] - out[1]) * mx; out[2] += (c2[2] - out[2]) * mx; }
    }

    // The field is made in two steps. splat() works out which claim owns each cell, which is the costly part
    // and only changes with the year, the view or what is folded. paint() colours the cells and runs every
    // frame: it moves the contour lines and the stripes.
    var splatKey = '', lastSplat = -1e9;
    function field(t, now) {
      var key = year + '|' + openG + '|' + GW + '|' + GH + '|' + baseDepth + '|' + V.x0 + '|' + V.s;
      if (key !== splatKey && (!playing || now == null || now - lastSplat > 55)) { splatKey = key; lastSplat = now || 0; splat(); }
      paint(t);
    }
    function splat() {
      var i, gx, gy;
      pw1.fill(0); pw2.fill(0); pb1.fill(-1); pb2.fill(-1);
      lw1.fill(0); lw2.fill(0); lb1.fill(-1); lb2.fill(-1);

      for (var k2 = 0; k2 < blobs.length; k2++) {
        var bb = blobs[k2], q2 = people[bb.pi], fold = folded(q2);
        bb.ek = fold ? -2 - q2.ft : bb.pi; bb.col = fold ? gcol[q2.ft] : q2.rgb; bb.flat = fold; bb.fam = fold ? gfam[q2.ft] : q2.family;
      }
      for (var bi = 0; bi < blobs.length; bi++) {
        var b = blobs[bi], p = people[b.pi]; if (p.type === 'polity') continue;
        var a = alphaAt(b.c, year); if (a < 0.02) continue;
        var lang = p.type === 'language';
        var W1 = lang ? lw1 : pw1, W2 = lang ? lw2 : pw2, B1 = lang ? lb1 : pb1, B2 = lang ? lb2 : pb2;
        var cls = b.c['class'], c = px(b.c.lon, b.c.lat), cx = c[0] / CELL, cy = c[1] / CELL, allow = p.allow;
        var sig = b.r * S / CELL * SPREAD[cls] * (b.flat ? 1.7 : 1), inv = 1 / (2 * sig * sig), rad = sig * 3.05 + 4, amp = a * (b.flat ? 0.75 : STRENGTH[cls]);
        var x0 = Math.max(0, Math.floor(cx - rad)), x1 = Math.min(GW - 1, Math.ceil(cx + rad));
        var y0 = Math.max(0, Math.floor(cy - rad)), y1 = Math.min(GH - 1, Math.ceil(cy + rad));
        for (gy = y0; gy <= y1; gy++) {
          var row = gy * GW, ddx = -cx, ddy = gy - cy;
          for (gx = x0; gx <= x1; gx++) {
            i = row + gx; var ok = allow[landCell[i]]; if (!ok) continue;
            var dx = gx + ddx, dy = ddy, q = (dx * dx + dy * dy) * inv;
            if (q > 4.6) continue;
            var w = amp * ok * LUT[(q * 56) | 0], o1 = B1[i];
            if (o1 >= 0 && blobs[o1].ek === b.ek) { if (b.flat) W1[i] = Math.min(1.1, W1[i] + w * 0.85); else if (w > W1[i]) { W1[i] = w; B1[i] = bi; } continue; }
            if (w > W1[i]) { W2[i] = W1[i]; B2[i] = o1; W1[i] = w; B1[i] = bi; }
            else if (w > W2[i]) { W2[i] = w; B2[i] = bi; }
          }
        }
      }

    }
    function paint(t) {
      var i, gx, gy, d = img.data, shift = Math.floor(t * 1.6), picked = selected >= 0, wob = 0;   // the edge waver is off: at whole cells it reads as a ragged edge. The contours and stripes still move
      for (gy = 0; gy < GH; gy++) offX[gy] = Math.round(wob * (2.4 * Math.sin(gy * 0.045 + t * 0.35) + 1.3 * Math.sin(gy * 0.11 - t * 0.22)));
      for (gx = 0; gx < GW; gx++) offY[gx] = Math.round(wob * (2.4 * Math.sin(gx * 0.05 - t * 0.3) + 1.3 * Math.sin(gx * 0.12 + t * 0.19)));
      for (gy = 0; gy < GH; gy++) {
        var ox = offX[gy];
        for (gx = 0; gx < GW; gx++) {
          var o = (gy * GW + gx) * 4;
          if (!landCell[gy * GW + gx]) { d[o + 3] = 0; continue; }
          var sy = gy + offY[gx], sx = gx + ox;
          i = sy >= 0 && sy < GH && sx >= 0 && sx < GW ? sy * GW + sx : gy * GW + gx;
          if (pb1[i] < 0 && lb1[i] < 0) i = gy * GW + gx;          // nothing to read there, as at a coast: stay put
          var pt = pb1[i], lt = lb1[i];
          if (pt < 0 && lt < 0) { d[o + 3] = 0; continue; }
          var stripe = ((gx + gy + shift) >> 2) & 1, v, fr, line, s;

          // language wash
          var La = 0, Lr = 0, Lg = 0, Lb = 0, lp = null;
          if (lt >= 0) {
            lp = people[blobs[lt].pi]; s = lw1[i];
            La = 1 - Math.exp(-9 * s);
            pick(lw1, lw2, lb1, lb2, i, stripe, true);
            v = Math.sqrt(s) * 4.6 - t * 0.09; fr = v - Math.floor(v);
            line = s > 0.05 && fr < 0.3 ? 1 - Math.abs(fr - 0.15) / 0.15 : 0;
            var ls = 0.8 + 0.04 * Math.min(1, s * 1.3) + line * line * 0.02;
            if (muted(lp)) La *= 0.12;
            if (picked) { if (blobs[lt].pi === selected) ls += 0.25; else La *= 0.35; }
            Lr = out[0] * ls; Lg = out[1] * ls; Lb = out[2] * ls;
          }

          // named peoples
          var Pa = 0, Pr = 0, Pg = 0, Pb = 0, pp = null, pfam = '';
          if (pt >= 0) {
            var bt = blobs[pt], cl = bt.c['class'], ps; pp = people[bt.pi]; s = pw1[i]; pfam = bt.fam;
            pick(pw1, pw2, pb1, pb2, i, stripe, false);
            if (bt.flat) {
              Pa = 1 - Math.exp(-3.4 * s); ps = 0.68 + 0.1 * Math.min(1, s);
              if (openG >= 0 && !pp.inOpen) Pa *= 0.4;
            } else {
              Pa = 1 - Math.exp(-(cl === 'attested' ? 6.5 : cl === 'reconstructed' ? 5 : 3.6) * s);
              v = Math.sqrt(s) * 4.6 - t * 0.09; fr = v - Math.floor(v);
              line = s > 0.04 && fr < 0.3 ? 1 - Math.abs(fr - 0.15) / 0.15 : 0;
              ps = 0.74 + 0.3 * Math.min(1, s * 1.25) + line * line * 0.12;
              if (cl === 'indicative' && ((gx ^ gy) & 1)) Pa *= 0.55;
              if (openG >= 0 && !pp.inOpen) Pa *= 0.4;
            }
            if (focus && branches[pfam] !== focus) Pa *= 0.12;
            if (picked) { if (bt.pi === selected) ps += 0.2; else Pa *= 0.3; }
            Pr = out[0] * ps; Pg = out[1] * ps; Pb = out[2] * ps;
          }

          var r, g, bl, al;
          if (pp && lp && branches[pfam] !== lp.branch && Pa > 0.3 && La > 0.3 && stripe) {   // striped only across branches: Tamil kings over Telugu speakers are not two worlds
            r = Lr * 1.15; g = Lg * 1.15; bl = Lb * 1.15; al = Math.min(1, La * 1.1);      // rulers and population differ
          } else {
            var under = La * 0.66 * (1 - Pa); al = Pa + under;
            if (al < 0.004) { d[o + 3] = 0; continue; }
            r = (Pr * Pa + Lr * under) / al; g = (Pg * Pa + Lg * under) / al; bl = (Pb * Pa + Lb * under) / al;
          }
          d[o] = Math.min(255, r * 255); d[o + 1] = Math.min(255, g * 255); d[o + 2] = Math.min(255, bl * 255);
          d[o + 3] = Math.min(1, al) * 255;
        }
      }
      gctx.putImageData(img, 0, 0);
      sctx.globalCompositeOperation = 'source-over';
      sctx.clearRect(0, 0, stage.width, stage.height);
      sctx.drawImage(grid, 0, 0, GW, GH, 0, 0, GW * CELL * dpr, GH * CELL * dpr);
      sctx.globalCompositeOperation = 'destination-in';
      sctx.drawImage(mask, 0, 0);
    }

    function draw(now) {
      var t = still ? 0 : now * 0.001;
      if (now - lastField > 30) { field(t, now); lastField = now; }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(base, 0, 0); ctx.drawImage(stage, 0, 0); ctx.drawImage(coastLayer, 0, 0);
      if (RX0 > 24) {                  // the view was widened to fill the page: quieten what lies beside it
        var fade = Math.min(90, RX0) * dpr, gl = ctx.createLinearGradient((RX0 - 8) * dpr - fade, 0, (RX0 - 8) * dpr, 0), gr = ctx.createLinearGradient((RX1 + 8) * dpr, 0, (RX1 + 8) * dpr + fade, 0);
        gl.addColorStop(0, 'rgba(5,8,14,.72)'); gl.addColorStop(1, 'rgba(5,8,14,0)'); gr.addColorStop(0, 'rgba(5,8,14,0)'); gr.addColorStop(1, 'rgba(5,8,14,.72)');
        ctx.fillStyle = gl; ctx.fillRect(0, 0, (RX0 - 8) * dpr, canvas.height); ctx.fillStyle = gr; ctx.fillRect((RX1 + 8) * dpr, 0, canvas.width, canvas.height);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Labels. A folded group gets one lead label with a count. An open group and ungrouped entries get one each.
      var best = {}, lead = {};
      blobs.forEach(function (b) {
        var a = alphaAt(b.c, year); if (a < 0.02) return;
        var p = people[b.pi];
        if (folded(p)) {
          var at = px(b.c.lon, b.c.lat);
          if (at[0] < RX0 - 30 || at[0] > RX1 + 30 || at[1] < -40 || at[1] > H + 40) return;   // off this view: it must not drag the lead's place
          var wgt = a * b.r * b.r, G = lead[p.ft] || (lead[p.ft] = { g: p.ft, x: 0, y: 0, w: 0, a: 0, top: at, topw: 0, open: p.inOpen });
          G.x += at[0] * wgt; G.y += at[1] * wgt; G.w += wgt; if (a > G.a) G.a = a;
          if (wgt > G.topw) { G.topw = wgt; G.top = at; }
          return;
        }
        var cur = best[b.pi]; if (!cur || a * b.r > cur.a * cur.b.r) best[b.pi] = { b: b, a: a };
      });
      var labels = Object.keys(best).map(function (key) { return best[key]; });
      Object.keys(lead).forEach(function (key) {
        var G = lead[key], cx = G.x / G.w, cy = G.y / G.w, cell = Math.floor(cy / CELL) * GW + Math.floor(cx / CELL);
        if (!(cx > 0 && cx < W && cy > 0 && cy < H && landCell[cell])) { cx = G.top[0]; cy = G.top[1]; }
        labels.push({ lead: true, g: G.g, a: G.a, at: [cx, cy], open: G.open });
      });
      var leadFam = {}; labels.forEach(function (L) { if (L.lead) leadFam[gfam[L.g]] = 1; });
      function rank(L) {
        if (L.lead) return 5e3 + gLive[L.g];
        var p = people[L.b.pi];
        return (L.b.pi === selected ? 1e6 : 0) + (openG >= 0 && p.inOpen ? 8e3 : 0) + (p.type === 'people' ? 2e3 : p.type === 'polity' ? 1e3 : 0) + L.a * L.b.r;
      }
      labels.sort(function (u, v) { return rank(v) - rank(u); });
      labelHits = [];
      var boxes = [], lvl = viewLevel(curView), seenW = Math.min(W, (canvas.parentNode && canvas.parentNode.clientWidth) || W), room = Math.max(4, Math.floor(W * H / (seenW < 600 ? 30000 : 11000))),   // a phone sees part of a wide map at a time
           caps = (openG < 0 ? CAPS[Math.min(lvl, CAPS.length - 1)] : [40, 40, 40]).concat([60]).map(function (c, i) { return Math.min(c, i ? Math.ceil(room / (seenW < 600 ? 3 : 2)) * (i === 3 ? 3 : 1) : room); }), used = [0, 0, 0, 0];
      ctx.lineJoin = 'round'; ctx.textBaseline = 'middle';
      labels.forEach(function (L) {
        var isLead = !!L.lead, p = isLead ? null : people[L.b.pi], sel = !isLead && L.b.pi === selected;
        var c = isLead ? L.at : px(L.b.c.lon, L.b.c.lat);
        if (L.a < 0.3 && !sel) return;
        if (c[0] < Math.max(6, RX0 - 24) || c[0] > Math.min(W - 6, RX1 + 24) || c[1] < 6 || c[1] > H - 6) return;   // its place is off the map, or beside the part asked for
        var kindOf = isLead ? 0 : p.type === 'language' ? 1 : p.type === 'polity' ? 2 : 3;
        if (!sel && used[kindOf] >= caps[kindOf]) return;
        if (!isLead && !sel && L.b.r * S < (p.type === 'people' ? 7 : 12)) return;   // too small on this view to carry a name
        if (!isLead && !sel && openG < 0 && p.type === 'language' && leadFam[p.family]) return;   // the lead already names this ground
        var branch = isLead ? branches[gfam[L.g]] : p.branch;
        if (!sel && focus && (isLead ? branch !== focus : (p.type === 'polity' || muted(p)))) return;
        var size, txt, fill, space, markCol = null, tail = '', vis = Math.min(1, L.a * 1.2);
        if (isLead) {
          if (openG >= 0 && !L.open) vis *= 0.55;
          size = Math.max(12, Math.min(15, 11 + Math.sqrt(gLive[L.g]) * 0.8)); txt = groups[gkeys[L.g]].name.toUpperCase(); space = 1.3;
          ctx.font = '700 ' + size + 'px ' + DISPLAY; fill = css(gtint[L.g], vis); markCol = css(gmark[L.g], vis); tail = String(gLive[L.g]);
        }
        else if (p.type === 'polity') { size = 11; txt = p.name.toUpperCase(); space = 3.6; ctx.font = '500 ' + size + 'px ' + DISPLAY; fill = 'rgba(232,238,245,' + Math.min(.78, L.a) + ')'; }
        else if (p.type === 'language') { size = Math.max(12, Math.min(14, 11.5 + L.b.r * 1)); txt = p.name; space = 0.1; ctx.font = '500 ' + size + 'px ' + SANS; fill = css(p.tint, Math.min(.9, L.a)); if (p.rgb) markCol = css(p.mark, vis); }
        else { size = Math.max(11.5, Math.min(15, 10 + L.b.r * 7)); txt = p.name.toUpperCase(); space = 1; ctx.font = '600 ' + size + 'px ' + DISPLAY; fill = css(p.tint, vis); if (p.rgb) markCol = css(p.mark, vis); }
        try { ctx.letterSpacing = space + 'px'; } catch (e) {}
        var gw = markCol ? size * 0.5 + 5 : 0, tw = ctx.measureText(txt).width, tailw = tail ? size * 0.46 * tail.length + 9 : 0, full = tw + gw + tailw;
        var bx = Math.max(3, Math.min(W - full - 3, c[0] - full / 2)), by = c[1], box, clash = true;
        // Leads, states and languages may step aside to find room; a people stays close to its place.
        var tries = isLead ? [[0, 0], [0, -20], [0, 20], [38, 0], [-38, 0], [0, -38], [0, 38], [38, -20], [38, 20], [-38, 20], [-38, -20]]
          : p.type !== 'people' ? [[0, 0], [0, 18], [0, -18], [42, 0], [-42, 0], [42, 18], [42, -18], [-42, 18], [0, 34], [0, -34], [64, 34]]
          : [[0, 0], [0, -13], [0, 13]];
        for (var ti = 0; ti < tries.length && clash; ti++) {
          var tx = Math.max(3, Math.min(W - full - 3, c[0] - full / 2 + tries[ti][0])), ty = c[1] + tries[ti][1];
          box = [tx - 4, ty - size * 0.62, tx + full + 4, ty + size * 0.62]; clash = false;
          for (var m = 0; m < boxes.length; m++) { var o = boxes[m]; if (box[0] < o[2] && box[2] > o[0] && box[1] < o[3] && box[3] > o[1]) { clash = true; break; } }
          if (!clash) { bx = tx; by = ty; }
        }
        if (clash && !sel) return;
        boxes.push(box); used[kindOf]++; labelHits.push(isLead ? { box: box, g: L.g } : { box: box, pi: L.b.pi });
        var halo = 'rgba(4,7,12,' + (0.7 * vis) + ')';
        if (markCol) {
          var shape = SHAPE[branch] || 'circle', gr = size * 0.25;
          glyphPath(ctx, shape, bx + gr + 1, by, gr);
          ctx.lineWidth = 2.6; ctx.strokeStyle = halo; ctx.stroke();
          if (shape === 'ring') { ctx.lineWidth = 1.4; ctx.strokeStyle = markCol; ctx.stroke(); } else { ctx.fillStyle = markCol; ctx.fill(); }
        }
        ctx.lineWidth = 2.8; ctx.strokeStyle = halo;
        ctx.strokeText(txt, bx + gw, by); ctx.fillStyle = fill; ctx.fillText(txt, bx + gw, by);
        if (tail) {
          try { ctx.letterSpacing = '0px'; } catch (e3) {}
          ctx.font = '500 ' + (size * 0.72) + 'px ui-monospace, "IBM Plex Mono", Menlo, monospace';
          ctx.strokeText(tail, bx + gw + tw + 5, by + 0.5); ctx.fillStyle = 'rgba(232,238,245,' + (0.72 * vis) + ')'; ctx.fillText(tail, bx + gw + tw + 5, by + 0.5);
        }
        if (sel) { ctx.fillStyle = fill; ctx.fillRect(bx + gw, by + size * 0.62, tw - space, 1.5); }
      });
      try { ctx.letterSpacing = '0px'; } catch (e2) {}
    }

    function fmt(y) { return (y < 1 ? 1 : Math.round(y)) + ' CE'; }
    function yr(y) { return y < 0 ? (-y) + ' BCE' : y + ' CE'; }
    function lineage(p) {
      if (!p.family) return '';
      var b = branchNames[p.branch] ? branchNames[p.branch] + ' · ' : '';
      return b + data.families[p.family] + (p.family_inferred ? ' (inferred)' : '') + ' · ';
    }

    var detailKey = '', byId = {}, linksOf = {};
    people.forEach(function (p, pi) { byId[p.id] = pi; });
    // Succession, said from each end of the link.
    var LINK_OUT = { 'continues': 'Continues as', 'name-continues': 'Name lives on in', 'merged-into': 'Merged into', 'absorbed-by': 'Absorbed by', 'split-from': 'Split from' };
    var LINK_IN = { 'continues': 'Came from', 'name-continues': 'Takes its name from', 'merged-into': 'Took in', 'absorbed-by': 'Absorbed', 'split-from': 'Parent of' };
    (data.links || []).forEach(function (l) {
      var y = parseInt(l.year, 10); y = isNaN(y) ? null : y;
      (linksOf[l.from_people] = linksOf[l.from_people] || []).push({ other: l.to_people, text: LINK_OUT[l.relation] || 'See', year: y == null ? null : Math.min(END, y + 20) });
      (linksOf[l.to_people] = linksOf[l.to_people] || []).push({ other: l.from_people, text: LINK_IN[l.relation] || 'See', year: y == null ? null : Math.max(1, y - 20) });
    });
    function showDetail(pi) {
      if (pi < 0) { detailEl.hidden = true; detailEl.textContent = ''; detailKey = ''; return; }
      var p = people[pi], cs = p.claims;
      var liveNow = cs.filter(function (c) { return alphaAt(c, year) > 0.2; });
      var show = liveNow.length ? liveNow : cs;
      var key = pi + '|' + show.map(function (c) { return c.id; }).join(',');
      if (key === detailKey) return;
      detailKey = key; detailEl.textContent = ''; detailEl.hidden = false;
      var first = cs[0].from, last = cs[cs.length - 1], open = cs.some(function (c) { return c.open; });
      var head = el('div', 'dhead'), h = el('h3');
      if (p.rgb) h.appendChild(glyph(p.branch, css(p.mark, 1), 14));
      h.appendChild(document.createTextNode(p.name));
      var x = el('button', 'close', '\u00d7'); x.type = 'button'; x.setAttribute('aria-label', 'Close details for ' + p.name);
      x.addEventListener('click', function () { select(-1); });
      head.appendChild(h); head.appendChild(x); detailEl.appendChild(head);
      var kind = p.type === 'polity' ? 'State' : p.type === 'language' ? 'Language community' : 'People or kingdom';
      detailEl.appendChild(el('div', 'meta', lineage(p) + kind + ' \u00b7 about ' + yr(first) + ' to ' + (open ? 'the present' : yr(last.to))));
      var notes = [], srcs = [], seed = false;
      show.forEach(function (c) {
        if (c.note && notes.indexOf(c.note) < 0) notes.push(c.note);
        c.sources.forEach(function (sid) { if (srcs.indexOf(sid) < 0) srcs.push(sid); });
        if (c.status === 'seed') seed = true;
      });
      if (notes.length) detailEl.appendChild(el('div', null, notes.join(' ')));
      detailEl.appendChild(el('div', 'cls', CLASS_TEXT[show[0]['class']] + '.' + (seed ? ' Unreviewed seed record.' : '')));
      var ul = el('ul');
      srcs.forEach(function (sid) { ul.appendChild(el('li', null, data.sources[sid])); });
      detailEl.appendChild(ul);
      var acts = el('div', 'acts'), life = lifeOf(p);
      function act(text, fn) { var b = el('button', null, text); b.type = 'button'; b.addEventListener('click', fn); acts.appendChild(b); }
      act('First appears ' + fmt(life[0]), function () { stop(); year = Math.min(END, life[0] + (life[0] > 1 ? 20 : 0)); update(false); });
      if (!open) act('Last appears ' + fmt(life[1]), function () { stop(); year = Math.max(1, life[1] - 20); update(false); });
      (linksOf[p.id] || []).forEach(function (l) {
        var other = byId[l.other]; if (other == null) return;
        act(l.text + ' ' + people[other].name, function () { goTo({ pi: other }, l.year); });
      });
      detailEl.appendChild(acts);
      var at = px(show[0].lon, show[0].lat);
      detailEl.classList.toggle('top', at[1] > H * 0.55);   // keep the card off the place it describes
    }

    function select(pi) { selected = pi; showDetail(pi); lastKey = ''; lastField = -1e9; update(false); }

    yearLabel.textContent = '';
    var yearNum = el('span', 'num'), yearEra = el('span', 'ce', 'CE'); yearLabel.appendChild(yearNum); yearLabel.appendChild(yearEra);
    var eraIdx = -1, legendKey = '', MARKS = [], marksEl = $('marks'), spanEl = $('lifespan'), markName = $('markname');
    function pct(y) { return (y - 1) / (END - 1) * 100; }
    function eventsFor(v) {
      while (v) { if (data.events && data.events[v.id]) return data.events[v.id]; v = viewById[v.parent]; }
      return [];
    }
    function markNear(y, within) { var best = null, bd = within + 1; MARKS.forEach(function (m) { var d = Math.abs(m[0] - y); if (d < bd) { bd = d; best = m; } }); return best; }
    function buildEras() {
      ERAS = periodsFor(curView); eraIdx = -1; MARKS = eventsFor(curView);
      if (marksEl) {
        marksEl.textContent = '';
        MARKS.forEach(function (m) {
          var b = el('button'); b.type = 'button'; b.style.left = pct(m[0]) + '%'; b.title = m[0] + ': ' + m[1];
          b.setAttribute('aria-label', m[0] + ', ' + m[1]);
          b.addEventListener('click', function () { stop(); year = m[0]; update(false); });
          marksEl.appendChild(b);
        });
      }
      if (stripEl) {
        stripEl.textContent = '';
        ERAS.forEach(function (e) {
          var seg = el('button'); seg.type = 'button'; seg.style.flexGrow = Math.max(1, Math.min(END, e[1]) - e[0]); seg.title = e[3];
          seg.setAttribute('aria-label', (e[3] || 'Period') + ', ' + e[0] + ' to ' + Math.min(END, e[1]));
          seg.addEventListener('click', function () { stop(); year = Math.max(1, Math.min(END, e[4])); update(false); });
          stripEl.appendChild(seg);
        });
      }
    }
    function update(fromSlider) {
      yearNum.textContent = String(year < 1 ? 1 : Math.round(year));
      var here = markNear(Math.round(year), 0);
      if (markName) { markName.textContent = here ? here[1] : ''; markName.hidden = !here; }
      if (marksEl) Array.prototype.forEach.call(marksEl.children, function (b, i) { b.className = MARKS[i] === here ? 'on' : ''; });
      if (spanEl) {
        if (selected >= 0) { var sl = lifeOf(people[selected]); spanEl.hidden = false; spanEl.style.left = pct(sl[0]) + '%'; spanEl.style.width = Math.max(0.4, pct(sl[1]) - pct(sl[0])) + '%'; }
        else spanEl.hidden = true;
      }
      for (var gi = 0; gi < gLive.length; gi++) gLive[gi] = 0;
      var act = [];
      people.forEach(function (p, pi) {
        var top = 0, vis = false;
        p.claims.forEach(function (c) {
          var a = alphaAt(c, year); if (a > top) top = a;
          if (a > 0.05 && !vis && c.kind !== 'movement') {
            var q = px(c.lon, c.lat), r = Math.max(c.r_km, 12) / 111 * S;
            vis = q[0] > RX0 - r && q[0] < RX1 + r && q[1] > -r && q[1] < H + r;
          }
        });
        p.inView = vis;
        if (top > 0.05) p.chain.forEach(function (g) { gLive[g]++; });
        if (top > 0.35 && vis) act.push(pi);
      });
      if (openG >= 0 && gLive[openG] === 0) { openG = -1; setBox(curView.box, curView.proj); resize(); showCrumb(); }
      refold();
      var e = 0; while (e < ERAS.length - 1 && year >= ERAS[e][1]) e++;
      if (e !== eraIdx) {
        eraIdx = e; eraEl.textContent = ERAS[e][2];
        if (eraName) eraName.textContent = ERAS[e][3];
        if (stripEl) Array.prototype.forEach.call(stripEl.children, function (seg, i) { seg.className = i === e ? 'on' : ''; });
        if (prevBtn) prevBtn.disabled = e === 0;
        if (nextBtn) nextBtn.disabled = e === ERAS.length - 1;
      }
      slider.setAttribute('aria-valuetext', fmt(year) + ', ' + ERAS[e][3]);
      var leads = [], seenLead = {}, shown = [], present = {};
      act.forEach(function (pi) {
        var p = people[pi];
        if (p.family) (present[p.branch] = present[p.branch] || {})[p.family] = 1;
        if (p.ft >= 0) { if (!seenLead[p.ft]) { seenLead[p.ft] = 1; leads.push(p.ft); } }
        else shown.push(pi);
      });
      leads.sort(function (a, b) { return gLive[b] - gLive[a]; });
      var lk = BRANCH_ORDER.filter(function (b) { return present[b]; }).map(function (b) { return b + ':' + Object.keys(present[b]).join(','); }).join('|');
      if (lk !== legendKey) { legendKey = lk; buildLegend(present); }
      var key = shown.join(',') + '|' + selected + '|' + openG + '|' + curView.id + '|' + leads.map(function (i) { return i + ':' + gLive[i]; }).join(',');
      if (key !== lastKey) {
        lastKey = key; listEl.textContent = '';
        if (openG >= 0) showCrumb();
        if (leads.length) {
          var gg = el('div', 'grp'), gh = el('h3', null, 'Groups · ' + leads.length), gb = el('div', 'names');
          leads.forEach(function (i) {
            var b = el('button'); b.type = 'button';
            b.appendChild(glyph(branches[gfam[i]], css(gmark[i], 1), 11));
            b.appendChild(document.createTextNode(groups[gkeys[i]].name + ' · ' + gLive[i]));
            b.addEventListener('click', function () { openGroup(i); });
            gb.appendChild(b);
          });
          gg.appendChild(gh); gg.appendChild(gb); listEl.appendChild(gg);
        }
        var count = { people: 0, language: 0, polity: 0 };
        shown.forEach(function (pi) { count[people[pi].type]++; });
        canvas.setAttribute('aria-label', 'Map of ' + curView.name + ' at ' + fmt(year) + (ERAS[e][3] ? ', ' + ERAS[e][3] : '') + ': ' + leads.length + ' groups of peoples, ' +
          count.people + ' named peoples and kingdoms, ' + count.language + ' language areas and ' + count.polity + ' states. The list after the map names them all.');
        var sections = [['polity', 'States', null, '']];
        FAMILY_ORDER.forEach(function (f) { if (RANGE[f]) sections.push([f, (branchNames[branches[f]] ? branchNames[branches[f]] + ' · ' : '') + data.families[f], css(familyColor(f, 0.04), 1), branches[f]]); });
        sections.forEach(function (grp) {
          var ids = shown.filter(function (pi) { var p = people[pi]; return (p.type === 'polity' ? 'polity' : p.family) === grp[0]; });
          if (!ids.length) return;
          var g = el('div', 'grp'), h = el('h3');
          if (grp[2]) h.appendChild(glyph(grp[3], grp[2], 11));
          h.appendChild(document.createTextNode(grp[1] + ' · ' + ids.length)); g.appendChild(h);
          var box = el('div', 'names');
          ids.forEach(function (pi) {
            var b = el('button'); b.type = 'button';
            if (people[pi].rgb) b.appendChild(glyph(people[pi].branch, css(people[pi].mark, 1), 11));
            b.appendChild(document.createTextNode(people[pi].name));
            b.setAttribute('aria-pressed', selected === pi ? 'true' : 'false');
            b.addEventListener('click', function () { select(selected === pi ? -1 : pi); });
            box.appendChild(b);
          });
          g.appendChild(box); listEl.appendChild(g);
        });
      }
      if (selected >= 0) showDetail(selected);
      if (!fromSlider) slider.value = Math.round(year);
      writeHash();
      lastField = -1e9;
      if (still) draw(performance.now());
    }

    function stop() { playing = false; playBtn.textContent = '\u25b6 Play'; playBtn.setAttribute('aria-pressed', 'false'); }

    slider.addEventListener('input', function () { year = +slider.value; stop(); update(true); });
    // Letting go near a dated event lands on it. The reach is what three pixels of the track is worth.
    slider.addEventListener('change', function () {
      var reach = Math.max(2, Math.round(3 * (END - 1) / Math.max(200, slider.clientWidth))), m = markNear(+slider.value, reach);
      if (m && m[0] !== +slider.value) { year = m[0]; update(false); }
    });
    // Keys: left and right ten years, with Shift a hundred and with Alt one; Page Up and Down a period;
    // [ and ] the previous and next dated event.
    slider.addEventListener('keydown', function (ev) {
      var k = ev.key, step = ev.altKey ? 1 : ev.shiftKey ? 100 : 10, y = Math.round(year), to = null;
      if (k === 'ArrowRight' || k === 'ArrowUp') to = y + step;
      else if (k === 'ArrowLeft' || k === 'ArrowDown') to = y - step;
      else if (k === 'PageUp') { ev.preventDefault(); jump(1); return; }
      else if (k === 'PageDown') { ev.preventDefault(); jump(-1); return; }
      else if (k === ']') { var nx = MARKS.filter(function (m) { return m[0] > y; })[0]; if (nx) to = nx[0]; }
      else if (k === '[') { var pv = MARKS.filter(function (m) { return m[0] < y; }).pop(); if (pv) to = pv[0]; }
      if (to == null) return;
      ev.preventDefault(); stop(); year = Math.max(1, Math.min(END, to)); update(false);
    });
    Array.prototype.forEach.call(document.querySelectorAll('#presets button[data-y]'), function (b) {
      b.addEventListener('click', function () { stop(); year = Math.min(END, +b.getAttribute('data-y')); update(false); });
    });
    playBtn.addEventListener('click', function () {
      if (playing) { stop(); return; }
      if (year >= END - 5) year = 1;
      playing = true; playBtn.textContent = '\u275a\u275a Pause'; playBtn.setAttribute('aria-pressed', 'true');
    });
    // What is under a point of the map, in css pixels: a lettered name first, then whichever entry owns that
    // cell of the field, then the same within a finger's width. Returns { pi } or { g } or null.
    function ownerAt(x, y) {
      if (x < 0 || y < 0 || x >= W || y >= H) return null;
      var i = Math.floor(y / CELL) * GW + Math.floor(x / CELL);
      if (!landCell[i]) return null;
      var pt = pb1[i], lt = lb1[i];
      if (pt >= 0 && pw1[i] > 0.1) { var p = people[blobs[pt].pi]; return p.ft >= 0 ? { g: p.ft } : { pi: blobs[pt].pi }; }
      if (lt >= 0 && lw1[i] > 0.05) return { pi: blobs[lt].pi };
      return null;
    }
    function hitAt(x, y, reach) {
      for (var k = 0; k < labelHits.length; k++) { var b = labelHits[k].box; if (x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3]) return labelHits[k]; }
      var hit = ownerAt(x, y);
      for (var r = 5; !hit && r <= reach; r += 5) for (var a = 0; a < 8 && !hit; a++) hit = ownerAt(x + r * Math.cos(a * 0.7854), y + r * Math.sin(a * 0.7854));
      return hit;
    }
    function nameOf(hit) {
      if (!hit) return '';
      if (hit.g != null) return groups[gkeys[hit.g]].name + ' · ' + gLive[hit.g] + ' · open';
      var p = people[hit.pi]; return p.name + (p.type === 'language' ? ' · language' : p.type === 'polity' ? ' · state' : '');
    }
    canvas.addEventListener('click', function (ev) {
      if (glide) return;
      var r = canvas.getBoundingClientRect(), hit = hitAt(ev.clientX - r.left, ev.clientY - r.top, 15);
      if (hit && hit.g != null) { openGroup(hit.g); return; }
      select(hit ? hit.pi : -1);
    });
    // A pointer that can hover gets the name of what it is over. Touch gets nothing here: a tap answers it.
    var tipEl = el('div', 'tip'); tipEl.hidden = true; tipEl.setAttribute('aria-hidden', 'true');
    if (canvas.parentNode) canvas.parentNode.appendChild(tipEl);
    var tipAt = null, tipQueued = false;
    function showTip() {
      tipQueued = false;
      var hit = tipAt && !glide ? hitAt(tipAt[0], tipAt[1], 0) : null, text = nameOf(hit);
      canvas.style.cursor = hit ? 'pointer' : '';
      if (!text) { tipEl.hidden = true; return; }
      tipEl.textContent = text; tipEl.hidden = false;
      var tw = tipEl.offsetWidth, left = Math.max(4, Math.min(W - tw - 4, tipAt[0] + 14));
      tipEl.style.left = left + 'px'; tipEl.style.top = Math.max(4, tipAt[1] - 34) + 'px';
    }
    canvas.addEventListener('pointermove', function (ev) {
      if (ev.pointerType && ev.pointerType !== 'mouse') return;
      var r = canvas.getBoundingClientRect(); tipAt = [ev.clientX - r.left, ev.clientY - r.top];
      if (!tipQueued) { tipQueued = true; requestAnimationFrame(showTip); }
    });
    canvas.addEventListener('pointerleave', function () { tipAt = null; tipEl.hidden = true; canvas.style.cursor = ''; });

    // Going straight to an entry or a group: the year in the middle of its life, the closest view that
    // holds it, its group open, and the entry selected. Search, the succession buttons and a shared
    // address all arrive this way.
    function lifeOf(p) {
      var first = 1e9, last = -1e9;
      p.claims.forEach(function (c) { if (c.from < first) first = c.from; var t = c.open ? END : c.to; if (t > last) last = t; });
      return [Math.max(1, first), Math.min(END, last)];
    }
    function midYear(p) {
      var life = lifeOf(p), mid = (life[0] + life[1]) / 2, best = p.claims[0], bd = 1e9;
      p.claims.forEach(function (c) { var t = c.open ? END : c.to, d = mid < c.from ? c.from - mid : mid > t ? mid - t : 0; if (d < bd) { bd = d; best = c; } });
      var t = best.open ? END : best.to;
      return Math.round(Math.max(1, Math.min(END, Math.max(best.from, Math.min(t, mid)))));
    }
    function viewFor(lon, lat, rdeg) {
      var best = (data.views || [])[0] || curView, area = 1e12;
      (data.views || []).forEach(function (v) {
        var b = v.box, mid = (b[0] + b[2]) / 2, half = (b[2] - b[0]) / 2, a = (b[2] - b[0]) * (b[3] - b[1]);
        if (Math.abs(norm(lon - mid)) > half - 1 || lat < b[1] + 1 || lat > b[3] - 1) return;
        if (Math.min(b[2] - b[0], b[3] - b[1]) < rdeg * 2.2) return;
        if (a < area) { area = a; best = v; }
      });
      return best;
    }
    function claimAt(p, y) { var best = p.claims[0], top = -1; p.claims.forEach(function (c) { var a = alphaAt(c, y) * Math.max(c.r_km, 12); if (a > top) { top = a; best = c; } }); return best; }
    function goTo(target, atYear) {
      stop(); tipAt = null; tipEl.hidden = true;
      var pi = target.pi != null ? target.pi : -1, g = target.g != null ? target.g : -1, p = pi >= 0 ? people[pi] : null;
      if (!p && g >= 0) {                       // a group: stand in the middle year of its members
        var mids = []; people.forEach(function (q) { if (q.chain.indexOf(g) >= 0) mids.push(midYear(q)); });
        if (!mids.length) return;
        mids.sort(function (a, b) { return a - b; });
        if (atYear == null) atYear = mids[mids.length >> 1];
        p = people.filter(function (q) { return q.chain.indexOf(g) >= 0 && q.claims.some(function (c) { return alphaAt(c, atYear) > 0.3; }); })[0] || null;
      }
      var y = atYear != null ? atYear : midYear(p), c = p ? claimAt(p, y) : null;
      var v = target.view || (c ? viewFor(c.lon, c.lat, Math.max(c.r_km, 12) / 111) : curView);
      glideTo(function () {
        curView = v; baseDepth = viewLevel(v) ? 1 : 0; openG = -1; selected = -1; year = y;
        setBox(v.box, v.proj); resize(); buildEras(); update(false);
        var open = g >= 0 ? g : p && p.g >= 0 && gLive[p.g] > 1 ? p.g : -1;
        if (open >= 0 && gLive[open] > 0) { openG = open; refold(); var box = groupBox(open); if (box) { setBox(box); resize(); } else openG = -1; }
        selected = pi; detailKey = ''; showDetail(pi); lastKey = ''; update(false); showCrumb(); viewButtons();
      });
    }

    // View switch, in two steps: the world or a continent, then a region of that continent.
    var viewsEl = $('views'), subEl = $('subviews');
    function viewButtons() {
      if (!viewsEl) return;
      var root = (kidsOf[''] || [])[0]; if (!root) return;
      var top = curView; while (top.parent && top.parent !== root.id && viewById[top.parent]) top = viewById[top.parent];
      function fill(box, items, on) {
        box.textContent = '';
        items.forEach(function (it) {
          var btn = el('button', null, it[1]); btn.type = 'button'; btn.setAttribute('aria-pressed', it[0] === on ? 'true' : 'false');
          btn.addEventListener('click', function () { if (it[0] !== curView) { setView(it[0]); viewButtons(); } });
          box.appendChild(btn);
        });
      }
      fill(viewsEl, [[root, root.name]].concat((kidsOf[root.id] || []).map(function (v) { return [v, v.name]; })), top);
      if (subEl) {
        var kids = top !== root ? kidsOf[top.id] || [] : [];
        subEl.hidden = !kids.length;
        if (kids.length) fill(subEl, [[top, 'All of ' + top.name.replace(/^The /, 'the ')]].concat(kids.map(function (v) { return [v, v.name]; })), curView);
      }
    }
    viewButtons();

    // Search. Names are matched without accents or case; a name that starts with what was typed comes first.
    var searchEl = $('search'), foundEl = $('found');
    function plain(t) { return String(t).normalize ? String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() : String(t).toLowerCase(); }
    if (searchEl && foundEl) {
      var index = [];
      people.forEach(function (p, pi) { index.push({ key: plain(p.name), pi: pi }); });
      gkeys.forEach(function (key, g) { index.push({ key: plain(groups[key].name), g: g }); });
      var results = [], cursor = -1;
      var kindText = { people: 'people or kingdom', polity: 'state', language: 'language' };
      var pickResult = function (r) {
        searchEl.value = ''; foundEl.hidden = true; foundEl.textContent = ''; results = []; searchEl.setAttribute('aria-expanded', 'false');
        goTo(r); canvas.scrollIntoView && canvas.scrollIntoView({ block: 'nearest' });
      };
      var runSearch = function () {
        var q = plain(searchEl.value.trim()); foundEl.textContent = ''; results = []; cursor = -1;
        if (q.length < 2) { foundEl.hidden = true; searchEl.setAttribute('aria-expanded', 'false'); return; }
        var scored = [];
        index.forEach(function (it) {
          var at = it.key.indexOf(q); if (at < 0) return;
          scored.push([at === 0 ? 0 : it.key.charAt(at - 1) === ' ' ? 1 : 2, it.key.length, it]);
        });
        scored.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
        results = scored.slice(0, 8).map(function (s) { return s[2]; });
        results.forEach(function (it, i) {
          var b = el('button'); b.type = 'button'; b.setAttribute('role', 'option'); b.id = 'found-' + i;
          if (it.g != null) {
            b.appendChild(glyph(branches[gfam[it.g]], css(gmark[it.g], 1), 11));
            b.appendChild(el('span', 'nm', groups[gkeys[it.g]].name)); b.appendChild(el('span', 'kd', 'group'));
          } else {
            var p = people[it.pi], life = lifeOf(p);
            if (p.rgb) b.appendChild(glyph(p.branch, css(p.mark, 1), 11));
            b.appendChild(el('span', 'nm', p.name));
            b.appendChild(el('span', 'kd', kindText[p.type] + ' · ' + life[0] + ' to ' + (life[1] >= END ? 'now' : life[1])));
          }
          b.addEventListener('click', function () { pickResult(it); });
          foundEl.appendChild(b);
        });
        if (!results.length) foundEl.appendChild(el('p', 'none', 'Nothing by that name. Names follow the sources, so try another spelling.'));
        foundEl.hidden = false; searchEl.setAttribute('aria-expanded', 'true');
      };
      searchEl.addEventListener('input', runSearch);
      searchEl.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') { searchEl.value = ''; runSearch(); return; }
        if (!results.length) return;
        if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
          ev.preventDefault(); cursor = (cursor + (ev.key === 'ArrowDown' ? 1 : results.length - 1)) % results.length;
          Array.prototype.forEach.call(foundEl.children, function (b, i) { b.className = i === cursor ? 'on' : ''; });
          searchEl.setAttribute('aria-activedescendant', 'found-' + cursor);
        } else if (ev.key === 'Enter') { ev.preventDefault(); pickResult(results[Math.max(0, cursor)]); }
      });
    }

    // Motion can be paused: the contours move on their own, so there has to be a way to stop them.
    if (motionBtn) {
      var syncMotion = function () { motionBtn.setAttribute('aria-pressed', still ? 'false' : 'true'); motionBtn.textContent = still ? 'Motion off' : 'Motion on'; };
      motionBtn.addEventListener('click', function () { still = !still; syncMotion(); lastField = -1e9; draw(performance.now()); });
      syncMotion();
    }
    var jump = function (d) { var e = Math.max(0, Math.min(ERAS.length - 1, eraIdx + d)); stop(); year = Math.max(1, Math.min(END, ERAS[e][4])); update(false); };
    if (prevBtn) prevBtn.addEventListener('click', function () { jump(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { jump(1); });
    buildEras();
    if (ticksEl) [1, 500, 1000, 1500, 2000].forEach(function (y) { var tk = el('span', null, String(y)); tk.style.left = pct(y) + '%'; ticksEl.appendChild(tk); });

    // Legend: one row per branch that is on the map in this view and year. The branch name is a switch that
    // dims everything else. When many branches are present the families are left to the list below.
    function buildLegend(present) {
      if (!legendEl) return;
      legendEl.textContent = '';
      var rows = BRANCH_ORDER.filter(function (br) { return present[br]; }), compact = rows.length > 12, btns = [];
      legendEl.className = compact ? 'compact' : '';
      if (focus && !present[focus]) focus = '';
      rows.forEach(function (br) {
        var fams = FAMILY_ORDER.filter(function (f) { return branches[f] === br && present[br][f] && RANGE[f]; });
        var row = el('div', 'brow'), btn = el('button', 'branch'); btn.type = 'button';
        var z = BRANCH_STYLE[br], sw = fams.length ? css(familyColor(fams[0], 0.06), 1) : '#eef2f6';
        btn.appendChild(glyph(br, z || compact ? sw : '#eef2f6', 13)); btn.appendChild(document.createTextNode(branchNames[br] || br));
        btn.setAttribute('aria-pressed', focus === br ? 'true' : 'false');
        btn.addEventListener('click', function () {
          focus = focus === br ? '' : br;
          btns.forEach(function (x) { x[1].setAttribute('aria-pressed', x[0] === focus ? 'true' : 'false'); });
          lastField = -1e9; if (still) draw(performance.now());
        });
        btns.push([br, btn]); row.appendChild(btn);
        if (!compact) {
          var list = el('div', 'fams');
          fams.forEach(function (f) {
            var sp = el('span'); sp.appendChild(glyph(br, css(familyColor(f, 0.04), 1), 11));
            sp.appendChild(document.createTextNode(data.families[f])); list.appendChild(sp);
          });
          row.appendChild(list);
        }
        legendEl.appendChild(row);
      });
    }
    if (statusEl) statusEl.textContent = people.length + ' entries, ' + claimCount + ' claims, ' + seedCount + ' unreviewed';

    var prev = 0;
    function frame(now) {
      var dt = Math.min(100, now - prev); prev = now;
      if (glide) { drawGlide(now); requestAnimationFrame(frame); return; }
      if (playing) { year += dt * 0.06; if (year >= END) { year = END; stop(); } update(false); }
      if (!still || playing) draw(now);
      requestAnimationFrame(frame);
    }
    // The address follows the view, so any moment can be shared: #y=1350&v=westafrica&g=group&s=entry.
    // Where the page is not allowed to touch its address, as inside some frames, this does nothing.
    var hashTimer = 0, lastHash = '';
    function stateHash() {
      var parts = ['y=' + Math.round(year), 'v=' + curView.id];
      if (openG >= 0) parts.push('g=' + encodeURIComponent(gkeys[openG]));
      if (selected >= 0) parts.push('s=' + encodeURIComponent(people[selected].id));
      return '#' + parts.join('&');
    }
    function writeHash() {
      if (playing) return;
      clearTimeout(hashTimer);
      hashTimer = setTimeout(function () {
        var h = stateHash(); if (h === lastHash) return; lastHash = h;
        try { history.replaceState(null, '', h); } catch (e) {}
      }, 350);
    }
    function readHash() {
      var h = ''; try { h = String(window.location.hash || ''); } catch (e) { return false; }
      if (h.length < 3 || h === lastHash) return false;
      var q = {}; h.slice(1).split('&').forEach(function (kv) { var i = kv.indexOf('='); if (i > 0) { try { q[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1)); } catch (e) {} } });
      var y = parseInt(q.y, 10), v = viewById[q.v], g = gpos[q.g], pi = byId[q.s];
      if (isNaN(y) && !v && g == null && pi == null) return false;
      y = isNaN(y) ? Math.round(year) : Math.max(1, Math.min(END, y));
      lastHash = h;
      var keep = still; still = true;          // arriving by address is a cut, not a glide
      if (pi != null || g != null) goTo({ pi: pi, g: pi != null ? null : g, view: v }, y);
      else { if (v) { curView = v; baseDepth = viewLevel(v) ? 1 : 0; openG = -1; setBox(v.box, v.proj); resize(); buildEras(); viewButtons(); } year = y; lastKey = ''; update(false); showCrumb(); }
      still = keep;
      return true;
    }
    window.addEventListener('hashchange', readHash);
    window.addEventListener('resize', resize);
    showDetail(-1); resize(); update(false); readHash();
    window.__atlas = { state: function () { return { view: curView.id, year: year, open: openG >= 0 ? gkeys[openG] : '', W: W, H: H, cell: CELL, cells: GW * GH }; },
      setView: function (id) { if (viewById[id]) { var keep = still; still = true; setView(viewById[id]); viewButtons(); still = keep; } },
      setYear: function (y) { year = y; update(false); }, openGroup: function (id) { var keep = still; still = true; openGroup(gpos[id]); still = keep; },
      fieldMs: function (n) { var t0 = performance.now(); for (var i = 0; i < n; i++) paint(i * 0.04); var t1 = performance.now(); splat(); return [(t1 - t0) / n, performance.now() - t1]; },
      dark: function () { var d = 0, land = 0; splat(); for (var i = 0; i < landCell.length; i++) if (landCell[i]) { land++; if (lb1[i] < 0 || lw1[i] < 0.045) d++; } return [d, land]; } };
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load('700 12px "Space Grotesk"'), document.fonts.load('600 12px "Space Grotesk"'), document.fonts.load('500 12px Inter')])
        .then(function () { draw(performance.now()); }, function () {});
    }
    requestAnimationFrame(frame);
  };
})();
