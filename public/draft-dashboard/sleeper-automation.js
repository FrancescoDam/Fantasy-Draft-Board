(function () {
  async function loadSleeperAutomation() {
    try {
      const [playersResponse, addsResponse, dropsResponse] = await Promise.all([
        fetch("/api/sleeper/players"),
        fetch("/api/sleeper/trending/add"),
        fetch("/api/sleeper/trending/drop")
      ]);

      const playersData = await playersResponse.json();
      const addsData = await addsResponse.json();
      const dropsData = await dropsResponse.json();

      const allPlayers = playersData.players || {};

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.right = "20px";
      container.style.bottom = "20px";
      container.style.width = "330px";
      container.style.maxHeight = "460px";
      container.style.overflowY = "auto";
      container.style.background = "#020617";
      container.style.color = "white";
      container.style.padding = "16px";
      container.style.borderRadius = "14px";
      container.style.zIndex = "999999";
      container.style.fontFamily = "Arial, sans-serif";
      container.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
      container.style.fontSize = "14px";

      const title = document.createElement("div");
      title.textContent = "Sleeper Live Data";
      title.style.fontWeight = "bold";
      title.style.fontSize = "16px";
      title.style.marginBottom = "8px";
      container.appendChild(title);

      const count = document.createElement("div");
      count.textContent = "Players loaded: " + playersData.count;
      count.style.marginBottom = "14px";
      count.style.color = "#cbd5e1";
      container.appendChild(count);

      function addSection(label, color, data) {
        const sectionTitle = document.createElement("div");
        sectionTitle.textContent = label;
        sectionTitle.style.color = color;
        sectionTitle.style.fontWeight = "bold";
        sectionTitle.style.marginTop = "10px";
        container.appendChild(sectionTitle);

        const list = document.createElement("ol");
        list.style.margin = "6px 0 0 20px";
        list.style.padding = "0";

        const items = (data.players || []).slice(0, 5);

        items.forEach(function (item) {
          const player = allPlayers[item.player_id];
          const li = document.createElement("li");

          if (player) {
            const name = player.full_name || item.player_id;
            const position = player.position || "";
            const team = player.team || "";
            li.textContent = name + " (" + position + " - " + team + ")";
          } else {
            li.textContent = item.player_id;
          }

          li.style.marginBottom = "4px";
          list.appendChild(li);
        });

        container.appendChild(list);
      }

      addSection("Most Added", "#22c55e", addsData);
      addSection("Most Dropped", "#ef4444", dropsData);

      document.body.appendChild(container);
    } catch (error) {
      console.error("Sleeper automation failed:", error);
    }
  }

  loadSleeperAutomation();
})();
