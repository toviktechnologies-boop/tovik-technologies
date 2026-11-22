import { useEffect, useState } from "react";
import {
  ArrowRight, ArrowUpRight, Menu, X, Code2, Layers3, Palette,
  ShoppingBag, ShieldCheck, Zap, CheckCircle2, Send, LayoutDashboard,
  LogOut, Mail, Phone, MapPin, Sparkles, ChevronRight
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const services = [
  { icon: Code2, number: "01", title: "Web Development", desc: "Fast, responsive websites that make your business look credible and turn visitors into customers.", tags: ["Business websites", "Landing pages", "SEO-ready builds"] },
  { icon: Layers3, number: "02", title: "Web Application Development", desc: "Purpose-built web applications that simplify workflows and help your team work smarter.", tags: ["Dashboards", "Portals", "Custom platforms"] },
  { icon: Palette, number: "03", title: "UI/UX Design", desc: "Thoughtful user experiences and clean interfaces that make every interaction feel effortless.", tags: ["UX research", "Wireframes", "Interface design"] },
  { icon: ShoppingBag, number: "04", title: "E-Commerce Solutions", desc: "Online stores designed to showcase products, support customers and grow with your business.", tags: ["Online stores", "Product catalogues", "Order flows"] }
];

const projects = [
  { type: "Photography", title: "Next Generation Studio", desc: "A visual-first studio experience with gallery and booking journeys.", color: "photo", mark: "NG" },
  { type: "E-Commerce", title: "Commerce Experience", desc: "A streamlined storefront concept built around product discovery.", color: "commerce", mark: "CX" },
  { type: "Corporate", title: "Business Website", desc: "A clear, confident digital presence for a growing business.", color: "corporate", mark: "BW" }
];

function Brand({ footer = false }) {
  return <a className={`brand ${footer ? "brand-footer" : ""}`} href="#home" aria-label="TOVIK Technologies home">
    <img src="/tovik-logo.jpeg" alt="TOVIK Technologies" />
  </a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [["Services", "#services"], ["Our work", "#work"], ["About", "#about"], ["Contact", "#contact"]];
  return <header className="header">
    <div className="container nav-wrap">
      <Brand />
      <nav className={open ? "nav nav-open" : "nav"}>
        {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Start a project <ArrowUpRight size={16} /></a>
      </nav>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
    </div>
  </header>;
}

function SectionHeading({ eyebrow, title, text, center = false }) {
  return <div className={`section-heading ${center ? "center" : ""}`}>
    <span className="eyebrow"><span />{eyebrow}</span>
    <h2>{title}</h2>
    {text && <p>{text}</p>}
  </div>;
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", service: "Web Development", message: "" });
  const [status, setStatus] = useState({ busy: false, text: "", error: false });
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setStatus({ busy: true, text: "", error: false });
    try {
      const response = await fetch(`${API}/enquiries`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not send your enquiry.");
      setStatus({ busy: false, text: "Thank you! Your enquiry has been received.", error: false });
      setForm({ name: "", email: "", service: "Web Development", message: "" });
    } catch (err) {
      setStatus({ busy: false, text: `${err.message} Make sure the backend is running.`, error: true });
    }
  }
  return <form className="contact-form" onSubmit={submit}>
    <div className="form-row">
      <label>Your name<input name="name" value={form.name} onChange={update} placeholder="Enter your name" required minLength="2" /></label>
      <label>Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="you@company.com" required /></label>
    </div>
    <label>What do you need?
      <select name="service" value={form.service} onChange={update}>
        {services.map(s => <option key={s.title}>{s.title}</option>)}
      </select>
    </label>
    <label>Tell us about your project<textarea name="message" value={form.message} onChange={update} placeholder="A few details about your idea..." rows="4" required minLength="10" /></label>
    <button className="button button-primary submit-button" disabled={status.busy}>{status.busy ? "Sending..." : "Send enquiry"} <Send size={17} /></button>
    {status.text && <p className={status.error ? "form-status error" : "form-status"}>{status.text}</p>}
    <small className="privacy-note"><ShieldCheck size={14} /> Your details are used only to respond to your enquiry.</small>
  </form>;
}

function AdminPanel({ onClose }) {
  const [token, setToken] = useState(localStorage.getItem("tovik_admin_token") || "");
  const [email, setEmail] = useState("admin@tovik.in");
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadLeads(authToken) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/admin/enquiries`, { headers: { Authorization: `Bearer ${authToken}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to load enquiries.");
      setLeads(data.enquiries || []);
    } catch (e) { setError(e.message); setToken(""); localStorage.removeItem("tovik_admin_token"); }
    finally { setLoading(false); }
  }
  useEffect(() => { if (token) loadLeads(token); }, []);
  async function login(e) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed.");
      localStorage.setItem("tovik_admin_token", data.token); setToken(data.token); await loadLeads(data.token);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }
  function logout() { localStorage.removeItem("tovik_admin_token"); setToken(""); setLeads([]); }
  return <div className="admin-overlay" role="dialog" aria-modal="true">
    <div className="admin-panel">
      <div className="admin-top"><div><span className="eyebrow"><span /> PRIVATE AREA</span><h2>Admin dashboard</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X /></button></div>
      {!token ? <form className="admin-login" onSubmit={login}>
        <p>Sign in to view website enquiries.</p>
        <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
        <button className="button button-primary" disabled={loading}>{loading ? "Signing in..." : "Sign in"} <ArrowRight size={16} /></button>
        {error && <p className="form-status error">{error}</p>}
      </form> : <div className="leads-area">
        <div className="leads-toolbar"><p>{leads.length} {leads.length === 1 ? "enquiry" : "enquiries"}</p><button className="text-button" onClick={logout}><LogOut size={15} /> Sign out</button></div>
        {loading ? <p>Loading enquiries...</p> : leads.length ? leads.map(lead => <article className="lead-card" key={lead.id}>
          <div className="lead-card-top"><strong>{lead.name}</strong><span>{new Date(lead.createdAt).toLocaleString()}</span></div>
          <a href={`mailto:${lead.email}`}>{lead.email}</a><p className="lead-service">{lead.service}</p><p>{lead.message}</p>
        </article>) : <div className="empty-state"><Mail size={28} /><h3>No enquiries yet</h3><p>New contact form submissions will appear here.</p></div>}
        {error && <p className="form-status error">{error}</p>}
      </div>}
    </div>
  </div>;
}

function App() {
  const [adminOpen, setAdminOpen] = useState(false);
  return <>
    <Header />
    <main>
      <section className="hero" id="home">
        <div className="hero-glow glow-one" /><div className="hero-glow glow-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-pill"><Sparkles size={14} /> DIGITAL IDEAS. REAL IMPACT.</span>
            <h1>We build digital<br /><span>that moves you</span><i>.</i></h1>
            <p className="hero-text">TOVIK Technologies helps businesses move forward with purposeful websites, powerful applications and experiences people love to use.</p>
            <div className="hero-actions"><a className="button button-primary" href="#contact">Let's build something <ArrowUpRight size={18} /></a><a className="button button-quiet" href="#work">Explore our work <ArrowRight size={17} /></a></div>
            <div className="hero-proof"><div className="proof-icon"><CheckCircle2 size={18} /></div><span>Thoughtful design <b>+</b> reliable development</span></div>
          </div>
          <div className="hero-art" aria-label="Abstract blue digital technology illustration">
            <div className="art-orbit orbit-a" /><div className="art-orbit orbit-b" />
            <div className="art-core"><div className="core-mark">T<span>V</span></div><div className="core-caption">IDEAS INTO EXPERIENCE</div></div>
            <div className="float-card card-top"><span className="mini-dot" /> DESIGN</div>
            <div className="float-card card-bottom"><Code2 size={17} /> DEVELOPMENT</div>
            <div className="art-spark spark-a">✳</div><div className="art-spark spark-b">✧</div>
          </div>
        </div>
        <div className="container hero-bottom"><span>SCROLL TO DISCOVER</span><div className="scroll-line" /><span>01 / 04</span></div>
      </section>

      <section className="trust-strip"><div className="container trust-inner"><span>CREATIVE THINKING</span><i /><span>SMART TECHNOLOGY</span><i /><span>MEANINGFUL RESULTS</span><i /><span>BUILT FOR GROWTH</span></div></section>

      <section className="section services-section" id="services">
        <div className="container"><SectionHeading eyebrow="WHAT WE DO" title={<>Digital solutions, <span>thoughtfully made.</span></>} text="From the first sketch to the final line of code, we bring design and technology together to solve real business needs." />
          <div className="service-grid">{services.map(s => <article className="service-card" key={s.number}><div className="service-top"><div className="service-icon"><s.icon size={23} /></div><span>{s.number}</span></div><h3>{s.title}</h3><p>{s.desc}</p><div className="tag-list">{s.tags.map(t => <span key={t}>{t}</span>)}</div><a href="#contact" className="card-link">Discuss a project <ArrowUpRight size={16} /></a></article>)}</div>
        </div>
      </section>

      <section className="work-section section" id="work">
        <div className="container"><div className="work-heading"><SectionHeading eyebrow="SELECTED CONCEPTS" title={<>Ideas made <span>tangible.</span></>} text="A look at the kinds of digital experiences we can create together." /><a className="button button-outline" href="#contact">Have a project in mind? <ArrowUpRight size={16} /></a></div>
          <div className="project-grid">{projects.map((p, i) => <article className="project-card" key={p.title}><div className={`project-visual ${p.color}`}><div className="project-window"><div className="window-dots"><i /><i /><i /></div><div className="project-monogram">{p.mark}</div><div className="visual-lines"><i /><i /><i /></div></div><span className="project-index">0{i + 1}</span></div><div className="project-info"><div><span>{p.type}</span><h3>{p.title}</h3><p>{p.desc}</p></div><a href={i === 0 ? "/photography/index.html" : i === 1 ? "/ecommerce/index.html" : "/corporate/index.html"} aria-label={`View ${p.title}`}><ArrowUpRight /></a></div></article>)}</div>
          <p className="concept-note">These are illustrative project concepts, not claims of completed client work.</p>
        </div>
      </section>

      <section className="about-section section" id="about">
        <div className="container about-grid"><div className="about-visual"><div className="about-ring ring-one" /><div className="about-ring ring-two" /><div className="about-center"><Zap size={38} /><span>MAKE IT<br />MATTER</span></div><div className="about-label label-one">DESIGN WITH PURPOSE</div><div className="about-label label-two">BUILD WITH CARE</div></div><div className="about-copy"><SectionHeading eyebrow="WHY TOVIK" title={<>Good technology should feel <span>simple.</span></>} text="We believe the best digital products balance clarity, creativity and dependable engineering. Our approach starts by understanding your goals, then shaping the right solution around them." /><div className="value-list"><div><span>01</span><p><b>People first</b> — experiences made around the people who use them.</p></div><div><span>02</span><p><b>Purposeful craft</b> — every detail has a reason to be there.</p></div><div><span>03</span><p><b>Built to grow</b> — flexible foundations for what comes next.</p></div></div><a href="#contact" className="inline-link">Let's talk about your idea <ArrowRight size={17} /></a></div></div>
      </section>

      <section className="process-section section"><div className="container"><SectionHeading eyebrow="HOW WE WORK" title={<>A clear path from <span>idea to launch.</span></>} text="A collaborative process that keeps your goals at the centre." center /><div className="process-grid">{[["01","Discover","We learn about your goals, audience and requirements."],["02","Plan & design","We shape the structure and experience before building."],["03","Develop","We turn the approved direction into a responsive product."],["04","Launch & improve","We test, launch and identify what to improve next."]].map(([n,t,d]) => <div className="process-step" key={n}><span>{n}</span><div className="step-connector" /><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>

      <section className="contact-section section" id="contact"><div className="container contact-grid"><div className="contact-copy"><SectionHeading eyebrow="LET'S CONNECT" title={<>Your next big idea starts <span>here.</span></>} text="Tell us what you're thinking. We'll get back to you to understand your goals and discuss the next step." /><div className="contact-details"><div><span className="contact-icon"><Mail size={18} /></span><p><small>EMAIL</small><b>toviktechnogies@gmail.com</b></p></div><div><span className="contact-icon"><MapPin size={18} /></span><p><small>WORKING WITH</small><b>Businesses & ambitious ideas</b></p></div></div></div><div className="form-shell"><div className="form-heading"><span>START A CONVERSATION</span><h3>Tell us about your project</h3></div><ContactForm /></div></div></section>
    </main>
    <footer className="footer"><div className="container"><div className="footer-main"><div><Brand footer /><p>Digital experiences designed with purpose<br />and developed with care.</p></div><div className="footer-links"><span>EXPLORE</span><a href="#services">Services</a><a href="#work">Our work</a><a href="#about">About</a><a href="#contact">Contact</a></div><div className="footer-links"><span>OUR SERVICES</span>{services.map(s => <a href="#services" key={s.title}>{s.title}</a>)}</div><div className="footer-cta"><span>HAVE AN IDEA?</span><a href="#contact">Let's make it real <ArrowUpRight size={17} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} TOVIK Technologies. All rights reserved.</span><button onClick={() => setAdminOpen(true)}><LayoutDashboard size={14} /> Admin</button><a href="#home">Back to top ↑</a></div></div></footer>
    {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
  </>;
}

export default App;
