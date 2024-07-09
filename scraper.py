import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime, timedelta
import logging
import os

# 設置日誌
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def fetch_tpex_data(date):
    url = f"https://www.tpex.org.tw/web/stock/exright/dailyquo/exDailyQ.php?l=zh-tw&d={date}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data.get('aaData', [])
    except requests.RequestException as e:
        logging.error(f"Error fetching TPEx data: {e}")
        return []

def fetch_twse_data(start_date, end_date):
    url = f"https://www.twse.com.tw/rwd/zh/exRight/TWT49U?startDate={start_date}&endDate={end_date}&response=json"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data.get('data', [])
    except requests.RequestException as e:
        logging.error(f"Error fetching TWSE data: {e}")
        return []

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
    
    logging.info("Fetching TPEx data...")
    tpex_data = fetch_tpex_data(today)
    logging.info(f"Retrieved {len(tpex_data)} items from TPEx")

    logging.info("Fetching TWSE data...")
    twse_data = fetch_twse_data(today, tomorrow)
    logging.info(f"Retrieved {len(twse_data)} items from TWSE")
    
    combined_data = process_data(tpex_data, twse_data)
    logging.info(f"Processed {len(combined_data)} total items")
    
    os.makedirs('data', exist_ok=True)
    with open('data/stock_data.json', 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, ensure_ascii=False, indent=2)
    logging.info("Data saved to data/stock_data.json")

if __name__ == "__main__":
    main()
