// Lambda landing page — React app
const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "warm",
  "hero": "split",
  "displayFont": "Instrument Serif",
  "showBeta": true
} /*EDITMODE-END*/;

const FONTS = {
  "Instrument Serif": '"Instrument Serif", "Times New Roman", serif',
  "Fraunces": '"Fraunces", serif',
  "Geist Mono": '"Geist Mono", ui-monospace, monospace',
  "Space Grotesk": '"Space Grotesk", ui-sans-serif, sans-serif'
};

// Windows-only build for now.
const OS = "Windows";
const INSTALLER_URL = "https://github.com/cattiskatt/lambda/releases/tag/releasse";
const INSTALLER_SIZE = "94 MB";

// ── Icons ───────────────────────────────────────────────────
const Icon = {
  Apple: (p) =>
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.7-1.8-3.3-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.7 1.1 8.9.8 1.1 1.7 2.2 2.9 2.2 1.2 0 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.2-2.6-.1 0-2.6-1-2.6-3.3zM14 5.4c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.6-1 2.6 1 .1 2-.5 2.7-1.2z" />
    </svg>,

  Win: (p) =>
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M3 5.5 11 4v8H3V5.5zm0 13L11 20v-8H3v6.5zM12 12h9v9.5l-9-1.5V12zm0-9 9-1.5V12h-9V3z" />
    </svg>,

  Linux: (p) =>
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2c-2.4 0-3.7 2.3-3.7 5.4 0 1.5.5 2.7.9 3.6.5 1 .8 1.7.5 2.7-.7 2.3-3.2 4-3.2 6.4 0 1.4 1 2.4 2.5 2.4 1.7 0 1.9-1.2 4-1.2s2.3 1.2 4 1.2c1.5 0 2.5-1 2.5-2.4 0-2.4-2.5-4.1-3.2-6.4-.3-1 0-1.7.5-2.7.4-.9.9-2.1.9-3.6C15.7 4.3 14.4 2 12 2zm-1.6 4.4c.5 0 1 .5 1 1.1 0 .3-.1.5-.2.7-.1-.1-.3-.2-.6-.2-.4 0-.7.2-.9.5-.1-.2-.2-.5-.2-.9 0-.7.5-1.2.9-1.2zm3.2 0c.5 0 .9.5.9 1.2 0 .4-.1.7-.2.9-.2-.3-.5-.5-.9-.5-.3 0-.5.1-.6.2-.1-.2-.2-.5-.2-.7 0-.6.5-1.1 1-1.1zM12 9.5c.7 0 1.7.4 1.7 1 0 .4-.5.6-.9.8-.4.2-.7.3-.8.3-.1 0-.4-.1-.8-.3-.4-.2-.9-.4-.9-.8 0-.6 1-1 1.7-1z" />
    </svg>,

  Play: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z" /></svg>,
  Pause: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>,
  Prev: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>,
  Next: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" /></svg>,
  Shuffle: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m18 14 4 4-4 4" /><path d="m18 2 4 4-4 4" /><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" /><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" /><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" /></svg>,
  Repeat: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg>,
  Vol: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>,
  Arrow: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>,
  Down: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>,
  Github: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1 .8-.2 1.7-.3 2.5-.3.9 0 1.7.1 2.5.3 1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.7c0 .3.2.6.7.5 4-1.3 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2z" /></svg>
};

// ── Tracklist data ──────────────────────────────────────────
const TRACKS = [
{ num: "01", title: "Recursive Hymn", artist: "Yiruma & Friends", duration: "3:48", spec: "FLAC · 24/96" },
{ num: "02", title: "Closure", artist: "Hatchet Theory", duration: "5:12", spec: "FLAC · 24/96" },
{ num: "03", title: "Beta Reduction", artist: "Erik Truffaz Quartet", duration: "6:04", spec: "FLAC · 16/44" },
{ num: "04", title: "Currying Light", artist: "Susuyu Tanaka", duration: "4:22", spec: "ALAC · 24/192" },
{ num: "05", title: "Free Variable", artist: "Mira Calix", duration: "7:33", spec: "WAV · 24/96" },
{ num: "06", title: "Eta Conversion", artist: "Murcof", duration: "5:48", spec: "DSD · 64" }];


// ── Header ──────────────────────────────────────────────────
function Nav({ showBeta }) {
  return (
    <header className="nav">
      <div className="nav-mark">
        <span className="glyph">λ</span>
        <span>Lambda</span>
        {showBeta && <span className="ver">v0.9.4 · BETA</span>}
      </div>
      <nav className="nav-links">
        <a href="#features">Features</a>
        <a href="#shortcuts">Shortcuts</a>
        <a href="#download">Download</a>
        <a href="#changelog">Changelog</a>
        <a href="#" aria-label="GitHub" style={{ display: "inline-flex" }}>
          <Icon.Github style={{ width: 18, height: 18 }} />
        </a>
      </nav>
      <a href={INSTALLER_URL} download className="nav-cta">
        Get for Windows <Icon.Down style={{ width: 13, height: 13 }} />
      </a>
    </header>);

}

// ── Hero variants ───────────────────────────────────────────
function HeroSplit() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span className="dot" />
              <span className="eyebrow">v0.9.4 — out now</span>
            </div>
            <h1 className="hero-title" style={{ fontFamily: "\"Times New Roman\"" }}>
              <span className="hero-glyph">λ</span>ambda — a
              <br />
              quieter way<br />
              to play.
            </h1>
            <p className="hero-tagline">
              A local-first music player for people who still keep a folder
              called <code style={{ fontFamily: "var(--mono)", fontSize: "0.9em", color: "var(--fg)" }}>~/Music</code>.
              Lossless, gapless, &amp; never asks for an account.
            </p>
            <div className="cta-row">
              <a className="btn-primary" href={INSTALLER_URL} download>
                <Icon.Win className="platform-ico" />
                Download for Windows
                <span className="meta">{INSTALLER_SIZE}</span>
              </a>
            </div>
            <div className="hero-meta">
              <div><b>FREE</b> &amp; OPEN SOURCE</div>
              <div><b>MIT</b> LICENSE</div>
              <div><b>NO</b> TELEMETRY</div>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-glow" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <PlayerWindow compact />
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function HeroWordmark() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-eyebrow">
          <span className="dot" />
          <span className="eyebrow">v0.9.4 — quieter listening, nicely rendered.</span>
        </div>
        <div className="hero-wordmark-row">
          <h1 className="hero-wordmark"><span className="hero-glyph">λ</span>ambda</h1>
          <p className="hero-wordmark-tag">
            A small, local-first music player.<br />
            Built for people with a folder<br />
            called <code style={{ fontFamily: "var(--mono)", fontSize: "0.95em" }}>~/Music</code>.
          </p>
        </div>
        <div className="cta-row" style={{ marginBottom: 60 }}>
          <a className="btn-primary" href={INSTALLER_URL} download>
            <Icon.Win className="platform-ico" />
            Download for Windows
            <span className="meta">{INSTALLER_SIZE}</span>
          </a>
        </div>
        <PlayerWindow />
      </div>
    </section>);

}

function HeroVisualizer() {
  const bars = useMemo(() => Array.from({ length: 56 }, (_, i) => ({
    delay: i * 0.07 % 1.2,
    h: 0.2 + Math.abs(Math.sin(i * 0.7)) * 0.8
  })), []);
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span className="dot" />
              <span className="eyebrow">now spinning · 24-bit / 96 kHz</span>
            </div>
            <h1 className="hero-title">
              Listen <em>louder</em><br />
              by listening<br />
              <span className="hero-glyph">λ</span> closer.
            </h1>
            <p className="hero-tagline">
              Lambda decodes lossless audio the long way around — sample-accurate,
              gapless, no resampling unless you ask.
            </p>
            <div className="cta-row">
              <a className="btn-primary" href={INSTALLER_URL} download>
                <Icon.Win className="platform-ico" />
                Download for Windows
                <span className="meta">{INSTALLER_SIZE}</span>
              </a>
            </div>
          </div>
          <div className="hero-art">
            <div className="viz">
              <div className="viz-bars">
                {bars.map((b, i) =>
                <i key={i} style={{
                  animationDelay: `-${b.delay}s`,
                  height: `${b.h * 100}%`
                }} />
                )}
              </div>
              <div className="viz-meta">
                <span>RECURSIVE HYMN — YIRUMA &amp; FRIENDS</span>
                <span>−6.2 dBFS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ── Player window (shared) ──────────────────────────────────
function PlayerWindow({ compact }) {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0.34);
  const [trackIdx, setTrackIdx] = useState(0);
  const [vol, setVol] = useState(0.72);
  const waveRef = useRef(null);

  // pre-compute waveform pattern
  const wave = useMemo(() => Array.from({ length: 96 }, (_, i) => {
    const seed = Math.sin(i * 0.31) * Math.cos(i * 0.13) * 0.5 + 0.5;
    const env = Math.sin(i / 96 * Math.PI) * 0.7 + 0.3;
    return Math.max(0.08, Math.min(1, seed * env + 0.1));
  }), []);

  // tick
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.0015;
        return next >= 1 ? 0 : next;
      });
    }, 80);
    return () => clearInterval(id);
  }, [playing]);

  const t = TRACKS[trackIdx];
  const totalSec = parseInt(t.duration.split(":")[0]) * 60 + parseInt(t.duration.split(":")[1]);
  const curSec = Math.floor(totalSec * progress);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const cursor = Math.floor(progress * wave.length);

  const seek = (e) => {
    const r = waveRef.current.getBoundingClientRect();
    setProgress(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
  };

  return (
    <div className="win">
      <div className="win-tb">
        <div className="lights"><i /><i /><i /></div>
        <div className="title">λambda — Library</div>
      </div>
      <div className="player">
        {!compact &&
        <aside className="player-side">
            <div className="label">Library</div>
            {TRACKS.map((tr, i) =>
          <div key={tr.num}
          className={"lib-item" + (i === trackIdx ? " active" : "")}
          onClick={() => {setTrackIdx(i);setProgress(0);setPlaying(true);}}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {tr.title}
                </span>
                <span className="num">{tr.duration}</span>
              </div>
          )}
          </aside>
        }
        <div className="player-main">
          <div className="np">
            <div className="np-art" />
            <div className="np-meta">
              <h3 className="np-track">{t.title}</h3>
              <div className="np-artist">{t.artist}</div>
              <div className="np-spec">{t.spec}</div>
            </div>
          </div>
          <div className="controls">
            <div className="wave" ref={waveRef} onClick={seek}>
              {wave.map((h, i) =>
              <i key={i}
              className={i < cursor ? "played" : i === cursor ? "cursor" : ""}
              style={{ height: `${h * 100}%` }} />
              )}
            </div>
            <div className="timeline">
              <span>{fmt(curSec)}</span>
              <span>−{fmt(totalSec - curSec)}</span>
            </div>
            <div className="transport">
              <button className="tbtn" aria-label="Shuffle"><Icon.Shuffle style={{ width: 16, height: 16 }} /></button>
              <button className="tbtn" aria-label="Previous"
              onClick={() => setTrackIdx((trackIdx - 1 + TRACKS.length) % TRACKS.length)}>
                <Icon.Prev style={{ width: 18, height: 18 }} />
              </button>
              <button className="tbtn play" aria-label={playing ? "Pause" : "Play"}
              onClick={() => setPlaying(!playing)}>
                {playing ? <Icon.Pause style={{ width: 20, height: 20 }} /> : <Icon.Play style={{ width: 22, height: 22 }} />}
              </button>
              <button className="tbtn" aria-label="Next"
              onClick={() => {setTrackIdx((trackIdx + 1) % TRACKS.length);setProgress(0);}}>
                <Icon.Next style={{ width: 18, height: 18 }} />
              </button>
              <button className="tbtn" aria-label="Repeat"><Icon.Repeat style={{ width: 16, height: 16 }} /></button>
            </div>
          </div>
          <div className="player-foot">
            <span>GAPLESS · ON</span>
            <div className="vol">
              <Icon.Vol style={{ width: 14, height: 14 }} />
              <div className="vol-track" onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setVol(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
              }}>
                <div className="vol-fill" style={{ width: `${vol * 100}%` }} />
              </div>
            </div>
            <span>EQ · FLAT</span>
          </div>
        </div>
      </div>
    </div>);

}

// ── Features ────────────────────────────────────────────────
const FEATURES = [
{ num: "01", title: "Local-first, by default",
  body: "Your library is just files in folders. Lambda watches them and gets out of the way. No cloud, no account, no telemetry.",
  badge: "100% offline" },
{ num: "02", title: "Lossless, all the way down",
  body: "FLAC, ALAC, WAV, AIFF, DSD64/128. Bit-perfect output to your DAC, sample-rate kept native unless you opt in.",
  badge: "Up to 24/192" },
{ num: "03", title: "Truly gapless",
  body: "Decoded ahead, crossed over at the sample boundary. Live albums, mixes and prog records the way they were mastered.",
  badge: "Sample-accurate" },
{ num: "04", title: "Parametric EQ",
  body: "Ten bands, drag the curve directly. Includes ReplayGain, room-correction import (.wav IRs) and per-output profiles.",
  badge: "10-band + IR" },
{ num: "05", title: "Global hotkeys",
  body: "Skip a track without leaving Figma. Re-bindable, scoped per-app, and they survive sleep — so does the queue.",
  badge: "OS-level" },
{ num: "06", title: "Desktop build",
  body: "Packaged as a Windows desktop app with local file access, real playback, and a native installer.",
  badge: INSTALLER_SIZE }];


function Features() {
  return (
    <section className="section" id="features">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num">§ 01 · Features</div>
            <h2 className="section-title">Built for the<br />way you <em>actually</em><br />listen.</h2>
          </div>
          <p className="section-lede">
            Lambda is a quiet, opinionated player. The defaults assume you have
            a real music collection and you'd like the software to respect it.
            Six things it does, very seriously.
          </p>
        </div>
        <div className="features">
          {FEATURES.map((f) =>
          <div key={f.num} className="feature">
              <div className="num">{f.num}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <div className="badge">{f.badge}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ── Shortcuts ───────────────────────────────────────────────
const SHORTCUTS = [
{ keys: ["Space"], desc: "Play / pause" },
{ keys: ["⇧", "←/→"], desc: "Skip track" },
{ keys: ["Ctrl", "F"], desc: "Search everything" },
{ keys: ["Ctrl", ","], desc: "Preferences" }];


function Shortcuts() {
  return (
    <section className="section" id="shortcuts">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num">§ 02 · Shortcuts</div>
            <h2 className="section-title">Everything by<br /><em>keyboard</em>.</h2>
          </div>
          <p className="section-lede">
            The mouse is for visitors. Every meaningful action in Lambda has a
            keystroke. Press <kbd style={{ fontSize: 11 }}>?</kbd> from anywhere
            to see the full sheet.
          </p>
        </div>
        <div className="shortcuts">
          {SHORTCUTS.map((s, i) =>
          <div key={i} className="shortcut">
              <span className="desc">{s.desc}</span>
              <span className="keys">
                {s.keys.map((k, j) => <kbd key={j}>{k}</kbd>)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ── Specs strip ─────────────────────────────────────────────
function Specs() {
  return (
    <section className="section" style={{ paddingTop: 0, borderTop: 0 }}>
      <div className="wrap">
        <div className="spec-grid">
          <div className="spec-cell">
            <div className="k">Cold start</div>
            <div className="v">187<small>ms</small></div>
          </div>
          <div className="spec-cell">
            <div className="k">Idle memory</div>
            <div className="v">42<small>MB</small></div>
          </div>
          <div className="spec-cell">
            <div className="k">Binary size</div>
            <div className="v">94<small>MB</small></div>
          </div>
          <div className="spec-cell">
            <div className="k">Build type</div>
            <div className="v">Electron</div>
          </div>
        </div>
      </div>
    </section>);

}

// ── Downloads ───────────────────────────────────────────────
const WIN_OPTIONS = [
  { name: "Installer (.exe)", size: INSTALLER_SIZE, href: INSTALLER_URL },
  { name: "Portable (.zip)", size: "Coming soon" },
  { name: "winget",          size: "Coming soon" },
];

function Downloads() {
  return (
    <section className="section" id="download">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num">§ 03 · Download</div>
            <h2 className="section-title">Get the<br /><em>Windows</em> build.</h2>
          </div>
          <p className="section-lede">
            The Windows installer is ready to download. macOS, Linux, portable
            builds, signing, and checksums are on the roadmap.
          </p>
        </div>
        <div className="downloads">
          <div className="dl-card featured">
            <Icon.Win className="os-ico" />
            <h3 className="os-name">Windows</h3>
            <div className="os-sub">Windows 10 / 11 · x64</div>
            <div className="dl-options">
              {WIN_OPTIONS.map((o) => {
                const Tag = o.href ? "a" : "div";
                return (
                <Tag key={o.name} className={"dl-opt" + (!o.href ? " disabled" : "")}
                  href={o.href} download={!!o.href ? true : undefined}
                  aria-disabled={!o.href ? "true" : undefined}>
                  <div className="left">
                    <div className="name">{o.name}</div>
                    <div className="size">{o.size}</div>
                  </div>
                  <Icon.Arrow className="arrow" style={{ width: 16, height: 16 }} />
                </Tag>
              );})}
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ── Footer ──────────────────────────────────────────────────
function Foot() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <h3 className="foot-mark"><span className="glyph">λ</span>ambda</h3>
            <p className="foot-tag">A local-first music player. Free, open source, made with quiet evenings in Champaign, IL.</p>
          </div>
          <div className="foot-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#download">Download</a></li>
              <li><a href="#changelog">Changelog</a></li>
              <li><a href="#">Roadmap</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Source</h4>
            <ul>
              <li><a href="#">GitHub repository</a></li>
              <li><a href="#">Issues</a></li>
              <li><a href="#">Contributing</a></li>
              <li><a href="#">License (MIT)</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Elsewhere</h4>
            <ul>
              <li><a href="#">@lambda.fm</a></li>
              <li><a href="#">Mailing list</a></li>
              <li><a href="#">Press kit</a></li>
              <li><a href="mailto:hi@lambda.fm">hi@lambda.fm</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-base">
          <span>© 2026 LAMBDA · MIT LICENSED</span>
          <span>BUILT 2026.05.04 · v0.9.4 · 7e3a2c1</span>
          <span>NO COOKIES · NO ANALYTICS · NO ACCOUNT</span>
        </div>
      </div>
    </footer>);

}

// ── Main app ────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply theme via data attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme);
  }, [t.theme]);

  // Apply display font
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--display", FONTS[t.displayFont] || FONTS["Instrument Serif"]
    );
  }, [t.displayFont]);

  const Hero = t.hero === "wordmark" ? HeroWordmark :
  t.hero === "viz" ? HeroVisualizer :
  HeroSplit;

  return (
    <>
      <Nav showBeta={t.showBeta} />
      <Hero />
      <Specs />
      <Features />
      <Shortcuts />
      <Downloads />
      <Foot />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio
            label="Tone"
            value={t.theme}
            options={[
            { value: "warm", label: "Warm" },
            { value: "cool", label: "Cool" },
            { value: "mono", label: "Mono" }]
            }
            onChange={(v) => setTweak("theme", v)} />
          
        </TweakSection>
        <TweakSection label="Hero">
          <TweakRadio
            label="Variant"
            value={t.hero}
            options={[
            { value: "split", label: "Split" },
            { value: "wordmark", label: "Type" },
            { value: "viz", label: "Viz" }]
            }
            onChange={(v) => setTweak("hero", v)} />
          
        </TweakSection>
        <TweakSection label="Typography">
          <TweakSelect
            label="Display font"
            value={t.displayFont}
            options={Object.keys(FONTS)}
            onChange={(v) => setTweak("displayFont", v)} />
          
        </TweakSection>
        <TweakSection label="Misc">
          <TweakToggle
            label="Show beta tag"
            value={t.showBeta}
            onChange={(v) => setTweak("showBeta", v)} />
          
        </TweakSection>
      </TweaksPanel>
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
