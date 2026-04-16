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
    document.getElementById(`red_hw_${i}`).value = "";
    document.getElementById(`green_pid_${i}`).value = "";
    document.getElementById(`green_code_${i}`).value = "";
    document.getElementById(`green_hw_${i}`).value = "";
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
    const pid = document.getElementById(`${teamPrefix}_pid_${i}`)?.value.trim();
    const code = document.getElementById(`${teamPrefix}_code_${i}`)?.value.trim();
    const hw = document.getElementById(`${teamPrefix}_hw_${i}`)?.value.trim();

    if (pid !== "" || code !== "" || hw !== "") {
      players.push({
        pid: pid,
        code: code || "-",
        hardwareId: hw || "-",
        points: 0,
        hasBase: false
      });
    }
  }

  return players;
}

function renderTeamPlayers(containerId, players, totalId) {
  const container = document.getElementById(containerId);
  const totalEl = document.getElementById(totalId);

  container.innerHTML = "";

  if (players.length === 0) {
    container.innerHTML = `<div style="padding:8px 10px;font-family:monospace;opacity:.8;">no players entered</div>`;
    if (totalEl) totalEl.textContent = "Team Total: 0";
    return;
  }

  players.sort((a, b) => b.points - a.points || a.code.localeCompare(b.code));

  const header = document.createElement("div");
  header.className = "play-header";
  header.innerHTML = `
    <div>Player</div>
    <div>Hardware</div>
    <div style="text-align:right;">Points</div>
    <div></div>
  `;
  container.appendChild(header);

  players.forEach((player) => {
    const row = document.createElement("div");
    row.className = "play-row";

    const baseIcon = player.hasBase
      ? `<img src="${BASE_ICON_PATH}" style="width:20px;height:20px;">`
      : "";

    row.innerHTML = `
      <div class="player-name">${player.code || "-"}</div>
      <div class="player-hardware">${player.hardwareId || "-"}</div>
      <div class="player-points">${player.points ?? 0}</div>
      <div>${baseIcon}</div>
    `;

    container.appendChild(row);
  });

  const teamTotal = players.reduce((sum, p) => sum + (p.points || 0), 0);
  if (totalEl) totalEl.textContent = `Team Total: ${teamTotal}`;
}

function refreshPlayLists() {
  renderTeamPlayers("redPlayList", redPlayersState, "redTeamTotal");
  renderTeamPlayers("greenPlayList", greenPlayersState, "greenTeamTotal");
  updateLeadingTeamFlash();
}

function updateLeadingTeamFlash() {
  const redTotalEl = document.getElementById("redTeamTotal");
  const greenTotalEl = document.getElementById("greenTeamTotal");

  const redTotal = redPlayersState.reduce((sum, p) => sum + (p.points || 0), 0);
  const greenTotal = greenPlayersState.reduce((sum, p) => sum + (p.points || 0), 0);

  redTotalEl?.classList.remove("leading-team");
  greenTotalEl?.classList.remove("leading-team");

  if (redTotal > greenTotal) {
    redTotalEl?.classList.add("leading-team");
  } else if (greenTotal > redTotal) {
    greenTotalEl?.classList.add("leading-team");
  }
}

function formatTime(seconds) { //sprint 4 update
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function awardOpposingHit(shooterHardwareId, targetHardwareId) {
  let shooter = null;

  shooter = redPlayersState.find(p => String(p.hardwareId) === String(shooterHardwareId))
         || greenPlayersState.find(p => String(p.hardwareId) === String(shooterHardwareId));

  if (shooter) {
    shooter.points += 10;
    refreshPlayLists();
  }
}

function applyFriendlyFire(shooterHardwareId, targetHardwareId) {
  const shooter = redPlayersState.find(p => String(p.hardwareId) === String(shooterHardwareId))
               || greenPlayersState.find(p => String(p.hardwareId) === String(shooterHardwareId));

  const target = redPlayersState.find(p => String(p.hardwareId) === String(targetHardwareId))
              || greenPlayersState.find(p => String(p.hardwareId) === String(targetHardwareId));

  if (shooter) shooter.points -= 10;
  if (target) target.points -= 10;

  refreshPlayLists();
}

//sends the game start signal 202
async function sendGameStartSignal() {
  try {
    await fetch("http://localhost:8080/api/startGame", {
      method: "POST"
    });
    console.log("Sent start signal (202)");
  } catch (error) {
    console.log("Error sending start signal", error);
  }
}


function showPlayActionDisplay() {
  redPlayersState = collectTeamPlayers("red"); //sprint 4 update
  greenPlayersState = collectTeamPlayers("green"); //sprint 4 update

  refreshPlayLists();

  document.getElementById("entry").classList.add("hidden");
  document.getElementById("play").classList.remove("hidden");

  let timeLeft = 30;
  const timerEl = document.getElementById("countdownTimer");
  timerEl.textContent = timeLeft;

  //select and load track for game loop
  let track = Math.floor(Math.random() * 8) + 1;
  const audio = new Audio("../assets/photon_tracks/Track0" + track + ".mp3");

  if (window.photonCountdown) {
    clearInterval(window.photonCountdown);
  }

  window.photonCountdown = setInterval(async () => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(window.photonCountdown);

      let gameTime = 360; //sprint 4 update

      // send 202 when countdown finishes
      await sendGameStartSignal();

      window.photonCountdown = setInterval(() => { //sprint 4 update
        gameTime--; //sprint 4 update
        timerEl.textContent = formatTime(gameTime); //sprint 4 update

        if (gameTime <= 0) { //sprint 4 update
          clearInterval(window.photonCountdown); //sprint 4 update
          timerEl.textContent = "0:00"; //sprint 4 update
        }
      }, 1000); //sprint 4 update
    }

    //play the track at 15 seconds remaining
    if(timeLeft == 15) {
      audio.play();
    }

  }, 1000);
}

function markPlayerBase(pid) {
  redPlayersState.forEach(p => {
    if (p.pid === pid) {
      p.hasBase = true;
      p.points += 100;
    }
  });

  greenPlayersState.forEach(p => {
    if (p.pid === pid) {
      p.hasBase = true;
      p.points += 100;
    }
  });

  refreshPlayLists();
}

window.markPlayerBase = markPlayerBase; //sprint 4 update
window.awardOpposingHit = awardOpposingHit;
window.applyFriendlyFire = applyFriendlyFire;
window.refreshPlayLists = refreshPlayLists;


//sound effect methods
//
