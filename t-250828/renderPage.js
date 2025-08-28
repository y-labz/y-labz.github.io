// 2025-05, y-labz.
const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
const wChinese = 2 * rootFontSize; //2rem
//const charsPerColumn = 40; // H * 95vh - borderAndPadding...
const charsPerColumn = Math.floor((window.innerHeight * 0.98 - 44) / wChinese);
const columnsPerPage = Math.floor((window.innerWidth * 0.98 - 24) / (wChinese * 2 + 1));
//const totalColumns = Math.ceil(text.length / charsPerColumn);
//const paper = document.getElementById("paper");

let currentPage = 0;
let totalPages = 0;
let allColumns = [];

function buildColumns(text, charsPerColumn) {
  const columns = [];
  const lines = text.split(/\r?\n/); // Handles both \n and \r\n

  lines.forEach(line => {
    if (line.startsWith('#')) {
      const title = line.slice(1).trim();
      const col = document.createElement('div');
      if (title.length === 0) {
        col.className = 'column';
        col.innerHTML = "&nbsp;";
      } else {
        col.className = 'column title';
        col.textContent = title;
      }
      columns.push(col);
    } else {
      // Break regular text into chunks
      for (let i = 0; i < line.length; i += charsPerColumn) {
        const chunk = line.slice(i, i + charsPerColumn);
        const col = document.createElement('div');
        col.className = 'column';
        col.textContent = chunk;
        columns.push(col);
      }
    }
  });
  return columns;
}

async function loadAndPrepareColumns(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();

    allColumns = buildColumns(text, charsPerColumn);
    totalPages = Math.ceil(allColumns.length / columnsPerPage);

    renderPage(currentPage);

    //document.getElementById("loading-message").style.display = "none";
    document.getElementById("loading-message").remove();

  } catch (e) {
    console.error("Failed to load or process text:", e);
  }
}

function renderPage(page) {
  const paper = document.getElementById("paper");
  paper.innerHTML = ""; //clear current columns
  const start = page * columnsPerPage;
  const end = start + columnsPerPage;
  allColumns.slice(start, end).forEach(col => paper.appendChild(col));
}

function nextPage() {
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderPage(currentPage);
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderPage(currentPage);
  }
}

loadAndPrepareColumns("raw.txt");
// document.fonts.ready.then(() => { loadAndPrepareColumns("raw.txt"); });

//refresh on resize
window.addEventListener('resize', () => location.reload());

