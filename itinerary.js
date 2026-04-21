const DATA = {
    itinerary: {
        1: {
            title: "D1 啟程．部落之光",
            items: [
                {
                    time: "07:00-11:32",
                    title: "搭火車前往台東",
                    desc: "抵達後自行至飯店大廳寄放行李休息",
                    icon: "train-front",
                    tag: "transport",
                    subItems: [
                        "板橋 408車次 07:06-11:10",
                        "台中 371車次 07:00-11:32",
                        "高雄 371車次 09:27-11:32"
                    ]
                },
                { time: "12:00-13:55", title: "飯店餐廳用餐", desc: "禾風新棧度假飯店", icon: "utensils", tag: "dining", action: "查看桌位表", actionType: "seating_d1_lunch" },
                { time: "13:00-14:00", title: "搭車至東河部落", desc: "開啟精彩旅程", icon: "bus", tag: "transport" },
                { time: "14:00-16:00", title: "竹筏體驗", desc: "東河部落屋｜文化探險", icon: "compass", tag: "activity" },
                { time: "16:00-18:00", title: "體驗部落晚宴", desc: "東河部落屋｜特色餐飲", icon: "utensils", tag: "dining" },
                { time: "18:00-19:00", title: "搭車回禾風新棧飯店", desc: "首日圓滿落幕", icon: "bus", tag: "transport", action: "查看房間分配", actionType: "rooms" }
            ]
        },
        2: {
            title: "D2 藝文．海洋之約",
            items: [
                { time: "08:45-09:00", title: "飯店出發", desc: "準時集合領取活力", icon: "bus", tag: "transport" },
                { time: "09:00-11:00", title: "卡塔文化工作室", desc: "燒製琉璃珠、傳統串珠體驗", icon: "compass", tag: "activity", action: "查看人員分配表", actionType: "kata" },
                { time: "11:00-11:30", title: "搭車至達麓岸部落屋", desc: "向部落前進", icon: "bus", tag: "transport" },
                { time: "11:30-12:55", title: "達麓岸部落屋", desc: "山海間的午宴", icon: "utensils", tag: "dining" },
                { time: "12:55-13:40", title: "搭車至成功漁港賞鯨", desc: "車程至少 40 分鐘，準備追鯨", icon: "bus", tag: "transport" },
                { time: "13:40-14:00", title: "成功漁港賞鯨集合", desc: "行前說明與安全須知", icon: "compass", tag: "activity" },
                { time: "14:00-17:00", title: "賞鯨體驗", desc: "太平洋追逐海豚與鯨魚", icon: "compass", tag: "activity" },
                { time: "17:00-17:15", title: "搭車至沙魚仔海鮮餐廳", desc: "飽餐一頓即將開始", icon: "bus", tag: "transport" },
                { time: "17:15-18:15", title: "吃晚餐", desc: "沙魚仔海鮮餐廳享用海味", icon: "utensils", tag: "dining", action: "查看桌位表", actionType: "seating_d2_dinner" },
                { time: "18:15-19:00", title: "搭車回禾風新棧飯店", desc: "充分休息補充體力", icon: "bus", tag: "transport", action: "查看房間分配", actionType: "rooms" }
            ]
        },
        3: {
            title: "D3 達魯瑪克深度遊",
            items: [
                { time: "09:30-10:00", title: "搭車至達魯瑪克部落", desc: "前往神祕魯凱族原鄉", icon: "bus", tag: "transport" },
                {
                    time: "10:00-19:00", title: "深度部落體驗", desc: "達魯瑪克部落一日行程", icon: "compass", tag: "activity", subItems: [
                        "10:00 入村祈福 & 10:30 森林山徑探索",
                        "12:00 獵寮區魯凱風味午餐",
                        "14:00 頭目農場香椿醬 DIY",
                        "16:15 傳統射箭體驗",
                        "17:15-19:00 格瑟農莊魯凱音樂晚餐"
                    ]
                },
                { time: "19:00-19:30", title: "搭車回禾風新棧飯店", desc: "帶著滿載的回憶賦歸", icon: "bus", tag: "transport", action: "查看房間分配", actionType: "rooms" }
            ]
        },
        4: {
            title: "D4 慢活綠隧之旅",
            items: [
                { time: "09:30-10:00", title: "搭車至阿杜的店", desc: "龍田綠色隧道單車行", icon: "bus", tag: "transport" },
                { time: "10:00-12:30", title: "龍田綠色隧道自行車導覽", desc: "在大樹下體驗最地道的慢活", icon: "compass", tag: "activity" },
                { time: "12:00-12:30", title: "騎腳踏車至春耕源", desc: "轉場前往香草餐廳", icon: "bike", tag: "bicycle" },
                { time: "12:30-14:00", title: "春耕源香草餐廳用餐", desc: "清新香草午味", icon: "utensils", tag: "dining", action: "🌍 Google Maps 地圖", actionLink: "https://maps.app.goo.gl/WQipAQXMnKGbqNEg7" },
                { time: "14:00-14:30", title: "歸還腳踏車", desc: "歸還租借裝備", icon: "bike", tag: "bicycle", action: "🌍 Google Maps 地圖", actionLink: "https://maps.app.goo.gl/k9M3AXMmjymv4LTYA" },
                { time: "14:30-15:00", title: "搭車回禾風新棧飯店", desc: "領取行李準備回程", icon: "bus", tag: "transport" },
                { time: "15:30-16:35", title: "搭車至台東火車站", desc: "15:45 中南部同仁 / 16:20 北部同仁", icon: "bus", tag: "transport" },
                {
                    time: "16:00-21:37",
                    title: "搭火車快樂賦歸",
                    desc: "帶著滿載的回憶回到溫暖的家",
                    icon: "train-front",
                    tag: "transport",
                    subItems: [
                        "板橋 439車次 16:50-21:37",
                        "台中 168車次 16:00-20:16",
                        "高雄 168車次 16:00-17:46"
                    ]
                }
            ]
        }
    },
    activities: {
        kata: [
            { group: "燒琉璃珠 (15人)", limit: "限國小6年級以上", items: ["劉榕展 Tony", "林秉毅 Cookys", "彭書怡 Ariel", "黃庭儀 Tim", "鄭亦廷 James", "辜元泰 Clode", "李佩倫 Dawn", "阿淑霞", "陳希寧", "黃坊瑪", "林凱偉 Kevin", "鄭珮君 illie", "簡采驪 Rosy", "簡欣儀", "張家漢 Jimmy"] },
            { group: "串珠體驗", limit: "", items: ["林裝恩", "黃之盈"] },
            { group: "噴砂裝飾", limit: "", items: ["葉家郡 Jun", "蔡川海 Ray", "陳垂康 Chaika", "戴培芯", "林志堉 Doug", "辜文玥", "辜愛心", "辜于衿", "林建瑋 David", "劉姿吟 Kelly"] }
        ]
    },
    seating: {
        seating_d1_lunch: [
            {
                table: "第一桌",
                people: [
                    { name: "林志堉 Doug", note: "" }, { name: "陳希寧", note: "林志堉家屬" }, { name: "林裝恩", note: "林志堉家屬" }, { name: "林維杰", note: "林志堉家屬" },
                    { name: "黃坊瑪", note: "林志堉家屬/素食" }, { name: "彭書怡 Ariel", note: "" }, { name: "鄭珮君 illie", note: "" },
                    { name: "劉姿吟 Kelly", note: "" }, { name: "陳垂康 Chaika", note: "" }, { name: "戴培芯", note: "陳垂康家屬" }
                ]
            },
            {
                table: "第二桌",
                people: [
                    { name: "劉榕展 Tony", note: "" }, { name: "林秉毅 Cookys", note: "" }, { name: "辜元泰 Clode", note: "" },
                    { name: "辜于衿", note: "辜元泰家屬" }, { name: "辜愛心", note: "辜元泰家屬" }, { name: "李佩倫 Dawn", note: "" },
                    { name: "阿淑霞", note: "李佩倫家屬" }, { name: "辜文玥", note: "李佩倫家屬" }, { name: "簡采驪 Rosy", note: "" },
                    { name: "簡欣儀", note: "簡采驪家屬" }
                ]
            },
            {
                table: "第三桌",
                people: [
                    { name: "鄭亦廷 James", note: "" }, { name: "蔡川海 Ray", note: "" }, { name: "林建瑋 David", note: "" },
                    { name: "姜之盈", note: "林建瑋家屬" }, { name: "林兩蓁", note: "林建瑋家屬" }, { name: "黃庭儀 Tim", note: "" },
                    { name: "葉家郡 Jun", note: "" }, { name: "林凱偉 Kevin", note: "" }, { name: "張家漢 Jimmy", note: "" }
                ]
            }
        ],
        seating_d2_dinner: [
            {
                table: "第一桌",
                people: [
                    { name: "林志堉 Doug", note: "" }, { name: "陳希寧", note: "" }, { name: "林裝恩", note: "" }, { name: "林維杰", note: "" },
                    { name: "黃坊瑪", note: "素食" }, { name: "彭書怡 Ariel", note: "" }, { name: "鄭珮君 illie", note: "" },
                    { name: "劉姿吟 Kelly", note: "" }, { name: "陳垂康 Chaika", note: "" }, { name: "戴培芯", note: "" },
                    { name: "張家漢 Jimmy", note: "" }
                ]
            },
            {
                table: "第二桌",
                people: [
                    { name: "劉榕展 Tony", note: "" }, { name: "林秉毅 Cookys", note: "" }, { name: "辜元泰 Clode", note: "" },
                    { name: "辜于衿", note: "" }, { name: "辜愛心", note: "" }, { name: "李佩倫 Dawn", note: "" },
                    { name: "阿淑霞", note: "" }, { name: "辜文玥", note: "" }, { name: "簡采驪 Rosy", note: "" },
                    { name: "簡欣儀", note: "" }, { name: "吳承宇 Ayres", note: "" }
                ]
            },
            {
                table: "第三桌",
                people: [
                    { name: "鄭亦廷 James", note: "" }, { name: "蔡川海 Ray", note: "" }, { name: "林建瑋 David", note: "" },
                    { name: "姜之盈", note: "" }, { name: "林兩蓁", note: "" }, { name: "黃庭儀 Tim", note: "" },
                    { name: "葉家郡 Jun", note: "" }, { name: "林凱偉 Kevin", note: "" }, { name: "鄧梅嬋", note: "林凱偉家屬" },
                    { name: "林子濬", note: "林凱偉家屬" }, { name: "林佑宸", note: "林凱偉家屬" }
                ]
            }
        ]
    },
    rooms: [
        { type: "稻香雙人房", people: ["鄭珮君", "彭書怡"], note: "" },
        { type: "禾風雙人房", people: ["劉姿吟"], note: "" },
        { type: "稻香雙人房", people: ["簡采驪", "簡欣儀"], note: "" },
        { type: "豪華水漾四人房", people: ["林志堉", "陳希寧", "林裝恩", "林維杰", "黃坊瑪"], note: "嬰兒床、澡盆、消毒鍋" },
        { type: "禾風雙人房", people: ["林建瑋", "黃之盈", "林兩蓁"], note: "嬰兒床、消毒鍋、澡盆" },
        { type: "豪華水漾四人房", people: ["林凱偉", "鄧梅嬋", "林子濬", "林佑宸"], note: "" },
        { type: "稻香雙人房", people: ["葉家郡"], note: "" },
        { type: "禾風雙人房", people: ["陳垂康", "戴培芯"], note: "" },
        { type: "稻香雙人房", people: ["劉榕展", "林秉毅"], note: "" },
        { type: "稻香雙人房", people: ["蔡川海", "鄭亦廷"], note: "" },
        { type: "稻香雙人房", people: ["張家漢", "吳承宇"], note: "" },
        { type: "禾風雙人房", people: ["黃庭儀"], note: "" }
    ],
    notes: [
        {
            category: "工作",
            items: [
                "💻 Sikax 團隊請隨身帶著筆電，以防突發狀況"
            ]
        },
        {
            category: "個人攜帶",
            items: [
                "🪥 請自備個人盥洗用具（牙刷、牙膏、洗面乳、刮鬍刀、梳子、浴帽等）。飯店會提供毛浴巾、沐浴洗髮用品。房內有重複使用的拖鞋，有衛生疑慮可自行攜帶",
                "💊 請準備個人常備用藥。會暈船者請自備暈船藥（建議賞鯨前半小時服用）",
                "🌿 戶外活動較多，準備防曬用品、防蚊液非常重要",
                "🎒 建議隨身攜帶：遮陽帽、太陽眼鏡、防曬外套、飲用水、雨傘、行動電源、涼感紙巾或風扇等",
                "💧 遊覽車上備有礦泉水，有需要的人可以自取"
            ]
        },
        {
            category: "活動天數D1-D3",
            items: [
                "🛶 (D1)竹筏體驗可能會弄濕身體，請多準備「一套備用衣物」及「一雙拖鞋或涼鞋」帶在身上",
                "🪪 (D2)賞鯨出海會驗證身份，請務必攜帶「健保卡」及其他身份證明文件（身份證、駕照等）",
                "👟 (D3)部落體驗建議穿著長褲及透氣排汗的衣物，好走耐髒的運動鞋或包鞋"
            ]
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('itinerary-content');
    const tabs = document.querySelectorAll('.tab-btn');
    const notesBtn = document.getElementById('notes-btn');
    const modal = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');

    if (notesBtn) {
        notesBtn.addEventListener('click', () => handleAction('notes'));
    }

    function renderDay(day) {
        const dayData = DATA.itinerary[day];
        let html = `<h2 class="day-title">${dayData.title}</h2>`;
        html += `<div class="timeline">`;

        dayData.items.forEach(item => {
            html += `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="item-time"><i data-lucide="clock"></i> ${item.time}</div>
                        <div class="item-title">${item.title}</div>
                        <div class="item-desc">${item.desc}</div>
                        <div class="icon-tag tag-${item.tag}">
                            <i data-lucide="${item.icon}"></i> ${getTagLabel(item.tag)}
                        </div>
                        ${item.subItems ? `
                            <ul style="margin: 10px 0 0 15px; font-size: 0.8rem; color: #94a3b8; list-style-type: circle;">
                                ${item.subItems.map(si => `<li style="margin-bottom:4px;">${si}</li>`).join('')}
                            </ul>
                        ` : ''}
                        ${item.actionLink ? `<a href="${item.actionLink}" target="_blank" class="action-btn" style="text-decoration:none; display:flex; justify-content:center; align-items:center;">${item.action}</a>` : (item.action ? `<button class="action-btn" onclick="handleAction('${item.actionType}')">${item.action}</button>` : '')}
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        content.innerHTML = html;
        lucide.createIcons();
        content.classList.remove('fade-in');
        void content.offsetWidth; // Trigger reflow
        content.classList.add('fade-in');
    }

    function getTagLabel(tag) {
        const map = { transport: "坐車", activity: "活動", dining: "用餐", bicycle: "腳踏車" };
        return map[tag] || "";
    }

    window.handleAction = (type) => {
        if (type === 'kata') {
            modalTitle.innerText = "卡塔文化工作室人員分配";
            let html = "";
            DATA.activities.kata.forEach(group => {
                html += `
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--accent-light); margin-bottom: 8px;">${group.group} <span style="font-size: 0.7rem; font-weight: normal; color: #94a3b8;">${group.limit}</span></h4>
                        <div class="person-list">
                            ${group.items.map(p => `<span class="person-tag">${p}</span>`).join('')}
                        </div>
                    </div>
                `;
            });
            modalBody.innerHTML = html;
        } else if (type === 'rooms') {
            modalTitle.innerText = "房間分配表 🏨";
            let html = `<div class="seating-grid">`;
            DATA.rooms.forEach(room => {
                html += `
                    <div class="table-card" style="border-left: 5px solid #3b82f6;">
                        <div class="table-title" style="color: #2563eb;">
                            <i data-lucide="home" style="width:16px;"></i> ${room.type}
                        </div>
                        <div class="person-list">
                            ${room.people.map(p => `<span class="person-tag">${p}</span>`).join('')}
                        </div>
                        ${room.note ? `
                            <div style="margin-top: 10px; font-size: 0.75rem; color: #e11d48; background: #fff1f2; padding: 4px 10px; border-radius: 8px; display: inline-block;">
                                💡 ${room.note}
                            </div>
                        ` : ''}
                    </div>
                `;
            });
            html += `</div>`;
            modalBody.innerHTML = html;
            lucide.createIcons();
        } else if (type === 'notes') {
            modalTitle.innerText = "出遊小叮嚀 ✨";
            let html = `<div style="padding-top: 10px;">`;
            DATA.notes.forEach(group => {
                html += `<h4 style="color: var(--accent); margin: 15px 0 10px 0; font-weight: 800; display: flex; align-items: center; gap: 6px;"><i data-lucide="bookmark" style="width:18px; height:18px;"></i> ${group.category}</h4>`;
                group.items.forEach(note => {
                    html += `<div class="notes-item">${note}</div>`;
                });
            });
            html += `</div>`;
            modalBody.innerHTML = html;
            lucide.createIcons();
        } else if (type.startsWith('seating_')) {
            const chart = DATA.seating[type];
            modalTitle.innerText = type === 'seating_d1_lunch' ? "D1 午餐座位分配表" : "D2 晚餐座位分配表";
            let html = `<div class="seating-grid">`;
            chart.forEach(table => {
                html += `
                    <div class="table-card">
                        <div class="table-title">${table.table}</div>
                        <div class="person-list">
                            ${table.people.map(p => `
                                <span class="person-tag ${p.note.includes('素食') ? 'veg' : ''} ${p.note ? 'note' : ''}">
                                    ${p.name} ${p.note ? `<small style="display:block; font-size: 0.6rem; opacity: 0.8;">(${p.note})</small>` : ''}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
            modalBody.innerHTML = html;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderDay(tab.dataset.day);
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // 點擊空白處關閉
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Default to Day 1
    renderDay(1);
});
