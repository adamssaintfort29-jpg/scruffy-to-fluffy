// Mobile menu toggle + active link highlight
(function () {
  const toggle = document.querySelector("[data-mobile-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("show");
      toggle.setAttribute("aria-expanded", menu.classList.contains("show") ? "true" : "false");
    });
  }

  // Active nav link
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll('a[data-nav]').forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("active");
  });
})();

// Booking form: simple validation + optional Formspree support
(function () {
  const form = document.querySelector("[data-booking-form]");
  if (!form) return;

  const notice = document.querySelector("[data-notice]");
  const endpoint = form.getAttribute("data-endpoint") || "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const phone = (data.get("phone") || "").toString().trim();
    const name = (data.get("name") || "").toString().trim();
    const pet = (data.get("petName") || "").toString().trim();

    if (name.length < 2 || pet.length < 1 || phone.length < 7) {
      show("Please fill out name, pet name, and a valid phone number.");
      return;
    }

    // If you set a Formspree endpoint, we send it there.
    if (endpoint && endpoint.startsWith("https://formspree.io/f/")) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" }
        });

        if (res.ok) {
          form.reset();
          show("✅ Request sent! We’ll confirm your appointment soon.");
        } else {
          show("Sent, but we couldn’t confirm delivery. Try again or call/text.");
        }
      } catch {
        show("Network issue. Try again or call/text to book.");
      }
      return;
    }

    // Fallback: opens user's email client (works without any backend)
    const subject = encodeURIComponent("Booking Request — Scruffy to Fluffy Dog Grooming");
    const bodyLines = [];
    for (const [k, v] of data.entries()) bodyLines.push(`${k}: ${v}`);
    const body = encodeURIComponent(bodyLines.join("\n"));

    // Change this email if you have one later.
    const emailTo = "scruffytfluffygrooming@example.com";
    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
    show("Opening your email app to send the request…");
  });

  function show(msg) {
    if (!notice) return;
    notice.textContent = msg;
    notice.classList.add("show");
  }
})();
