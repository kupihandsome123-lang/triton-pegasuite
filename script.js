const pokerLevels = [
  [1, 10, 10, 10], [2, 10, 20, 20], [3, 20, 40, 40], [4, 30, 60, 60], [5, 40, 80, 80],
  ["BK", "Break", "Time", "-"], 
  [6, 50, 100, 100], [7, 60, 120, 120], [8, 70, 140, 140], [9, 80, 160, 160], [10, 90, 180, 180],
  ["BK", "Break", "Time", "-"],
  [11, 100, 200, 200], [12, 150, 300, 300], [13, 200, 400, 400], [14, 250, 500, 500], [15, 300, 600, 600],
  ["BK", "Break", "Time", "-"],
  [16, 400, 800, 800], [17, 500, 1000, 2000], [18, 1000, 2000, 2000], [19, 1500, 3000, 6000], [20, 2000, 4000, 8000],
  ["BK", "Break", "Time", "-"],
  [21, 6000, 12000, 12000], [22, 8000, 16000, 16000]
];

let currentLevelIndex = 0;
const tableBody = document.getElementById('pokerLevelsContent');

pokerLevels.forEach((lvl, index) => {
  const row = document.createElement('tr');
  row.id = `level-row-${index}`;
  
  // Kiểm tra nếu là dòng Break thì thêm class để đổi màu
  if (lvl[0] === "BK") row.className = "break-row";
  
  row.innerHTML = `<td>${lvl[0]}</td><td>${lvl[1]}</td><td>${lvl[2]}</td><td>${lvl[3]}</td>`;
  
  // Click đúp để chọn level
  row.addEventListener('dblclick', () => {
    currentLevelIndex = index;
    // Cần có hàm updateLevelHighlight() đi kèm nếu bạn dùng lại code này
    if (typeof updateLevelHighlight === 'function') {
        updateLevelHighlight();
    }
  });
  
  tableBody.appendChild(row);
});
