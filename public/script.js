// ===============================
// BASIC CONFIG
// ===============================
const homeInput = document.getElementById("homeTeam");
const awayInput = document.getElementById("awayTeam");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultBox = document.getElementById("result");

// ===============================
// TEAM AUTOCOMPLETE FUNCTION
// ===============================
async function searchTeams(query, listElement, inputElement) {
  if (query.length < 3) {
    listElement.innerHTML = "";
    return;
  }

  try {
    const res = await fetch(`/teams?search=${query}`);
    const data = await res.json();

    listElement.innerHTML = "";

    if (!data.response) return;

    data.response.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.team.name;
      li.style.cursor = "pointer";
      li.style.padding = "6px";
      li.style.borderBottom = "1px solid #ddd";

      li.onclick = () => {
        inputElement.value = item.team.name;
        listElement.innerHTML = "";
      };

      listElement.appendChild(li);
    });
  } catch (err) {
    console.error("Team search error", err);
  }
}

// ===============================
// HOME TEAM AUTOCOMPLETE
// ===============================
homeInput.addEventListener("input", e => {
  searchTeams(
    e.target.value,
    document.getElementById("homeList"),
    homeInput
  );
});

// ===============================
// AWAY TEAM AUTOCOMPLETE
// ===============================
awayInput.addEventListener("input", e => {
  searchTeams(
    e.target.value,
    document.getElementById("awayList"),
    awayInput
  );
});

// ===============================
// ANALYZE MATCH
// ===============================
analyzeBtn.addEventListener("click", async () => {
  const home = homeInput.value.trim();
  const away = awayInput.value.trim();

  if (!home || !away) {
    resultBox.innerHTML = "⚠️ Please select both teams from suggestions";
    return;
  }

  resultBox.innerHTML = "⏳ Analyzing match...";

  try {
    const res = await fetch(`/analyze?home=${home}&away=${away}`);
    const data = await res.json();

    resultBox.innerHTML = `
      <h3>${home} vs ${away}</h3>
      <h2>${data.category}</h2>
      <p>${data.reason}</p>
    `;
  } catch (err) {
    console.error(err);
    resultBox.innerHTML = "❌ Error analyzing match";
  }
});

// ===============================
// CLOSE SUGGESTIONS ON CLICK OUTSIDE
// ===============================
document.addEventListener("click", e => {
  if (!e.target.closest("input")) {
    document.getElementById("homeList").innerHTML = "";
    document.getElementById("awayList").innerHTML = "";
  }
});
