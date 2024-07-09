import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime, timedelta

def fetch_tpex_data(date):
    url = f"https://www.tpex.org.tw/web/stock/exright/dailyquo/exDailyQ.php?l=zh-tw&d={date}"
    response = requests.get(url)
    data = response.json()
    return data.get('aaData', [])

def fetch_twse_data(start_date, end_date):
    url = f"https://www.twse.com.tw/rwd/zh/exRight/TWT49U?startDate={start_date}&endDate={end_date}&response=json"
    response = requests.get(url)
    data = response.json()
    return data.get('data', [])

def process_data(tpex_data, twse_data):
    combined_data = {}
    
    for item in tpex_data:
        stock_id = item[0]
        company_name = item[1]
        ex_dividend_date = item[2]
        cash_dividend = item[3]
        
        combined_data[stock_id] = {
            "company_name": company_name,
            "ex_dividend_date": ex_dividend_date,
            "cash_dividend": cash_dividend,
            "market": "TPEx"
        }
    
    for item in twse_data:
        stock_id = item[0]
        company_name = item[1]
        ex_dividend_date = item[3]
        cash_dividend = item[4]
        
        combined_data[stock_id] = {
            "company_name": company_name,
            "ex_dividend_date": ex_dividend_date,
            "cash_dividend": cash_dividend,
            "market": "TWSE"
        }
    
    return combined_data

def main():
    today = datetime.now().strftime("%Y%m%d")
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y%m%d")
    
    tpex_data = fetch_tpex_data(today)
    twse_data = fetch_twse_data(today, tomorrow)
    
    combined_data = process_data(tpex_data, twse_data)
    
    with open('data/stock_data.json', 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
