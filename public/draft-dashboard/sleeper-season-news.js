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

  function renderNewsStories(stories) {
    var section = document.createElement("div");
    section.style.marginTop = "24px";

    var heading = createText("h3", "NFL Trending Stories");
    heading.style.color = "#38bdf8";
    heading.style.marginBottom = "12px";
    section.appendChild(heading);

    if (!stories.length) {
      var empty = createText("p", "No NFL stories loaded.");
      empty.style.color = "#f87171";
      section.appendChild(empty);
      return section;
    }

    stories.slice(0, 12).forEach(function (story) {
      var card = document.createElement("div");
      card.style.padding = "14px";
      card.style.marginBottom = "12px";
      card.style.border = "1px solid rgba(148, 163, 184, 0.25)";
      card.style.borderRadius = "12px";
      card.style.background = "rgba(30, 41, 59, 0.7)";

      var title = document.createElement("a");
      title.textContent = story.title || "Untitled story";
      title.href = story.link || "#";
      title.target = "_blank";
      title.rel = "noopener noreferrer";
      title.style.color = "#93c5fd";
      title.style.fontWeight = "bold";
      title.style.textDecoration = "none";
      card.appendChild(title);

      if (story.description) {
        var desc = createText("p", story.description);
        desc.style.color = "#e2e8f0";
        desc.style.marginTop = "8px";
        card.appendChild(desc);
      }

      var meta = createText("p", "Source: " + (story.source || "NFL news feed"));
      meta.style.color = "#94a3b8";
      meta.style.fontSize = "12px";
      card.appendChild(meta);

      section.appendChild(card);
    });

    return section;
  }

  function renderPlayerList(title, players, allPlayers, color) {
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

  async function loadSeasonNewsAutomation() {
    var anchor = document.getElementById("season-news-automation-anchor");

    if (!anchor) {
      console.warn("Season News automation anchor not found.");
      return;
    }

    if (document.getElementById("season-news-automation")) {
      return;
    }

    var block = document.createElement("section");
    block.id = "season-news-automation";
    block.style.marginTop = "32px";
    block.style.padding = "24px";
    block.style.border = "1px solid rgba(148, 163, 184, 0.35)";
    block.style.borderRadius = "16px";
    block.style.background = "rgba(15, 23, 42, 0.95)";
    block.style.color = "white";
    block.style.fontFamily = "Arial, sans-serif";

    var title = createText("h2", "Season News Automation");
    title.style.marginBottom = "8px";
    block.appendChild(title);

    var status = createText("p", "Loading NFL stories and Sleeper market movement...");
    status.style.color = "#cbd5e1";
    status.style.marginBottom = "12px";
    block.appendChild(status);

    anchor.appendChild(block);

    try {
      var responses = await Promise.all([
        fetch("/api/nfl/news"),
        fetch("/api/sleeper/players"),
        fetch("/api/sleeper/trending/add"),
        fetch("/api/sleeper/trending/drop")
      ]);

      var newsData = await responses[0].json();
      var playersData = await responses[1].json();
      var addsData = await responses[2].json();
      var dropsData = await responses[3].json();

      var stories = newsData.stories || [];
      var allPlayers = playersData.players || {};
      var addedPlayers = addsData.players || [];
      var droppedPlayers = dropsData.players || [];

      status.textContent =
        "Loaded " +
        stories.length +
        " NFL stories, " +
        addedPlayers.length +
        " most added players, and " +
        droppedPlayers.length +
        " most dropped players.";

      block.appendChild(renderNewsStories(stories));

      var sleeperTitle = createText("h2", "Sleeper Live Market");
      sleeperTitle.style.marginTop = "36px";
      sleeperTitle.style.marginBottom = "8px";
      sleeperTitle.style.color = "#facc15";
      block.appendChild(sleeperTitle);

      var sleeperNote = createText("p", "Live Sleeper movement based on most added and most dropped players.");
      sleeperNote.style.color = "#cbd5e1";
      block.appendChild(sleeperNote);

      block.appendChild(renderPlayerList("Most Added Players", addedPlayers, allPlayers, "#22c55e"));
      block.appendChild(renderPlayerList("Most Dropped Players", droppedPlayers, allPlayers, "#ef4444"));
    } catch (error) {
      console.error("Season News automation failed:", error);
      status.textContent = "Season news automation failed to load.";
      status.style.color = "#f87171";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSeasonNewsAutomation);
  } else {
    loadSeasonNewsAutomation();
  }
})();
