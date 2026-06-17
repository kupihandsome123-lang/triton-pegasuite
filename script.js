// Dữ liệu bảng level
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

// Render bảng level ra HTML
pokerLevels.forEach((lvl, index) => {
  const row = document.createElement('tr');
  row.id = `level-row-${index}`;
  
  if (lvl[0] === "BK") row.className = "break-row";
  row.innerHTML = `<td>${lvl[0]}</td><td>${lvl[1]}</td><td>${lvl[2]}</td><td>${lvl[3]}</td>`;
  
  // Click đúp để highlight level
  row.addEventListener('dblclick', () => {
    currentLevelIndex = index;
    updateLevelHighlight();
  });
  
  tableBody.appendChild(row);
});

// Hàm highlight dòng level đang chọn
function updateLevelHighlight() {
  document.querySelectorAll('.level-table tr').forEach(tr => tr.classList.remove('active-level'));
  const activeRow = document.getElementById(`level-row-${currentLevelIndex}`);
  if (activeRow) {
    activeRow.classList.add('active-level');
    activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Chạy highlight level đầu tiên khi vừa load trang
updateLevelHighlight();

let countdownInterval = null;
let remainingSeconds = 15 * 60; // 15 minutes

function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  document.getElementById('mainTimer').textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateMainLevelDisplay() {
  const lvlData = pokerLevels[currentLevelIndex];
  const mainLevelElement = document.getElementById('mainLevel');
  const mainBlindsElement = document.getElementById('mainBlinds');
  const mainNextBlindsElement = document.getElementById('mainNextBlinds');

  if (lvlData[0] === "BK") {
    mainLevelElement.textContent = "BREAK";
    mainBlindsElement.textContent = "Break Time";
  } else {
    mainLevelElement.textContent = `LEVEL ${lvlData[0]}`;
    mainBlindsElement.textContent = `${lvlData[1]} / ${lvlData[2]} BBA`;
  }

  // Handle NEXT Blinds
  let nextLvlData = null;
  for (let i = currentLevelIndex + 1; i < pokerLevels.length; i++) {
    if (pokerLevels[i][0] !== "BK") {
      nextLvlData = pokerLevels[i];
      break;
    }
  }

  if (nextLvlData) {
    mainNextBlindsElement.textContent = `NEXT: ${nextLvlData[1]} / ${nextLvlData[2]} BBA`;
  } else {
    mainNextBlindsElement.textContent = "";
  }
}

// Ghi đè lại hàm updateLevelHighlight để cập nhật luôn hiển thị level chính
const originalUpdateLevelHighlight = updateLevelHighlight;
updateLevelHighlight = function() {
  originalUpdateLevelHighlight();
  updateMainLevelDisplay();
}
// Cập nhật ngay từ đầu
updateMainLevelDisplay();
updateTimerDisplay();

// Chống load lại trang do lỡ tay bấm F5
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = ''; 
});
// script.js

const levelBtn = document.getElementById('levelControlBtn');

levelBtn.addEventListener('click', function() {
  // Kiểm tra trạng thái hiện tại thông qua text
  if (this.textContent === 'START') {
    // Chuyển sang STOP
    this.textContent = 'STOP';
    this.classList.remove('btn-luxury-start');
    this.classList.add('btn-luxury-stop');
    
    // Bắt đầu đếm ngược
    countdownInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        updateTimerDisplay();
      } else {
        // Hết thời gian, tăng level
        if (currentLevelIndex < pokerLevels.length - 1) {
          currentLevelIndex++;
          updateLevelHighlight();
        }
        // Reset thời gian lại 15 phút
        remainingSeconds = 15 * 60;
        updateTimerDisplay();
      }
    }, 1000);
    
    console.log("Đã bắt đầu Timer Level...");
  } else {
    // Chuyển ngược lại START
    this.textContent = 'START';
    this.classList.remove('btn-luxury-stop');
    this.classList.add('btn-luxury-start');
    
    // Dừng đếm ngược
    clearInterval(countdownInterval);
    countdownInterval = null;
    
    console.log("Đã dừng Timer Level.");
  }
});
