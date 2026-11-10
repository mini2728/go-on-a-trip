document.addEventListener('DOMContentLoaded', () => {
    const feedbackItemsContainer = document.getElementById('feedback-items-container');
    const submitBtn = document.getElementById('submit-feedback');
    const feedbackForm = document.getElementById('feedback-form-container');
    const successScreen = document.getElementById('success-screen');
    const userNameInput = document.getElementById('user-name');
    const overallSuggestionInput = document.getElementById('overall-suggestion');

    // 資料儲存結構：{ "itemId": { title, attended, rating, comment } }
    const feedbackDataStore = {};

    // 1. 動態生成所有項目的評分卡片
    function initFeedbackItems() {
        Object.keys(DATA.itinerary).forEach(dayNum => {
            const day = DATA.itinerary[dayNum];
            day.items.forEach((item, index) => {
                if (item.tag === 'activity' || item.tag === 'dining') {
                    let displayTitle = item.title;
                    
                    if (displayTitle === '成功漁港賞鯨集合') return;

                    if (displayTitle === '吃晚餐' || displayTitle === '飯店餐廳用餐') {
                        displayTitle = item.desc.split(/[\|｜享用]/)[0].trim();
                    }
                    
                    const fullId = `D${dayNum}_${index}`;
                    const fullTitle = `D${dayNum} ${displayTitle}`;
                    
                    // 初始化資料儲存 (預設為有參加)
                    feedbackDataStore[fullId] = {
                        title: fullTitle,
                        attended: true,
                        rating: 0,
                        comment: ""
                    };

                    const card = document.createElement('section');
                    card.className = 'feedback-card fade-in';
                    card.id = `card-${fullId}`;
                    card.innerHTML = `
                        <div class="card-header">
                            <h2 class="section-title">${fullTitle}</h2>
                            <p class="section-subtitle">${item.desc}</p>
                        </div>
                        <div class="item-divider"></div>
                        
                        <div class="attendance-toggle">
                            <span class="attendance-label">是否有參加？</span>
                            <div class="toggle-group">
                                <button class="toggle-btn active" data-attended="true">有</button>
                                <button class="toggle-btn" data-attended="false">無</button>
                            </div>
                        </div>

                        <div class="item-content-wrapper" id="wrapper-${fullId}">
                            <div style="font-size: 0.8rem; margin-bottom: 8px; color: #64748b; font-weight: 700;">
                                評分 <span class="required-mark">*</span>
                            </div>
                            <div class="rating-stars" data-item-id="${fullId}">
                                ${[1, 2, 3, 4, 5].map(v => `
                                    <button class="star-btn" data-value="${v}"><i data-lucide="star"></i></button>
                                `).join('')}
                            </div>
                            <div class="item-comment">
                                <input type="text" class="feedback-input" 
                                       placeholder="對此項目的具體意見 (選填)" 
                                       data-item-id="${fullId}">
                            </div>
                        </div>
                    `;
                    feedbackItemsContainer.appendChild(card);

                    // 綁定參加狀態切換事件
                    const toggleBtns = card.querySelectorAll('.toggle-btn');
                    const wrapper = card.querySelector('.item-content-wrapper');
                    toggleBtns.forEach(btn => {
                        btn.addEventListener('click', () => {
                            const isAttended = btn.dataset.attended === 'true';
                            toggleBtns.forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            
                            feedbackDataStore[fullId].attended = isAttended;
                            card.classList.remove('warning'); // 清除警告
                            
                            if (isAttended) {
                                wrapper.classList.remove('disabled');
                            } else {
                                wrapper.classList.add('disabled');
                                feedbackDataStore[fullId].rating = 0;
                                updateItemStars(card.querySelectorAll('.star-btn'), 0);
                            }
                        });
                    });

                    // 綁定星級點擊事件
                    const stars = card.querySelectorAll('.star-btn');
                    stars.forEach(star => {
                        star.addEventListener('click', () => {
                            if (!feedbackDataStore[fullId].attended) return;
                            const val = parseInt(star.dataset.value);
                            feedbackDataStore[fullId].rating = val;
                            updateItemStars(stars, val);
                            card.classList.remove('warning'); // 選了星星就清除警告
                        });
                    });

                    // 綁定意見欄位輸入事件
                    const commentInput = card.querySelector('.feedback-input');
                    commentInput.addEventListener('input', (e) => {
                        feedbackDataStore[fullId].comment = e.target.value;
                    });
                }
            });
        });
        lucide.createIcons();
    }

    function updateItemStars(stars, value) {
        stars.forEach(btn => {
            const btnValue = parseInt(btn.dataset.value);
            if (btnValue <= value) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 2. 提交並同步資料
    let submitted = false;

    submitBtn.addEventListener('click', async () => {
        if (submitted) return;

        const name = userNameInput.value.trim();
        if (!name) {
            alert('請先填寫您的姓名！');
            userNameInput.focus();
            return;
        }

        // 檢查是否有「參加但未評分」的項目
        const invalidItems = Object.keys(feedbackDataStore).filter(id => {
            const item = feedbackDataStore[id];
            return item.attended && item.rating === 0;
        });

        if (invalidItems.length > 0) {
            const firstInvalidId = invalidItems[0];
            const firstInvalidCard = document.getElementById(`card-${firstInvalidId}`);
            invalidItems.forEach(id => document.getElementById(`card-${id}`).classList.add('warning'));
            alert('您有參加的項目尚未完成評分，請確認標示 * 的欄位。');
            firstInvalidCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const SLACK_WEBHOOK_URL = 'https://line-bot-nodejs.mini14091309.workers.dev/slack';
        const GAS_URL = 'https://script.google.com/macros/s/AKfycby1ip0qI9i4kwlRAVDh7J9KrpyXzKodwqqB7hiDWVMXNin708FbPkSH1-N-SLc8D4Qn/exec';

        const finalSubmission = {
            type: 'trip_feedback',
            user: name,
            overallSuggestion: overallSuggestionInput.value.trim(), // 整體建議
            feedbacks: feedbackDataStore,
            timestamp: new Date().toISOString()
        };

        const slackMessage = {
            text: `📝 *收到新的員工旅遊回饋評分* - [${name}]`,
            attachments: [{
                color: "#facc15",
                text: "```\n" + JSON.stringify(finalSubmission, null, 2) + "\n```"
            }]
        };

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-text">正在送出...</span>';

            if (!navigator.onLine) throw new Error('目前沒有網路連線，請連線後再送出');

            // 1. 寫入 Google 試算表：確認伺服器收到才算成功
            let gasRes;
            try {
                gasRes = await fetch(GAS_URL, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(finalSubmission)
                });
            } catch (err) {
                console.error('GAS Sync Error:', err);
                throw new Error('連不上伺服器，可能被廣告阻擋器或公司防火牆擋住');
            }
            if (!gasRes.ok) {
                throw new Error('伺服器回應 ' + gasRes.status + '，回饋沒有寫入');
            }

            // 2. 內部通知：失敗不影響回饋結果
            try {
                await fetch(SLACK_WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(slackMessage)
                });
            } catch (err) { console.error('Slack Sync Error:', err); }

            submitted = true;

            feedbackForm.classList.add('fade-out');
            setTimeout(() => {
                feedbackForm.classList.add('hidden');
                successScreen.classList.remove('hidden');
            }, 400);

        } catch (error) {
            console.error('Submission failed:', error);
            alert('回饋尚未送出：' + error.message + '。資料仍保留在畫面上，排除問題後請再按一次送出。');
        } finally {
            if (!submitted) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="btn-text">提交所有回饋</span><i data-lucide="send"></i>';
                lucide.createIcons();
            }
        }
    });

    initFeedbackItems();
});
