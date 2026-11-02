// Phone menu, and the gallery's bigger view (with arrow keys).
(function () {
  var bar = document.querySelector(".topbar");
  var menu = document.querySelector(".menu-button");
  if (bar && menu) {
    menu.addEventListener("click", function () {
      var open = bar.classList.toggle("open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
    });
    bar.querySelectorAll(".links a").forEach(function (a) {
      a.addEventListener("click", function () {
        bar.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
      });
    });
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
