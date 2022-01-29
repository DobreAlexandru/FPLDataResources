import teamImages from "./images.js";

const loadTeam = async function () {
  try {
    const res = await fetch(
      "https://api.allorigins.win/raw?url=https://fantasy.premierleague.com/api/bootstrap-static/"
    );
    const data = await res.json();
    const slider = document.querySelector(".carousel-inner");
    const teamSelect = document.querySelector(".team-select");

    data.teams.forEach((el) => {
      const srcImage = teamImages[`${el.short_name}`];
      if (el.id === 1) {
        slider.insertAdjacentHTML(
          "beforeend",
          `<div class="carousel-item active">
          <div class="container team-box">
          <div class="row align-items center">
            <div class="col-12 col-md-6">
            <img class="carousel-image img-fluid" src="${srcImage}" class="d-block"/>
            </div>
            <div class="col-12 col-md-6">
            <p class="carousel-text-name" style="padding-right: 20%">${el.name} </p>
            <p class="carousel-text" style="padding-right: 20%">Team Alias: ${el.short_name}</p>
            <p class="carousel-text" style="padding-right: 20%">Attack Strength Index at Home: ${el.strength_attack_away}</p>
            <p class="carousel-text" style="padding-right: 20%">Attack Strength Index Away: ${el.strength_attack_away}</p>
            <p class="carousel-text" style="padding-right: 20%">Defence Index at Home: ${el.strength_defence_home}</p>
            <p class="carousel-text" style="padding-right: 20%">Defence Index Away: ${el.strength_defence_away}</p>
            <p class="carousel-text" style="padding-right: 20%">Overall Index at Home: ${el.strength_overall_home}</p>
            <p class="carousel-text" style="padding-right: 20%">Overall Strength Index Away: ${el.strength_overall_away}</p>
            </div>
          </div>
        </div>`
        );
      } else {
        slider.insertAdjacentHTML(
          "beforeend",
          `<div class="carousel-item">
          <div class="container team-box">
          <div class="row align-items center">
            <div class="col-12 col-md-6">
            <img class="carousel-image img-fluid" src="${srcImage}" class="d-block"/>
            </div>
            <div class="col-12 col-md-6">
            <p class="carousel-text-name" style="padding-right: 20%">${el.name} </p>
            <p class="carousel-text" style="padding-right: 20%">Team Alias: ${el.short_name}</p>
            <p class="carousel-text" style="padding-right: 20%">Attack Strength Index at Home: ${el.strength_attack_away}</p>
            <p class="carousel-text" style="padding-right: 20%">Attack Strength Index Away: ${el.strength_attack_away}</p>
            <p class="carousel-text" style="padding-right: 20%">Defence Index at Home: ${el.strength_defence_home}</p>
            <p class="carousel-text" style="padding-right: 20%">Defence Index Away: ${el.strength_defence_away}</p>
            <p class="carousel-text" style="padding-right: 20%">Overall Index at Home: ${el.strength_overall_home}</p>
            <p class="carousel-text" style="padding-right: 20%">Overall Strength Index Away: ${el.strength_overall_away}</p>
            </div>
          </div>
        </div>`
        );
      }
      teamSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${el.id}">${el.name}</option>`
      );
    });
  } catch (err) {
    alert(err);
  }
};

loadTeam();

const teamChange = document.getElementById("team-pick");
teamChange.onchange = async function () {
  const res = await fetch(
    "https://api.allorigins.win/raw?url=https://fantasy.premierleague.com/api/bootstrap-static/"
  );
  const data = await res.json();
  const playerSelect = document.querySelector(".player-select");
  playerSelect.innerHTML = `<option value=""</option>`;
  data.elements.forEach((el) => {
    if (el.team == teamChange.value) {
      playerSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${el.id}">${el.first_name} ${el.second_name}</option>`
      );
    }
  });
};

const playerChange = document.getElementById("player-pick");
playerChange.onchange = async function () {
  const res = await fetch(
    "https://api.allorigins.win/raw?url=https://fantasy.premierleague.com/api/bootstrap-static/"
  );
  const data = await res.json();
  const card = document.querySelector(".player-window");
  data.elements.forEach((el) => {
    if (el.id == playerChange.value) {
      card.classList.remove("hidden");
      card.innerHTML = "";
      card.insertAdjacentHTML(
        "beforeend",
        `
        <img class="player-picture img-fluid" src="https://resources.premierleague.com/premierleague/photos/players/110x140/p${
          el.code
        }.png"/>
        <div>
        <h1>${el.first_name} ${el.second_name}</h1>
         <p>Price: ${el.now_cost / 10} million</p>
         <p>Total Points: ${el.total_points}</p>
         <p>Points per Game: ${el.points_per_game}</p>
         <p>Owned by: ${el.selected_by_percent}% of teams</p>
         <p>Transfers In: ${el.transfers_in_event}</p>
         <p>Transfers Out: ${el.transfers_out_event}</p>
         <p>Goals: ${el.goals_scored}</p>
         <p>Assists: ${el.assists}</p>

         <p>${el.news}&zwnj;</p>
        </div>

`
      );
    }
  });
};

const buttonID = document.querySelector(".ID-button");
buttonID.addEventListener("click", async function () {
  try {
    const id = document.querySelector(".form-control");
    const res = await fetch(
      `https://api.allorigins.win/raw?url=https://fantasy.premierleague.com/api/entry/${id.value}/`
    );
    const data = await res.json();
    const managers = document.querySelector(".managers-text");
    managers.innerHTML = "";
    managers.insertAdjacentHTML(
      "beforeend",
      `
      <h1>Hi, ${data.player_first_name} ${data.player_last_name},</h1>
      <h3>manager of ${data.name}!</h3>
      <p>You joined FPL this season on ${data.joined_time.slice(0, 10)}.</p>
      <p>Your region is: ${data.player_region_name}.</p>
      <p>Your score this week is: ${data.summary_event_points} points.</p>
      <p>Your total score this season is ${
        data.summary_overall_points
      } points, placing you at rank ${data.summary_overall_rank} overall.</p>
    `
    );

    const xlabels = [];
    const scoreGW = [];
    const rank = [];
    async function makeChart(xlabels, scoreGW, id, label) {
      const ctx = document.getElementById(`myChart${id}`).getContext("2d");
      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: xlabels,
          datasets: [
            {
              label: label,
              data: scoreGW,
              borderColor: ["rgba(255,255,255)"],
              borderWidth: 2,
            },
          ],
        },
      });
    }

    const resH = await fetch(
      `https://api.allorigins.win/raw?url=https://fantasy.premierleague.com/api/entry/${id.value}/history/`
    );
    const dataH = await resH.json();
    const managerH = document.querySelector(".manager-history");
    managerH.classList.remove("hidden");
    dataH.current.forEach((el) => {
      xlabels.push(el.event);
      scoreGW.push(el.points);
      rank.push(el.overall_rank);
    });
    managerH.innerHTML = "";
    managerH.insertAdjacentHTML(
      "afterbegin",
      `<h4>Your score throughout the season:</h4>
      <canvas id="myChart1"></canvas>
      <h4 class="mt-5">Your rank throughout the season:</h4>
      <canvas  id="myChart2"></canvas>`
    );
    makeChart(xlabels, scoreGW, 1, "Score");
    makeChart(xlabels, rank, 2, "Rank");
  } catch (err) {
    alert("Wrong ID");
  }
});
