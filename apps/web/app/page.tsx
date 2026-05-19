"use client";

import { useState, type CSSProperties } from "react";
import {
  ArrowRight, BookOpen, Boxes, CalendarClock, Camera,
  CheckCircle2, CircleDot, Database, GitBranch, Library,
  ListChecks, Search, Sparkles, UploadCloud, Users
} from "lucide-react";

const metrics = [
  { label: "Issues Cataloged", value: "1,284", detail: "+38 this month", color: "#E8192C" },
  { label: "Storylines Linked", value: "216", detail: "73% coverage", color: "#0476F2" },
  { label: "Open Gaps", value: "42", detail: "12 high priority", color: "#F5A800" },
  { label: "Creators Tracked", value: "389", detail: "18 active runs", color: "#00A550" },
];

const recommendations = [
  {
    title: "Finish Morrison's New X-Men opening arc",
    reason: "You own #117–154, but #114–116 anchors the run and explains the shift in status quo.",
    tag: "Collect Next",
    confidence: "94%",
    accent: "#E8192C",
  },
  {
    title: "Read House of X / Powers of X before X-Men #1",
    reason: "Your Krakoa shelf starts after the setup. This reading order closes the context gap.",
    tag: "Read First",
    confidence: "91%",
    accent: "#0476F2",
  },
  {
    title: "Connect Civil War tie-ins by character path",
    reason: "Spider-Man, Cap, and Fantastic Four issues can be split into three cleaner paths.",
    tag: "Organize",
    confidence: "86%",
    accent: "#F5A800",
  },
];

const timeline = [
  { title: "House of X #1", meta: "Owned · Hickman, Larraz", status: "owned" },
  { title: "Powers of X #1", meta: "Owned · Hickman, Silva", status: "owned" },
  { title: "House of X #2", meta: "Missing · High story impact", status: "gap" },
  { title: "Powers of X #2", meta: "Recommended next read", status: "next" },
  { title: "X-Men #1", meta: "Owned · Starts Dawn of X", status: "owned" },
];

const coverData = [
  { abbr: "X", label: "X-Men", color: "#E8192C" },
  { abbr: "FF", label: "Fantastic Four", color: "#0476F2" },
  { abbr: "SM", label: "Spider-Man", color: "#E8192C" },
  { abbr: "CA", label: "Captain America", color: "#0476F2" },
  { abbr: "DD", label: "Daredevil", color: "#E8192C" },
  { abbr: "AV", label: "Avengers", color: "#F5A800" },
];

const navItems = [
  { icon: Library, label: "Dashboard", active: true },
  { icon: Boxes, label: "Collection" },
  { icon: GitBranch, label: "Story Graph" },
  { icon: BookOpen, label: "Reading Orders" },
  { icon: Sparkles, label: "Recommendations" },
];

// Halftone SVG pattern as data URI
const halftonePattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Ccircle cx='4' cy='4' r='1.2' fill='%23000' opacity='0.07'/%3E%3C/svg%3E")`;

type ComicStyleProperties = CSSProperties & Record<`--${string}`, string>;

export default function ComicDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Oswald:wght@400;500;600;700&family=Barlow+Condensed:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --red: #E8192C;
          --blue: #0476F2;
          --yellow: #F5A800;
          --green: #00A550;
          --black: #0D0D0D;
          --ink: #1A1A1A;
          --paper: #FDF6E3;
          --panel-bg: #FEFBF0;
          --border: 3px solid #0D0D0D;
          --border-thick: 4px solid #0D0D0D;
          --shadow: 4px 4px 0 #0D0D0D;
          --shadow-lg: 6px 6px 0 #0D0D0D;
          --font-display: 'Bangers', cursive;
          --font-head: 'Oswald', sans-serif;
          --font-body: 'Barlow Condensed', sans-serif;
        }

        .comic-shell {
          display: flex;
          height: 100vh;
          background: var(--paper);
          background-image: ${halftonePattern};
          font-family: var(--font-body);
          overflow: hidden;
          color: var(--ink);
        }

        /* ── SIDEBAR ── */
        .sidebar {
          width: 220px;
          min-width: 220px;
          background: var(--black);
          border-right: var(--border-thick);
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
          overflow: hidden;
        }
        .sidebar::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: ${halftonePattern};
          opacity: .4;
          pointer-events: none;
        }

        .brand {
          padding: 20px 16px 16px;
          border-bottom: 3px solid #333;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-mark {
          width: 42px; height: 42px;
          background: var(--red);
          border: 3px solid var(--yellow);
          border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display);
          font-size: 20px;
          color: #fff;
          letter-spacing: 1px;
          flex-shrink: 0;
          box-shadow: 3px 3px 0 var(--yellow);
        }
        .brand-text strong {
          display: block;
          font-family: var(--font-display);
          font-size: 18px;
          letter-spacing: 2px;
          color: #fff;
          line-height: 1;
        }
        .brand-text span {
          font-family: var(--font-body);
          font-size: 11px;
          color: #888;
          letter-spacing: .5px;
          text-transform: uppercase;
        }

        .nav {
          display: flex;
          flex-direction: column;
          padding: 12px 10px;
          gap: 4px;
          flex: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 2px;
          font-family: var(--font-head);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #aaa;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all .1s;
          position: relative;
          user-select: none;
        }
        .nav-item:hover {
          color: #fff;
          border-color: #444;
          background: #1a1a1a;
        }
        .nav-item.active {
          color: var(--yellow);
          border-color: var(--yellow);
          background: #111;
          box-shadow: 3px 3px 0 var(--yellow);
        }

        .sync-panel {
          margin: 12px;
          padding: 12px;
          background: #111;
          border: 2px solid #333;
          border-radius: 2px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .sync-panel svg { color: var(--green); flex-shrink: 0; margin-top: 2px; }
        .sync-panel strong {
          display: block;
          font-family: var(--font-head);
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--green);
        }
        .sync-panel span {
          font-size: 11px;
          color: #666;
          line-height: 1.4;
        }

        /* ── MAIN CONTENT ── */
        .content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: var(--border-thick);
          background: var(--black);
          gap: 16px;
          flex-wrap: wrap;
        }
        .topbar .eyebrow {
          font-family: var(--font-head);
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--yellow);
          margin-bottom: 4px;
        }
        .topbar h1 {
          font-family: var(--font-display);
          font-size: 28px;
          letter-spacing: 3px;
          color: #fff;
          line-height: 1;
          max-width: 480px;
          text-transform: uppercase;
        }
        .actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          padding-top: 4px;
        }
        .icon-btn {
          width: 38px; height: 38px;
          border: 2px solid #444;
          background: #1a1a1a;
          color: #aaa;
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all .1s;
        }
        .icon-btn:hover { border-color: var(--yellow); color: var(--yellow); }
        .btn-secondary {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px;
          border: 2px solid #555;
          background: #1a1a1a;
          color: #ccc;
          font-family: var(--font-head);
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: all .1s;
        }
        .btn-secondary:hover { border-color: #fff; color: #fff; }
        .btn-primary {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 18px;
          border: 3px solid var(--yellow);
          background: var(--red);
          color: #fff;
          font-family: var(--font-head);
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          box-shadow: 3px 3px 0 var(--yellow);
          transition: all .1s;
        }
        .btn-primary:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 var(--yellow); }
        .btn-primary:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 var(--yellow); }

        /* ── METRICS ── */
        .metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-bottom: var(--border-thick);
        }
        .metric {
          padding: 18px 20px;
          border-right: var(--border);
          position: relative;
          background: var(--panel-bg);
          overflow: hidden;
        }
        .metric:last-child { border-right: none; }
        .metric::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: var(--accent);
        }
        .metric-label {
          font-family: var(--font-head);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 6px;
        }
        .metric-value {
          font-family: var(--font-display);
          font-size: 38px;
          letter-spacing: 2px;
          color: var(--ink);
          line-height: 1;
          margin-bottom: 4px;
        }
        .metric-detail {
          font-family: var(--font-body);
          font-size: 12px;
          color: #888;
          font-style: italic;
        }

        /* ── WORKSPACE ── */
        .workspace {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          flex: 1;
        }

        /* Comic panel borders */
        .panel {
          border-right: var(--border);
          border-bottom: var(--border);
          padding: 20px;
          background: var(--panel-bg);
          position: relative;
        }
        .panel-wide {
          grid-column: 1 / -1;
          border-bottom: var(--border);
          padding: 20px;
          background: var(--panel-bg);
          position: relative;
        }
        .panel::after, .panel-wide::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: ${halftonePattern};
          opacity: .3;
          pointer-events: none;
        }

        .panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .section-label {
          font-family: var(--font-head);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .section-label::before {
          content: '';
          display: inline-block;
          width: 16px; height: 3px;
          background: var(--red);
        }
        .panel-header h2 {
          font-family: var(--font-display);
          font-size: 22px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--ink);
          line-height: 1.1;
        }
        .text-btn {
          display: flex; align-items: center; gap: 4px;
          font-family: var(--font-head);
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--blue);
          background: none;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          padding-top: 2px;
        }
        .text-btn:hover { color: var(--red); }

        /* ── RECOMMENDATIONS ── */
        .recommendations {
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          z-index: 1;
        }
        .rec-card {
          border: var(--border);
          padding: 12px 14px;
          background: #fff;
          position: relative;
          cursor: pointer;
          transition: transform .1s, box-shadow .1s;
          box-shadow: var(--shadow);
        }
        .rec-card:hover { transform: translate(-2px,-2px); box-shadow: var(--shadow-lg); }
        .rec-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 5px;
          background: var(--accent);
        }
        .rec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          padding-left: 8px;
        }
        .rec-tag {
          font-family: var(--font-head);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--accent);
          background: var(--accent-bg);
          padding: 2px 8px;
          border: 1.5px solid var(--accent);
        }
        .rec-confidence {
          font-family: var(--font-display);
          font-size: 18px;
          letter-spacing: 1px;
          color: var(--accent);
        }
        .rec-title {
          font-family: var(--font-head);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: .5px;
          color: var(--ink);
          margin-bottom: 4px;
          padding-left: 8px;
        }
        .rec-reason {
          font-family: var(--font-body);
          font-size: 12px;
          color: #555;
          line-height: 1.5;
          padding-left: 8px;
        }

        /* ── TIMELINE ── */
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
          z-index: 1;
        }
        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 12px;
          border: var(--border);
          margin-bottom: -3px;
          background: #fff;
          position: relative;
          transition: background .1s;
        }
        .timeline-item:hover { background: #fffbf0; }
        .timeline-item[data-status="owned"] { border-left: 5px solid var(--green); }
        .timeline-item[data-status="gap"] { border-left: 5px solid var(--red); background: #fff5f5; }
        .timeline-item[data-status="next"] { border-left: 5px solid var(--blue); background: #f0f7ff; }
        .timeline-icon[data-status="owned"] { color: var(--green); }
        .timeline-icon[data-status="gap"] { color: var(--red); }
        .timeline-icon[data-status="next"] { color: var(--blue); }
        .timeline-title {
          font-family: var(--font-head);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .5px;
          color: var(--ink);
          line-height: 1.2;
        }
        .timeline-meta {
          font-family: var(--font-body);
          font-size: 11px;
          color: #777;
          font-style: italic;
        }

        /* ── GRAPH PANEL ── */
        .graph-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 24px;
          align-items: start;
          position: relative;
          z-index: 1;
        }
        .cover-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          max-width: 280px;
        }
        .cover {
          width: 76px;
          height: 112px;
          border: var(--border-thick);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 8px;
          position: relative;
          cursor: pointer;
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: transform .1s, box-shadow .1s;
        }
        .cover:hover { transform: translate(-2px,-2px) rotate(-1deg); box-shadow: var(--shadow-lg); }
        .cover-bg {
          position: absolute;
          inset: 0;
          background: var(--cover-color);
          background-image: ${halftonePattern};
        }
        .cover-num {
          position: absolute;
          top: 6px; left: 8px;
          font-family: var(--font-head);
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,.7);
          letter-spacing: 1px;
        }
        .cover-abbr {
          position: relative;
          z-index: 1;
          font-family: var(--font-display);
          font-size: 22px;
          letter-spacing: 2px;
          color: #fff;
          text-shadow: 2px 2px 0 rgba(0,0,0,.5);
          line-height: 1;
        }

        .graph-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .stat-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          border: var(--border);
          background: #fff;
          box-shadow: var(--shadow);
          position: relative;
        }
        .stat-row svg { color: var(--red); flex-shrink: 0; margin-top: 2px; }
        .stat-row strong {
          font-family: var(--font-head);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .5px;
          display: block;
          margin-bottom: 2px;
        }
        .stat-row span {
          font-family: var(--font-body);
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }

        /* speech bubble callout */
        .bubble {
          background: var(--yellow);
          border: var(--border);
          padding: 8px 14px;
          font-family: var(--font-display);
          font-size: 20px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--ink);
          display: inline-block;
          box-shadow: var(--shadow);
          position: relative;
        }
        .bubble::after {
          content: '';
          position: absolute;
          bottom: -12px; left: 20px;
          border-left: 10px solid transparent;
          border-right: 6px solid transparent;
          border-top: 12px solid var(--ink);
        }
        .bubble::before {
          content: '';
          position: absolute;
          bottom: -8px; left: 22px;
          border-left: 8px solid transparent;
          border-right: 4px solid transparent;
          border-top: 10px solid var(--yellow);
          z-index: 1;
        }

        /* scrollbar */
        .content::-webkit-scrollbar { width: 6px; }
        .content::-webkit-scrollbar-track { background: var(--black); }
        .content::-webkit-scrollbar-thumb { background: #444; border-radius: 0; }
      `}</style>

      <div className="comic-shell">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">CV</div>
            <div className="brand-text">
              <strong>ComicVerse</strong>
              <span>AI Companion</span>
            </div>
          </div>

          <nav className="nav">
            {navItems.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`nav-item${activeNav === label ? " active" : ""}`}
                onClick={() => setActiveNav(label)}
              >
                <Icon size={16} />
                {label}
              </div>
            ))}
          </nav>

          <div className="sync-panel">
            <Database size={16} />
            <div>
              <strong>RAG Index</strong>
              <span>Ready — embeddings synced for issues, creators, events & characters.</span>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <section className="content">
          {/* Topbar */}
          <header className="topbar">
            <div>
              <p className="eyebrow">Dashboard</p>
              <h1>Map the collection. Surface what's next.</h1>
            </div>
            <div className="actions">
              <button className="icon-btn" aria-label="Search">
                <Search size={17} />
              </button>
              <button className="btn-secondary">
                <UploadCloud size={16} /> Import CSV
              </button>
              <button className="btn-primary">
                <Camera size={16} /> Scan Books
              </button>
            </div>
          </header>

          {/* Metrics */}
          <section className="metrics">
            {metrics.map((m) => (
              <article
                className="metric"
                key={m.label}
                style={{ "--accent": m.color } as ComicStyleProperties}
              >
                <div className="metric-label">{m.label}</div>
                <div className="metric-value">{m.value}</div>
                <div className="metric-detail">{m.detail}</div>
              </article>
            ))}
          </section>

          {/* Workspace panels */}
          <div className="workspace">
            {/* Recommendations */}
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="section-label">Shelf Intelligence</p>
                  <h2>Recommended Next Moves</h2>
                </div>
                <button className="text-btn">
                  View all <ArrowRight size={14} />
                </button>
              </div>
              <div className="recommendations">
                {recommendations.map((item) => (
                  <article
                    className="rec-card"
                    key={item.title}
                    style={{
                      "--accent": item.accent,
                      "--accent-bg": item.accent + "14",
                    } as ComicStyleProperties}
                  >
                    <div className="rec-header">
                      <span className="rec-tag">{item.tag}</span>
                      <span className="rec-confidence">{item.confidence}</span>
                    </div>
                    <h3 className="rec-title">{item.title}</h3>
                    <p className="rec-reason">{item.reason}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Reading order */}
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="section-label">Reading Order</p>
                  <h2>Krakoa Starter Path</h2>
                </div>
                <CalendarClock size={20} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <span className="bubble">Issue Tracker</span>
              </div>
              <div style={{ marginTop: 20 }}>
                <div className="timeline">
                  {timeline.map((item) => (
                    <article
                      className="timeline-item"
                      key={item.title}
                      data-status={item.status}
                    >
                      <span
                        className="timeline-icon"
                        data-status={item.status}
                      >
                        {item.status === "owned"
                          ? <CheckCircle2 size={18} />
                          : <CircleDot size={18} />}
                      </span>
                      <div>
                        <div className="timeline-title">{item.title}</div>
                        <div className="timeline-meta">{item.meta}</div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Graph panel full width */}
            <section className="panel-wide">
              <div className="panel-header">
                <div>
                  <p className="section-label">Collection Graph</p>
                  <h2>Books Connected to People, Events & Arcs</h2>
                </div>
                <Users size={20} />
              </div>
              <div className="graph-grid">
                <div className="cover-stack">
                  {coverData.map((c, i) => (
                    <div
                      className="cover"
                      key={c.abbr}
                      style={{ "--cover-color": c.color } as ComicStyleProperties}
                      title={c.label}
                    >
                      <div className="cover-bg" />
                      <span className="cover-num">#{i + 1}</span>
                      <span className="cover-abbr">{c.abbr}</span>
                    </div>
                  ))}
                </div>
                <div className="graph-stats">
                  {[
                    {
                      icon: ListChecks,
                      title: "Entity Extraction",
                      desc: "Creators, characters, events, teams, locations auto-linked from your issues.",
                    },
                    {
                      icon: GitBranch,
                      title: "Continuity Links",
                      desc: "Runs, arcs, crossovers, prelude issues, and aftermath issues mapped together.",
                    },
                    {
                      icon: Sparkles,
                      title: "Recommendation Engine",
                      desc: "Reading paths and collection targets built from your owned-collection context.",
                    },
                  ].map(({ icon: Icon, title, desc }) => (
                    <article className="stat-row" key={title}>
                      <Icon size={18} />
                      <div>
                        <strong>{title}</strong>
                        <span>{desc}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}
