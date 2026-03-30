document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const familyList = document.getElementById('familyList');
    const addFamilyBtn = document.getElementById('addFamilyBtn');
    const summaryContent = document.getElementById('summaryContent');
    const totalBar = document.getElementById('totalBar');
    const submitBtn = document.getElementById('submitBtn');

    const PRICING = {
        ROOM_EXTRA: {
            standard: 0,
            double: 7800,
            quad: 11400,
            family: 19500
        },
        TRANSPORT_FULL: {
            banqiao: 1904,
            taichung: 1964,
            kaohsiung: 970
        }
    };

    const TRIP_DATE = new Date('2026-04-01');

    // 新增家屬
    addFamilyBtn.addEventListener('click', () => {
        const familyItem = document.createElement('div');
        familyItem.className = 'family-item';
        familyItem.innerHTML = `
            <div class="form-row" style="grid-template-columns: 2fr 1fr 1fr auto; width: 100%; align-items: center; margin-bottom: 0;">
                <input type="text" placeholder="姓名/稱謂" class="f-name">
                <div class="input-unit">
                    <input type="number" placeholder="年齡" class="f-age" min="0" max="100" value="30">
                    <span>歲</span>
                </div>
                <div class="input-unit">
                    <input type="number" placeholder="身高" class="f-height" min="0" max="250" value="165">
                    <span>cm</span>
                </div>
                <button type="button" class="btn-danger remove-btn">移除</button>
            </div>
        `;

        familyItem.querySelector('.remove-btn').addEventListener('click', () => {
            familyItem.remove();
            calculateCost();
        });

        familyItem.querySelectorAll('input').forEach(el => {
            el.addEventListener('change', calculateCost);
        });

        familyList.appendChild(familyItem);
        calculateCost();
    });

    // 監控主要欄位變動
    registrationForm.querySelectorAll('input, select').forEach(el => {
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
        addDetail(`來回交通費 (${departure})`, transp);

        addDetail('飯店宴會廳午餐 (D1)', age <= 2 ? 0 : 770);
        addDetail('東河部落屋竹筏體驗 (D1)', age <= 2 ? 0 : (age < 8 ? 150 : 400));
        addDetail('部落晚宴 (D1)', age <= 2 ? 0 : 650);
        addDetail('江賢二藝術園區門票 (D2)', age < 7 ? 0 : 250);
        addDetail('達麓岸/海角咖啡午餐 (D2)', age < 12 ? 0 : 600);
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
        const roomType = document.getElementById('roomType').value;
        const empHeight = parseFloat(document.getElementById('empHeight').value) || 0;
        const isUpgraded = (roomType !== 'standard');

        let totalProjectCost = 0;
        let totalSubsidy = 0;
        let summaryLines = [];
        let finalData = {
            employee: { name: empName, joinDate, seniority: seniorityMonths, height: empHeight, departure, roomType },
            families: [],
            totals: {}
        };

        const roomExtraValue = PRICING.ROOM_EXTRA[roomType] || 0;
        const factor = seniorityMonths >= 12 ? 1 : (seniorityMonths >= 3 ? (seniorityMonths / 12) : 0);

        // 1. 員工本人
        const empData = getParticipantCost(30, empHeight, departure, roomExtraValue, false, isUpgraded);
        totalProjectCost += empData.total;
        let empBaseSubsidy = Math.round((empData.total - roomExtraValue) * factor);
        let empRoomSubsidy = Math.round(Math.min(roomExtraValue, 3900) * factor);
        let empSubsidy = empBaseSubsidy + empRoomSubsidy;
        totalSubsidy += empSubsidy;

        finalData.employee.total = empData.total;
        finalData.employee.subsidy = empSubsidy;
        finalData.employee.details = empData.details;

        summaryLines.push(`
            <div class="summary-group">
                <div class="summary-item main-line"><span class="label">員工本人 (身高 ${empHeight}cm)</span><span class="value">${empData.total.toLocaleString()}元</span></div>
                <div class="details-list">
                    ${empData.details.map(d => `<div>${d.label}: ${d.val.toLocaleString()}元</div>`).join('')}
                </div>
                <div class="summary-item subsidy-line"><span class="label">└ 員工補貼 (${Math.round(factor * 100)}%)</span><span class="value">-${empSubsidy.toLocaleString()}元</span></div>
            </div>
        `);

        // 2. 家屬
        const familyElements = familyList.querySelectorAll('.family-item');
        familyElements.forEach((item, index) => {
            const name = item.querySelector('.f-name').value || `家屬 ${index + 1}`;
            const age = parseInt(item.querySelector('.f-age').value) || 0;
            const height = parseFloat(item.querySelector('.f-height').value) || 0;

            const fData = getParticipantCost(age, height, departure, 0, true, isUpgraded);
            totalProjectCost += fData.total;

            let fMaxPossible = (index === 0) ? 1950 : 0;
            let fSubsidy = Math.min(fData.total, Math.round(fMaxPossible * factor));
            totalSubsidy += fSubsidy;

            finalData.families.push({ name, age, height, total: fData.total, subsidy: fSubsidy, details: fData.details });

            summaryLines.push(`
                <div class="summary-group">
                    <div class="summary-item main-line"><span class="label">${name} (${age}歲 / ${height}cm)</span><span class="value">${fData.total.toLocaleString()}元</span></div>
                    <div class="details-list">
                        ${fData.details.map(d => `<div>${d.label}: ${d.val.toLocaleString()}元</div>`).join('')}
                    </div>
                    ${fSubsidy > 0 ? `<div class="summary-item subsidy-line"><span class="label">└ 家屬住宿補助 (限額 ${Math.round(fMaxPossible * factor)})</span><span class="value">-${fSubsidy.toLocaleString()}元</span></div>` : ''}
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

            // 儲存當前數據供提交使用
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

        // 1. 儲存/下載 JSON 檔
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `員工旅遊報名_${data.employee.name || '未命名'}_${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        // 2. 發送至 Slack (使用 Webhook)
        const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

        const slackMessage = {
            text: `📢 *收到新的員工旅遊報名紀錄*`,
            attachments: [
                {
                    color: "#6366f1",
                    text: "```\n" + JSON.stringify(data, null, 2) + "\n```",
                    fields: [
                        { title: "員工姓名", value: data.employee.name || "未填寫", short: true },
                        { title: "補助後應付總額", value: `${data.totals.finalPay.toLocaleString()} 元`, short: true }
                    ]
                }
            ]
        };

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ 發送中...';

            // 由於 Webhook 通常涉及跨域問題，在本地純前端測試時可能會失敗。
            // 這裡提供邏輯，建議在有 Webhook Proxy 或 正式伺服器環境下使用。
            const response = await fetch(SLACK_WEBHOOK_URL, {
                method: 'POST',
                body: JSON.stringify(slackMessage),
                mode: 'no-cors' // 常用於 Webhook 直接發送
            });

            alert('✅ 登記成功！JSON 檔已下載，報名訊息已嘗試發送至 Slack。');
        } catch (error) {
            console.error('Slack 發送失敗:', error);
            alert('⚠️ 登記已儲存為 JSON，但 Slack 發送失敗（可能是 Webhook URL 未設定或跨域限制）。');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="icon">🚀</span> 提交登記資料';
        }
    });

    calculateCost();
});
