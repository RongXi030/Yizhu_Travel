// JS/introcard.js

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. 生成內容 (卡片 & Modal)
    generateContent();

    // 2. 處理外部連結導引 (原本的功能)
    handleUrlNavigation();

});

// --- 功能函式 ---

function generateContent() {
    const spotsContainer = document.getElementById('spotsContainer');
    const modalsContainer = document.getElementById('modalsContainer');

    // 如果找不到容器 (可能是在別的頁面)，就直接結束，避免報錯
    if (!spotsContainer || !modalsContainer) return;

    // 清空容器 (保險起見)
    spotsContainer.innerHTML = '';
    modalsContainer.innerHTML = '';

    // 開始迴圈產生 HTML
    placesData.forEach(place => {
        
        // A. 產生景點卡片 HTML
        const cardHTML = `
            <div class="col-md-6 col-lg-4" id="card-spot${place.id}">
                <div class="card h-100 shadow-sm place-card-hover">
                    <img src="${place.cover}" class="card-img-top" alt="${place.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${place.name}</h5>
                        <p class="card-text text-muted small flex-grow-1">${place.desc}</p>
                        <button class="btn btn-outline-success w-100 mt-2" data-bs-toggle="modal" data-bs-target="#modal-spot${place.id}">
                            查看詳情 ➜
                        </button>
                    </div>
                </div>
            </div>
        `;
        spotsContainer.innerHTML += cardHTML;


        // B. 產生 Modal HTML (含輪播圖)
        
        // B-1. 先產生輪播圖片的 HTML
        let carouselItemsHTML = '';
        place.images.forEach((imgUrl, index) => {
            const activeClass = index === 0 ? 'active' : ''; // 第一張圖要加 active
            carouselItemsHTML += `
                <div class="carousel-item ${activeClass}">
                    <img src="${imgUrl}" class="d-block w-100" style="height: 400px; object-fit: contain;" alt="${place.name}">
                </div>
            `;
        });

        // B-2. 組合整個 Modal HTML
        const modalHTML = `
            <div class="modal fade" id="modal-spot${place.id}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title fw-bold">${place.name}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <div id="carouselSpot${place.id}" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">
                                    ${carouselItemsHTML}
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#carouselSpot${place.id}" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carouselSpot${place.id}" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                </button>
                            </div>
                            
                            <div class="p-4">
                                <h4 class="fw-bold" style="color: #3f1a12;">詳細介紹</h4>
                                <div class="modaltext">
                                    <p class="lh-lg text-secondary">${place.fullDesc || place.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modalsContainer.innerHTML += modalHTML;
    });
}

function handleUrlNavigation() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetModalId = urlParams.get('spot');

    if (targetModalId) {
        const triggerEl = document.querySelector('a[href="#tab-spots"]');
        if (triggerEl) {
            const tab = new bootstrap.Tab(triggerEl);
            tab.show();
        }

        setTimeout(() => {
            const targetModal = document.getElementById(targetModalId);
            if (targetModal) {
                const modal = new bootstrap.Modal(targetModal);
                modal.show();
                
                // 找到對應的卡片並滾動過去
                const cardId = targetModalId.replace('modal-', 'card-'); // 假設 modal-spot1 對應 card-spot1
                const card = document.getElementById(cardId);
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }, 300);
    }
}