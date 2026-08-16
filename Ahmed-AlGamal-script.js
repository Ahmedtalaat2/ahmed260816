/* ============================================================
   SCRIPT.JS
   كل التفاعلات والحركات موجودة هنا بشكل منفصل
============================================================ */

(() => {
  "use strict";

  /* ============================================================
     عناصر الصفحة الأساسية
  ============================================================ */
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  /* ============================================================
     Navbar
     تغيير شكل النافبار عند التمرير
  ============================================================ */
  const updateNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  };

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  /* ============================================================
     Mobile Menu
     فتح وإغلاق قائمة الهاتف
  ============================================================ */
  const closeMobileMenu = () => {
    if (!navLinks || !hamburger) return;
    navLinks.classList.remove("open");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
  };

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("active", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  /* ============================================================
     Smooth Scroll
     التمرير السلس إلى أقسام الصفحة
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const selector = anchor.getAttribute("href");
      if (!selector || selector === "#") return;

      const target = document.querySelector(selector);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  /* ============================================================
     Scroll Reveal
     ظهور العناصر تدريجيًا عند دخولها الشاشة
  ============================================================ */
  const revealElements = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("revealed"));
  }

  /* ============================================================
     Hero Initial Reveal
     إظهار عناصر الهيرو مباشرة بعد تحميل الصفحة
  ============================================================ */
  window.addEventListener("load", () => {
    document.querySelectorAll(".hero [data-reveal]").forEach((element) => {
      element.classList.add("revealed");
    });
  });

  /* ============================================================
     Animated Counters
     تحريك أرقام النتائج عند ظهور القسم
  ============================================================ */
  const statsGrid = document.querySelector(".stats-grid");
  const counters = document.querySelectorAll(".stat-number");
  let countersStarted = false;

  const animateCounter = (element) => {
    const target = Number(element.dataset.target || 0);
    const suffix = element.dataset.suffix || "";
    const duration = 1800;
    const startTime = performance.now();

    const easeOutQuart = (value) => 1 - Math.pow(1 - value, 4);

    const tick = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = Math.floor(easeOutQuart(progress) * target);

      element.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(tick);
  };

  if (statsGrid && counters.length) {
    if ("IntersectionObserver" in window) {
      const statsObserver = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting || countersStarted) return;

          countersStarted = true;
          counters.forEach(animateCounter);
          statsObserver.disconnect();
        },
        { threshold: 0.3 }
      );

      statsObserver.observe(statsGrid);
    } else {
      counters.forEach((counter) => {
        counter.textContent = `${counter.dataset.target || 0}${counter.dataset.suffix || ""}`;
      });
    }
  }

  /* ============================================================
     Custom Cursor
     المؤشر المخصص لسطح المكتب
  ============================================================ */
  const cursorGlow = document.getElementById("cursorGlow");
  const cursorDot = document.getElementById("cursorDot");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (finePointer && cursorGlow && cursorDot) {
    let mouseX = -100;
    let mouseY = -100;
    let lastX = -100;
    let lastY = -100;
    let glowX = -100;
    let glowY = -100;

    const createCursorBubble = (x, y) => {
      const bubble = document.createElement("span");
      bubble.className = "cursor-bubble";
      bubble.style.left = `${x}px`;
      bubble.style.top = `${y}px`;
      document.body.appendChild(bubble);

      window.setTimeout(() => bubble.remove(), 520);
    };

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;

      const distance = Math.hypot(mouseX - lastX, mouseY - lastY);

      if (distance > 18) {
        createCursorBubble(mouseX, mouseY);
        lastX = mouseX;
        lastY = mouseY;
      }
    });

    const animateCursor = () => {
      glowX += (mouseX - glowX) * 0.09;
      glowY += (mouseY - glowY) * 0.09;

      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;

      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  }

  /* ============================================================
     Hero Parallax
     حركة خفيفة جدًا حول الصورة والعناصر الهندسية
  ============================================================ */
  const heroPerson = document.querySelector(".hero-person");
  const geoBackground = document.querySelector(".geo-background-hero svg");

  if (finePointer && heroPerson && geoBackground) {
    document.addEventListener("mousemove", (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      heroPerson.style.transform = `translate(${x * 8}px, ${y * 5}px)`;
      geoBackground.style.transform = `translate(${x * -12}px, ${y * -8}px)`;
    });
  }

  /* ============================================================
     Contact Form
     إرسال البيانات إلى Google Apps Script الحالي
  ============================================================ */
  if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const nameInput = contactForm.querySelector('input[name="name"]');
    const phoneInput = contactForm.querySelector('input[name="phone"]');
    const serviceInput = contactForm.querySelector('select[name="service"]');
    const messageInput = contactForm.querySelector('textarea[name="message"]');

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = nameInput?.value.trim() || "";
      const phone = phoneInput?.value.trim() || "";
      const service = serviceInput?.value || "Not specified";
      const message = messageInput?.value.trim() || "";

      if (!name || !phone) {
        alert("من فضلك املى الاسم ورقم التليفون ❗");
        return;
      }

      const originalButtonHTML = submitButton?.innerHTML || "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'جاري الإرسال... <i class="fa-solid fa-spinner fa-spin"></i>';
      }

      const data = {
        name,
        phone,
        service,
        message
      };

      try {
        await fetch(
          "https://script.google.com/macros/s/AKfycbzovz-6HvRa2AmrKsnk56DTGkcHVupZxWf7DNTpdB-zVpxnC8ho67HG_I2_NVt-HQjTWg/exec",
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }
        );

        if (submitButton) {
          submitButton.innerHTML = 'تم الإرسال ✔️';
        }

        formSuccess?.classList.add("show");
        contactForm.reset();

        window.setTimeout(() => {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
          }
          formSuccess?.classList.remove("show");
        }, 3000);
      } catch (error) {
        console.error("Contact form error:", error);

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = "حصل خطأ ❌";
        }

        window.setTimeout(() => {
          if (submitButton) {
            submitButton.innerHTML = originalButtonHTML;
          }
        }, 3000);
      }
    });
  }

  /* ============================================================
     Close menu with Escape
     إغلاق قائمة الهاتف عند الضغط على Escape
  ============================================================ */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  /* ============================================================
     Console Message
  ============================================================ */
  console.log(
    "%cAhmed Algamal Portfolio — New Identity Loaded",
    "color:#26304B;font-size:14px;font-weight:800;"
  );
})();
