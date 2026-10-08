/**
 * Build script to generate static SVG cards for profile-assets/
 * Can be run locally or via GitHub Actions workflow.
 */

const fs = require("node:fs");
const path = require("node:path");
const { fetchGitHubData } = require("../lib/github");
const {
  renderHeroCard,
  renderTelemetryCard,
  renderProjectCard,
  renderSkillsCard,
} = require("../lib/cards");

async function main() {
  console.log("[build] Fetching GitHub telemetry for Monomee...");
  const data = await fetchGitHubData("Monomee");
  console.log(`[build] Repos: ${data.publicRepos}, Stars: ${data.stars}, Followers: ${data.followers}`);

  const outputDir = path.join(__dirname, "..", "profile-assets");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = {
    "hero-card.svg": renderHeroCard(data),
    "telemetry-card.svg": renderTelemetryCard(data),
    "project-card.svg": renderProjectCard(),
    "skills-card.svg": renderSkillsCard(),
  };

  for (const [filename, content] of Object.entries(files)) {
    const dest = path.join(outputDir, filename);
    fs.writeFileSync(dest, content, "utf-8");
    console.log(`[build] Wrote ${filename} (${content.length} bytes)`);
  }

  console.log("[build] All profile asset cards generated successfully!");
}

main().catch((err) => {
  console.error("[build] Failed:", err);
  process.exit(1);
});
