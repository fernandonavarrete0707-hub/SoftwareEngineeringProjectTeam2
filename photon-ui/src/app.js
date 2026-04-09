//this file is only responsible for splash & entry and building the entry grid

const BASE_ICON_PATH = "../assets/baseicon.jpg"; //sprint 4 update

let redPlayersState = []; //sprint 4 update
let greenPlayersState = []; //sprint 4 update

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

function clearPlayers() {
  for (let i = 0; i < 15; i++) {
      document.getElementById(`red_pid_${i}`).value = "";
      document.getElementById(`red_code_${i}`).value = "";
      document.getElementById(`green_pid_${i}`).value = "";
      document.getElementById(`green_code_${i}`).value = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  buildTeamGrid("redGrid", "red");
  buildTeamGrid("greenGrid", "green");

  const skipBtn = document.getElementById("skipSplash");
  skipBtn.addEventListener("click", showEntry);

  setTimeout(showEntry, 3000);

  document.getElementById("clearBtn").addEventListener("click", () => {
    clearPlayers();
  });

  document.getElementById("startBtn").addEventListener("click", (e) => { //sprint 4 update
    e.stopImmediatePropagation(); //sprint 4 update
    showPlayActionDisplay();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "F12") {
      e.preventDefault();
      clearPlayers();
    } 
    else if (e.key === "F3") {
      e.stopImmediatePropagation();
      e.preventDefault();
      showPlayActionDisplay();
    } 
    else if (e.key === "F1" && !document.getElementById("play").classList.contains("hidden")) {
      e.preventDefault();
      if (window.photonCountdown) {
        clearInterval(window.photonCountdown);
      }
      document.getElementById("play").classList.add("hidden");
      document.getElementById("entry").classList.remove("hidden");

      redPlayersState = []; //sprint 4 update
      greenPlayersState = []; //sprint 4 update
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
        code: code,
        hasBase: false //sprint 4 update
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
    row.style.gridTemplateColumns = "46px 120px 1fr 50px"; //sprint 4 update
    row.style.gap = "8px";
    row.style.alignItems = "center";
    row.style.padding = "6px 8px";
    row.style.marginBottom = "6px";
    row.style.background = "rgba(255,255,255,0.08)";
    row.style.border = "1px solid rgba(255,255,255,0.15)";
    row.style.fontFamily = "monospace";

    const baseIcon = player.hasBase //sprint 4 update
      ? `<img src="${BASE_ICON_PATH}" style="width:20px;height:20px;">` //sprint 4 update
      : ""; //sprint 4 update

    row.innerHTML = `
      <div>${player.slot}</div>
      <div>${player.pid || "-"}</div>
      <div>${player.code || "-"}</div>
      <div>${baseIcon}</div> <!-- sprint 4 update -->
    `;
    container.appendChild(row);
  });
}

function formatTime(seconds) { //sprint 4 update
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function showPlayActionDisplay() {
  redPlayersState = collectTeamPlayers("red"); //sprint 4 update
  greenPlayersState = collectTeamPlayers("green"); //sprint 4 update

  renderTeamPlayers("redPlayList", redPlayersState);
  renderTeamPlayers("greenPlayList", greenPlayersState);

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

      let gameTime = 360; //sprint 4 update

      window.photonCountdown = setInterval(() => { //sprint 4 update
        gameTime--; //sprint 4 update
        timerEl.textContent = formatTime(gameTime); //sprint 4 update

        if (gameTime <= 0) { //sprint 4 update
          clearInterval(window.photonCountdown); //sprint 4 update
          timerEl.textContent = "0:00"; //sprint 4 update
        }
      }, 1000); //sprint 4 update
    }
  }, 1000);
}

function markPlayerBase(pid) { //sprint 4 update
  redPlayersState.forEach(p => {
    if (p.pid === pid) p.hasBase = true;
  });
  greenPlayersState.forEach(p => {
    if (p.pid === pid) p.hasBase = true;
  });

  renderTeamPlayers("redPlayList", redPlayersState);
  renderTeamPlayers("greenPlayList", greenPlayersState);
}

window.markPlayerBase = markPlayerBase; //sprint 4 update