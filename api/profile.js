const { fetchGitHubData } = require("../lib/github");
const { renderHeroCard } = require("../lib/cards");

module.exports = async function handler(req, res) {
  try {
    const data = await fetchGitHubData("Monomee");
    const svg = renderHeroCard(data);

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400"
    );
    res.status ? res.status(200).send(svg) : res.end(svg);
  } catch (err) {
    console.error("Error generating hero profile card:", err);
    // Fallback card with default data
    const svg = renderHeroCard({
      name: "Nguyen Viet Hoang",
      role: "Game Developer",
      class: "GAMEPLAY ENGINEER",
      engine: "UNITY",
      language: "C#",
      status: "BUILDING",
    });
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.status ? res.status(200).send(svg) : res.end(svg);
  }
};
