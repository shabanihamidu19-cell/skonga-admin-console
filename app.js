(function () {
  const M = window.SKONGA_MOCK;
  const viewEl = document.getElementById("view");
  const titleEl = document.getElementById("page-title");
  const subEl = document.getElementById("page-sub");
  const drawer = document.getElementById("drawer");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerBody = document.getElementById("drawer-body");

  const titles = {
    overview: ["Overview", "Platform snapshot (mock)"],
    users: ["Users", "Directory — mock accounts"],
    usage: ["Usage", "Quota policy snapshot"],
    library: ["Library", "Curriculum RAG readiness"],
    learn: ["Learn", "Path signals (mock)"],
    feedback: ["Feedback", "Likes & dislikes on AI replies"],
    reports: ["Reports", "Structured issues & triage"],
    system: ["System", "Service health"],
    settings: ["Settings", "Management (local only)"],
  };

  function pct(n) {
    return Math.round(n * 100) + "%";
  }

  function statusPill(s) {
    if (s === "ok" || s === "active" || s === "resolved") return '<span class="pill ok">' + s + "</span>";
    if (s === "open" || s === "warn" || s === "triaged") return '<span class="pill warn">' + s + "</span>";
    if (s === "bad" || s === "off") return '<span class="pill bad">' + s + "</span>";
    return '<span class="pill neutral">' + s + "</span>";
  }

  function openDrawer(title, html) {
    drawerTitle.textContent = title;
    drawerBody.innerHTML = html;
    drawer.classList.remove("hidden");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    drawer.classList.add("hidden");
    drawer.setAttribute("aria-hidden", "true");
  }

  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  drawer.addEventListener("click", function (e) {
    if (e.target === drawer) closeDrawer();
  });

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () {
      t.remove();
    }, 2200);
  }

  function renderOverview() {
    const o = M.overview;
    viewEl.innerHTML =
      '<div class="grid">' +
      card("Users", o.usersTotal, "+" + o.usersNew7d + " (7d)") +
      card("Chats today", o.chatsToday, "") +
      card("Like rate (7d)", pct(o.likeRate7d), "Quality KPI") +
      card("Open reports", o.openReports, "Needs triage") +
      card("RAG OK rate", pct(o.ragOkRate), "Library hits") +
      "</div>" +
      '<div class="panel"><h3>Services</h3>' +
      M.services
        .map(function (s) {
          return (
            '<div class="health-row"><span>' +
            s.name +
            '<br><span class="muted">' +
            s.url +
            "</span></span>" +
            statusPill(s.status) +
            "</div>"
          );
        })
        .join("") +
      "</div>";
  }

  function card(label, value, hint) {
    return (
      '<div class="card"><div class="label">' +
      label +
      '</div><div class="value">' +
      value +
      "</div>" +
      (hint ? '<div class="hint">' + hint + "</div>" : "") +
      "</div>"
    );
  }

  function renderUsers() {
    viewEl.innerHTML =
      '<div class="panel table-wrap"><table><thead><tr>' +
      "<th>Name</th><th>Email</th><th>Plan</th><th>Status</th><th>Created</th>" +
      "</tr></thead><tbody>" +
      M.users
        .map(function (u) {
          return (
            "<tr><td>" +
            u.name +
            "</td><td>" +
            u.email +
            "</td><td>" +
            u.plan +
            "</td><td>" +
            statusPill(u.status) +
            "</td><td>" +
            u.created +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div>";
  }

  function renderUsage() {
    const u = M.usage;
    viewEl.innerHTML =
      '<div class="grid">' +
      card("Chats today", u.today.chats, "") +
      card("Scans", u.today.scans, "") +
      card("Images", u.today.images, "") +
      card("RAG hits", u.today.ragHits, "") +
      "</div>" +
      '<div class="panel"><h3>Default limits (mock)</h3>' +
      "<p class=\"muted\">Free — chat " +
      u.free.chat +
      "/day · scan " +
      u.free.scan +
      " · image " +
      u.free.image +
      " · RAG " +
      u.free.rag +
      "</p>" +
      "<p class=\"muted\">Pro — chat " +
      u.pro.chat +
      "/day · scan " +
      u.pro.scan +
      " · image " +
      u.pro.image +
      " · RAG " +
      u.pro.rag +
      "</p></div>";
  }

  function renderLibrary() {
    const L = M.library;
    viewEl.innerHTML =
      '<div class="grid">' +
      card("Version", L.version, "") +
      card("Subjects", L.subjectsLoaded, "") +
      card("Auth mode", L.authMode, "") +
      "</div>" +
      '<div class="panel"><h3>Last RAG</h3>' +
      "<p>OK at: <code>" +
      (L.lastOkAt || "—") +
      "</code></p>" +
      "<p>Error: " +
      (L.lastError || "none") +
      "</p></div>";
  }

  function renderLearn() {
    const L = M.learn;
    viewEl.innerHTML =
      '<div class="grid">' +
      card("Active paths", L.activePaths, "") +
      card("Avg mastery", L.avgMastery, "0–3 scale") +
      "</div>" +
      '<div class="panel"><h3>Top subjects</h3><p>' +
      L.topSubjects.join(", ") +
      "</p></div>";
  }

  function renderFeedback() {
    viewEl.innerHTML =
      '<div class="filters">' +
      '<select id="fb-filter"><option value="all">All votes</option><option value="like">Likes</option><option value="dislike">Dislikes</option></select>' +
      "</div>" +
      '<div class="panel table-wrap"><table><thead><tr>' +
      "<th>When</th><th>User</th><th>Vote</th><th>Curriculum</th><th>Snippet</th>" +
      "</tr></thead><tbody id="fb-body"></tbody></table></div>";

    function paint(filter) {
      const rows = M.feedback.filter(function (f) {
        return filter === "all" || f.vote === filter;
      });
      document.getElementById("fb-body").innerHTML = rows
        .map(function (f) {
          return (
            '<tr class="clickable" data-id="' +
            f.id +
            '"><td>' +
            f.at.replace("T", " ").slice(0, 16) +
            "</td><td>" +
            f.user +
            '</td><td><span class="pill ' +
            f.vote +
            '">' +
            f.vote +
            "</span></td><td>" +
            (f.curriculumAligned ? statusPill("ok") : statusPill("off")) +
            "</td><td>" +
            escapeHtml(f.userText.slice(0, 48)) +
            "…</td></tr>"
          );
        })
        .join("");

      document.querySelectorAll("#fb-body tr").forEach(function (tr) {
        tr.addEventListener("click", function () {
          const f = M.feedback.find(function (x) {
            return x.id === tr.getAttribute("data-id");
          });
          if (!f) return;
          openDrawer(
            "Feedback · " + f.vote,
            '<div class="meta">' +
              f.at +
              " · " +
              f.user +
              " · " +
              f.provider +
              " · citations " +
              f.citationCount +
              "</div>" +
              "<p><strong>User</strong></p><pre>" +
              escapeHtml(f.userText) +
              "</pre>" +
              "<p><strong>Reply</strong></p><pre>" +
              escapeHtml(f.replyText) +
              "</pre>"
          );
        });
      });
    }

    paint("all");
    document.getElementById("fb-filter").addEventListener("change", function (e) {
      paint(e.target.value);
    });
  }

  function renderReports() {
    viewEl.innerHTML =
      '<div class="panel table-wrap"><table><thead><tr>' +
      "<th>When</th><th>User</th><th>Reason</th><th>Status</th><th>Snippet</th>" +
      "</tr></thead><tbody>" +
      M.reports
        .map(function (r) {
          return (
            '<tr class="clickable" data-id="' +
            r.id +
            '"><td>' +
            r.at.replace("T", " ").slice(0, 16) +
            "</td><td>" +
            r.user +
            "</td><td><code>" +
            r.reason +
            "</code></td><td>" +
            statusPill(r.status) +
            "</td><td>" +
            escapeHtml(r.snippet.slice(0, 40)) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div>";

    document.querySelectorAll("#view tr.clickable").forEach(function (tr) {
      tr.addEventListener("click", function () {
        const r = M.reports.find(function (x) {
          return x.id === tr.getAttribute("data-id");
        });
        if (!r) return;
        openDrawer(
          "Report · " + r.reason,
          '<div class="meta">' +
            r.at +
            " · " +
            r.user +
            "</div>" +
            "<p>Status: " +
            statusPill(r.status) +
            "</p>" +
            "<p>" +
            escapeHtml(r.snippet) +
            "</p>" +
            "<p class=\"muted\">Admin note: " +
            escapeHtml(r.note || "—") +
            "</p>" +
            '<p style="margin-top:16px">' +
            '<button type="button" class="btn sm" data-st="triaged">Mark triaged</button> ' +
            '<button type="button" class="btn sm" data-st="resolved">Resolve</button> ' +
            '<button type="button" class="btn sm ghost" data-st="wontfix">Won\'t fix</button></p>'
        );
        drawerBody.querySelectorAll("[data-st]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            r.status = btn.getAttribute("data-st");
            toast("Mock only: status → " + r.status);
            closeDrawer();
            renderReports();
          });
        });
      });
    });
  }

  function renderSystem() {
    viewEl.innerHTML =
      '<div class="panel"><h3>Health</h3>' +
      M.services
        .map(function (s) {
          return (
            '<div class="health-row"><div><strong>' +
            s.name +
            '</strong><div class="muted">' +
            s.url +
            "</div></div>" +
            statusPill(s.status) +
            "</div>"
          );
        })
        .join("") +
      "</div>";
  }

  function renderSettings() {
    const s = M.settings;
    viewEl.innerHTML =
      '<div class="panel"><h3>Features</h3><div class="form-grid" id="feat-form"></div></div>' +
      '<div class="panel"><h3>Quotas (free defaults)</h3><div class="form-grid" id="quota-form"></div></div>' +
      '<div class="panel"><h3>General</h3><div class="form-grid" id="gen-form"></div></div>' +
      '<button type="button" class="btn" id="save-settings">Save (local mock)</button>';

    const feat = document.getElementById("feat-form");
    Object.keys(s.features).forEach(function (k) {
      feat.innerHTML +=
        '<div class="form-row inline"><label>' +
        k +
        '</label><label class="toggle"><input type="checkbox" data-feat="' +
        k +
        '" ' +
        (s.features[k] ? "checked" : "") +
        "/> on</label></div>";
    });

    const qf = document.getElementById("quota-form");
    [
      ["freeChat", "Chat / day"],
      ["freeScan", "Scan / day"],
      ["freeImage", "Image / day"],
      ["freeRag", "RAG / day"],
    ].forEach(function (pair) {
      qf.innerHTML +=
        '<div class="form-row"><label>' +
        pair[1] +
        '</label><input type="number" data-q="' +
        pair[0] +
        '" value="' +
        s.quotas[pair[0]] +
        '" min="0"/></div>';
    });

    document.getElementById("gen-form").innerHTML =
      '<div class="form-row inline"><label>Maintenance mode</label><label class="toggle"><input type="checkbox" id="maint" ' +
      (s.maintenanceMode ? "checked" : "") +
      "/> on</label></div>" +
      '<div class="form-row"><label>Feedback retain (days)</label><input type="number" id="retain" value="' +
      s.feedbackRetainDays +
      '" min="1"/></div>';

    document.getElementById("save-settings").addEventListener("click", function () {
      document.querySelectorAll("[data-feat]").forEach(function (el) {
        s.features[el.getAttribute("data-feat")] = el.checked;
      });
      document.querySelectorAll("[data-q]").forEach(function (el) {
        s.quotas[el.getAttribute("data-q")] = Number(el.value);
      });
      s.maintenanceMode = document.getElementById("maint").checked;
      s.feedbackRetainDays = Number(document.getElementById("retain").value);
      try {
        localStorage.setItem("skonga_admin_settings_mock", JSON.stringify(s));
      } catch (e) {}
      toast("Saved locally only — not production");
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """);
  }

  const renderers = {
    overview: renderOverview,
    users: renderUsers,
    usage: renderUsage,
    library: renderLibrary,
    learn: renderLearn,
    feedback: renderFeedback,
    reports: renderReports,
    system: renderSystem,
    settings: renderSettings,
  };

  function show(name) {
    const t = titles[name] || [name, ""];
    titleEl.textContent = t[0];
    subEl.textContent = t[1];
    document.querySelectorAll("#nav button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-view") === name);
    });
    closeDrawer();
    (renderers[name] || renderOverview)();
  }

  document.getElementById("nav").addEventListener("click", function (e) {
    const btn = e.target.closest("button[data-view]");
    if (!btn) return;
    show(btn.getAttribute("data-view"));
  });

  try {
    const saved = localStorage.getItem("skonga_admin_settings_mock");
    if (saved) Object.assign(M.settings, JSON.parse(saved));
  } catch (e) {}

  show("overview");
})();
