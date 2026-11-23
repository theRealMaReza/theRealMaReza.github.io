(function () {
  const cfg = window.GEZ_CONFIG || {};
  const repo = cfg.websiteRepo || "theRealMaReza/theRealMaReza.github.io";
  const releaseBase = `https://github.com/${repo}/releases/latest/download`;

  const downloads = cfg.downloads || {
    mac: { label: "Download for Mac", shortLabel: "macOS", file: "Gez-Mac.zip", note: "Universal (Apple Silicon & Intel)" },
    windows: { label: "Download for Windows", shortLabel: "Windows", file: "Gez-Windows.zip", note: "64-bit Windows 10 / 11" },
    linux: { label: "Download for Linux", shortLabel: "Linux", file: "Gez-Linux.tar.gz", note: "64-bit x86_64" }
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

  // 1. Wire Hero & Header Downloads
  const detectedOS = detectOS();
  const otherOS = ["mac", "windows", "linux"].filter((k) => k !== detectedOS);

  const heroBtn = document.getElementById("hero-download-btn");
  const navBtn = document.getElementById("nav-download-btn");
  const altOsEl = document.getElementById("hero-alt-os");

  if (heroBtn) {
    heroBtn.href = downloadUrl(detectedOS);
    heroBtn.querySelector("span").textContent = downloads[detectedOS].label;
  }
  if (navBtn) {
    navBtn.href = downloadUrl(detectedOS);
  }
  if (altOsEl) {
    altOsEl.innerHTML =
      "Also on: " +
      otherOS
        .map((k) => `<a href="${downloadUrl(k)}">${downloads[k].shortLabel}</a>`)
        .join("");
  }

  // 2. Render Platform Cards
  const platformGrid = document.getElementById("platform-grid");
  const platformTitles = { mac: "macOS", windows: "Windows", linux: "Linux" };

  if (platformGrid) {
    platformGrid.innerHTML = ["mac", "windows", "linux"]
      .map((key) => {
        const item = downloads[key];
        const isDetected = key === detectedOS;
        return `
          <div class="platform-card ${isDetected ? "is-detected" : ""}">
            <div>
              ${isDetected ? `<div class="platform-tag">Detected Platform</div>` : `<div class="platform-tag">Desktop Alpha</div>`}
              <h3>${platformTitles[key]}</h3>
              <p>${item.note}</p>
            </div>
            <a class="${isDetected ? "btn-solid" : "btn-ghost"}" href="${downloadUrl(key)}">${item.label}</a>
          </div>
        `;
      })
      .join("");
  }

  // 3. Fetch Latest Release Version Badge
  const statusEl = document.getElementById("release-status");
  fetch(`https://api.github.com/repos/${repo}/releases/latest`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data || !data.tag_name || !statusEl) return;
      const dateStr = data.published_at
        ? new Date(data.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : "";
      statusEl.textContent = `Build ${data.tag_name}${dateStr ? " · " + dateStr : ""} · Free Alpha`;
    })
    .catch(() => {});

  // 4. Media Carousel (Slide 0 = Trailer slot, Slides 1..6 = Screenshots)
  const trailerCfg = cfg.trailer || {};
  const ytId = extractYoutubeId(trailerCfg.youtubeUrl);
  const hasTrailer = Boolean(ytId || trailerCfg.mp4Url);

  const heroTrailerBtn = document.getElementById("hero-trailer-btn");
  const heroTrailerLabel = document.getElementById("hero-trailer-label");
  if (heroTrailerLabel && hasTrailer) {
    heroTrailerLabel.textContent = "Watch Trailer";
  }
  heroTrailerBtn?.addEventListener("click", () => {
    if (hasTrailer) {
      currentIdx = 0;
      trailerPlaying = true;
      renderCarousel();
    }
  });

  const MEDIA = [
    {
      type: "trailer",
      thumb: "assets/battle.webp",
      title: hasTrailer ? "Official Gameplay Trailer" : "Official Trailer — Coming Soon",
      desc: hasTrailer
        ? "Watch Gez in motion across campaign map, court, and tactical battles."
        : trailerCfg.comingSoonNote || "Trailer in production. Click to tour alpha gameplay screenshots."
    },
    {
      type: "image",
      thumb: "assets/map-world.webp",
      title: "Painted Chart — Europe, Middle East & India (1453)",
      desc: "Zoomed-out atlas presentation with curved borders and historical realms."
    },
    {
      type: "image",
      thumb: "assets/map-balkans.webp",
      title: "3D Campaign Map — Balkans & Anatolia",
      desc: "Detailed topography, cities, marching armies, and sea lanes."
    },
    {
      type: "image",
      thumb: "assets/battle.webp",
      title: "Real-Time Tactical Battles",
      desc: "Direct regiment control with formations, stances, morale, and speed controls."
    },
    {
      type: "image",
      thumb: "assets/court.webp",
      title: "Court & Ruling Dynasty",
      desc: "Historical 1453 rulers, traits, succession laws, and manuscript portraits."
    },
    {
      type: "image",
      thumb: "assets/trade.webp",
      title: "Overland & Sea Trade Routes",
      desc: "Route goods from Tabriz to Constantinople and manage toll policies."
    },
    {
      type: "image",
      thumb: "assets/diplomacy.webp",
      title: "Diplomacy & War Negotiation",
      desc: "Form alliances, issue guarantees, enforce embargoes, and broker peace."
    }
  ];

  const activeBox = document.getElementById("carousel-active");
  const peekPrevImg = document.getElementById("peek-prev-img");
  const peekNextImg = document.getElementById("peek-next-img");
  const titleEl = document.getElementById("carousel-title");
  const descEl = document.getElementById("carousel-desc");
  const dotsEl = document.getElementById("media-dots");

  let currentIdx = 0;
  let trailerPlaying = false;

  function renderCarousel() {
    const item = MEDIA[currentIdx];
    const prevItem = MEDIA[(currentIdx - 1 + MEDIA.length) % MEDIA.length];
    const nextItem = MEDIA[(currentIdx + 1) % MEDIA.length];

    if (peekPrevImg) peekPrevImg.src = prevItem.thumb;
    if (peekNextImg) peekNextImg.src = nextItem.thumb;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.desc;

    if (activeBox) {
      if (item.type === "trailer") {
        if (trailerPlaying && ytId) {
          activeBox.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0" title="Gez Official Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else if (trailerPlaying && trailerCfg.mp4Url) {
          activeBox.innerHTML = `<video controls autoplay playsinline poster="${item.thumb}"><source src="${trailerCfg.mp4Url}" type="video/mp4" /></video>`;
        } else {
          activeBox.innerHTML = `
            <div class="media-poster" id="trailer-poster-btn" role="button" tabindex="0" aria-label="${hasTrailer ? "Play trailer" : "Preview screenshots"}">
              <img src="${item.thumb}" alt="${item.title}" />
              <div class="media-poster-overlay">
                <div class="play-circle" aria-hidden="true">▶</div>
                <div class="trailer-badge">${hasTrailer ? "Play Official Trailer" : "Trailer Coming Soon"}</div>
                <div class="trailer-hint">${item.desc}</div>
              </div>
            </div>
          `;
          document.getElementById("trailer-poster-btn")?.addEventListener("click", () => {
            if (hasTrailer) {
              trailerPlaying = true;
              renderCarousel();
            } else {
              openLightbox(1);
            }
          });
        }
      } else {
        trailerPlaying = false;
        activeBox.innerHTML = `
          <button class="screenshot-click-layer" type="button" aria-label="Enlarge ${item.title}">
            <img src="${item.thumb}" alt="${item.title}" />
          </button>
        `;
        activeBox.querySelector(".screenshot-click-layer")?.addEventListener("click", () => {
          openLightbox(currentIdx);
        });
      }
    }

    if (dotsEl) {
      dotsEl.innerHTML = MEDIA.map(
        (_, i) =>
          `<button class="pager-num ${i === currentIdx ? "is-active" : ""}" data-slide="${i}" type="button" aria-label="Media slide ${i + 1}">${i + 1}</button>`
      ).join("");
    }
  }

  function goToSlide(idx) {
    trailerPlaying = false;
    currentIdx = (idx + MEDIA.length) % MEDIA.length;
    renderCarousel();
  }

  document.getElementById("media-prev")?.addEventListener("click", () => goToSlide(currentIdx - 1));
  document.getElementById("media-next")?.addEventListener("click", () => goToSlide(currentIdx + 1));
  document.getElementById("peek-prev")?.addEventListener("click", () => goToSlide(currentIdx - 1));
  document.getElementById("peek-next")?.addEventListener("click", () => goToSlide(currentIdx + 1));
  dotsEl?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-slide]");
    if (btn) goToSlide(Number(btn.dataset.slide));
  });

  renderCarousel();

  // 5. Lightbox for Screenshots (indices 1..MEDIA.length-1)
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbTitle = document.getElementById("lightbox-title");
  const lbDesc = document.getElementById("lightbox-desc");
  let lbIdx = 1;

  function renderLightbox() {
    const item = MEDIA[lbIdx];
    if (!item) return;
    lbImg.src = item.thumb;
    lbImg.alt = item.title;
    lbTitle.textContent = item.title;
    lbDesc.textContent = item.desc;
  }

  function openLightbox(idx) {
    lbIdx = idx < 1 ? 1 : idx;
    renderLightbox();
    lightbox?.classList.add("is-open");
  }

  function closeLightbox() {
    lightbox?.classList.remove("is-open");
  }

  function stepLightbox(delta) {
    const shotsCount = MEDIA.length - 1;
    const offset = ((lbIdx - 1 + delta) % shotsCount + shotsCount) % shotsCount;
    lbIdx = offset + 1;
    renderLightbox();
  }

  document.querySelectorAll("[data-lightbox-index]").forEach((el) => {
    el.addEventListener("click", () => openLightbox(Number(el.dataset.lightboxIndex)));
  });

  document.getElementById("lb-prev")?.addEventListener("click", () => stepLightbox(-1));
  document.getElementById("lb-next")?.addEventListener("click", () => stepLightbox(1));
  document.getElementById("lb-close")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  // 6. Auto-hide header on downward scroll & Back-to-Top toggle (Paradox pattern)
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("back-to-top");
  let lastY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (navbar) {
        navbar.classList.toggle("is-hidden", y > 120 && y > lastY);
      }
      if (backToTop) {
        backToTop.classList.toggle("is-visible", y > 480);
      }
      lastY = y;
    },
    { passive: true }
  );
})();
