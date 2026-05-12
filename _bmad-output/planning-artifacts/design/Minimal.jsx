// Variation 2 — Technical Minimal (Linear/Vercel territory)
// Tight grid system, JetBrains Mono labels, dense info, sharp borders.

const C2 = window.MM_CONTENT;

const tmRoot = {
  width: "100%",
  background: "#0a0a0a",
  color: "#ededed",
  fontFamily: "'Inter', -apple-system, sans-serif",
  fontSize: 14,
  lineHeight: 1.55,
  letterSpacing: "-0.005em",
  position: "relative",
};

const mono = {
  fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
};

// ---------- MM mark (sharp geometric) ----------
function TMLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="#ededed" />
      <text
        x="50%"
        y="56%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="14"
        fontWeight="700"
        fill="#0a0a0a"
        letterSpacing="-1"
      >
        MM
      </text>
    </svg>
  );
}

// ---------- Nav ----------
function TMNav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1f1f1f",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <TMLogo size={28} />
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>Michael Mann</span>
        <span style={{ ...mono, fontSize: 11, color: "#666", padding: "2px 8px", border: "1px solid #1f1f1f", borderRadius: 4 }}>
          v2026.1
        </span>
      </div>
      <div style={{ ...mono, display: "flex", gap: 24, fontSize: 12, color: "#888" }}>
        {["about", "work", "projects", "stack", "contact"].map((s) => (
          <a key={s} style={{ color: "inherit", textDecoration: "none" }}>
            <span style={{ color: "#666" }}>$ </span>cd ./{s}
          </a>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ ...mono, fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7eb389", boxShadow: "0 0 8px #7eb389" }} />
          available
        </span>
        <a
          href={`mailto:${C2.meta.email}`}
          style={{
            background: "#ededed",
            color: "#0a0a0a",
            padding: "7px 14px",
            fontSize: 12,
            fontWeight: 500,
            textDecoration: "none",
            borderRadius: 6,
          }}
        >
          Get in touch →
        </a>
      </div>
    </nav>
  );
}

// ---------- Grid backdrop wrapper ----------
function GridSection({ children, label, idx, padded = true, style = {} }) {
  return (
    <section
      style={{
        borderBottom: "1px solid #1f1f1f",
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 32,
          borderRight: "1px solid #1f1f1f",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 32,
          borderLeft: "1px solid #1f1f1f",
        }}
      />
      {label && (
        <div
          style={{
            ...mono,
            position: "absolute",
            top: 24,
            left: 12,
            fontSize: 10,
            color: "#666",
            transform: "rotate(-90deg)",
            transformOrigin: "left top",
            whiteSpace: "nowrap",
            letterSpacing: "0.1em",
          }}
        >
          {idx} ↗ {label}
        </div>
      )}
      <div style={{ padding: padded ? "96px 80px" : 0, position: "relative" }}>{children}</div>
    </section>
  );
}

// ---------- Hero ----------
function TMHero() {
  const { hero, meta } = C2;
  return (
    <GridSection label="HERO" idx="00" style={{ paddingTop: 60 }}>
      <div style={{ ...mono, fontSize: 11, color: "#666", marginBottom: 28, display: "flex", gap: 18 }}>
        <span>$ whoami</span>
        <span style={{ color: "#444" }}>→</span>
        <span style={{ color: "#888" }}>michael-mann · senior-frontend-engineer · ashdod.il</span>
      </div>

      <h1
        style={{
          fontSize: 84,
          fontWeight: 600,
          lineHeight: 0.98,
          letterSpacing: "-0.04em",
          margin: 0,
          maxWidth: 1180,
          color: "#fafafa",
        }}
      >
        Senior frontend engineer
        <br />
        building <span style={{ color: "#d4a574" }}>production&nbsp;SaaS</span>
        <br />
        for global brands.
      </h1>

      <p
        style={{
          fontSize: 17,
          lineHeight: 1.55,
          color: "#a3a3a3",
          marginTop: 32,
          maxWidth: 720,
        }}
      >
        {hero.sub}
      </p>

      {/* Meta strip */}
      <div
        style={{
          marginTop: 56,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          border: "1px solid #1f1f1f",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {hero.meta.map(([k, v], i) => (
          <div
            key={k}
            style={{
              padding: "18px 22px",
              borderRight: i < hero.meta.length - 1 ? "1px solid #1f1f1f" : "none",
              background: "rgba(255,255,255,0.01)",
            }}
          >
            <div style={{ ...mono, fontSize: 10, color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
              {String(i + 1).padStart(2, "0")} / {k}
            </div>
            <div style={{ fontSize: 15, color: "#ededed", fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ marginTop: 32, display: "flex", gap: 10 }}>
        <a
          href={`mailto:${meta.email}`}
          style={{
            background: "#ededed",
            color: "#0a0a0a",
            padding: "11px 20px",
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
            borderRadius: 6,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Start a conversation
          <span style={{ ...mono, fontSize: 12 }}>→</span>
        </a>
        <a
          href="#work"
          style={{
            color: "#ededed",
            padding: "11px 20px",
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
            borderRadius: 6,
            border: "1px solid #2a2a2a",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          View work
        </a>
        <a
          href={meta.linkedin}
          style={{
            color: "#888",
            padding: "11px 20px",
            fontSize: 13,
            textDecoration: "none",
            borderRadius: 6,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          LinkedIn
          <span style={mono}>↗</span>
        </a>
      </div>
    </GridSection>
  );
}

// ---------- Client logos as wordmarks grid ----------
function TMClients() {
  return (
    <section style={{ borderBottom: "1px solid #1f1f1f", padding: "32px 0", background: "#080808" }}>
      <div style={{ padding: "0 80px 20px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ ...mono, fontSize: 11, color: "#666" }}>// clients.shipped_to</span>
        <span style={{ ...mono, fontSize: 11, color: "#666" }}>4 maisons · via Balink</span>
      </div>
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            gap: 80,
            animation: "tm-marquee 32s linear infinite",
            width: "max-content",
            alignItems: "center",
            padding: "20px 0",
          }}
        >
          {[...C2.clients, ...C2.clients, ...C2.clients].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 44,
                  fontWeight: 400,
                  color: "#fafafa",
                  letterSpacing: "0.04em",
                  fontStyle: "italic",
                }}
              >
                {b.name}
              </span>
              <span style={{ ...mono, fontSize: 10, color: "#555", letterSpacing: "0.1em" }}>·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Section heading ----------
function TMSectionHead({ label, heading, sub, idx }) {
  return (
    <div style={{ marginBottom: 56, display: "grid", gridTemplateColumns: "auto 1fr", gap: 48, alignItems: "start" }}>
      <div style={{ ...mono, fontSize: 11, color: "#666", paddingTop: 8 }}>
        <div style={{ color: "#d4a574" }}>{idx}</div>
        <div style={{ marginTop: 6, letterSpacing: "0.1em" }}>{label.split(" — ")[1] || label}</div>
      </div>
      <div>
        <h2 style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0, color: "#fafafa" }}>
          {heading}
        </h2>
        {sub && <p style={{ fontSize: 16, color: "#a3a3a3", margin: "16px 0 0", maxWidth: 640 }}>{sub}</p>}
      </div>
    </div>
  );
}

// ---------- About ----------
function TMAbout() {
  const { about } = C2;
  return (
    <GridSection label="ABOUT" idx="01">
      <TMSectionHead label={about.label} heading={about.heading} sub={about.sub} idx="01 / 05" />
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 1fr", gap: 48 }}>
        <div style={{ ...mono, fontSize: 11, color: "#666" }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ color: "#444" }}>const</span> bio = {"{"}
          </div>
          <div style={{ paddingLeft: 16, lineHeight: 1.8 }}>
            <div>experience: <span style={{ color: "#d4a574" }}>'5+ yrs'</span>,</div>
            <div>scope: <span style={{ color: "#d4a574" }}>'arch → lead'</span>,</div>
            <div>focus: <span style={{ color: "#d4a574" }}>'SaaS'</span>,</div>
            <div>ships: <span style={{ color: "#d4a574" }}>true</span>,</div>
          </div>
          <div>{"}"}</div>
        </div>
        <div>
          {about.left.map((p, i) => (
            <p key={i} style={{ fontSize: 15, lineHeight: 1.65, color: "#cfcfcf", margin: i === 0 ? 0 : "20px 0 0" }}>
              {p}
            </p>
          ))}
        </div>
        <div>
          {about.right.map((p, i) => (
            <p key={i} style={{ fontSize: 15, lineHeight: 1.65, color: "#cfcfcf", margin: i === 0 ? 0 : "20px 0 0" }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </GridSection>
  );
}

// ---------- Experience ----------
function TMRoleCard({ role, idx, total }) {
  return (
    <article
      style={{
        border: "1px solid #1f1f1f",
        borderRadius: 10,
        padding: 32,
        background: "rgba(255,255,255,0.015)",
        position: "relative",
      }}
    >
      <div
        style={{
          ...mono,
          position: "absolute",
          top: 16,
          right: 16,
          fontSize: 10,
          color: "#666",
          letterSpacing: "0.1em",
        }}
      >
        {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 6 }}>
        <h3 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, color: "#fafafa" }}>{role.company}</h3>
        <span style={{ ...mono, fontSize: 12, color: "#666" }}>·</span>
        <span style={{ ...mono, fontSize: 12, color: "#888" }}>{role.location}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32, gap: 24, flexWrap: "wrap" }}>
        <div style={{ fontSize: 14, color: "#a3a3a3" }}>{role.title}</div>
        <div style={{ ...mono, fontSize: 11, color: "#888" }}>
          <span style={{ color: "#666" }}>{role.dates}</span>
          <span style={{ color: "#444", margin: "0 8px" }}>·</span>
          <span style={{ color: "#d4a574" }}>{role.duration}</span>
        </div>
      </div>

      {/* KPIs as data row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
        {role.kpis.map(([v, l]) => (
          <div key={l} style={{ padding: 16, background: "#101010", borderRadius: 6, border: "1px solid #1a1a1a" }}>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: "#d4a574" }}>{v}</div>
            <div style={{ ...mono, fontSize: 10, color: "#888", marginTop: 4, letterSpacing: "0.06em" }}>{l}</div>
          </div>
        ))}
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {role.bullets.map((b, i) => (
          <li key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "#cfcfcf", display: "flex", gap: 14 }}>
            <span style={{ ...mono, color: "#444", flexShrink: 0, paddingTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {role.tags.map((t) => (
          <span
            key={t}
            style={{
              ...mono,
              fontSize: 11,
              color: "#a3a3a3",
              padding: "4px 10px",
              background: "#101010",
              border: "1px solid #1f1f1f",
              borderRadius: 4,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

function TMExperience() {
  const { experience } = C2;
  return (
    <GridSection label="EXPERIENCE" idx="02">
      <TMSectionHead label={experience.label} heading={experience.heading} sub={experience.sub} idx="02 / 05" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {experience.roles.map((r, i) => (
          <TMRoleCard key={r.company} role={r} idx={i} total={experience.roles.length} />
        ))}
      </div>
    </GridSection>
  );
}

// ---------- Projects ----------
function TMProjects() {
  const { projects } = C2;
  const [maqom, methodology] = projects.items;
  return (
    <GridSection label="PROJECTS" idx="03">
      <TMSectionHead label={projects.label} heading={projects.heading} sub={projects.sub} idx="03 / 05" />

      {/* Maqom — featured terminal-card */}
      <article
        style={{
          border: "1px solid #2a2a2a",
          borderRadius: 12,
          overflow: "hidden",
          background: "#0c0c0c",
          marginBottom: 16,
        }}
      >
        {/* Window header */}
        <div
          style={{
            padding: "12px 16px",
            background: "#0f0f0f",
            borderBottom: "1px solid #1f1f1f",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
          </div>
          <div style={{ ...mono, fontSize: 11, color: "#666", marginLeft: 12 }}>maqom.co</div>
          <div style={{ marginLeft: "auto", ...mono, fontSize: 11, color: "#7eb389", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7eb389" }} />
            {maqom.status}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 0 }}>
          <div style={{ padding: 36, borderRight: "1px solid #1f1f1f" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: "#fff",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="assets/maqom-logo-light.png" alt="Maqom" style={{ width: 36, height: 36 }} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>{maqom.name}</div>
                <div style={{ ...mono, fontSize: 11, color: "#888" }}>{maqom.url} · CRM</div>
              </div>
              <span
                style={{
                  ...mono,
                  fontSize: 10,
                  color: "#d4a574",
                  padding: "3px 8px",
                  border: "1px solid rgba(212,165,116,0.3)",
                  borderRadius: 4,
                  marginLeft: "auto",
                }}
              >
                FEATURED
              </span>
            </div>
            <h4 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 16px", color: "#fafafa" }}>
              {maqom.tagline}
            </h4>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "#a3a3a3", margin: 0 }}>{maqom.description}</p>
            <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {maqom.stack.map((s) => (
                <span
                  key={s}
                  style={{
                    ...mono,
                    fontSize: 11,
                    color: "#d4a574",
                    padding: "4px 10px",
                    background: "rgba(212,165,116,0.06)",
                    border: "1px solid rgba(212,165,116,0.2)",
                    borderRadius: 4,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div style={{ padding: 36, background: "#080808" }}>
            <div style={{ ...mono, fontSize: 11, color: "#666", marginBottom: 16 }}>// project_meta</div>
            <div style={{ display: "grid", gap: 14 }}>
              {[
                ["entity", "Maqom Software Ltd. (CY)"],
                ["billing", "Stripe · multi-currency"],
                ["markets", "EUR · USD · ILS"],
                ["distribution", "PWA + App Stores"],
                ["role", "Co-founder · frontend lead"],
                ["target", "Photographers · videographers · planners"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 16, fontSize: 13 }}>
                  <span style={{ ...mono, color: "#666", width: 110, flexShrink: 0 }}>{k}</span>
                  <span style={{ color: "#ededed" }}>{v}</span>
                </div>
              ))}
            </div>
            <a
              href="#"
              style={{
                marginTop: 28,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                ...mono,
                fontSize: 13,
                color: "#d4a574",
                textDecoration: "none",
                padding: "10px 14px",
                border: "1px solid rgba(212,165,116,0.3)",
                borderRadius: 6,
              }}
            >
              $ open maqom.co →
            </a>
          </div>
        </div>
      </article>

      {/* Methodology */}
      <article
        style={{
          border: "1px solid #1f1f1f",
          borderRadius: 10,
          padding: 32,
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 24, gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ ...mono, fontSize: 11, color: "#d4a574", marginBottom: 10 }}>
              // personal_framework · {methodology.status.toLowerCase().replace(/ /g, "_")}
            </div>
            <h4 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, color: "#fafafa" }}>
              {methodology.name}
            </h4>
          </div>
          <span style={{ fontSize: 14, color: "#a3a3a3", fontStyle: "italic", maxWidth: 420, textAlign: "right", lineHeight: 1.4 }}>
            "{methodology.tagline}"
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: "#cfcfcf", margin: 0 }}>{methodology.description}</p>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: "#cfcfcf", margin: 0 }}>{methodology.descriptionTwo}</p>
        </div>
        <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {methodology.stack.map((s) => (
            <span
              key={s}
              style={{
                ...mono,
                fontSize: 11,
                color: "#a3a3a3",
                padding: "4px 10px",
                background: "#101010",
                border: "1px solid #1f1f1f",
                borderRadius: 4,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </article>
    </GridSection>
  );
}

// ---------- Stack ----------
function TMStack() {
  const { stack } = C2;
  return (
    <GridSection label="STACK" idx="04">
      <TMSectionHead label={stack.label} heading={stack.heading} sub={stack.sub} idx="04 / 05" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {stack.groups.map((g, gi) => (
          <div key={g.title} style={{ border: "1px solid #1f1f1f", borderRadius: 10, padding: 24, background: "rgba(255,255,255,0.015)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "#fafafa" }}>{g.title}</h4>
              <span style={{ ...mono, fontSize: 11, color: "#666" }}>
                {String(g.items.length).padStart(2, "0")}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {g.items.map((item) => (
                <span
                  key={item}
                  style={{
                    ...mono,
                    fontSize: 11,
                    color: "#cfcfcf",
                    padding: "5px 10px",
                    background: "#101010",
                    border: "1px solid #1a1a1a",
                    borderRadius: 4,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GridSection>
  );
}

// ---------- AI ----------
function TMAI() {
  const { ai } = C2;
  return (
    <GridSection label="AI" idx="04.5" style={{ background: "#070707" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 64, alignItems: "start" }}>
        <div>
          <div style={{ ...mono, fontSize: 11, color: "#d4a574", marginBottom: 14, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            // ai_agentic_engineering
          </div>
          <h2 style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0, color: "#fafafa" }}>
            Shipping with <span style={{ color: "#d4a574" }}>agents</span>,
            <br />
            not just <span style={{ color: "#d4a574" }}>for</span> them.
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: "#a3a3a3", marginTop: 24 }}>{ai.body}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {ai.tools.map((t, i) => (
            <div
              key={t.name}
              style={{
                padding: 24,
                border: "1px solid #1f1f1f",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                position: "relative",
              }}
            >
              <div style={{ ...mono, fontSize: 10, color: "#d4a574", marginBottom: 14, letterSpacing: "0.1em" }}>
                0{i + 1} ↗
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, color: "#fafafa", letterSpacing: "-0.01em" }}>{t.name}</div>
              <div style={{ fontSize: 13, color: "#a3a3a3", lineHeight: 1.55 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </GridSection>
  );
}

// ---------- Contact ----------
function TMContact() {
  const { contact, meta, footer } = C2;
  return (
    <GridSection label="CONTACT" idx="05">
      <TMSectionHead label={contact.label} heading={contact.heading} sub={contact.sub} idx="05 / 05" />
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "stretch" }}>
        <div
          style={{
            border: "1px solid #2a2a2a",
            borderRadius: 12,
            padding: 36,
            background: "linear-gradient(135deg, rgba(212,165,116,0.08), rgba(212,165,116,0.02))",
          }}
        >
          <div style={{ ...mono, fontSize: 11, color: "#d4a574", marginBottom: 14 }}>// primary_cta</div>
          <h3 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, color: "#fafafa" }}>
            Drop me a line.
          </h3>
          <p style={{ fontSize: 14, color: "#a3a3a3", marginTop: 10 }}>I respond within 24 hours.</p>
          <a
            href={`mailto:${meta.email}`}
            style={{
              marginTop: 28,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "#ededed",
              color: "#0a0a0a",
              padding: "14px 22px",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            {meta.email}
            <span style={{ ...mono }}>→</span>
          </a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["LinkedIn", meta.linkedinShort, meta.linkedin, "↗"],
            ["Phone", meta.phone, `tel:${meta.phone}`, "📞"],
            ["Location", meta.location, null, "◎"],
            ["Languages", meta.languages, null, "✶"],
          ].map(([k, v, href, ico]) => (
            <a
              key={k}
              href={href || undefined}
              style={{
                border: "1px solid #1f1f1f",
                borderRadius: 8,
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textDecoration: "none",
                color: "#ededed",
                background: "rgba(255,255,255,0.015)",
              }}
            >
              <div>
                <div style={{ ...mono, fontSize: 10, color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
                  {k}
                </div>
                <div style={{ fontSize: 14 }}>{v}</div>
              </div>
              <span style={{ ...mono, color: "#666" }}>{ico}</span>
            </a>
          ))}
        </div>
      </div>

      <footer
        style={{
          marginTop: 80,
          paddingTop: 28,
          borderTop: "1px solid #1f1f1f",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          ...mono,
          fontSize: 11,
          color: "#555",
        }}
      >
        <span>{footer}</span>
        <span>
          built with care · ashdod ↗ everywhere
        </span>
      </footer>
    </GridSection>
  );
}

// ---------- Root ----------
function TechnicalMinimal() {
  return (
    <div style={tmRoot}>
      <style>{`
        @keyframes tm-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
      <TMNav />
      <TMHero />
      <TMClients />
      <TMAbout />
      <TMExperience />
      <TMProjects />
      <TMStack />
      <TMAI />
      <TMContact />
    </div>
  );
}

window.TechnicalMinimal = TechnicalMinimal;
