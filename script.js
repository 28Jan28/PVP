async function searchPart() {
  const partInput = document.getElementById("partId");
  const partId = partInput.value.trim(); // Oříznutí bílých znaků

  if (!partId) {
    alert("Zadejte ID dílu."); // Upozornění, pokud pole je prázdné
    partInput.focus();
    return;
  }

  try {
    // Odeslání požadavku na backend
    const response = await fetch(`http://localhost:5000/search?partId=${partId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP chyba! Status: ${response.status}`);
    }

    const results = await response.json();

    if (results.length > 0) {
      // Zpracování výsledků
      let resultHTML = results.map(
        (result) => `<p>Šuplík: ${result.drawer}, Krabička: ${result.box}</p>`
      ).join("<hr>");

      document.getElementById("result").innerHTML = resultHTML;

      // Vykreslení šuplíků
      const drawersMap = {};
      results.forEach((result) => {
        if (!drawersMap[result.drawer]) {
          drawersMap[result.drawer] = [];
        }
        drawersMap[result.drawer].push(result.box);
      });

      Object.keys(drawersMap).forEach((drawerId) => {
        renderDrawer(drawerId, drawersMap[drawerId]);
      });
    } else {
      document.getElementById("result").innerHTML = `<p>Díl nenalezen</p>`;
      document.getElementById("drawerView").innerHTML = "";
    }
  } catch (error) {
    console.error("Chyba při vyhledávání:", error.message);
  }

  partInput.value = ""; // Vyprázdnění vstupního pole
  partInput.focus();
}

function renderDrawer(drawerId, highlightBoxes) {
  const drawerConfig = {
    "1": { rows: 6, cols: 11 },
    "2": { rows: 6, cols: 11 },
    "3": { rows: 8, cols: 8 },
    "4": { rows: 8, cols: 8 }
  };

  const drawer = drawerConfig[drawerId];
  const drawerView = document.getElementById("drawerView");

  // Vymazání předchozího zobrazení šuplíku
  let drawerContainer = drawerView.querySelector(`.drawer-${drawerId}`);
  if (!drawerContainer) {
    drawerContainer = document.createElement("div");
    drawerContainer.className = `drawer drawer-${drawerId}`;
    drawerContainer.style.display = "grid";
    drawerContainer.style.gridTemplateRows = `repeat(${drawer.rows}, 1fr)`;
    drawerContainer.style.gridTemplateColumns = `repeat(${drawer.cols}, 1fr)`;
    drawerContainer.style.gap = "5px";
    drawerContainer.style.marginBottom = "20px";
    drawerView.appendChild(drawerContainer);
  }

  drawerContainer.innerHTML = "";

  // Vykreslení krabiček
  for (let row = 1; row <= drawer.rows; row++) {
    for (let col = 1; col <= drawer.cols; col++) {
      const boxId = `A${(row - 1) * drawer.cols + col}`;
      const boxElement = document.createElement("div");
      boxElement.className = `box ${highlightBoxes.includes(boxId) ? "highlight" : ""}`;
      boxElement.textContent = boxId;
      drawerContainer.appendChild(boxElement);
    }
  }
}