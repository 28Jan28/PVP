async function searchPart() {
  const partInput = document.getElementById("partId");
  const partId = partInput.value;

  if (!partId) {
    alert("Zadejte ID dílu.");
    partInput.focus();
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/search?partId=${partId}`);
    const results = await response.json();

    if (response.ok && results.length > 0) {
      // Vytvoření HTML pro zobrazení všech nalezených míst
      let resultHTML = results.map(
        (result) => `
          <p>Šuplík: ${result.drawer}, Krabička: ${result.box}</p>
        `
      ).join("<hr>");

      document.getElementById("result").innerHTML = resultHTML;

      // Vytvoříme mapu šuplíků a krabiček k vykreslení
      const drawersMap = {};
      results.forEach((result) => {
        if (!drawersMap[result.drawer]) {
          drawersMap[result.drawer] = [];
        }
        drawersMap[result.drawer].push(result.box);
      });

      // Pro každý šuplík vykreslíme všechny zvýrazněné krabičky
      Object.keys(drawersMap).forEach((drawerId) => {
        renderDrawer(drawerId, drawersMap[drawerId]);
      });
    } else {
      document.getElementById("result").innerHTML = `<p>Díl nenalezen</p>`;
      document.getElementById("drawerView").innerHTML = "";
    }
  } catch (error) {
    console.error("Chyba při vyhledávání:", error);
  }

  partInput.value = "";
  partInput.focus();
}

function renderDrawer(drawerId, highlightBoxes) {
  const drawerConfig = {
    "1": { rows: 8, cols: 11 },
    "2": { rows: 8, cols: 11 },
    "3": { rows: 8, cols: 8 },
    "4": { rows: 8, cols: 8 }
  };

  const drawer = drawerConfig[drawerId];
  const drawerView = document.getElementById("drawerView");

  // Pokud již existuje šuplík, vymažeme obsah pouze toho šuplíku, který právě renderujeme
  if (!drawerView.querySelector(`.drawer-${drawerId}`)) {
    const drawerContainer = document.createElement("div");
    drawerContainer.className = `drawer drawer-${drawerId}`;
    drawerContainer.style.display = "grid";
    drawerContainer.style.gridTemplateRows = `repeat(${drawer.rows}, 1fr)`;
    drawerContainer.style.gridTemplateColumns = `repeat(${drawer.cols}, 1fr)`;
    drawerContainer.style.gap = "5px";
    drawerContainer.style.marginBottom = "20px";
    drawerView.appendChild(drawerContainer);
  }

  const drawerContainer = drawerView.querySelector(`.drawer-${drawerId}`);
  drawerContainer.innerHTML = "";

  const boxes = [];
  for (let row = drawer.rows; row >= 1; row--) {
    for (let col = 1; col <= drawer.cols; col++) {
      boxes.push(`A${(row - 1) * drawer.cols + col}`);
    }
  }

  boxes.forEach((boxId) => {
    const boxElement = document.createElement("div");
    boxElement.className = `box ${highlightBoxes.includes(boxId) ? "highlight" : ""}`;
    boxElement.textContent = boxId;
    drawerContainer.appendChild(boxElement);
  });
}