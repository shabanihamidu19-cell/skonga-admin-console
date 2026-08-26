(function () {
  const M = window.SKONGA_MOCK;
  const viewEl = document.getElementById("view");
  const titleEl = document.getElementById("page-title");
  const subEl = document.getElementById("page-sub");

  const titles = {
    overview: ["Overview", "Four key signals — mock data"],
    users: ["Users", "Account directory"],
    usage: ["Usage", "Quota snapshot"],
    feedback: ["Feedback", "Likes & dislikes — list + detail"],
    reports: ["Reports", "Issue queue — list + detail"],
    library: ["Library", "RAG readiness"],
    learn: ["Learn", "Path signals"],
    system: ["System", "Service health"],
    settings: ["Settings", "Local mock policy only"],
  };

  function esc(s) {
    return String(s)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """);
  }

  function pct(n) {
    return Math.round(n * 100) + "%";
  }

  function pill(s, cls) {
    return '<span class="pill ' + (cls || "muted") + '">' + esc(s) + "</span>";
  }

  function statusClass(s) {
    if (s === "ok" || s === "active" || s === "resolved") return "ok";
    if (s === "open" || s === "triaged" || s === "warn") return "warn";
    if (s === "off" || s === "bad") return "bad";
    return "muted";
  }

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () {
      t.remove();
    }, 2000);
  }

  function kpi(label, value, hint) {
    return (
      '<div class="kpi"><div class="k">' +
      esc(label) +
      '</div><div class="v">' +
      value +
      "</div>" +
      (hint ? '<div class="h">' + esc(hint) + "</div>" : "") +
      "</div>"
    );
  }

  function renderOverview() {
    const o = M.overview;
    viewEl.innerHTML =
      '<div class="kpi-row">' +
      kpi("Users", o.usersTotal, "+" + o.usersNew7d + " last 7 days") +
      kpi("Like rate", pct(o.likeRate7d), "7-day quality") +
      kpi("Open reports", o.openReports, "Needs triage") +
      kpi("RAG OK rate", pct(o.ragOkRate), "Library hits") +
      "</div>" +
      '<div class="panel"><div class="panel-h">Services</div><div class="panel-b">' +
      M.services
        .map(function (s) {
          return (
            '<div class="health-row"><div><strong>' +
            esc(s.name) +
            '</strong><div class="u">' +
            esc(s.url) +
            "</div></div>" +
            pill(s.status, statusClass(s.status)) +
            "</div>"
          );
        })
        .join("") +
      "</div></div>";
  }

  function renderUsers() {
    viewEl.innerHTML =
      '<div class="panel"><div class="panel-h">Accounts</div><div class="panel-b"><table><thead><tr>' +
      "<th>Name</th><th>Email</th><th>Plan</th><th>Status</th><th>Created</th></tr></thead><tbody>" +
      M.users
        .map(function (u) {
          return (
            "<tr><td>" +
            esc(u.name) +
            "</td><td>" +
            esc(u.email) +
            "</td><td>" +
            esc(u.plan) +
            "</td><td>" +
            pill(u.status, statusClass(u.status)) +
            "</td><td>" +
            esc(u.created) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div></div>";
  }

  function renderUsage() {
    const u = M.usage;
    viewEl.innerHTML =
      '<div class="kpi-row">' +
      kpi("Chats", u.today.chats, "today") +
      kpi("Scans", u.today.scans, "today") +
      kpi("Images", u.today.images, "today") +
      kpi("RAG hits", u.today.ragHits, "today") +
      "</div>" +
      '<div class="panel"><div class="panel-h">Default limits (mock)</div>' +
      '<div class="panel-b" style="padding:16px;font-size:0.85rem;color:var(--muted)">' +
      "Free — chat " +
      u.free.chat +
      " · scan " +
      u.free.scan +
      " · image " +
      u.free.image +
      " · RAG " +
      u.free.rag +
      "/day<br>Pro — chat " +
      u.pro.chat +
      " · scan " +
      u.pro.scan +
      " · image " +
      u.pro.image +
      " · RAG " +
      u.pro.rag +
      "/day</div></div>";
  }

  function renderLibrary() {
    const L = M.library;
    viewEl.innerHTML =
      '<div class="kpi-row">' +
      kpi("Version", L.version, "") +
      kpi("Subjects", L.subjectsLoaded, "") +
      kpi("Auth", L.authMode, "") +
      kpi("Last error", L.lastError ? "yes" : "none", "") +
      "</div>" +
      '<div class="panel"><div class="panel-h">Last RAG OK</div>' +
      '<div class="panel-b" style="padding:16px;font-size:0.85rem"><code>' +
      esc(L.lastOkAt || "—") +
      "</code></div></div>";
  }

  function renderLearn() {
    const L = M.learn;
    viewEl.innerHTML =
      '<div class="kpi-row">' +
      kpi("Active paths", L.activePaths, "") +
      kpi("Avg mastery", L.avgMastery, "0–3") +
      kpi("Subjects", L.topSubjects.length, L.topSubjects.join(", ")) +
      kpi("—", "—", "") +
      "</div>";
  }

  function renderSystem() {
    viewEl.innerHTML =
      '<div class="panel"><div class="panel-h">Health</div><div class="panel-b">' +
      M.services
        .map(function (s) {
          return (
            '<div class="health-row"><div><strong>' +
            esc(s.name) +
            '</strong><div class="u">' +
            esc(s.url) +
            "</div></div>" +
            pill(s.status, statusClass(s.status)) +
            "</div>"
          );
        })
        .join("") +
      "</div></div>";
  }

  function renderFeedback() {
    viewEl.innerHTML =
      '<div class="filters">' +
      '<select id="fb-filter"><option value="all">All</option><option value="like">Likes</option><option value="dislike">Dislikes</option></select>' +
      "</div>" +
      '<div class="dual">' +
      '<div class="panel"><div class="panel-h">Events</div><div class="panel-b"><table><thead><tr>' +
      "<th>When</th><th>User</th><th>Vote</th><th>Curriculum</th></tr></thead>" +
      '<tbody id="fb-body"></tbody></table></div></div>' +
      '<div class="detail empty" id="fb-detail">Select a row</div></div>';

    function paint(filter) {
      const rows = M.feedback.filter(function (f) {
        return filter === "all" || f.vote === filter;
      });
      const body = document.getElementById("fb-body");
      body.innerHTML = rows
        .map(function (f) {
          return (
            '<tr class="click" data-id="' +
            f.id +
            '"><td>' +
            f.at.replace("T", " ").slice(0, 16) +
            "</td><td>" +
            esc(f.user) +
            "</td><td>" +
            pill(f.vote, f.vote) +
            "</td><td>" +
            (f.curriculumAligned ? pill("yes", "ok") : pill("no", "muted")) +
            "</td></tr>"
          );
        })
        .join("");

      body.querySelectorAll("tr").forEach(function (tr) {
        tr.addEventListener("click", function () {
          body.querySelectorAll("tr").forEach(function (x) {
            x.classList.remove("sel");
          });
          tr.classList.add("sel");
          const f = M.feedback.find(function (x) {
            return x.id === tr.getAttribute("data-id");
          });
          if (!f) return;
          const d = document.getElementById("fb-detail");
          d.classList.remove("empty");
          d.innerHTML =
            "<h3>" +
            pill(f.vote, f.vote) +
            " · " +
            esc(f.user) +
            "</h3>" +
            '<div class="meta">' +
            esc(f.at) +
            " · " +
            esc(f.provider) +
            " · citations " +
            f.citationCount +
            "</div>" +
            "<p style=\"font-size:0.75rem;color:var(--muted);margin:0 0 4px\">User</p><pre>" +
            esc(f.userText) +
            "</pre>" +
            "<p style=\"font-size:0.75rem;color:var(--muted);margin:0 0 4px\">Reply</p><pre>" +
            esc(f.replyText) +
            "</pre>";
        });
      });
    }

    paint("all");
    document.getElementById("fb-filter").addEventListener("change", function (e) {
      document.getElementById("fb-detail").className = "detail empty";
      document.getElementById("fb-detail").textContent = "Select a row";
      paint(e.target.value);
    });
  }

  function renderReports() {
    viewEl.innerHTML =
      '<div class="dual">' +
      '<div class="panel"><div class="panel-h">Queue</div><div class="panel-b"><table><thead><tr>' +
      "<th>When</th><th>User</th><th>Reason</th><th>Status</th></tr></thead>" +
      '<tbody id="rp-body"></tbody></table></div></div>' +
      '<div class="detail empty" id="rp-detail">Select a report</div></div>';

    const body = document.getElementById("rp-body");
    function paint() {
      body.innerHTML = M.reports
        .map(function (r) {
          return (
            '<tr class="click" data-id="' +
            r.id +
            '"><td>' +
            r.at.replace("T", " ").slice(0, 16) +
            "</td><td>" +
            esc(r.user) +
            "</td><td><code>" +
            esc(r.reason) +
            "</code></td><td>" +
            pill(r.status, statusClass(r.status)) +
            "</td></tr>"
          );
        })
        .join("");

      body.querySelectorAll("tr").forEach(function (tr) {
        tr.addEventListener("click", function () {
          body.querySelectorAll("tr").forEach(function (x) {
            x.classList.remove("sel");
          });
          tr.classList.add("sel");
          const r = M.reports.find(function (x) {
            return x.id === tr.getAttribute("data-id");
          });
          if (!r) return;
          const d = document.getElementById("rp-detail");
          d.classList.remove("empty");
          d.innerHTML =
            "<h3>" +
            esc(r.reason) +
            "</h3>" +
            '<div class="meta">' +
            esc(r.at) +
            " · " +
            esc(r.user) +
            " · " +
            pill(r.status, statusClass(r.status)) +
            "</div>" +
            "<p style=\"font-size:0.85rem\">" +
            esc(r.snippet) +
            "</p>" +
            "<p class=\"meta\">Note: " +
            esc(r.note || "—") +
            "</p>" +
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px">' +
            '<button type="button" class="btn sm" data-st="triaged">Triaged</button>' +
            '<button type="button" class="btn sm" data-st="resolved">Resolved</button>' +
            '<button type="button" class="btn sm ghost" data-st="wontfix">Won\'t fix</button></div>';
          d.querySelectorAll("[data-st]").forEach(function (btn) {
            btn.addEventListener("click", function () {
              r.status = btn.getAttribute("data-st");
              toast("Mock status → " + r.status);
              paint();
              tr.click();
            });
          });
        });
      });
    }
    paint();
  }

  function renderSettings() {
    const s = M.settings;
    viewEl.innerHTML =
      '<div class="panel"><div class="panel-h">Features</div><div class="form-grid" id="feat"></div></div>' +
      '<div class="panel"><div class="panel-h">Free quotas</div><div class="form-grid" id="quota"></div></div>' +
      '<div class="panel"><div class="panel-h">General</div><div class="form-grid" id="gen"></div>' +
      '<div class="actions"><button type="button" class="btn" id="save">Save locally</button></div></div>';

    const feat = document.getElementById("feat");
    Object.keys(s.features).forEach(function (k) {
      feat.innerHTML +=
        '<div class="form-row inline"><label>' +
        esc(k) +
        '</label><input type="checkbox" data-feat="' +
        k +
        '" ' +
        (s.features[k] ? "checked" : "") +
        "/></div>";
    });
    const q = document.getElementById("quota");
    [
      ["freeChat", "Chat / day"],
      ["freeScan", "Scan / day"],
      ["freeImage", "Image / day"],
      ["freeRag", "RAG / day"],
    ].forEach(function (p) {
      q.innerHTML +=
        '<div class="form-row"><label>' +
        p[1] +
        '</label><input type="number" data-q="' +
        p[0] +
        '" value="' +
        s.quotas[p[0]] +
        '" min="0"/></div>';
    });
    document.getElementById("gen").innerHTML =
      '<div class="form-row inline"><label>Maintenance mode</label><input type="checkbox" id="maint" ' +
      (s.maintenanceMode ? "checked" : "") +
      "/></div>" +
      '<div class="form-row"><label>Feedback retain (days)</label><input type="number" id="retain" value="' +
      s.feedbackRetainDays +
      '" min="1"/></div>';

    document.getElementById("save").addEventListener("click", function () {
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
      toast("Saved locally only");
    });
  }

  const renderers = {
    overview: renderOverview,
    users: renderUsers,
    usage: renderUsage,
    feedback: renderFeedback,
    reports: renderReports,
    library: renderLibrary,
    learn: renderLearn,
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
    (renderers[name] || renderOverview)();
  }

  document.getElementById("nav").addEventListener("click", function (e) {
    const btn = e.target.closest("button[data-view]");
    if (btn) show(btn.getAttribute("data-view"));
  });

  document.getElementById("global-search").addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    const q = e.target.value.trim().toLowerCase();
    if (!q) return;
    if (q.indexOf("report") >= 0) show("reports");
    else if (q.indexOf("like") >= 0 || q.indexOf("feedback") >= 0) show("feedback");
    else if (q.indexOf("user") >= 0) show("users");
    else toast("Search is mock — try: users, feedback, reports");
  });

  try {
    const saved = localStorage.getItem("skonga_admin_settings_mock");
    if (saved) Object.assign(M.settings, JSON.parse(saved));
  } catch (e) {}

  show("overview");
})();
