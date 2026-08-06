(function () {
  function createText(tag, text) {
    var el = document.createElement(tag);
    el.textContent = text;
    return el;
  }

  function playerLabel(item, allPlayers) {
    var player = allPlayers[item.player_id];

    if (!player) {
      return item.player_id;
    }

    var name = player.full_name || item.player_id;
    var position = player.position || "N/A";
    var team = player.team || "FA";

    return name + " (" + position + " - " + team + ")";
  }

  function renderList(title, players, allPlayers, color) {
    var section = document.createElement("div");
    section.style.marginTop = "24px";

    var heading = createText("h3", title);
    heading.style.color = color;
    heading.style.marginBottom = "10px";
    section.appendChild(heading);

    var list = document.createElement("ol");
    list.style.marginLeft = "24px";

    players.slice(0, 25).forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = playerLabel(item, allPlayers);
      li.style.marginBottom = "8px";
      list.appendChild(li);
    });

    section.appendChild(list);
    return section;
  }

  async function loadSleeperSeasonNews() {
    console.log("Sleeper Season News full script loaded");

    var old = document.getElementById("sleeper-live-market");
    if (old) {
      old.remove();
    }

    var block = document.createElement("section");
    block.id = "sleeper-live-market";
    block.style.margin = "40px auto";
    block.style.padding = "24px";
    block.style.maxWidth = "1100px";
    block.style.border = "1px solid rgba(148, 163, 184, 0.35)";
    block.style.borderRadius = "16px";
    block.style.background = "rgba(15, 23, 42, 0.95)";
    block.style.color = "white";
    block.style.fontFamily = "Arial, sans-serif";

    var title = createText("h2", "Sleeper Live Market");
    title.style.marginBottom = "8px";
    block.appendChild(title);

    var status = createText("p", "Loading Sleeper live data...");
    status.style.color = "#cbd5e1";
    status.style.marginBottom = "12px";
    block.appendChild(status);

    document.body.appendChild(block);

    try {
      var responses = await Promise.all([
        fetch("/api/sleeper/players"),
        fetch("/api/sleeper/trending/add"),
        fetch("/api/sleeper/trending/drop")
      ]);

      var playersResponse = responses[0];
      var addsResponse = responses[1];
      var dropsResponse = responses[2];

      if (!playersResponse.ok || !addsResponse.ok || !dropsResponse.ok) {
        throw new Error("One or more Sleeper API routes failed.");
      }

      var playersData = await playersResponse.json();
      var addsData = await addsResponse.json();
      var dropsData = await dropsResponse.json();

      var allPlayers = playersData.players || {};
      var addedPlayers = addsData.players || [];
      var droppedPlayers = dropsData.players || [];

      status.textContent =
        "Loaded " +
        playersData.count +
        " players. Showing " +
        addedPlayers.length +
        " most added and " +
        droppedPlayers.length +
        " most dropped players.";

      var updated = createText("p", "Updated: " + new Date().toLocaleString());
      updated.style.color = "#94a3b8";
      updated.style.fontSize = "13px";
      updated.style.marginBottom = "12px";
      block.appendChild(updated);

      block.appendChild(renderList("Most Added Players", addedPlayers, allPlayers, "#22c55e"));
      block.appendChild(renderList("Most Dropped Players", droppedPlayers, allPlayers, "#ef4444"));
    } catch (error) {
      console.error("Failed to load Sleeper Season News:", error);
      status.textContent = "Sleeper data failed to load. Check the browser console.";
      status.style.color = "#f87171";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSleeperSeasonNews);
  } else {
    loadSleeperSeasonNews();
  }
})();
