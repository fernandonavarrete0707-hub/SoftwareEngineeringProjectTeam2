//this file is only responsible for splash & entry and building the entry grid

function buildTeamGrid(containerId, teamPrefix) {
  const grid = document.getElementById(containerId);

  //15 players per team to match sprint requirement
  for (let i = 0; i < 15; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.innerHTML = `<span class="checkbox"></span><span class="slotnum">${i}</span>`;
    grid.appendChild(slot);

    const id = document.createElement("input");
    id.className = "cell";
    id.type = "text";
    id.placeholder = "player id";
    id.id = `${teamPrefix}_pid_${i}`;
    grid.appendChild(id);

    const code = document.createElement("input");
    code.className = "cell";
    code.type = "text";
    code.placeholder = "codename";
    code.id = `${teamPrefix}_code_${i}`;
    grid.appendChild(code);

    //added the third column
    const hardware = document.createElement("input");
    hardware.className = "cell";
    hardware.type = "text";
    hardware.placeholder = "hardware id";
    hardware.id = `${teamPrefix}_hw_${i}`;
    grid.appendChild(hardware);
  }
}

function showEntry() {
  document.getElementById("splash").classList.add("hidden");
  document.getElementById("entry").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  //building grids to be similar to the layout in the slides
  buildTeamGrid("redGrid", "red");
  buildTeamGrid("greenGrid", "green");

  //splashtiming - 3 seconds & offers the click to skip
  const skipBtn = document.getElementById("skipSplash");
  skipBtn.addEventListener("click", showEntry);

  setTimeout(showEntry, 3000);

  //clear game button
  document.getElementById("clearBtn").addEventListener("click", () => {
    for (let i = 0; i < 15; i++) {
      document.getElementById(`red_pid_${i}`).value = "";
      document.getElementById(`red_code_${i}`).value = "";
      document.getElementById(`green_pid_${i}`).value = "";
      document.getElementById(`green_code_${i}`).value = "";
    }
  });

  //f3 start game is a placeholder click for now
  document.getElementById("startBtn").addEventListener("click", () => {
    alert("start game (ui placeholder)");
  });

  //i madethe keyboard shortcuts similar to what prof Strother had in his slides
  document.addEventListener("keydown", (e) => {
    if (e.key === "F12") {
      e.preventDefault();
      document.getElementById("clearBtn").click();
    }
    if (e.key === "F3") {
      e.preventDefault();
      document.getElementById("startBtn").click();
    }
  });
});

//sprint 3
function collectTeamPlayers(teamPrefix) {
  const players = [];
  for (let i = 0; i < 15; i++) {
    const pid = document.getElementById(`${teamPrefix}_pid_${i}`).value.trim();
    const code = document.getElementById(`${teamPrefix}_code_${i}`).value.trim();
    if (pid !== "" || code !== "") {
      players.push({
        slot: i,
        pid: pid,
        code: code
      });
    }
  }
  return players;
}

function renderTeamPlayers(containerId, players) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (players.length === 0) {
    container.innerHTML = `<div style="padding:8px 10px;font-family:monospace;opacity:.8;">no players entered</div>`;
    return;
  }

  players.forEach((player) => {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "46px 120px 1fr";
    row.style.gap = "8px";
    row.style.alignItems = "center";
    row.style.padding = "6px 8px";
    row.style.marginBottom = "6px";
    row.style.background = "rgba(255,255,255,0.08)";
    row.style.border = "1px solid rgba(255,255,255,0.15)";
    row.style.fontFamily = "monospace";
    row.innerHTML = `
      <div>${player.slot}</div>
      <div>${player.pid || "-"}</div>
      <div>${player.code || "-"}</div>
    `;
    container.appendChild(row);
  });
}

function showPlayActionDisplay() {
  const redPlayers = collectTeamPlayers("red");
  const greenPlayers = collectTeamPlayers("green");

  renderTeamPlayers("redPlayList", redPlayers);
  renderTeamPlayers("greenPlayList", greenPlayers);

  document.getElementById("entry").classList.add("hidden");
  document.getElementById("play").classList.remove("hidden");

  let timeLeft = 30;
  const timerEl = document.getElementById("countdownTimer");
  timerEl.textContent = timeLeft;

  if (window.photonCountdown) {
    clearInterval(window.photonCountdown);
  }

  window.photonCountdown = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(window.photonCountdown);
      timerEl.textContent = "GO";
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");

  startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    showPlayActionDisplay();
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key === "F5") {
      e.preventDefault();
      showPlayActionDisplay();
    }

    if (e.key === "F1" && !document.getElementById("play").classList.contains("hidden")) {
      e.preventDefault();
      if (window.photonCountdown) {
        clearInterval(window.photonCountdown);
      }
      document.getElementById("play").classList.add("hidden");
      document.getElementById("entry").classList.remove("hidden");
    }
  }, true);
});
