async function fetchData() {
    const startDate = document.getElementById('startDate').value.replace(/-/g, '');
    const endDate = document.getElementById('endDate').value.replace(/-/g, '');

    const url = `/.netlify/functions/fetchData?startDate=${startDate}&endDate=${endDate}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data); // 先檢查一下返回的數據結構

        displayResults(data.tpexData, data.twseData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResults(tpexData, twseData) {
    const tbody = document.querySelector('#results tbody');
    tbody.innerHTML = '';

    // 假設twseData是正確的JSON數據，tpexData是HTML字符串，需要進一步處理
    if (twseData && Array.isArray(twseData.data)) {
        twseData.data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item[0]}</td>
                <td>${item[1]}</td>
                <td>${item[2]}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // 解析tpexData中的HTML字符串
    const parser = new DOMParser();
    const doc = parser.parseFromString(tpexData, 'text/html');
    const rows = doc.querySelectorAll('table tr'); // 根據實際HTML結構調整選擇器

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${cells[0].innerText}</td>
                <td>${cells[1].innerText}</td>
                <td>${cells[2].innerText}</td>
            `;
            tbody.appendChild(newRow);
        }
    });
}
