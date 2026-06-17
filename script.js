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

function updateNextBreakDisplay() {
  let secondsToBreak = 0;
  let foundBreak = false;

  if (pokerLevels[currentLevelIndex][0] === "BK") {
    document.getElementById('val-nbreak').textContent = "00:00:00";
    return;
  }

  secondsToBreak += remainingSeconds;

  for (let i = currentLevelIndex + 1; i < pokerLevels.length; i++) {
    if (pokerLevels[i][0] === "BK") {
      foundBreak = true;
      break;
    } else {
      secondsToBreak += 15 * 60; 
    }
  }

  if (foundBreak) {
    const h = Math.floor(secondsToBreak / 3600);
    const m = Math.floor((secondsToBreak % 3600) / 60);
    const s = secondsToBreak % 60;
    document.getElementById('val-nbreak').textContent = 
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  } else {
    document.getElementById('val-nbreak').textContent = "--:--:--";
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  document.getElementById('mainTimer').textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
  updateNextBreakDisplay();
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
updateLevelHighlight = function () {
  originalUpdateLevelHighlight();
  updateMainLevelDisplay();
  
  // Cập nhật lại thời gian tuỳ theo level (15 phút) hay break (5 phút)
  if (pokerLevels[currentLevelIndex][0] === "BK") {
    remainingSeconds = 5 * 60;
  } else {
    remainingSeconds = 15 * 60;
  }
  updateTimerDisplay();
  
  // Cập nhật BB khi chuyển level
  updateBBDisplay();
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

levelBtn.addEventListener('click', function () {
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

function updateBBDisplay() {
  const tstackElement = document.getElementById('val-tstack');
  const astackElement = document.getElementById('val-astack'); // BB display
  
  if (tstackElement && astackElement) {
    // Lấy giá trị Total Stack hiện tại
    const totalStackText = tstackElement.textContent.replace(/[,.]/g, '');
    const totalStack = parseInt(totalStackText, 10);
    
    // Lấy Big blind của level hiện tại
    const lvlData = pokerLevels[currentLevelIndex];
    
    if (lvlData[0] === "BK") {
      astackElement.textContent = "-";
    } else {
      const bigBlind = parseInt(lvlData[2], 10);
      if (!isNaN(totalStack) && !isNaN(bigBlind) && bigBlind > 0) {
        // bb = total stack / big blind (có thể lấy số nguyên)
        const bbValue = Math.round(totalStack / bigBlind);
        astackElement.textContent = new Intl.NumberFormat('de-DE').format(bbValue);
      }
    }
  }
}

// Hàm tính toán tự động Total Stack từ Total Entries và chuỗi Stack ở top-info-line
function updateTotalStack() {
  const infoElements = document.querySelectorAll('.top-info-line');
  if (infoElements.length > 1) {
    const text = infoElements[1].textContent;
    // Tìm chuỗi "Stack: " và lấy phần số đằng sau
    const stackMatch = text.match(/Stack:\s*([\d,.]+)/i);
    if (stackMatch) {
      // Xoá dấu phẩy hoặc chấm nếu có
      let stackStr = stackMatch[1].replace(/[,.]/g, '');
      const stackSize = parseInt(stackStr, 10);
      
      const entriesElement = document.getElementById('val-entries');
      if (entriesElement) {
        const entriesText = entriesElement.textContent;
        const entriesCount = parseInt(entriesText.replace(/[,.]/g, ''), 10);
        
        if (!isNaN(stackSize) && !isNaN(entriesCount)) {
          const totalStack = stackSize * entriesCount;
          // Định dạng số có dấu chấm ngăn cách hàng nghìn (ví dụ 20.000)
          document.getElementById('val-tstack').textContent = new Intl.NumberFormat('de-DE').format(totalStack);
          
          // Sau khi tính Total Stack xong, cập nhật luôn số lượng BB
          updateBBDisplay();
        }
      }
    }
  }
}

// Hàm tính toán tự động Total Prize Pool từ Total Entries và chuỗi Buyin
function updateTotalPrizePool() {
  const infoElements = document.querySelectorAll('.top-info-line');
  if (infoElements.length > 1) {
    const text = infoElements[1].textContent;
    // Tìm chuỗi "Buyin: " và lấy phần số đằng sau, kiểm tra xem có chữ K không
    const buyinMatch = text.match(/Buyin:\s*([\d,.]+)([kK]?)/i);
    if (buyinMatch) {
      // Xoá dấu phẩy hoặc chấm nếu có
      let buyinStr = buyinMatch[1].replace(/[,.]/g, '');
      let buyinAmount = parseInt(buyinStr, 10);
      
      // Nếu có chữ K hoặc k thì nhân thêm 1000
      if (buyinMatch[2] && buyinMatch[2].toLowerCase() === 'k') {
        buyinAmount *= 1000;
      }

      const entriesElement = document.getElementById('val-entries');
      if (entriesElement) {
        const entriesText = entriesElement.textContent;
        const entriesCount = parseInt(entriesText.replace(/[,.]/g, ''), 10);
        
        if (!isNaN(buyinAmount) && !isNaN(entriesCount)) {
          const totalPrize = buyinAmount * entriesCount;
          // Tìm class prize-total và gán giá trị
          const prizeTotalElement = document.querySelector('.prize-total');
          if (prizeTotalElement) {
            // Định dạng theo kiểu de-DE để có dấu chấm (4.000.000) và thêm chữ $
            prizeTotalElement.textContent = new Intl.NumberFormat('de-DE').format(totalPrize) + ' $';
          }
          
          // Tính toán danh sách giải thưởng
          updatePrizeList(entriesCount, totalPrize);
        }
      }
    }
  }
}

// Cập nhật danh sách giải thưởng theo số lượng entries
function updatePrizeList(entriesCount, totalPrizePool) {
  const prizeListElement = document.querySelector('.prize-list');
  if (!prizeListElement) return;
  
  prizeListElement.innerHTML = ''; // Xoá danh sách hiện tại
  const formatter = new Intl.NumberFormat('de-DE');
  
  if (entriesCount === 0) {
    // 0 người: giải 1 và 2 đều bằng 0
    prizeListElement.innerHTML = `
      <div class="prize-row"><span>1</span><span>0</span></div>
      <div class="prize-row"><span>2</span><span>0</span></div>
    `;
  } else if (entriesCount === 1) {
    // 1 người: giải 1 lấy toàn bộ (500k), giải 2 bằng 0
    prizeListElement.innerHTML = `
      <div class="prize-row"><span>1</span><span>${formatter.format(totalPrizePool)}</span></div>
      <div class="prize-row"><span>2</span><span>0</span></div>
    `;
  } else if (entriesCount < 11) {
    // Từ 2 đến 10 người: 2 giải
    const prize2 = 500000;
    const prize1 = totalPrizePool - prize2;
    
    // Nếu tổng giải thưởng ít hơn 500k thì giải 1 bị âm, ta có thể xử lý an toàn
    const finalPrize1 = prize1 > 0 ? prize1 : 0;
    
    prizeListElement.innerHTML = `
      <div class="prize-row"><span>1</span><span>${formatter.format(finalPrize1)}</span></div>
      <div class="prize-row"><span>2</span><span>${formatter.format(prize2)}</span></div>
    `;
  } else {
    // Từ 11 người trở lên: 3 giải
    const prize2 = 1000000;
    const prize3 = 500000;
    const prize1 = totalPrizePool - prize2 - prize3;
    
    const finalPrize1 = prize1 > 0 ? prize1 : 0;
    
    prizeListElement.innerHTML = `
      <div class="prize-row"><span>1</span><span>${formatter.format(finalPrize1)}</span></div>
      <div class="prize-row"><span>2</span><span>${formatter.format(prize2)}</span></div>
      <div class="prize-row"><span>3</span><span>${formatter.format(prize3)}</span></div>
    `;
  }
}

// Chạy tính toán Total Stack và Total Prize Pool ngay khi tải trang
updateTotalStack();
updateTotalPrizePool();

// Xử lý bật/tắt Add Name Popup
const openAddNamePopupBtn = document.getElementById('openAddNamePopupBtn');
const addNamePopup = document.getElementById('addNamePopup');

if (openAddNamePopupBtn && addNamePopup) {
  openAddNamePopupBtn.addEventListener('click', () => {
    addNamePopup.style.display = 'flex';
    document.getElementById('nameInput').focus();
  });

  // Đóng popup khi click ra ngoài vùng xám
  addNamePopup.addEventListener('click', (e) => {
    if (e.target === addNamePopup) {
      addNamePopup.style.display = 'none';
    }
  });
}

// Quản lý danh sách người chơi
let playerEntries = [];
let activePlayerIndex = -1;

const nameInput = document.getElementById('nameInput');
const addNameBtn = document.getElementById('addNameBtn');
const popupNameList = document.getElementById('popupNameList');
const mainNameList = document.getElementById('mainNameList');
const valEntries = document.getElementById('val-entries');

function renderNameLists() {
  if (!popupNameList || !mainNameList) return;
  
  popupNameList.innerHTML = '';
  mainNameList.innerHTML = '';
  
  playerEntries.forEach((player, index) => {
    // Render popup list item
    const popupItem = document.createElement('div');
    popupItem.className = 'popup-list-item' + (index === activePlayerIndex ? ' active-item' : '');
    popupItem.style.cursor = 'pointer';
    popupItem.innerHTML = `<span>${player.name}</span><span>${player.count}</span>`;
    
    // Click vào item để chọn
    popupItem.addEventListener('click', () => {
      activePlayerIndex = index;
      nameInput.value = ''; // Làm rỗng ô nhập để chuẩn bị cộng thêm cho người này
      renderNameLists();
      nameInput.focus();
    });
    
    popupNameList.appendChild(popupItem);
    
    // Render main list item (bảng bên ngoài)
    const mainItem = document.createElement('div');
    mainItem.className = 'name-row';
    mainItem.innerHTML = `<span>${player.name}</span><span>${player.count}</span>`;
    mainNameList.appendChild(mainItem);
  });
}

function handleAddName() {
  const name = nameInput.value.trim();
  
  if (!name) {
    // Nếu ô nhập rỗng, cộng 1 cho người đang được chọn (nếu có)
    if (activePlayerIndex >= 0 && activePlayerIndex < playerEntries.length) {
      playerEntries[activePlayerIndex].count += 1;
    } else {
      return; // Không có gì để cộng
    }
  } else {
    // Nếu có nhập tên
    const lowerName = name.toLowerCase();
    const existingIndex = playerEntries.findIndex(p => p.name.toLowerCase() === lowerName);
    
    if (existingIndex !== -1) {
      playerEntries[existingIndex].count += 1;
      // Không tự động select khi vừa nhập tên bằng tay
      activePlayerIndex = -1;
    } else {
      playerEntries.push({ name: name, count: 1 });
      // Không tự động select khi vừa nhập tên bằng tay
      activePlayerIndex = -1;
    }
  }
  
  // Tăng total entries
  let currentEntries = parseInt(valEntries.textContent.replace(/[,.]/g, ''), 10) || 0;
  valEntries.textContent = currentEntries + 1;
  
  // Cập nhật các thông số khác liên quan đến Total Entries
  updateTotalStack();
  updateTotalPrizePool();
  
  // Render lại danh sách
  renderNameLists();
  
  // Xoá ô nhập và focus lại để gõ tiếp
  nameInput.value = '';
  nameInput.focus();
}

if (addNameBtn) {
  addNameBtn.addEventListener('click', handleAddName);
}

if (nameInput) {
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleAddName();
    }
  });
}
