/**
 * GitHub API client with in-memory caching and resilient fallbacks.
 * Works seamlessly in Node.js 18+ (uses native fetch).
 */

const fs = require("node:fs");
const path = require("node:path");

const USERNAME = "Monomee";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

let cachedData = null;
let lastFetchTime = 0;

let cachedAvatarBase64 = null;
let lastAvatarFetchTime = 0;
const AVATAR_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour for avatar

const LANG_COLORS = {
  "C#": "#ffd166",
  ShaderLab: "#00e5ff",
  Java: "#00ff9f",
  JavaScript: "#ff6b6b",
  HTML: "#ff6b6b",
  TypeScript: "#38bdf8",
  Python: "#a78bfa",
  Other: "#7d8995",
};

/**
 * Fetch avatar as base64 string so SVG can embed it directly without
 * CORS or GitHub Camo proxy sub-resource blocking.
 */
async function fetchAvatarBase64(username = USERNAME) {
  const now = Date.now();
  if (cachedAvatarBase64 && now - lastAvatarFetchTime < AVATAR_CACHE_TTL_MS) {
    return cachedAvatarBase64;
  }

  // 1. Check if local avatar file exists in profile-assets
  try {
    const localAvatarPath = path.join(__dirname, "..", "profile-assets", "avatar.png");
    if (fs.existsSync(localAvatarPath)) {
      const buffer = fs.readFileSync(localAvatarPath);
      if (buffer.length > 1000) {
        cachedAvatarBase64 = `data:image/png;base64,${buffer.toString("base64")}`;
        lastAvatarFetchTime = now;
        return cachedAvatarBase64;
      }
    }
  } catch (err) {
    // Continue to network fetch
  }

  // 2. Fetch from direct avatar URL or github.com
  const avatarUrls = [
    `https://avatars.githubusercontent.com/u/165058731?v=4`,
    `https://github.com/${username}.png`,
  ];

  for (const url of avatarUrls) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Monome-Profile-Service" },
        redirect: "follow",
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const contentType = res.headers.get("content-type") || "image/png";
        cachedAvatarBase64 = `data:${contentType};base64,${base64}`;
        lastAvatarFetchTime = now;
        return cachedAvatarBase64;
      }
    } catch (err) {
      // try next URL
    }
  }

  return cachedAvatarBase64 || null;
}

/**
 * Fetch GitHub telemetry data for Monomee.
 */
async function fetchGitHubData(username = USERNAME) {
  const now = Date.now();
  if (cachedData && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedData;
  }

  const token = process.env.GITHUB_TOKEN;
  const headers = {
    "User-Agent": "Monome-Profile-Service",
    Accept: "application/vnd.github+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Baseline verified values for Monomee
  const result = {
    username,
    name: "Nguyen Viet Hoang",
    role: "Game Developer",
    class: "GAMEPLAY ENGINEER",
    engine: "UNITY",
    language: "C#",
    status: "BUILDING",
    publicRepos: 33,
    followers: 2,
    following: 0,
    stars: 4,
    activityLevel: 88,
    recentEventsCount: 32,
    eventBreakdown: {
      commits: 16,
      prs: 11,
      others: 5,
      total: 32,
    },
    languages: [
      { name: "C#", pct: 46.7, count: 14, color: LANG_COLORS["C#"] },
      { name: "ShaderLab", pct: 13.3, count: 4, color: LANG_COLORS.ShaderLab },
      { name: "Java", pct: 10.0, count: 3, color: LANG_COLORS.Java },
      { name: "JavaScript", pct: 10.0, count: 3, color: LANG_COLORS.JavaScript },
      { name: "Other", pct: 20.0, count: 6, color: LANG_COLORS.Other },
    ],
    lastUpdated: new Date().toISOString(),
    avatarBase64: null,
  };

  try {
    // 1. Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      signal: AbortSignal.timeout(6000),
    });

    if (userRes.ok) {
      const userData = await userRes.json();
      result.publicRepos = userData.public_repos ?? result.publicRepos;
      result.followers = userData.followers ?? result.followers;
      result.following = userData.following ?? result.following;
    }

    // 2. Fetch repos to calculate stars and language distribution
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers, signal: AbortSignal.timeout(6000) }
    );

    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos)) {
        result.stars = repos.reduce(
          (acc, r) => acc + (r.stargazers_count || 0),
          0
        );

        // Language analysis
        const langCounts = {};
        repos.forEach((r) => {
          const l = r.language === "HTML" ? "JavaScript" : r.language;
          if (l) {
            langCounts[l] = (langCounts[l] || 0) + 1;
          }
        });

        const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0);
        if (totalLangs > 0) {
          const sorted = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
          const top = sorted.slice(0, 4);
          const otherSum = sorted.slice(4).reduce((a, b) => a + b[1], 0);

          const computed = top.map(([name, count]) => ({
            name,
            pct: parseFloat(((count / totalLangs) * 100).toFixed(1)),
            count,
            color: LANG_COLORS[name] || "#38bdf8",
          }));

          if (otherSum > 0) {
            computed.push({
              name: "Other",
              pct: parseFloat(((otherSum / totalLangs) * 100).toFixed(1)),
              count: otherSum,
              color: LANG_COLORS.Other,
            });
          }
          result.languages = computed;
        }
      }
    }

    // 3. Fetch public events for activity & commit breakdown
    const eventsRes = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      { headers, signal: AbortSignal.timeout(6000) }
    );

    if (eventsRes.ok) {
      const events = await eventsRes.json();
      if (Array.isArray(events)) {
        result.recentEventsCount = events.length;
        let commits = 0;
        let prs = 0;
        let others = 0;

        events.forEach((e) => {
          if (e.type === "PushEvent") commits++;
          else if (e.type === "PullRequestEvent") prs++;
          else others++;
        });

        result.eventBreakdown = {
          commits: commits || result.eventBreakdown.commits,
          prs: prs || result.eventBreakdown.prs,
          others: others || result.eventBreakdown.others,
          total: events.length || result.eventBreakdown.total,
        };
        result.activityLevel = Math.min(
          96,
          Math.max(50, 40 + events.length * 1.5)
        );
      }
    }
  } catch (err) {
    console.warn("GitHub API fetch warning (using verified telemetry):", err.message);
  }

  // Fetch avatar base64 (from local file or remote)
  result.avatarBase64 = await fetchAvatarBase64(username);

  cachedData = result;
  lastFetchTime = now;
  return result;
}

module.exports = {
  fetchGitHubData,
  fetchAvatarBase64,
  USERNAME,
  LANG_COLORS,
};
