/* =========================================================
   SAMG Infotech – App JS
   - Mobile drawer open/close
   - Active nav highlight on scroll
   - Counter animation
   - FAQ accordion
   - Basic form handler (demo)
   ========================================================= */

(function () {
  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Footer Year ----------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Mobile Drawer ----------
  const menuBtn = $("#menuBtn");
  const drawer = $("#drawer");
  const drawerClose = $("#drawerClose");

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (menuBtn && drawer) menuBtn.addEventListener("click", openDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);

  // Close drawer when clicking outside the panel
  if (drawer) {
    drawer.addEventListener("click", (e) => {
      const panel = $(".drawer__panel", drawer);
      if (!panel) return;
      if (!panel.contains(e.target)) closeDrawer();
    });
  }

  // Close drawer on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // Close drawer when selecting a link
  $$(".drawer__link").forEach((a) => {
    a.addEventListener("click", () => closeDrawer());
  });

  // ---------- Active Nav Highlight on Scroll ----------
  const navLinks = $$(".nav__link");
  const ids = navLinks
    .map((a) => a.getAttribute("href"))
    .filter((h) => h && h.startsWith("#"))
    .map((h) => h.slice(1));

  const sections = ids
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActiveNav() {
    const y = window.scrollY + 140;
    let current = "home";

    for (const sec of sections) {
      if (sec.offsetTop <= y) current = sec.id;
    }

    navLinks.forEach((a) => {
      const match = a.getAttribute("href") === `#${current}`;
      a.classList.toggle("is-active", match);
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  // ---------- Counter Animation ----------
  // Triggers when first stat block is visible
  const counters = $$("[data-count]");
  let countersStarted = false;

  function runCounters() {
    counters.forEach((el) => {
      const target = Number(el.getAttribute("data-count")) || 0;
      const duration = 900; // ms
      const start = performance.now();

      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.round(target * eased);
        el.textContent = String(value);

        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = String(target);
      }

      requestAnimationFrame(tick);
    });
  }

  function checkCounters() {
    if (countersStarted || counters.length === 0) return;

    // Use the first counter position
    const first = counters[0];
    const rect = first.getBoundingClientRect();
    if (rect.top < window.innerHeight - 120) {
      countersStarted = true;
      runCounters();
    }
  }

  window.addEventListener("scroll", checkCounters, { passive: true });
  checkCounters();

  // ---------- FAQ Accordion ----------
  const faqItems = $$(".faq__item");
  faqItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.classList.contains("is-open");

      // Close others for cleaner UX
      faqItems.forEach((x) => x.classList.remove("is-open"));

      if (!isOpen) btn.classList.add("is-open");
    });
  });

  // ---------- Simple form handler (demo) ----------
  // Next step: connect to email using Formspree (works on GitHub Pages)
  const form = $("#leadForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Basic validation
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    if (!name || !email) {
      alert("Please fill in Name and Email.");
      return;
    }

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        alert("Thank you! Your message has been sent. We will contact you soon.");
        form.reset();
      } else {
        alert("Something went wrong. Please try again or email us directly.");
      }
    } catch (err) {
      alert("Network error. Please try again or email us directly.");
    }
  });
}
})();

