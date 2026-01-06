// 模擬義竹景點資料 (實務上可以從 API 抓)


// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderSourceList();
    updateSelectedCount();
});

// 1. 渲染右側選擇列表
function renderSourceList() {
    const list = document.getElementById('sourceList');
    list.innerHTML = ""; // 清空

    placesData.forEach(place => {
        const item = document.createElement('div');
        item.className = "place-card";
        item.onclick = (e) => toggleCard(place.id, e);
        item.innerHTML = `
            <div class="form-check">
                <input class="form-check-input place-checkbox" type="checkbox" value="${place.id}" id="check-${place.id}" onchange="updateSelectedCount()">
            </div>
            <img src="${place.cover}" class="place-img" alt="${place.name}">
            <div class="flex-grow-1">
                <h6 class="mb-0 fw-bold">${place.name}</h6>
            </div>
            <button class="btn btn-sm btn-outline-info rounded-pill" onclick="event.stopPropagation();showInfo(${place.id})">了解更多</button>
        `;
        list.appendChild(item);
    });
}
function toggleCard(id, event) {
    // 找到該卡片對應的 checkbox
    const checkbox = document.getElementById(`check-${id}`);
    
    // 判斷點擊的目標是不是 checkbox 本身
    // 如果使用者直接點那個方框，瀏覽器會自動切換，我們只要更新數字就好
    // 如果使用者點的是卡片背景或文字，我們要手動幫他切換 checkbox
    
    if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked; // 手動切換
    }

    // 更新計數器 (不管是手動切換還是點方框，都要更新)
    updateSelectedCount();
}

// 2. 更新已選擇數量 & 防呆
function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.place-checkbox:checked');
    const count = checkboxes.length;
    document.getElementById('selectedCount').innerText = count;
    
    const input = document.getElementById('drawCount');
    // 設定最大值不能超過勾選數
    input.max = count > 0 ? count : 1;
    // 如果目前輸入超過勾選數，自動調降
    if (parseInt(input.value) > count && count > 0) {
        input.value = count;
    }
}

// 3. 全選 / 取消全選
function selectAll(isChecked) {
    const checkboxes = document.querySelectorAll('.place-checkbox');
    checkboxes.forEach(cb => cb.checked = isChecked);
    updateSelectedCount();
}
let currentModal = null;
// 4. Modal 顯示詳情
function showInfo(id) {
    const place = placesData.find(p => p.id === id);
    if (!place) return;

    document.getElementById('modalTitle').innerText = place.name;
    document.getElementById('modalImg').src = place.cover;
    document.getElementById('modalDesc').innerText = place.desc;
    const linkBtn = document.getElementById('modalLink');
    if (linkBtn) {
        linkBtn.href = `introduce.html?spot=modal-spot${place.id}`;
        linkBtn.onclick = function() {
            if (currentModal) {
                currentModal.hide(); // 這樣就不會擋住 href 的跳轉了！
            }
        };
    }
    // document.getElementById('modalAddr').innerText = place.addr;

    const modalEl = document.getElementById('infoModal');
    
    // 使用 getOrCreateInstance 避免重複建立導致錯誤
    currentModal = bootstrap.Modal.getOrCreateInstance(modalEl); 
    currentModal.show();
}

// 5. 開始抽籤 (核心邏輯)
function startRaffle() {
    // 1. 取得所有被勾選的來源項目
    const selectedIds = Array.from(document.querySelectorAll('.place-checkbox:checked')).map(cb => parseInt(cb.value));
    
    if (selectedIds.length === 0) {
        alert("請先在左側勾選想去的景點！");
        return;
    }

    // 2. 取得抽選數量 (關鍵修正！)
    const countInput = document.getElementById('drawCount');
    let drawCount = countInput ? parseInt(countInput.value) : 3;

    // 防呆：如果選擇的數量大於勾選的數量，就只抽勾選的數量
    if (drawCount > selectedIds.length) {
        drawCount = selectedIds.length;
    }

    // 3. 取得景點資料並隨機打亂
    const selectedPlaces = placesData.filter(p => selectedIds.includes(p.id));
    
    // ★ 這裡加上了 .slice(0, drawCount)，才會只取前 N 個！
    const results = selectedPlaces.sort(() => 0.5 - Math.random()).slice(0, drawCount); 

    const resultSection = document.getElementById('resultSection');
    if (resultSection) {
        resultSection.classList.remove('d-none'); // ✨ 移除隱藏，讓它出現
        
        // (選用) 自動滾動到詳細資訊區，讓使用者知道下面有東西
        // setTimeout(() => {
        //    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // }, 100);
    }


    // --- 4. 渲染右側列表 (Result List) ---
    const resultList = document.getElementById('resultList');
    resultList.innerHTML = ""; 
    
    // --- 5. 渲染下方卡片區 (Card Container) ---
    const cardsContainer = document.getElementById('resultCardsContainer');
    if (cardsContainer) {
        cardsContainer.innerHTML = ""; // 先清空
    }

    results.forEach((place, index) => {
        // A. 生成列表項目 (右側)
        const item = document.createElement('div');
        item.className = "place-card result-card"; 
        item.draggable = true;
        item.dataset.id = place.id;
        item.dataset.name = place.name;
        
        item.innerHTML = `
            <span class="fs-4 me-3 handle">≡</span>
            <img src="${place.cover}" class="place-img" style="margin-left:0;">
            <div class="flex-grow-1">
                <h6 class="mb-0 fw-bold place-name">${place.name}</h6>
            </div>
            <button class="btn btn-sm text-danger fs-2 border-0 bg-transparent" onclick="removeResult(this)" title="移除此地點">
                &times;
            </button>
        `;
        
        addDragEvents(item); // 綁定拖曳
        resultList.appendChild(item);

        // B. 生成詳細卡片 (下方)
        if (cardsContainer) {
            const gridCol = document.createElement('div');
            gridCol.className = "col-md-6 col-lg-3 result-grid-card"; 
            gridCol.dataset.id = place.id; // 綁定 ID 方便刪除
            
            // 這裡用 onclick="showInfo(${place.id})" 來開啟原本的 Modal
            gridCol.innerHTML = `
                <div class="card h-100 shadow-sm border-0 place-card-hover">
                    <img src="${place.cover}" class="card-img-top" style="height: 180px; object-fit: cover; border-radius: 8px 8px 0 0;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold text-center mb-3">${place.name}</h5>
                        <button class="btn btn-outline-success w-100 rounded-pill mt-auto" onclick="showInfo(${place.id})">
                            查看詳情
                        </button>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(gridCol);
        }
    });

    // 更新起點/終點標記
    updateFlags();
}

// 6. 渲染結果並加入拖放功能
function renderResults(results) {
    const resultList = document.getElementById('resultList');
    const emptyState = document.getElementById('emptyState');
    const countBadge = document.getElementById('resultCount');

    // 隱藏空狀態
    emptyState.style.display = "none";
    countBadge.innerText = results.length;
    
    // 清空現有列表 (除了 emptyState)
    resultList.innerHTML = "";
    resultList.appendChild(emptyState);

    results.forEach((place, index) => {
        const card = document.createElement('div');
        card.className = "place-card result-card";
        card.draggable = true; // 開啟拖曳
        card.dataset.id = place.id; // 存 ID 方便之後抓順序
        card.dataset.name = place.name; // 存名稱給 Google Maps 用

        card.innerHTML = `
            <span class="fs-4 me-3 handle">≡</span>
            <img src="${place.cover}" class="place-img" style="margin-left:0;">
            <div class="flex-grow-1">
                <h6 class="mb-0 fw-bold place-name">${place.name}</h6>
            </div>
            <button class="btn btn-sm text-danger fs-2 border-0 bg-transparent" onclick="removeResult(this)" title="移除此地點">
                &times;
            </button>
        `;
        
        // 加入拖曳事件
        addDragEvents(card);
        resultList.appendChild(card);
    });

    updateFlags(); // 更新起點終點標記
}

// 7. 拖曳事件處理 (Drag and Drop API)
function addDragEvents(card) {
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        updateFlags(); // 拖曳結束後重新標記旗幟
    });
}

// 監聽容器的拖曳行為
const resultContainer = document.getElementById('resultList');
resultContainer.addEventListener('dragover', e => {
    e.preventDefault(); // 允許放置
    const afterElement = getDragAfterElement(resultContainer, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        resultContainer.appendChild(draggable);
    } else {
        resultContainer.insertBefore(draggable, afterElement);
    }
});

// 計算拖曳位置的輔助函式
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.result-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 8. 更新起點與終點標記
function updateFlags() {
    const cards = document.querySelectorAll('.result-card');
    cards.forEach(c => {
        c.querySelector('.place-name').classList.remove('flag-start', 'flag-end');
    });

    if (cards.length > 0) {
        cards[0].querySelector('.place-name').classList.add('flag-start');
    }
    if (cards.length === 1) {
        // ★ 只有一個時：變成「目的地」
        cards[0].querySelector('.place-name').classList.add('flag-dest');
    }else if (cards.length > 1) {
        cards[cards.length - 1].querySelector('.place-name').classList.add('flag-end');
    }
}

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 地球半徑 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// 2. 規劃最佳路徑 (最近鄰居法)
function optimizeRouteOrder(places) {
    // 如果地點少於 3 個，不用排，直接回傳
    if (places.length < 3) return places;

    // 複製一份名單，避免動到原本的
    let remaining = [...places];
    
    // 步驟 A: 固定「第一張卡」當作起點 (Start)
    let sortedPlaces = [remaining.shift()]; 

    // 步驟 B: 迴圈找出最近的下一站
    while (remaining.length > 0) {
        let current = sortedPlaces[sortedPlaces.length - 1]; // 目前所在地
        let nearestIndex = 0;
        let minDist = Infinity;

        // 在剩下的地點中，找一個離目前最近的
        remaining.forEach((place, index) => {
            const dist = getDistance(current.lat, current.lng, place.lat, place.lng);
            if (dist < minDist) {
                minDist = dist;
                nearestIndex = index;
            }
        });

        // 把最近的那個加入已規劃名單，並從剩餘名單移除
        sortedPlaces.push(remaining[nearestIndex]);
        remaining.splice(nearestIndex, 1);
    }

    return sortedPlaces;
}

// 9. 產生 Google Maps 連結
function generateRoute() {
    const cards = document.querySelectorAll('.result-card');
    if (cards.length === 0) {
        alert("請先抽籤產生景點！");
        return;
    }
    if (cards.length > 9) {
        alert("GoogleMap最多支援9個停靠站!");
        return;
    }

    const routePoints = [...cards].map(card =>{
        const id = parseInt(card.dataset.id);
        const place = placesData.find(p => p.id === id);
        return place ? `${place.lat},${place.lng}`:null;
    }).filter(p => p !== null);

    let url=``;
    if(routePoints.length === 1){
        url = `https://www.google.com/maps/dir/?api=1&destination=${routePoints[0]}`;
    }else if(routePoints.length>1){
        const destination = routePoints[routePoints.length-1];
        const waypoints = routePoints.slice(0, -1).join('|');
        url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&waypoints=${waypoints}`;
    }
    window.open(url, '_blank');
}

// 10. 刪除單一結果的函式
function removeResult(btn) {
    // 1. 找到左側列表中被點擊的卡片
    const listCard = btn.closest('.result-card');
    
    if (listCard) {
        const id = listCard.dataset.id; // 取得該卡片的 ID

        // 2. ✨ 同步刪除下方對應的大卡片
        // 利用屬性選擇器找到 ID 一樣的那張卡
        const gridCard = document.querySelector(`.result-grid-card[data-id="${id}"]`);
        if (gridCard) {
            // 加一點淡出動畫 (選用)
            gridCard.style.transition = "opacity 0.3s";
            gridCard.style.opacity = "0";
            setTimeout(() => gridCard.remove(), 300);
        }

        // 3. 刪除左側列表卡片
        listCard.remove();
        
        // 4. 更新起點/終點標記
        updateFlags();
        const remainingCards = document.querySelectorAll('.result-card');
        if (remainingCards.length === 0) {
            const resultSection = document.getElementById('resultSection');
            if (resultSection) {
                resultSection.classList.add('d-none'); // ✨ 如果剩 0 個，就把它藏起來
            }
        }
    }
}

// --- 新增功能：計算並顯示最佳路徑 ---

// 全域變數，用來暫存算好的最佳順序 (給導航按鈕用)
let optimizedPlacesCache = [];

function calculateAndShowOptimized() {
    // 1. 取得目前畫面上的卡片 (使用者可能拖曳過，或者刪除過)
    const currentCards = document.querySelectorAll('.result-card');
    
    if (currentCards.length < 2) {
        alert("地點太少，不需要規劃順序喔！直接導航即可。");
        return;
    }

    // 2. 轉回資料物件
    let currentPlaces = Array.from(currentCards).map(card => {
        const id = parseInt(card.dataset.id);
        return placesData.find(p => p.id === id);
    }).filter(p => p !== undefined);

    // 3. 執行最佳化演算法 (使用你原本已寫好的 optimizeRouteOrder)
    // 注意：這裡我們假設 optimizeRouteOrder 會回傳一個新的排序陣列
    const sortedPlaces = optimizeRouteOrder(currentPlaces);
    
    // 存到全域變數，等下按鈕要用
    optimizedPlacesCache = sortedPlaces;

    // 4. 渲染到畫面上
    const container = document.getElementById('optimizedPathContainer');
    container.innerHTML = ""; // 清空

    sortedPlaces.forEach((place, index) => {
        // 判斷是否為起點或終點
        let statusClass = "";
        if (index === 0) statusClass = "start";
        else if (index === sortedPlaces.length - 1) statusClass = "end";

        // 產生卡片 HTML
        const stepHtml = `
            <div class="opt-step ${statusClass}">
                <div class="opt-badge">${index + 1}</div>
                <img src="${place.cover}" class="opt-img">
                <div class="opt-name">${place.name}</div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', stepHtml);

        // 如果不是最後一個，加上箭頭
        if (index < sortedPlaces.length - 1) {
            container.insertAdjacentHTML('beforeend', `<div class="opt-arrow">➜</div>`);
        }
    });

    // 5. 顯示區塊並綁定按鈕事件
    const section = document.getElementById('optimizedSection');
    section.classList.remove('d-none');
    
    // 讓畫面滑動到這裡
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 綁定導航按鈕事件
    document.getElementById('btnOptimizedMap').onclick = function() {
        openOptimizedMap(sortedPlaces);
    };
}

// 專門用來開啟最佳化路徑的函式
function openOptimizedMap(places) {
    if (!places || places.length === 0) return;

    if (places.length > 9) {
        alert("Google Maps 最多支援 9 個地點導航！");
        return; // 雖然通常這裡已經過濾過了，但保險起見
    }

    const routePoints = places.map(p => `${p.lat},${p.lng}`);
    let url = "";

    // 終點
    const destination = routePoints[routePoints.length - 1];
    
    // 中途點 (扣掉最後一個作為終點)
    // 邏輯：從現在位置 -> 第一站 -> 第二站 ... -> 終點
    const waypoints = routePoints.slice(0, -1).join('|');
    
    url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&waypoints=${waypoints}`;

    window.open(url, '_blank');
}