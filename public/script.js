async function analyze() {
  const home = document.getElementById("home").value;
  const away = document.getElementById("away").value;

  const res = await fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ home, away })
  });

  const d = await res.json();

  if (d.risk === "AVOID") {
    document.getElementById("result").innerHTML = `
      <div class="avoid">
        <h3>${home} vs ${away}</h3>
        <p>❌ AVOID</p>
        <p>${d.reason}</p>
      </div>
    `;
    return;
  }

  document.getElementById("result").innerHTML = `
    <div class="ok">
      <h3>${d.match}</h3>
      <p><b>League:</b> ${d.league}</p>
      <p><b>Total xG:</b> ${d.totalXG}</p>
      <p><b>Goals:</b> ${d.goalsBet} (${d.goalsStrength})</p>
      <p><b>Result:</b> ${d.resultBet}</p>
      <p class="oktext">🟢 OK</p>
    </div>
  `;
}
