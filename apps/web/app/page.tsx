"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Building2,
  CalendarClock,
  Camera,
  CheckCircle2,
  CircleDot,
  Database,
  GitBranch,
  Library,
  ListChecks,
  Paintbrush,
  Search,
  Sparkles,
  UploadCloud,
  Users,
} from "lucide-react";
import styles from "./page.module.css";

type ViewName = "Dashboard" | "Collection" | "Story Graph" | "Reading Orders" | "Recommendations";
type CollectionFilter = "Artist" | "Company" | "Title" | "Format" | "Year";

type ComicStyleProperties = CSSProperties & Record<`--${string}`, string>;

const metrics = [
  { label: "Issues Cataloged", value: "1,284", detail: "+38 this month", color: "#bc3143" },
  { label: "Storylines Linked", value: "216", detail: "73% coverage", color: "#216b9f" },
  { label: "Open Gaps", value: "42", detail: "12 high priority", color: "#c5902f" },
  { label: "Creators Tracked", value: "389", detail: "18 active runs", color: "#217b66" },
];

const recommendations = [
  {
    title: "Finish Morrison's New X-Men opening arc",
    reason: "You own #117-154, but #114-116 anchors the run and explains the shift in status quo.",
    tag: "Collect Next",
    confidence: "94%",
  },
  {
    title: "Read House of X / Powers of X before X-Men #1",
    reason: "Your Krakoa shelf starts after the setup. This reading order closes the context gap.",
    tag: "Read First",
    confidence: "91%",
  },
  {
    title: "Connect Civil War tie-ins by character path",
    reason: "Spider-Man, Cap, and Fantastic Four issues can be split into three cleaner paths.",
    tag: "Organize",
    confidence: "86%",
  },
];

const timeline = [
  { title: "House of X #1", meta: "Owned - Hickman, Larraz", status: "owned" },
  { title: "Powers of X #1", meta: "Owned - Hickman, Silva", status: "owned" },
  { title: "House of X #2", meta: "Missing - High story impact", status: "gap" },
  { title: "Powers of X #2", meta: "Recommended next read", status: "next" },
  { title: "X-Men #1", meta: "Owned - Starts Dawn of X", status: "owned" },
];

const coverData = [
  { abbr: "X", label: "X-Men", color: "#bc3143" },
  { abbr: "FF", label: "Fantastic Four", color: "#216b9f" },
  { abbr: "SM", label: "Spider-Man", color: "#bc3143" },
  { abbr: "CA", label: "Captain America", color: "#216b9f" },
  { abbr: "DD", label: "Daredevil", color: "#bc3143" },
  { abbr: "AV", label: "Avengers", color: "#c5902f" },
];

const collectionItems = [
  {
    title: "New X-Men",
    issue: "#114",
    artist: "Frank Quitely",
    company: "Marvel",
    format: "Single Issue",
    year: "2001",
    status: "Owned",
    color: "#bc3143",
  },
  {
    title: "Fantastic Four",
    issue: "Vol. 1",
    artist: "Jack Kirby",
    company: "Marvel",
    format: "Graphic Novel",
    year: "1961",
    status: "Wishlist",
    color: "#216b9f",
  },
  {
    title: "Batman: Year One",
    issue: "Deluxe",
    artist: "David Mazzucchelli",
    company: "DC",
    format: "Graphic Novel",
    year: "1987",
    status: "Owned",
    color: "#15171d",
  },
  {
    title: "Saga",
    issue: "#1",
    artist: "Fiona Staples",
    company: "Image",
    format: "Single Issue",
    year: "2012",
    status: "Owned",
    color: "#217b66",
  },
  {
    title: "Daredevil",
    issue: "#25",
    artist: "Marco Checchetto",
    company: "Marvel",
    format: "Single Issue",
    year: "2020",
    status: "Reading",
    color: "#c5902f",
  },
  {
    title: "Hellboy",
    issue: "Seed of Destruction",
    artist: "Mike Mignola",
    company: "Dark Horse",
    format: "Graphic Novel",
    year: "1994",
    status: "Owned",
    color: "#7b2f1d",
  },
];

const navItems: Array<{ icon: typeof Library; label: ViewName }> = [
  { icon: Library, label: "Dashboard" },
  { icon: Boxes, label: "Collection" },
  { icon: GitBranch, label: "Story Graph" },
  { icon: BookOpen, label: "Reading Orders" },
  { icon: Sparkles, label: "Recommendations" },
];

const collectionFilters: Array<{ label: CollectionFilter; icon: typeof Library }> = [
  { label: "Artist", icon: Paintbrush },
  { label: "Company", icon: Building2 },
  { label: "Title", icon: BookOpen },
  { label: "Format", icon: Boxes },
  { label: "Year", icon: CalendarClock },
];

export default function ComicDashboard() {
  const [activeNav, setActiveNav] = useState<ViewName>("Dashboard");

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>CV</div>
          <div>
            <strong>ComicVerse</strong>
            <span>AI Companion</span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Primary navigation">
          {navItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className={activeNav === label ? styles.navItemActive : styles.navItem}
              type="button"
              onClick={() => setActiveNav(label)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.syncPanel}>
          <Database size={16} />
          <div>
            <strong>RAG Index</strong>
            <span>Ready - embeddings synced for issues, creators, events and characters.</span>
          </div>
        </div>
      </aside>

      <main className={styles.content}>
        <Topbar activeView={activeNav} />
        {activeNav === "Dashboard" ? <DashboardView /> : null}
        {activeNav === "Collection" ? <CollectionView /> : null}
        {activeNav !== "Dashboard" && activeNav !== "Collection" ? (
          <PlaceholderView activeView={activeNav} />
        ) : null}
      </main>
    </div>
  );
}

function Topbar({ activeView }: { activeView: ViewName }) {
  const title =
    activeView === "Collection"
      ? "Browse and shape the library."
      : activeView === "Dashboard"
        ? "Map the collection. Surface what's next."
        : `${activeView} workspace`;

  return (
    <header className={styles.topbar}>
      <div>
        <p className={styles.eyebrow}>{activeView}</p>
        <h1>{title}</h1>
      </div>
      <div className={styles.actions}>
        <button className={styles.iconButton} type="button" aria-label="Search collection">
          <Search size={17} />
        </button>
        <button className={styles.secondaryButton} type="button">
          <UploadCloud size={16} />
          Import CSV
        </button>
        <button className={styles.primaryButton} type="button">
          <Camera size={16} />
          Scan Books
        </button>
      </div>
    </header>
  );
}

function DashboardView() {
  return (
    <>
      <section className={styles.metrics} aria-label="Collection metrics">
        {metrics.map((metric) => (
          <article
            className={styles.metric}
            key={metric.label}
            style={{ "--accent": metric.color } as ComicStyleProperties}
          >
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <div className={styles.workspace}>
        <section className={styles.panel}>
          <PanelHeader label="Shelf Intelligence" title="Recommended Next Moves">
            <button className={styles.textButton} type="button">
              View all <ArrowRight size={14} />
            </button>
          </PanelHeader>

          <div className={styles.recommendations}>
            {recommendations.map((item) => (
              <article className={styles.recommendation} key={item.title}>
                <div className={styles.recHeader}>
                  <span>{item.tag}</span>
                  <strong>{item.confidence}</strong>
                </div>
                <h3>{item.title}</h3>
                <p>{item.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <PanelHeader label="Reading Order" title="Krakoa Starter Path">
            <CalendarClock size={20} />
          </PanelHeader>

          <div className={styles.timeline}>
            {timeline.map((item) => (
              <article className={styles.timelineItem} key={item.title}>
                <span data-status={item.status}>
                  {item.status === "owned" ? <CheckCircle2 size={18} /> : <CircleDot size={18} />}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.meta}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.panelWide}>
          <PanelHeader label="Collection Graph" title="Books Connected to People, Events and Arcs">
            <Users size={20} />
          </PanelHeader>

          <div className={styles.graphGrid}>
            <div className={styles.coverStack}>
              {coverData.map((cover, index) => (
                <div
                  className={styles.cover}
                  key={cover.abbr}
                  style={{ "--cover": cover.color } as ComicStyleProperties}
                  title={cover.label}
                >
                  <span>#{index + 1}</span>
                  <strong>{cover.abbr}</strong>
                </div>
              ))}
            </div>

            <div className={styles.graphStats}>
              {[
                {
                  icon: ListChecks,
                  title: "Entity Extraction",
                  desc: "Creators, characters, events, teams and locations auto-linked from your issues.",
                },
                {
                  icon: GitBranch,
                  title: "Continuity Links",
                  desc: "Runs, arcs, crossovers, prelude issues and aftermath issues mapped together.",
                },
                {
                  icon: Sparkles,
                  title: "Recommendation Engine",
                  desc: "Reading paths and collection targets built from your owned-collection context.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <article key={title}>
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
    </>
  );
}

function CollectionView() {
  const [activeFilter, setActiveFilter] = useState<CollectionFilter>("Artist");

  const groups = useMemo(() => {
    const keyForFilter = activeFilter === "Format" ? "format" : activeFilter.toLowerCase();
    return collectionItems.reduce<Record<string, typeof collectionItems>>((result, item) => {
      const groupName = item[keyForFilter as keyof typeof item] as string;
      result[groupName] = [...(result[groupName] ?? []), item];
      return result;
    }, {});
  }, [activeFilter]);

  return (
    <section className={styles.collectionView}>
      <div className={styles.collectionToolbar}>
        <div>
          <p className={styles.sectionLabel}>Library View</p>
          <h2>Your Collection</h2>
        </div>
        <div className={styles.filterTabs} aria-label="Group collection by">
          {collectionFilters.map(({ label, icon: Icon }) => (
            <button
              className={activeFilter === label ? styles.filterTabActive : styles.filterTab}
              key={label}
              type="button"
              onClick={() => setActiveFilter(label)}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.collectionSummary}>
        <article>
          <span>Total Books</span>
          <strong>1,284</strong>
        </article>
        <article>
          <span>Single Issues</span>
          <strong>934</strong>
        </article>
        <article>
          <span>Graphic Novels</span>
          <strong>350</strong>
        </article>
      </div>

      <div className={styles.collectionLayout}>
        <aside className={styles.collectionGroups}>
          {Object.entries(groups).map(([groupName, items]) => (
            <button className={styles.groupButton} key={groupName} type="button">
              <span>{groupName}</span>
              <strong>{items.length}</strong>
            </button>
          ))}
        </aside>

        <div className={styles.collectionGrid}>
          {collectionItems.map((item) => (
            <article className={styles.collectionCard} key={`${item.title}-${item.issue}`}>
              <div className={styles.publisherRow}>
                <span className={styles.publisherLogo} data-company={item.company}>
                  {getPublisherLogoText(item.company)}
                </span>
              </div>
              <div
                className={styles.comicCover}
                style={{ "--book-color": item.color } as ComicStyleProperties}
                aria-label={`${item.title} cover`}
              >
                <span className={styles.coverIssue}>{item.issue}</span>
                <strong>{item.title}</strong>
                <small>{item.year}</small>
              </div>
              <div className={styles.collectionInfo}>
                <div className={styles.cardHeader}>
                  <span>{item.status}</span>
                  <small>{item.year}</small>
                </div>
                <h3>
                  {item.title} <span>{item.issue}</span>
                </h3>
                <p>{item.artist}</p>
                <dl>
                  <div>
                    <dt>Company</dt>
                    <dd>{item.company}</dd>
                  </div>
                  <div>
                    <dt>Format</dt>
                    <dd>{item.format}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function getPublisherLogoText(company: string) {
  const logoText: Record<string, string> = {
    Marvel: "MARVEL",
    DC: "DC",
    Image: "image",
    "Dark Horse": "DARK HORSE",
  };

  return logoText[company] ?? company;
}

function PlaceholderView({ activeView }: { activeView: Exclude<ViewName, "Dashboard" | "Collection"> }) {
  return (
    <section className={styles.placeholder}>
      <Sparkles size={22} />
      <h2>{activeView}</h2>
      <p>This section is ready for the next feature pass.</p>
    </section>
  );
}

function PanelHeader({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.panelHeader}>
      <div>
        <p className={styles.sectionLabel}>{label}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
