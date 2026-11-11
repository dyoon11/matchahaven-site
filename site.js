// Phone menu, and the gallery's bigger view (with arrow keys).
(function () {
  var bar = document.querySelector(".topbar");
  var menu = document.querySelector(".menu-button");
  if (bar && menu) {
    var setOpen = function (open) {
      bar.classList.toggle("open", open);
      menu.setAttribute("aria-expanded", open ? "true" : "false");
      menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    menu.addEventListener("click", function () { setOpen(!bar.classList.contains("open")); });
    bar.querySelectorAll(".links a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("click", function (event) {
      if (bar.classList.contains("open") && !bar.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && bar.classList.contains("open")) { setOpen(false); menu.focus(); }
    });
  }

  // Home page: the menu floats over the art until you scroll.
  var hero = document.querySelector(".hero");
  if (bar && bar.classList.contains("over-hero")) {
    var onScroll = function () { bar.classList.toggle("scrolled", window.scrollY > 60); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Follow Along: a small list of the social accounts.
  var followButton = document.querySelector(".follow button");
  var followPop = document.getElementById("follow-pop");
  if (followButton && followPop) {
    var setFollow = function (open) {
      followPop.hidden = !open;
      followButton.setAttribute("aria-expanded", open ? "true" : "false");
    };
    followButton.addEventListener("click", function () { setFollow(followPop.hidden); });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".follow")) setFollow(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setFollow(false);
    });
  }

  // Drifting petals, and the picture leaning a little with the mouse.
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clip = document.querySelector(".hero-clip");
  if (hero && clip && !calm) {
    var count = window.innerWidth > 640 ? 16 : 7;
    for (var i = 0; i < count; i++) {
      var petal = document.createElement("span");
      petal.className = "petal" + (i % 3 === 0 ? " leaf" : "");
      petal.style.left = (Math.random() * 100).toFixed(1) + "%";
      petal.style.setProperty("--drift", (40 + Math.random() * 120).toFixed(0) + "px");
      petal.style.setProperty("--size", (8 + Math.random() * 8).toFixed(0) + "px");
      petal.style.animationDuration = (11 + Math.random() * 11).toFixed(1) + "s";
      petal.style.animationDelay = (-Math.random() * 22).toFixed(1) + "s";
      clip.appendChild(petal);
    }
    var stage = document.querySelector(".hero-stage");
    if (stage && window.matchMedia("(hover: hover) and (min-width: 641px)").matches) {
      hero.addEventListener("pointermove", function (event) {
        var box = hero.getBoundingClientRect();
        stage.style.setProperty("--px", (((event.clientX - box.left) / box.width - 0.5) * -18).toFixed(1) + "px");
        stage.style.setProperty("--py", (((event.clientY - box.top) / box.height - 0.5) * -10).toFixed(1) + "px");
      });
    }
  }

  var box = document.querySelector(".lightbox");
  var shots = Array.prototype.slice.call(document.querySelectorAll(".gallery button"));
  if (!box || !shots.length || typeof box.showModal !== "function") return;
  var picture = box.querySelector("img");
  var caption = box.querySelector(".caption");
  var current = 0;

  function show(index) {
    current = (index + shots.length) % shots.length;
    var img = shots[current].querySelector("img");
    picture.src = img.src;
    picture.alt = img.alt;
    caption.textContent = shots[current].getAttribute("data-caption") || "";
  }

  shots.forEach(function (button, index) {
    button.addEventListener("click", function () {
      show(index);
      box.showModal();
    });
  });

  box.querySelectorAll("[data-step]").forEach(function (button) {
    button.addEventListener("click", function () { show(current + Number(button.getAttribute("data-step"))); });
  });
  box.querySelector("[data-close]").addEventListener("click", function () { box.close(); });
  box.addEventListener("click", function (event) { if (event.target === box) box.close(); });
  document.addEventListener("keydown", function (event) {
    if (!box.open) return;
    if (event.key === "ArrowRight") show(current + 1);
    if (event.key === "ArrowLeft") show(current - 1);
  });
})();
