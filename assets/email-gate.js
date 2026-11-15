/* Email gate: the address is never written in the page, so scrapers can't read it.
   Tapping an "Email" button asks a quick sum, then reveals the address. */
(function () {
  // Address stored as shifted character codes, decoded only after the check passes.
  var K = [109, 106, 113, 113, 116, 69, 106, 113, 113, 102, 119, 102, 110, 121, 104, 109, 51, 104, 116, 114];
  function addr() { return K.map(function (c) { return String.fromCharCode(c - 5); }).join(""); }

  var dlg, a, b, input, err, step1, step2;

  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "email-gate";
    dlg.setAttribute("aria-labelledby", "eg-title");
    dlg.innerHTML =
      '<form method="dialog" class="eg-close-form"><button class="eg-x" aria-label="Close">×</button></form>' +
      '<h2 id="eg-title">Email me</h2>' +
      '<div class="eg-step1">' +
        '<p>Quick check so robots can\'t grab my address:</p>' +
        '<label class="eg-q"><span class="eg-sum"></span> <input type="text" inputmode="numeric" autocomplete="off" maxlength="3" aria-label="Answer"></label>' +
        '<p class="eg-err" role="alert" hidden>Not quite. Try again.</p>' +
        '<button type="button" class="eg-btn eg-go">Show email</button>' +
      '</div>' +
      '<div class="eg-step2" hidden>' +
        '<p class="eg-addr"></p>' +
        '<div class="eg-row"><a class="eg-btn eg-mail">Open mail app</a><button type="button" class="eg-btn eg-alt eg-copy">Copy</button></div>' +
      '</div>';
    document.body.appendChild(dlg);
    input = dlg.querySelector("input");
    err = dlg.querySelector(".eg-err");
    step1 = dlg.querySelector(".eg-step1");
    step2 = dlg.querySelector(".eg-step2");
    dlg.querySelector(".eg-go").addEventListener("click", check);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); check(); } });
    dlg.querySelector(".eg-copy").addEventListener("click", function () {
      var btn = this;
      navigator.clipboard && navigator.clipboard.writeText(addr()).then(function () { btn.textContent = "Copied"; });
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  function check() {
    if (parseInt(input.value, 10) === a + b) {
      var e = addr();
      dlg.querySelector(".eg-addr").textContent = e;
      dlg.querySelector(".eg-mail").href = "mailto:" + e;
      step1.hidden = true; step2.hidden = false;
      dlg.querySelector(".eg-mail").focus();
    } else {
      err.hidden = false; input.value = ""; input.focus();
    }
  }

  function open() {
    if (!dlg) build();
    a = 2 + Math.floor(Math.random() * 7); b = 1 + Math.floor(Math.random() * 8);
    dlg.querySelector(".eg-sum").textContent = "What's " + a + " + " + b + "?";
    input.value = ""; err.hidden = true; step1.hidden = false; step2.hidden = true;
    dlg.querySelector(".eg-copy").textContent = "Copy";
    dlg.showModal();
    input.focus();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest(".email-link");
    if (t) { e.preventDefault(); open(); }
  });
})();
