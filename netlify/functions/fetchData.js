npm install node-fetch

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const startDate = event.queryStringParameters.startDate || '';
    const endDate = event.queryStringParameters.endDate || '';

    const tpexUrl = 'https://www.tpex.org.tw/web/stock/exright/dailyquo/exDailyQ.php?l=zh-tw';
    const twseUrl = `https://www.twse.com.tw/rwd/zh/exRight/TWT49U?startDate=${startDate}&endDate=${endDate}&response=json`;

    try {
        const [tpexResponse, twseResponse] = await Promise.all([
            fetch(tpexUrl),
            fetch(twseUrl)
        ]);

        const tpexData = await tpexResponse.text(); // 根據實際情況解析tpex數據
        const twseData = await twseResponse.json();

        // 返回抓取的數據
        return {
            statusCode: 200,
            body: JSON.stringify({ tpexData, twseData }),
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};
