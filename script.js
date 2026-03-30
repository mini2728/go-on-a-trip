document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const familyList = document.getElementById('familyList');
    const addFamilyBtn = document.getElementById('addFamilyBtn');
    const summaryContent = document.getElementById('summaryContent');
    const totalBar = document.getElementById('totalBar');
    const submitBtn = document.getElementById('submitBtn');
    
    const PRICING = {
        ROOM_EXTRA: {
            '標準分配': 0,
            '稻香雙人房': 7800,
            '水漾四人房': 11400,
            '米米親子房': 19500
        },
        TRANSPORT_FULL: {
            '板橋': 1904,
            '台中': 1964,
            '高雄': 970
        }
    };

    const TRIP_DATE = new Date('2026-04-01');

    // 新增家屬
    addFamilyBtn.addEventListener('click', () => {
        const familyItem = document.createElement('div');
        familyItem.className = 'family-item';
        familyItem.innerHTML = `
            <div class="form-row" style="grid-template-columns: 2fr 1fr 1fr 1.5fr auto; width: 100%; align-items: center; margin-bottom: 0; gap: 8px;">
                <input type="text" placeholder="姓名/稱謂" class="f-name">
                <div class="input-unit">
                    <input type="number" placeholder="年齡" class="f-age" min="0" max="100" value="30">
                    <span>歲</span>
                </div>
                <div class="input-unit">
                    <input type="number" placeholder="身高" class="f-height" min="0" max="250" value="165">
                    <span>cm</span>
                </div>
                <select class="f-diet" style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                    <option value="葷食">葷食</option>
                    <option value="素食">素食</option>
                </select>
                <button type="button" class="btn-danger remove-btn">移除</button>
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
        addDetail('東河部落屋竹筏體驗 (D1)', age <= 2 ? 0 : (age < 8 ? 150 : 400));
        addDetail('部落晚宴 (D1)', age <= 2 ? 0 : 650);
        addDetail('江賢二藝術園區門票 (D2)', age < 7 ? 0 : 250);
        addDetail('達麓岸午餐 (D2)', age <= 3 ? 0 : 350);
        addDetail('成功漁港賞鯨費用 (D2)', age < 5 ? 300 : (age <= 12 ? 650 : 850));
        addDetail('佳濱成功旗魚海鮮晚餐 (D2)', age <= 2 ? 0 : 600);
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
        const empName = document.getElementById('empName').value;
        const joinDate = document.getElementById('joinDate').value;
        const seniorityMonths = calculateSeniority(joinDate);
        const departure = document.getElementById('departure').value;
        const empDiet = document.getElementById('empDiet').value;
        const roomType = document.getElementById('roomType').value;
        const roomNote = document.getElementById('roomNote').value;
        const empHeight = parseFloat(document.getElementById('empHeight').value) || 0;
        const isUpgraded = (roomType !== '標準分配');
        const familyElements = familyList.querySelectorAll('.family-item');
        const hasFamily = familyElements.length > 0;

        let totalProjectCost = 0;
        let totalSubsidy = 0;
        let summaryLines = [];
        let finalData = {
            employee: { name: empName, joinDate, seniority: seniorityMonths, height: empHeight, departure, diet: empDiet, roomType, roomNote },
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
        const empData = getParticipantCost(30, empHeight, departure, roomExtraValue, false, isUpgraded);
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
                <div class="summary-item main-line"><span class="label">員工本人 (${empDiet} / ${empHeight}cm)</span><span class="value">${empData.total.toLocaleString()}元</span></div>
                <div class="details-list">
                    ${empData.details.map(d => `<div>${d.label}: ${d.val.toLocaleString()}元</div>`).join('')}
                </div>
                <div class="summary-item subsidy-line"><span class="label">└ 公司補貼 (${Math.round(factor * 100)}%)</span><span class="value">-${empSubsidy.toLocaleString()}元</span></div>
                ${isUpgraded ? `<div style="font-size:0.7rem; color:#aaa; margin-top:-5px; padding-left:15px;">(房型折抵: ${Math.min(roomExtraValue, empRoomDiscount).toLocaleString()}元)</div>` : ''}
            </div>
        `);

        // 2. 家屬
        familyElements.forEach((item, index) => {
            const name = item.querySelector('.f-name').value || `家屬 ${index + 1}`;
            const age = parseInt(item.querySelector('.f-age').value) || 0;
            const height = parseFloat(item.querySelector('.f-height').value) || 0;
            const diet = item.querySelector('.f-diet').value;
            
            if (diet === '葷食') finalData.dietStats.meat++; else finalData.dietStats.veg++;
            if (departure in finalData.ticketStats) finalData.ticketStats[departure]++;

            const fData = getParticipantCost(age, height, departure, 0, true, isUpgraded);
            totalProjectCost += fData.total;

            let fSubsidy = 0;
            if (index === 0 && seniorityMonths >= 36) fSubsidy = Math.round(fData.total * 0.5);
            totalSubsidy += fSubsidy;

            finalData.families.push({ name, age, height, diet, total: fData.total, subsidy: fSubsidy, details: fData.details });

            summaryLines.push(`
                <div class="summary-group">
                    <div class="summary-item main-line"><span class="label">${name} (${diet} / ${age}歲 / ${height}cm)</span><span class="value">${fData.total.toLocaleString()}元</span></div>
                    <div class="details-list">
                        ${fData.details.map(d => `<div>${d.label}: ${d.val.toLocaleString()}元</div>`).join('')}
                    </div>
                    ${fSubsidy > 0 ? `<div class="summary-item subsidy-line"><span class="label">└ 家屬優惠 (年資滿3年半價)</span><span class="value">-${fSubsidy.toLocaleString()}元</span></div>` : ''}
                </div>
            `);
        });

        finalData.totals = { project: totalProjectCost, subsidy: totalSubsidy, finalPay: totalProjectCost - totalSubsidy };

        if (summaryLines.length > 0) {
            summaryContent.innerHTML = summaryLines.join('');
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
    }

    // 提交功能
    submitBtn.addEventListener('click', async () => {
        const payloadStr = submitBtn.dataset.payload;
        if (!payloadStr) return;
        const data = JSON.parse(payloadStr);
        
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `員工旅遊報名_${data.employee.name}.json`;
        a.click();
        URL.revokeObjectURL(url);

        const SLACK_WEBHOOK_URL = 'https://line-bot-nodejs.mini14091309.workers.dev/slack'; 
        const slackMessage = {
            text: `📢 *收到新的員工旅遊報名紀錄*`,
            attachments: [
                {
                    color: "#6366f1",
                    text: "```\n" + JSON.stringify(data, null, 2) + "\n```",
                    fields: [
                        { title: "員工姓名", value: data.employee.name || "未填寫", short: true },
                        { title: "飲食統計", value: `葷：${data.dietStats.meat} 位 / 素：${data.dietStats.veg} 位`, short: true },
                        { title: "票務統計", value: `板橋：${data.ticketStats['板橋']} / 台中：${data.ticketStats['台中']} / 高雄：${data.ticketStats['高雄']}`, short: false },
                        { title: "房型需求", value: data.employee.roomNote || "無", short: false },
                        { title: "補助後應付總額", value: `${data.totals.finalPay.toLocaleString()} 元`, short: true }
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
            alert('✅ 登記成功！JSON 檔已下載，報名訊息已發送至 Slack。');
        } catch (error) {
            console.error('Slack 發送失敗:', error);
            alert('⚠️ 登記已儲存為 JSON，但 Slack 發送失敗。');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="icon">🚀</span> 提交登記資料';
        }
    });

    calculateCost();
});
