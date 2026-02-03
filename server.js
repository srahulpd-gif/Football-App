require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const API = "https://v3.football.api-sports.io";
const headers = { "x-apisports-key": process.env.API_FOOTBALL_KEY };

// ---------- HELPERS ----------
function goalDecision(xg) {
  if (xg >= 2.9) return { bet: "Over 2.5 Goals", strength: "Strong" };
  if (xg >= 2.7) return { bet: "Over 2.5 Goals", strength: "Medium" };
  if (xg <= 2.1) return { bet: "Under 2.5 Goals", strength: "Strong" };
  if (xg <= 2.3) return { bet: "Under 2.5 Goals", strength: "Medium" };
  return { bet: "No clear edge", strength: "Avoid" };
}

function resultDecision(diff, drawRate, xg) {
  let drawScore = 0;
  if (Math.abs(diff) < 10) drawScore++;
  if (drawRate > 30) drawScore++;
  if (xg > 2.2 && xg < 2.6) drawScore++;

  if (drawScore >= 2) return "Draw";
  if (diff >= 15) return "Home Win";
  if (diff <= -15) return "Away Win";
  return "Draw";
}

// ---------- MAIN API ----------
app.post("/analyze", async (req, res) => {
  try {
    const { home, away } = req.body;

    // 🔍 Get upcoming fixture
    const fixtureRes = await axios.get(`${API}/fixtures`, {
      headers,
      params: { team: home, next: 1 }
    });

    if (!fixtureRes.data.response.length)
      return res.json({ risk: "AVOID", reason: "No upcoming fixture found" });

    const fixture = fixtureRes.data.response[0];
    const leagueId = fixture.league.id;
    const season = fixture.league.season;

    if (fixture.league.type !== "League") {
      return res.json({
        risk: "AVOID",
        reason: "Cup / Friendly match"
      });
    }

    // 🆔 Get team IDs
    const homeId = fixture.teams.home.id;
    const awayId = fixture.teams.away.id;

    // 📊 Stats
    const homeStats = await axios.get(`${API}/teams/statistics`, {
      headers, params: { team: homeId, league: leagueId, season }
    });

    const awayStats = await axios.get(`${API}/teams/statistics`, {
      headers, params: { team: awayId, league: leagueId, season }
    });

    const h = homeStats.data.response;
    const a = awayStats.data.response;

    const homeXG =
      (h.goals.for.average.home + a.goals.against.average.away) / 2;
    const awayXG =
      (a.goals.for.average.away + h.goals.against.average.home) / 2;
    const totalXG = homeXG + awayXG;

    const strengthDiff =
      parseFloat(h.fixtures.wins.home.percentage) -
      parseFloat(a.fixtures.wins.away.percentage);

    const drawRate =
      (parseFloat(h.fixtures.draws.home.percentage) +
        parseFloat(a.fixtures.draws.away.percentage)) / 2;

    const goals = goalDecision(totalXG);
    if (goals.strength === "Avoid") {
      return res.json({
        home, away,
        totalXG: totalXG.toFixed(2),
        risk: "AVOID",
        reason: "Unstable goal range"
      });
    }

    const result = resultDecision(strengthDiff, drawRate, totalXG);

    res.json({
      match: `${home} vs ${away}`,
      league: fixture.league.name,
      totalXG: totalXG.toFixed(2),
      goalsBet: goals.bet,
      goalsStrength: goals.strength,
      resultBet: result,
      risk: "OK"
    });

  } catch (err) {
    res.status(500).json({ risk: "AVOID", reason: "API error or limit reached" });
  }
});

app.listen(3000, () =>
  console.log("✅ App running at http://localhost:3000")
);
