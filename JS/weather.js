
function fetchweather(){
    
    const now = new Date();
    const m = now.getMonth() + 1;
    const d = now.getDate();

    const dayList = ["日", "一", "二", "三", "四", "五", "六"];
    const day2 = dayList[now.getDay()];
    const datestring = `${m}月${d}日 (${day2})`;
    document.querySelector(".innerDate").innerText=datestring;

    
    const apiKey = "CWA-6B71C0AD-B8D5-4B98-ABD4-3E30C5BD15FC"; 
    const locationName = "義竹鄉";
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-029?Authorization=${apiKey}&format=JSON&LocationName=${encodeURIComponent(locationName)}`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log("原始資料:", data);

        const records = data.records
        const locationsArr = records.locations || records.Locations;
        if (!locationsArr) throw new Error("找不到 Locations 結構");

        const locationArr = locationsArr[0].location || locationsArr[0].Location;
        if (!locationArr || locationArr.length === 0) {
            throw new Error(`找不到「${locationName}」，請檢查代號 029/031`);
        }
        
        const locationData = locationArr[0];
        const weatherElements = locationData.weatherElement || locationData.WeatherElement;

        const getValue = (elementName) => {
            const item = weatherElements.find(el => 
                (el.elementName === elementName) || (el.ElementName === elementName)
            );
            if (!item) return null;

            const timeArr = item.time || item.Time;
            if (!timeArr || timeArr.length === 0) return null;

            const valArr = timeArr[0].elementValue || timeArr[0].ElementValue;
            if (!valArr || valArr.length === 0) return null;

            return valArr[0]; 
        };
        
        const tempObj = getValue("溫度");
        const temp = tempObj ? tempObj.Temperature : "--";

        const wxObj = getValue("天氣現象");
        const wx = wxObj ? wxObj.Weather : "載入中";
        const wxCode = wxObj ? wxObj.WeatherCode : null;

        const popObj = getValue("3小時降雨機率");
        const pop = popObj ? popObj.ProbabilityOfPrecipitation : "0";

        const ciObj = getValue("舒適度指數");
        const ci = ciObj ? ciObj.ComfortIndexDescription : "--";


        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".desc").innerText = wx;
        document.querySelector(".rain").innerText = pop + "%";
        document.querySelector(".comfort").innerText = ci;

        const iconDiv = document.querySelector(".icon");
        const code = parseInt(wxCode);

        const nowtime = new Date().getHours();
        const isnight = (nowtime>=6 && nowtime<=17)?0:1;
        
        if (code === 1 && isnight==0) iconDiv.innerText = "☀️";
        else if(code === 1 && isnight==1) iconDiv.innerText = "🌙";
        else if (code >= 2 && code <= 7) iconDiv.innerText = "⛅";
        else if (code >= 8) iconDiv.innerText = "🌧️";
        else iconDiv.innerText = "🌤️";

    })
    .catch(error => {
        console.error("抓取失敗:", error);
        document.querySelector(".desc").innerText = "資料錯誤";
    });

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;
    const astrourl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=${apiKey}&format=JSON&CountyName=${encodeURIComponent("嘉義縣")}&Date=${todayString}`;

    fetch(astrourl)
        .then(res=>res.json())
        .then(astrodata=>{
            console.log(astrodata);

            const newlocation=astrodata.records.locations.location[0];
            const timedata=newlocation.time[0];

            if(timedata){
                document.querySelector(".sunrise").innerText=timedata.SunRiseTime;
                document.querySelector(".sunset").innerText=timedata.SunSetTime;
            }
        })
    .catch(err=>{
        console.error("抓取日出日落失敗:", err);
    })
}

fetchweather();
setInterval(fetchweather, 600000);