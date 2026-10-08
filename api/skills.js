const { renderSkillsCard } = require("../lib/cards");

module.exports = async function handler(req, res) {
  try {
    const svg = renderSkillsCard();

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"
    );
    res.status ? res.status(200).send(svg) : res.end(svg);
  } catch (err) {
    console.error("Error generating skills card:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
};
