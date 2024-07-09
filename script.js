async function fetchData() {
    const startDate = document.getElementById('startDate').value.replace(/-/g, '');
    const endDate = document.getElementById('endDate').value.replace(/-/g, '');

    const tpexUrl = `https://www.tpex.org.tw/web/stock/exright/dailyquo/exDailyQ.php?l=zh-tw`;
    const twseUrl = `https://www.twse.com.tw/rwd/zh/exRight/TWT49U?startDate=${startDate}&endDate=${endDate}&response=json`;

    try {
        const [tpexResponse, twseResponse] = await Promise.all([
            fetch(tpexUrl),
            fetch(twseUrl)
        ]);

        const tpexData = await tpexResponse.json();
        const twseData = await twseResponse.json();

        displayResults(tpexData, twseData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResults(tpexData, twseData) {
    const tbody = document.querySelector('#results tbody');
    tbody.innerHTML = '';

    // 假設tpexData和twseData格式相似，可以根據實際數據格式進行調整
    tpexData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.stockCode}</td>
            <td>${item.companyName}</td>
            <td>${item.dividendDate}</td>
        `;
        tbody.appendChild(row);
    });

    twseData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.stockCode}</td>
            <td>${item.companyName}</td>
            <td>${item.dividendDate}</td>
        `;
        tbody.appendChild(row);
    });
}
