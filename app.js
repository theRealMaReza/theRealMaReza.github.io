(function () {
  const cfg = window.GEZ_CONFIG || {};
  const repo = cfg.websiteRepo || "theRealMaReza/theRealMaReza.github.io";
  const releaseBase = `https://github.com/${repo}/releases/latest/download`;

  const downloads = cfg.downloads || {
    mac: { label: "Download for Mac", shortLabel: "macOS (.zip)", file: "Gez-Mac.zip", note: "Apple Silicon & Intel · macOS" },
    windows: { label: "Download for Windows", shortLabel: "Windows (.zip)", file: "Gez-Windows.zip", note: "64-bit Windows 10 / 11" },
    linux: { label: "Download for Linux", shortLabel: "Linux (.tar.gz)", file: "Gez-Linux.tar.gz", note: "64-bit x86_64" }
  };

  function detectOS() {
    const ua = (navigator.userAgent || "").toLowerCase();
    const plat = (navigator.platform || "").toLowerCase();
    if (plat.includes("win") || ua.includes("windows")) return "windows";
    if (plat.includes("linux") || (ua.includes("linux") && !ua.includes("android"))) return "linux";
    return "mac";
  }

  function downloadUrl(osKey) {
    return `${releaseBase}/${downloads[osKey].file}`;
  }

  // 1. Wire Hero Download Buttons
  const detectedOS = detectOS();
  const osOrder = ["mac", "windows", "linux"].sort((a, b) => (a === detectedOS ? -1 : b === detectedOS ? 1 : 0));

  const primaryBtn = document.getElementById("primary-download-btn");
  const secondaryRow = document.getElementById("secondary-download-row");

  if (primaryBtn) {
    const primaryKey = osOrder[0];
    primaryBtn.textContent = downloads[primaryKey].label;
    primaryBtn.href = downloadUrl(primaryKey);
  }

  if (secondaryRow) {
    secondaryRow.innerHTML = osOrder
      .slice(1)
      .map(
        (key) =>
          `<a class="btn-secondary" href="${downloadUrl(key)}">${downloads[key].shortLabel}</a>`
      )
      .join("");
  }

  // 2. Render Platform Download Cards
  const downloadGrid = document.getElementById("download-grid");
  const platformTitles = { mac: "macOS", windows: "Windows", linux: "Linux" };

  if (downloadGrid) {
    downloadGrid.innerHTML = ["mac", "windows", "linux"]
      .map((key) => {
        const item = downloads[key];
        const isDetected = key === detectedOS;
        return `
          <div class="parchment gold-frame platform-card ${isDetected ? "is-detected" : ""}">
            <div>
              ${isDetected ? `<span class="platform-badge">Recommended for your device</span>` : ""}
              <h3>${platformTitles[key]}</h3>
              <p>${item.note}</p>
            </div>
            <a class="btn-gold" href="${downloadUrl(key)}">${item.label}</a>
          </div>
        `;
      })
      .join("");
  }

  // 3. Fetch Latest Release Version Badge (graceful fallback before first release)
  const statusEl = document.getElementById("release-status");
  fetch(`https://api.github.com/repos/${repo}/releases/latest`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data || !data.tag_name || !statusEl) return;
      const dateStr = data.published_at
        ? new Date(data.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : "";
      statusEl.textContent = `Latest build: ${data.tag_name}${dateStr ? " · " + dateStr : ""} · Mac, Windows & Linux`;
    })
    .catch(() => {
      // Keep default fallback label offline or before first release
    });

  // 4. Screenshots & Feature Data
  const GALLERY = [
    {
      src: "assets/map-balkans.webp",
      title: "3D World Map — Balkans & Anatolia (1453)",
      desc: "Detailed terrain, towns, armies, and sea lanes starting 30 May 1453."
    },
    {
      src: "assets/map-world.webp",
      title: "Painted Chart Zoomed-Out View",
      desc: "Across Europe, North Africa, the Middle East, and India with curved realm names."
    },
    {
      src: "assets/battle.webp",
      title: "Tactical Real-Time Battles",
      desc: "Direct regiment control with formations, morale, stances, and battle speed controls."
    },
    {
      src: "assets/court.webp",
      title: "Court & Ruling Dynasty",
      desc: "Historical 1453 rulers, traits, succession, councilors, and manuscript portraits."
    },
    {
      src: "assets/trade.webp",
      title: "Overland & Sea Trade Routes",
      desc: "Assign merchants along Silk Road and Black Sea corridors and tune toll policy."
    },
    {
      src: "assets/diplomacy.webp",
      title: "Diplomacy & Peace Treaties",
      desc: "Alliances, guarantees, embargoes, relation slots, and war negotiation."
    }
  ];

  const FEATURES = {
    map: {
      img: "assets/map-balkans.webp",
      title: "1453 Living Map",
      desc: "Explore a richly detailed 3D world painted like an antique chart from afar, zooming down to towns, coastlines, forests, and marching armies.",
      points: [
        "1,378+ provinces starting 30 May 1453 with daily simulation and 5 speeds",
        "Instant map modes: political, terrain, religion, culture, goods, and markets",
        "Chronicle by reign, ledger graphs, and full map timelapse"
      ]
    },
    battles: {
      img: "assets/battle.webp",
      title: "Tactical Battles & Sieges",
      desc: "Lead armies yourself on Total War-style battlefields or auto-resolve minor clashes to keep your campaign moving.",
      points: [
        "Formations: Line, Column, Wedge, Square, Wagons, and Skirmish",
        "Control stances (Hold, Advance, Charge, Volley) with touch or mouse",
        "Morale, fatigue, terrain modifiers, and fortress sieges"
      ]
    },
    court: {
      img: "assets/court.webp",
      title: "Dynasty & Court",
      desc: "Every realm is led by real historical figures of 1453 with families, ambitions, traits, and manuscript-style portraits.",
      points: [
        "Manage spouses, heirs, succession laws, and noble privileges",
        "Appoint councilors and balance Crown authority against estates",
        "Track every ruler's reign automatically in the Chronicle"
      ]
    },
    trade: {
      img: "assets/trade.webp",
      title: "Trade & Diplomacy",
      desc: "Shape the economy along historic land and sea corridors while outmaneuvering rival empires at the diplomatic table.",
      points: [
        "Route goods like raw silk across regional markets and toll chokepoints",
        "Negotiate alliances, guarantees, non-aggression pacts, and peace deals",
        "70+ historical events shaping the early modern world"
      ]
    }
  };

  // Feature Tab Switching
  const tabBtns = document.querySelectorAll(".feature-tab");
  const spotlightImg = document.getElementById("spotlight-img");
  const spotlightTitle = document.getElementById("spotlight-title");
  const spotlightDesc = document.getElementById("spotlight-desc");
  const spotlightPoints = document.getElementById("spotlight-points");
  const spotlightMedia = document.getElementById("spotlight-media");

  let activeFeatureKey = "map";

  function setFeature(key) {
    const f = FEATURES[key];
    if (!f) return;
    activeFeatureKey = key;
    tabBtns.forEach((btn) => {
      const active = btn.dataset.feature === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    if (spotlightImg) {
      spotlightImg.src = f.img;
      spotlightImg.alt = f.title;
    }
    if (spotlightTitle) spotlightTitle.textContent = f.title;
    if (spotlightDesc) spotlightDesc.textContent = f.desc;
    if (spotlightPoints) {
      spotlightPoints.innerHTML = f.points.map((pt) => `<li>${pt}</li>`).join("");
    }
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => setFeature(btn.dataset.feature));
  });

  if (spotlightMedia) {
    spotlightMedia.addEventListener("click", () => {
      const currentImg = FEATURES[activeFeatureKey]?.img || "assets/map-balkans.webp";
      const idx = Math.max(0, GALLERY.findIndex((g) => g.src === currentImg));
      openLightbox(idx);
    });
  }

  // 5. Render Gallery Grid
  const galleryGrid = document.getElementById("gallery-grid");
  if (galleryGrid) {
    galleryGrid.innerHTML = GALLERY.map(
      (item, idx) => `
        <article class="parchment gold-frame gallery-card" data-gallery-idx="${idx}" tabindex="0" role="button" aria-label="View ${item.title}">
          <img src="${item.src}" alt="${item.title}" loading="lazy" />
          <div class="gallery-caption">
            <strong>${item.title}</strong>
            <span>${item.desc}</span>
          </div>
        </article>
      `
    ).join("");

    galleryGrid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-gallery-idx]");
      if (card) openLightbox(Number(card.dataset.galleryIdx));
    });
    galleryGrid.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const card = e.target.closest("[data-gallery-idx]");
        if (card) {
          e.preventDefault();
          openLightbox(Number(card.dataset.galleryIdx));
        }
      }
    });
  }

  // 6. Lightbox Logic
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbTitle = document.getElementById("lightbox-title");
  const lbDesc = document.getElementById("lightbox-desc");
  let lbIndex = 0;

  function renderLightbox() {
    const item = GALLERY[lbIndex];
    if (!item) return;
    lbImg.src = item.src;
    lbImg.alt = item.title;
    lbTitle.textContent = item.title;
    lbDesc.textContent = item.desc;
  }

  function openLightbox(idx) {
    lbIndex = (idx + GALLERY.length) % GALLERY.length;
    renderLightbox();
    lightbox.classList.add("is-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
  }

  document.getElementById("lb-prev")?.addEventListener("click", () => {
    lbIndex = (lbIndex - 1 + GALLERY.length) % GALLERY.length;
    renderLightbox();
  });
  document.getElementById("lb-next")?.addEventListener("click", () => {
    lbIndex = (lbIndex + 1) % GALLERY.length;
    renderLightbox();
  });
  document.getElementById("lb-close")?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") {
      lbIndex = (lbIndex - 1 + GALLERY.length) % GALLERY.length;
      renderLightbox();
    }
    if (e.key === "ArrowRight") {
      lbIndex = (lbIndex + 1) % GALLERY.length;
      renderLightbox();
    }
  });

  // 7. Trailer Slot (YouTube, local MP4, or interactive Coming Soon showcase)
  function extractYoutubeId(input) {
    if (!input) return "";
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    try {
      const url = new URL(trimmed);
      if (url.hostname.includes("youtu.be")) return url.pathname.slice(1).split("/")[0];
      if (url.searchParams.get("v")) return url.searchParams.get("v");
      const parts = url.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    } catch {
      return "";
    }
    return "";
  }

  const trailerStage = document.getElementById("trailer-stage");
  const trailerBarText = document.getElementById("trailer-bar-text");
  const trailerCfg = cfg.trailer || {};
  const ytId = extractYoutubeId(trailerCfg.youtubeUrl);

  if (trailerStage) {
    if (ytId) {
      trailerStage.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}?rel=0" title="Gez Official Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      if (trailerBarText) trailerBarText.textContent = "Official Gameplay Trailer";
    } else if (trailerCfg.mp4Url) {
      trailerStage.innerHTML = `<video controls playsinline poster="assets/battle.webp"><source src="${trailerCfg.mp4Url}" type="video/mp4" /></video>`;
      if (trailerBarText) trailerBarText.textContent = "Official Gameplay Trailer";
    } else {
      trailerStage.innerHTML = `
        <div class="trailer-poster" id="trailer-coming-soon" role="button" tabindex="0" aria-label="Open gameplay screenshot tour">
          <img id="trailer-poster-img" src="assets/battle.webp" alt="Gez Gameplay Preview" />
          <div class="trailer-overlay">
            <div class="play-emblem" aria-hidden="true">▶</div>
            <div class="trailer-title">Official Trailer Coming Soon</div>
            <div class="trailer-sub">${trailerCfg.comingSoonNote || "Click to tour alpha gameplay screenshots."}</div>
          </div>
        </div>
      `;

      const posterEl = document.getElementById("trailer-coming-soon");
      const posterImg = document.getElementById("trailer-poster-img");
      const previewShots = ["assets/battle.webp", "assets/map-balkans.webp", "assets/court.webp", "assets/trade.webp"];
      let shotIdx = 0;

      setInterval(() => {
        if (!posterImg) return;
        shotIdx = (shotIdx + 1) % previewShots.length;
        posterImg.src = previewShots[shotIdx];
      }, 4500);

      posterEl?.addEventListener("click", () => openLightbox(0));
      posterEl?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(0);
        }
      });
    }
  }
})();
