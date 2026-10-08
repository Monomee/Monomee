const { fetchGitHubData } = require("../lib/github");
const { renderTelemetryCard } = require("../lib/cards");

module.exports = async function handler(req, res) {
  try {
    const data = await fetchGitHubData("Monomee");
    const svg = renderTelemetryCard(data);

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400"
    );
    res.status ? res.status(200).send(svg) : res.end(svg);
  } catch (err) {
    console.error("Error generating telemetry card:", err);
    const svg = renderTelemetryCard({});
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.status ? res.status(200).send(svg) : res.end(svg);
  }
};
