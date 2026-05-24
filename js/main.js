const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

function updateTopbarState() {
  if (!topbar) {
    return;
  }

  topbar.classList.toggle("scrolled", window.scrollY > 12);
}

updateTopbarState();
window.addEventListener("scroll", updateTopbarState, { passive: true });

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll("[data-nav-link]").forEach((link) => {
  const linkPage = link.getAttribute("href");
  if (linkPage === currentPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

const revealItems = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && revealItems.length && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("revealed"));
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');

    if (!button) {
      return;
    }

    const originalLabel = button.textContent;
    button.textContent = "Thanks. We will be in touch.";
    button.disabled = true;

    window.setTimeout(() => {
      button.textContent = originalLabel;
      button.disabled = false;
      form.reset();
    }, 2200);
  });
});

function setAccordionState(item, isOpen) {
  const trigger = item.querySelector("[data-accordion-trigger]");
  const answer = item.querySelector(".faq-answer");

  if (!trigger || !answer) {
    return;
  }

  item.classList.toggle("open", isOpen);
  trigger.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    answer.style.maxHeight = `${answer.scrollHeight + 24}px`;
  } else {
    answer.style.maxHeight = "0px";
  }
}

document.querySelectorAll(".faq-item").forEach((item) => {
  setAccordionState(item, item.classList.contains("open"));
});

document.querySelectorAll("[data-accordion-trigger]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".faq-item");
    const group = trigger.closest(".faq-list");

    if (!item || !group) {
      return;
    }

    const willOpen = !item.classList.contains("open");

    group.querySelectorAll(".faq-item").forEach((groupItem) => {
      setAccordionState(groupItem, false);
    });

    if (willOpen) {
      setAccordionState(item, true);
    }
  });
});

window.addEventListener("resize", () => {
  document.querySelectorAll(".faq-item.open").forEach((item) => {
    setAccordionState(item, true);
  });
});
