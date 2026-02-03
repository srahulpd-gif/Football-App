// ===============================
// SIMPLE TEAM LIST (EDITABLE)
// ===============================
const teams = [
  "Manchester City",
  "Manchester United",
  "Arsenal",
  "Chelsea",
  "Liverpool",
  "Tottenham",
  "Barcelona",
  "Real Madrid",
  "Atletico Madrid",
  "Bayern Munich",
  "Borussia Dortmund",
  "Juventus",
  "Inter",
  "AC Milan",
  "PSG",
  "Marseille",
  "Ajax",
  "Porto",
  "Benfica",
  "Sporting CP",
  "Universitatea Cluj",
  "Universitatea Craiova",
  "FC Arges",
  "Rapid Bucuresti",
  "CFR Cluj",
  "FCSB"
];

// ===============================
// ELEMENTS
// ===============================
const homeInput = document.getElementById("homeTeam");
const awayInput = document.getElementById("awayTeam");
const homeList = document.getElementById("homeList");
const awayList = document.getElementById("awayList");
const resultBox = document.getElementById("result");
const analyzeBtn = document.getElementById("analyzeBtn");

// ===============================
// AUTOCOMPLETE FUNCTION
// ===============================
function showSuggestions(value, list, input) {
  list.innerHTML = "";
  if (value.length < 2) return;

  teams
    .filter(team =>
      team.toLowerCase().includes(value.toLowerCase())
    )
    .forEach(team => {
      const li = document.createElement("li");
      li.textContent = team;
      li.style.cursor = "pointer";
      li.style.padding = "6px";

      li.onclick = () => {
        input.value = team;
        list.innerHTML = "";
      };

      list.appendChild(li);
    });
}

// ===============================
// INPUT EVENTS
// ===============================
homeInput.addEventListener("input", () => {
  showSuggestions(homeInput.value, homeList, homeInput);
});

awayInput.addEventListener("input", () => {
  showSuggestions(awayInput.value, awayList, awayInput);
});

// ===============================
// ANALYZE BUTTON (SIMPLE LOGIC)
// ===============================
analyzeBtn.addEventListener("click", () => {
  const home = homeInput.value;
  const away = awayInput.value;

  if (!home || !away) {
    resultBox.innerHTML = "⚠️ Please select both teams";
    return;
  }

  // VERY SIMPLE DEMO ANALYSIS
  let category = "NEUTRAL";

  if (home.includes("City") || home.includes("Madrid")) {
    category = "HOME WIN";
  } else if (away.includes("City") || away.includes("Madrid")) {
    category = "AWAY WIN";
  }

  resultBox.innerHTML = `
    <h3>${home} vs ${away}</h3>
    <h2>${category}</h2>
    <p>This is a simple analytical suggestion.</p>
  `;
});

// ===============================
// CLOSE LIST ON OUTSIDE CLICK
// ===============================
document.addEventListener("click", e => {
  if (!e.target.closest("input")) {
    homeList.innerHTML = "";
    awayList.innerHTML = "";
  }
});
