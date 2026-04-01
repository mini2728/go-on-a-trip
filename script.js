document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const familyList = document.getElementById('familyList');
    const addFamilyBtn = document.getElementById('addFamilyBtn');
    const summaryContent = document.getElementById('summaryContent');
    const totalBar = document.getElementById('totalBar');
    const submitBtn = document.getElementById('submitBtn');
    const participationStatus = document.getElementById('participationStatus');
    const travelDetails = document.getElementById('travelDetails');

    const PRICING = {
        ROOM_EXTRA: {
            '標準分配': 0,
            '稻香雙人房': 7800,
            '禾風雙人房': 8416,
            '水漾四人房': 11400,
            '米米親子房': 15900,
            '河馬親子房': 16800
        },
        TRANSPORT_FULL: {
            '板橋': 1904,
            '台中': 1964,
            '高雄': 970
        }
    };

    const TRIP_DATE = new Date('2026-04-01');

    function calculateAge(birthdayStr) {
        if (!birthdayStr) return 0;
        const birth = new Date(birthdayStr);
        let age = TRIP_DATE.getFullYear() - birth.getFullYear();
        const m = TRIP_DATE.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && TRIP_DATE.getDate() < birth.getDate())) {
            age--;
        }
        return age < 0 ? 0 : age;
    }

    function saveState() {
        const familyElements = document.querySelectorAll('.family-item');
        const families = Array.from(familyElements).map(item => ({
            name: item.querySelector('.f-name').value,
            id: item.querySelector('.f-id').value,
            birthday: item.querySelector('.f-birthday').value,
            height: item.querySelector('.f-height').value,
            diet: item.querySelector('.f-diet').value
        }));

        const state = {
            participationStatus: participationStatus.value,
            empName: document.getElementById('empName').value,
            empID: document.getElementById('empID').value,
            empBirthday: document.getElementById('empBirthday').value,
            empHeight: document.getElementById('empHeight').value,
            joinDate: document.getElementById('joinDate').value,
            departure: document.getElementById('departure').value,
            empDiet: document.getElementById('empDiet').value,
            roomType: document.getElementById('roomType').value,
            roomNote: document.getElementById('roomNote').value,
            families: families
        };
        localStorage.setItem('tripRegistrationState', JSON.stringify(state));
    }

    function loadState() {
        const stateStr = localStorage.getItem('tripRegistrationState');
        if (!stateStr) return;

        try {
            const state = JSON.parse(stateStr);
            if (state.participationStatus) participationStatus.value = state.participationStatus;
            if (state.empName) document.getElementById('empName').value = state.empName;
            if (state.empID) document.getElementById('empID').value = state.empID;
            if (state.empBirthday) document.getElementById('empBirthday').value = state.empBirthday;
            if (state.empHeight) document.getElementById('empHeight').value = state.empHeight;
            if (state.joinDate) document.getElementById('joinDate').value = state.joinDate;
            if (state.departure) document.getElementById('departure').value = state.departure;
            if (state.empDiet) document.getElementById('empDiet').value = state.empDiet;
            if (state.roomType) document.getElementById('roomType').value = state.roomType;
            if (state.roomNote) document.getElementById('roomNote').value = state.roomNote;

            if (state.families && Array.isArray(state.families)) {
                state.families.forEach(f => {
                    const familyItem = addFamilyItem();
                    if (f.name) familyItem.querySelector('.f-name').value = f.name;
                    if (f.id) familyItem.querySelector('.f-id').value = f.id;
                    if (f.birthday) familyItem.querySelector('.f-birthday').value = f.birthday;
                    if (f.height) familyItem.querySelector('.f-height').value = f.height;
                    if (f.diet) familyItem.querySelector('.f-diet').value = f.diet;
                });
            }
        } catch (e) {
            console.error('Local storage parse error:', e);
        }
    }

    participationStatus.addEventListener('change', () => {
        const isParticipating = participationStatus.value === 'participate';
        travelDetails.style.display = isParticipating ? 'block' : 'none';

        // 根據意願切換必填狀態
        // travelDetails 內部的欄位只有在參加時才需要必填
        const inputsInTravelDetails = travelDetails.querySelectorAll('input, select');
        inputsInTravelDetails.forEach(el => {
            if (isParticipating) {
                if (el.id === 'empID' || el.id === 'empBirthday' || el.id === 'empHeight' || el.id === 'joinDate') {
                    el.required = true;
                }
            } else {
                el.required = false;
            }
        });

        if (!isParticipating) {
            familyList.innerHTML = ''; // 清空家屬
        }

        calculateCost();
    });

    function addFamilyItem() {
        const familyItem = document.createElement('div');
        familyItem.className = 'family-item';
        familyItem.style.cssText = `
            background: #f8fafc; 
            padding: 15px; 
            border-radius: 12px; 
            margin-bottom: 20px; 
            border: 1px solid rgba(3,173,201,0.2);
        `;

        familyItem.innerHTML = `
            <div class="family-grid-top">
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size: 0.8rem; opacity: 0.7; margin-bottom: 5px; display: block;">家屬姓名</label>
                    <input type="text" placeholder="姓名" class="f-name" style="width: 100%;" required>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size: 0.8rem; opacity: 0.7; margin-bottom: 5px; display: block;">身分證字號</label>
                    <input type="text" placeholder="身分證字號" class="f-id" style="width: 100%;" required>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size: 0.8rem; opacity: 0.7; margin-bottom: 5px; display: block;">出生年月日</label>
                    <input type="date" class="f-birthday" style="width: 100%;" required>
                </div>
            </div>
            <div class="family-grid-bottom">
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size: 0.8rem; opacity: 0.7; margin-bottom: 5px; display: block;">身高 (cm)</label>
                    <input type="number" class="f-height" min="0" max="250" value="165" style="width: 100%;" required>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size: 0.8rem; color: #64748b; margin-bottom: 5px; display: block;">飲食習慣</label>
                    <select class="f-diet" style="width: 100%; padding: 10px; border-radius: 8px; background: #ffffff; border: 1px solid rgba(3,173,201,0.2); color: #1e293b;">
                        <option value="葷食">葷食</option>
                        <option value="素食">素食</option>
                    </select>
                </div>
                <button type="button" class="btn-danger remove-btn" style="height: 42px; width: 100%;">移除家屬</button>
            </div>
        `;

        familyItem.querySelector('.remove-btn').addEventListener('click', () => {
            familyItem.remove();
            calculateCost();
        });

        familyItem.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('change', calculateCost);
        });

        familyList.appendChild(familyItem);
        return familyItem;
    }

    // 新增家屬
    addFamilyBtn.addEventListener('click', () => {
        addFamilyItem();
        calculateCost();
    });

    // 監控主要欄位變動
    registrationForm.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('change', calculateCost);
    });

    function calculateSeniority(joinDateStr) {
        if (!joinDateStr) return 0;
        const join = new Date(joinDateStr);
        let months = (TRIP_DATE.getFullYear() - join.getFullYear()) * 12;
        months -= join.getMonth();
        months += TRIP_DATE.getMonth();
        return months <= 0 ? 0 : months;
    }

    function getParticipantCost(age, height, departure, roomExtra = 0, isFamily = false, isUpgraded = false) {
        let details = [];
        let total = 0;

        function addDetail(label, val) {
            total += val;
            details.push({ label, val });
        }

        // --- 核心收費細項 ---
        addDetail('遊覽車車資', age <= 2 ? 0 : 1314);
        addDetail('旅平險', age <= 2 ? 100 : (age <= 12 ? 300 : 400));

        let hotelFee = (age <= 2) ? 0 : 3900;
        if (isFamily && isUpgraded) hotelFee = 0;
        addDetail('住宿費 (3晚)', hotelFee);

        const fullTicket = PRICING.TRANSPORT_FULL[departure] || 0;
        const transp = height < 115 ? 0 : (height <= 150 ? Math.round(fullTicket * 0.5) : fullTicket);
        addDetail(`台鐵來回票 (${departure})`, transp);

        addDetail('飯店宴會廳午餐 (D1)', age <= 2 ? 0 : 770);
        addDetail('竹筏體驗｜東河部落屋 (D1)', age <= 2 ? 0 : (age < 8 ? 150 : 400));
        addDetail('部落晚宴｜東河部落屋 (D1)', age <= 2 ? 0 : 650);
        addDetail('燒製琉璃珠與傳統串珠手環體驗｜卡塔文化工作室(燒製琉璃珠/串珠手環) (D2)', age <= 2 ? 0 : 390);
        addDetail('午餐｜達麓岸部落屋 (D2)', age <= 2 ? 0 : 350);
        addDetail('出海賞鯨｜晉領號夏季經典友善賞鯨行程 (D2)', age < 5 ? 300 : (age <= 12 ? 650 : 850));
        addDetail('沙魚仔海鮮餐廳晚餐 (D2)', age <= 2 ? 0 : 650);
        addDetail('達魯瑪克深度部落體驗 (D3)', age <= 3 ? 0 : (age <= 12 ? 2100 : 2780));
        addDetail('阿杜的店-自行車導覽 (D4)', age < 3 ? 0 : 400);
        addDetail('春耕源香草餐廳午餐 (D4)', age <= 2 ? 0 : 320);

        if (roomExtra > 0) {
            total += roomExtra;
            details.push({ label: '選用房型加價', val: roomExtra });
        }

        return { total, details };
    }

    function calculateCost() {
        const status = participationStatus.value;

        if (status === 'work') {
            const empName = document.getElementById('empName').value;
            summaryContent.innerHTML = `
                <div style="background: rgba(3, 173, 201, 0.05); padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 1.2rem; color: #03adc9; font-weight: 600; margin-bottom: 10px;">🏠 正常上班</div>
                    <div style="color: #1e293b; font-weight: 500; margin-bottom: 5px;">員工姓名：${empName || '(尚未填寫)'}</div>
                    <div style="color: var(--text-muted);">不參加此次員工旅遊</div>
                </div>
            `;
            totalBar.style.display = 'flex';
            submitBtn.style.display = 'block';
            document.getElementById('totalPrice').textContent = '0';
            document.getElementById('totalSubsidy').textContent = '0';
            document.getElementById('empFinalPay').textContent = '0';
            submitBtn.dataset.payload = JSON.stringify({
                participationStatus: '正常上班',
                employee: { name: empName },
                totals: { project: 0, subsidy: 0, finalPay: 0 }
            });
            saveState();
            return;
        }

        const empName = document.getElementById('empName').value;
        const empID = document.getElementById('empID').value;
        const empBirthday = document.getElementById('empBirthday').value;
        const joinDate = document.getElementById('joinDate').value;
        const seniorityMonths = calculateSeniority(joinDate);
        const departure = document.getElementById('departure').value;
        const empDiet = document.getElementById('empDiet').value;
        const roomType = document.getElementById('roomType').value;
        const roomNote = document.getElementById('roomNote').value;
        const empHeight = parseFloat(document.getElementById('empHeight').value) || 0;

        const empAge = calculateAge(empBirthday);

        const isUpgraded = (roomType !== '標準分配');
        const familyElements = familyList.querySelectorAll('.family-item');
        const hasFamily = familyElements.length > 0;

        let totalProjectCost = 0;
        let totalSubsidy = 0;
        let summaryLines = [];
        let finalData = {
            participationStatus: '參加旅遊',
            employee: { name: empName, id: empID, birthday: empBirthday, age: empAge, joinDate, seniority: seniorityMonths, height: empHeight, departure, diet: empDiet, roomType, roomNote },
            families: [],
            totals: {},
            dietStats: { meat: 0, veg: 0 },
            ticketStats: { '板橋': 0, '台中': 0, '高雄': 0 }
        };

        if (empDiet === '葷食') finalData.dietStats.meat++; else finalData.dietStats.veg++;
        if (departure in finalData.ticketStats) finalData.ticketStats[departure]++;

        const roomExtraValue = PRICING.ROOM_EXTRA[roomType] || 0;
        const factor = seniorityMonths >= 12 ? 1 : (seniorityMonths >= 3 ? (seniorityMonths / 12) : 0);

        // 1. 員工本人
        const empData = getParticipantCost(empAge, empHeight, departure, roomExtraValue, false, isUpgraded);
        totalProjectCost += empData.total;

        const baseExclUpgrade = empData.total - roomExtraValue;
        let empBaseSubsidy = Math.round(baseExclUpgrade * factor);

        let empRoomDiscount = 0;
        if (isUpgraded) {
            empRoomDiscount += Math.round(3900 * factor);
            if (seniorityMonths >= 36 && hasFamily) empRoomDiscount += 1950;
        }
        let empSubsidy = empBaseSubsidy + Math.min(roomExtraValue, empRoomDiscount);
        totalSubsidy += empSubsidy;

        finalData.employee.total = empData.total;
        finalData.employee.subsidy = empSubsidy;
        finalData.employee.details = empData.details;

        summaryLines.push(`
            <div class="summary-group">
                <div class="summary-item main-line"><span class="label">員工本人 (${empDiet} / ${empAge}歲 / ${empHeight}cm)</span><span class="value">${empData.total.toLocaleString()}元</span></div>
                <div style="font-size: 0.75rem; color: #888; padding-left: 10px;">ID: ${empID || '未填'} / 生日: ${empBirthday || '未填'}</div>
                <div class="details-list">
                    ${empData.details.map(d => `<div>${d.label}: ${d.val.toLocaleString()}元</div>`).join('')}
                </div>
                <div class="summary-item subsidy-line"><span class="label">└ 公司補貼 (${Math.round(factor * 100)}%)</span><span class="value">-${empSubsidy.toLocaleString()}元</span></div>
                ${isUpgraded ? `<div style="font-size:0.7rem; color:#aaa; margin-top:-5px; padding-left:15px;">(房型折抵: ${Math.min(roomExtraValue, empRoomDiscount).toLocaleString()}元)</div>` : ''}
            </div>
        `);

        // 2. 家屬
        let familyDatas = [];
        familyElements.forEach((item, index) => {
            const name = item.querySelector('.f-name').value || `家屬 ${index + 1}`;
            const idNumber = item.querySelector('.f-id').value;
            const birthday = item.querySelector('.f-birthday').value;
            const height = parseFloat(item.querySelector('.f-height').value) || 0;
            const diet = item.querySelector('.f-diet').value;

            const age = calculateAge(birthday);
            const fData = getParticipantCost(age, height, departure, 0, true, isUpgraded);
            familyDatas.push({ name, idNumber, birthday, height, diet, age, fData, index });
        });

        // 找出最高費用的家屬索引 (用於補貼收費高者)
        let maxCostIndex = -1;
        let maxCost = -1;
        familyDatas.forEach((fd, i) => {
            if (fd.fData.total > maxCost) {
                maxCost = fd.fData.total;
                maxCostIndex = i;
            }
        });

        familyDatas.forEach((fd, i) => {
            const { name, idNumber, birthday, height, diet, age, fData } = fd;

            if (diet === '葷食') finalData.dietStats.meat++; else finalData.dietStats.veg++;
            if (departure in finalData.ticketStats) finalData.ticketStats[departure]++;

            totalProjectCost += fData.total;

            let fSubsidy = 0;
            // 補貼費用最高的那一位
            if (i === maxCostIndex && seniorityMonths >= 36) fSubsidy = Math.round(fData.total * 0.5);
            totalSubsidy += fSubsidy;

            finalData.families.push({ name, id: idNumber, birthday: birthday, age: age, height, diet, total: fData.total, subsidy: fSubsidy, details: fData.details });

            summaryLines.push(`
                <div class="summary-group">
                    <div class="summary-item main-line"><span class="label">${name} (${diet} / ${age}歲 / ${height}cm)</span><span class="value">${fData.total.toLocaleString()}元</span></div>
                    <div style="font-size: 0.75rem; color: #888; padding-left: 10px;">ID: ${idNumber || '未填'} / 生日: ${birthday || '未填'}</div>
                    <div class="details-list">
                        ${fData.details.map(d => `<div>${d.label}: ${d.val.toLocaleString()}元</div>`).join('')}
                    </div>
                    ${fSubsidy > 0 ? `<div class="summary-item subsidy-line"><span class="label">└ 家屬優惠 (年資滿3年及收費最高名額)</span><span class="value">-${fSubsidy.toLocaleString()}元</span></div>` : ''}
                </div>
            `);
        });

        finalData.totals = { project: totalProjectCost, subsidy: totalSubsidy, finalPay: totalProjectCost - totalSubsidy };

        if (summaryLines.length > 0 || status === 'participate') {
            summaryContent.innerHTML = summaryLines.join('') || '<div class="empty-state">請填寫員工報名資料</div>';
            totalBar.style.display = 'flex';
            submitBtn.style.display = 'block';
            document.getElementById('totalPrice').textContent = totalProjectCost.toLocaleString();
            document.getElementById('totalSubsidy').textContent = totalSubsidy.toLocaleString();
            document.getElementById('empFinalPay').textContent = (totalProjectCost - totalSubsidy).toLocaleString();
            submitBtn.dataset.payload = JSON.stringify(finalData);
        } else {
            summaryContent.innerHTML = '<div class="empty-state">請填寫左側表單計算費用</div>';
            totalBar.style.display = 'none';
            submitBtn.style.display = 'none';
        }

        saveState();
    }

    // 提交功能
    submitBtn.addEventListener('click', async () => {
        // 先執行原生表單驗證
        if (!registrationForm.reportValidity()) {
            return;
        }

        const payloadStr = submitBtn.dataset.payload;
        if (!payloadStr) return;
        const data = JSON.parse(payloadStr);

        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileNamePrefix = data.participationStatus === '參加旅遊' ? `員工旅遊報名_${data.employee.name}` : `員工旅遊_不參加上班_${data.employee.name || '未填'}`;
        a.download = `${fileNamePrefix}.json`;
        a.click();
        URL.revokeObjectURL(url);

        const SLACK_WEBHOOK_URL = 'https://line-bot-nodejs.mini14091309.workers.dev/slack';

        const slackMessage = {
            text: `📢 *收到新的員工旅遊回覆* - [${data.participationStatus}]`,
            attachments: [
                {
                    color: data.participationStatus === '參加旅遊' ? "#03adc9" : "#94a3b8",
                    text: "```\n" + JSON.stringify(data, null, 2) + "\n```",
                    fields: data.participationStatus === '參加旅遊' ? [
                        { title: "員工姓名", value: data.employee.name || "未填寫", short: true },
                        { title: "飲食統計", value: `葷：${data.dietStats.meat} 位 / 素：${data.dietStats.veg} 位`, short: true },
                        { title: "票務統計", value: `板橋：${data.ticketStats['板橋']} / 台中：${data.ticketStats['台中']} / 高雄：${data.ticketStats['高雄']}`, short: false },
                        { title: "房型需求", value: data.employee.roomNote || "無", short: false },
                        { title: "補助後應付總額", value: `${data.totals.finalPay.toLocaleString()} 元`, short: true }
                    ] : [
                        { title: "狀態", value: "不參加，選擇上班", short: false }
                    ]
                }
            ]
        };

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ 發送中...';

            const response = await fetch(SLACK_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(slackMessage),
                mode: 'no-cors'
            });

            // 送出到 Google Excel (Apps Script)
            fetch('https://script.google.com/macros/s/AKfycby1ip0qI9i4kwlRAVDh7J9KrpyXzKodwqqB7hiDWVMXNin708FbPkSH1-N-SLc8D4Qn/exec', {
                method: 'POST',
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(console.log)
                .catch(console.error);

            alert('✅ 回覆成功！資料已儲存並同步。');
        } catch (error) {
            console.error('Slack 發送失敗:', error);

            alert(`⚠️ 發送失敗: ${error}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="icon">🚀</span> 提交登記資料';
        }
    });

    loadState();
    participationStatus.dispatchEvent(new Event('change'));
});
