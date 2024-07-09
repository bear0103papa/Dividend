import requests
import pandas as pd
from datetime import datetime
import time
import json

def scrape_twse():
    url = "https://www.twse.com.tw/rwd/zh/exRight/TWT49U"
    params = {
        "startDate": "20230101",
        "endDate": datetime.now().strftime("%Y%m%d"),
        "response": "json"
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    if data['stat'] == 'OK':
        df = pd.DataFrame(data['data'], columns=data['fields'])
        return df
    else:
        print("無法從台灣證券交易所獲取數據")
        return None

def scrape_tpex():
    url = "https://www.tpex.org.tw/web/stock/exright/dailyquo/exDailyQ_result.php"
    params = {
        "l": "zh-tw",
        "d": datetime.now().strftime("%Y%m%d"),
        "o": "json"
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    if data['iTotalRecords'] > 0:
        df = pd.DataFrame(data['aaData'])
        return df
    else:
        print("無法從櫃買中心獲取數據")
        return None

def process_data(df, source):
    if df is not None:
        df['來源'] = source
        df['更新時間'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return df

def main():
    print("正在爬取台灣證券交易所的數據...")
    twse_df = process_data(scrape_twse(), '台灣證券交易所')
    
    time.sleep(2)  # 添加延遲以避免快速連續請求
    
    print("正在爬取櫃買中心的數據...")
    tpex_df = process_data(scrape_tpex(), '櫃買中心')
    
    # 合併數據
    combined_df = pd.concat([twse_df, tpex_df], ignore_index=True)
    
    # 將數據轉換為JSON格式並保存
    if not combined_df.empty:
        combined_df.to_json('dividend_data.json', orient='records', force_ascii=False)
        print("合併後的數據已保存到 dividend_data.json")
    else:
        print("沒有可用的數據")

if __name__ == "__main__":
    main()
