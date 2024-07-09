async function fetchData() {
    const startDate = document.getElementById('startDate').value.replace(/-/g, '');
    const endDate = document.getElementById('endDate').value.replace(/-/g, '');

    const url = `/.netlify/functions/fetchData?startDate=${startDate}&endDate=${endDate}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        displayResults(data.tpexData, data.twseData);
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
