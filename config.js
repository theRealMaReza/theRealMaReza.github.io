// ============================================================================
// Gez Website Configuration
// Edit this file to add your trailer or change your GitHub website repo name.
// ============================================================================

window.GEZ_CONFIG = {
  // Your website repository on GitHub (never links to the private game repo).
  websiteRepo: "theRealMaReza/theRealMaReza.github.io",

  // Trailer settings:
  // 1) When your trailer is on YouTube, paste the link or video ID below, e.g.:
  //    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  // 2) Or if you upload an MP4 file into assets/, set mp4Url: "assets/trailer.mp4",
  // Leave both empty ("") to show the "Trailer Coming Soon" showcase frame.
  trailer: {
    youtubeUrl: "",
    mp4Url: "assets/trailer.mp4",
    comingSoonNote: "Official gameplay trailer is in the works. Explore the live screenshots below while alpha builds are updated."
  },

  // Download file names published as GitHub Release assets on the website repo.
  downloads: {
    mac: {
      label: "Download for Mac",
      shortLabel: "macOS (.zip)",
      file: "Gez-Mac.zip",
      note: "Universal / Apple Silicon & Intel · macOS"
    },
    windows: {
      label: "Download for Windows",
      shortLabel: "Windows (.zip)",
      file: "Gez-Windows.zip",
      note: "64-bit Windows 10 / 11"
    },
    linux: {
      label: "Download for Linux",
      shortLabel: "Linux (.tar.gz)",
      file: "Gez-Linux.tar.gz",
      note: "64-bit x86_64"
    }
  }
};
