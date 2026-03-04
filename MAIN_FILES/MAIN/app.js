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

  //Changes the Address
  document.getElementById("addressChngBtn").addEventListener("click", async () => {

    NewAddress = prompt("Enter New Valid Address:")
    if (!NewAddress) return;

    try {
        const response = await fetch("http://localhost:8080/api/setNetworkAddress", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ address: NewAddress })
        });

        const result = await response.json();
        console.log(result);

        } catch (error) {
        console.error("Error updating address:", error);
        }
    
  });



  //Clear game button, clears all players from the board and then clears the database. This will be changed later, however
  document.getElementById("clearBtn").addEventListener("click", async () => {

    playersRemoved = []

    for (let i = 0; i < 15; i++) {
      

      if(document.getElementById(`red_code_${i}`).value != "")
        playersRemoved.push(document.getElementById(`red_code_${i}`).value)
      if(document.getElementById(`green_code_${i}`).value)
        playersRemoved.push(document.getElementById(`green_code_${i}`).value)

      document.getElementById(`red_pid_${i}`).value = "";
      document.getElementById(`red_code_${i}`).value = "";
      document.getElementById(`green_pid_${i}`).value = "";
      document.getElementById(`green_code_${i}`).value = "";

    }

    try
    {
      call = await fetch("http://localhost:8080/api/removePlayers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(players)
    });

    response = await call.text();
    console.log("Response:", response)

    await fetch("http://localhost:8080/api/PrintPlayers", {
    method: "POST"
    });

    

    }catch(error){
      console.log("Error Starting Game",error);
    }




  });

  //Add all current players on the grids to the database
  document.getElementById("InsertBtn").addEventListener("click", async () => {

    players = []

    for (let i = 0; i < 15; i++)
    {
      if(document.getElementById(`red_pid_${i}`).value != "" )
      players.push(document.getElementById(`red_pid_${i}`).value)
      if(document.getElementById(`red_code_${i}`).value != "")
      players.push(document.getElementById(`red_code_${i}`).value)
      if(document.getElementById(`green_pid_${i}`).value != "")
      players.push(document.getElementById(`green_pid_${i}`).value)
      if(document.getElementById(`green_code_${i}`).value != "")
      players.push(document.getElementById(`green_code_${i}`).value)

    }

    try
    {
      call = await fetch("http://localhost:8080/api/addPlayers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(players)
    });

    response = await call.text();
    console.log("Response:", response)

    await fetch("http://localhost:8080/api/PrintPlayers", {
    method: "POST"
    });

    

    }catch(error){
      console.log("Error Starting Game",error);
    }



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
