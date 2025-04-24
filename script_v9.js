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

      // Vykreslení každého šuplíku s vyznačenými krabičkami
      results.forEach((result) => {
        renderDrawer(result.drawer, result.box);
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

function renderDrawer(drawerId, highlightBox) {
  const drawerConfig = {
    "1": { rows: 8, cols: 11 },
    "2": { rows: 8, cols: 11 },
    "3": { rows: 8, cols: 8 },
    "4": { rows: 8, cols: 8 }
  };

  const drawer = drawerConfig[drawerId];
  const drawerView = document.getElementById("drawerView");

  drawerView.style.gridTemplateRows = `repeat(${drawer.rows}, 1fr)`;
  drawerView.style.gridTemplateColumns = `repeat(${drawer.cols}, 1fr)`;
  drawerView.innerHTML = "";

  const boxes = [];
  for (let row = drawer.rows; row >= 1; row--) {
    for (let col = 1; col <= drawer.cols; col++) {
      boxes.push(`${String.fromCharCode(64 + drawerId)}${(row - 1) * drawer.cols + col}`);
    }
  }

  boxes.forEach((boxId) => {
    const boxElement = document.createElement("div");
    boxElement.className = `box ${boxId === highlightBox ? "highlight" : ""}`;
    boxElement.textContent = boxId;
    drawerView.appendChild(boxElement);
  });
}