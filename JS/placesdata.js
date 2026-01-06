const placesData = [
    { 
        id: 1, 
        name: "翁岳生祖居", 
        lat:23.3322927,
        lng:120.242245,
        cover: "./media/intro/id-01.JPG", // 卡片封面圖
        images: ["./media/intro/id-01.JPG", "https://picsum.photos/800/400?random=1"], // 輪播圖陣列
        desc: "明治時期的閩南古厝，如何孕育出台灣五任大法官？走進「存德堂」，除了珍貴的法學手稿與老照片，更藏著一段跨越世紀的動人故事...", 
        fullDesc: "這裡可以放更完整的詳細介紹文字。翁岳生祖居（存德堂）是義竹鄉重要的歷史建築...", // 模態窗裡的詳細內文
        addr: "義竹鄉六桂村" 
    },
    { 
        id: 2, 
        name: "馨滿義竹", 
        lat:23.339501, 
        lng:120.249899,
        cover: "./media/intro/id-02.JPG",
        images: ["./media/intro/id-02.JPG", "https://picsum.photos/800/400?random=2"],
        desc: "回到日本時代的義竹，火車鳴笛聲中總夾雜著淡淡糖香。這裡曾是「糖業王國」的樞紐，更藏著一段蔗農子弟獨有的搭車記憶。想知道這條鐵道背後的故事...",
        fullDesc: "義竹舊車站見證了糖業鐵路的興衰，保留了許多珍貴的鐵道文物...",
        addr: "義竹鄉台19線旁" 
    },
    // ... 請依此格式把剩下 3~8 的資料都補進來
    { 
        id: 3, 
        name: "翁清江古厝", 
        lat:23.3337724,
        lng:120.2436863,
        cover: "./media/intro/id-03.JPG", 
        images: ["./media/intro/id-03.JPG"], 
        desc: "義竹鄉間竟藏著荷蘭人設計的豪宅？融合閩日西三種風格，門楣上的神祕盾牌更暗藏玄機。一窺前中研院院長翁啟惠祖居的真實風貌...", 
        fullDesc: "...", 
        addr: "..." 
    },

    { 
        id: 4, 
        name: "東後寮教會", 
        lat:23.378228, 
        lng:120.246697,
        cover: "./media/intro/id-04.JPG", 
        images: ["./media/intro/id-04.JPG"], 
        desc: "義竹路旁的紅磚秘境，竟是南台灣罕見的「巴西力卡式」老教堂！1927年的絕美拱窗與精湛英格蘭砌法，邀你走入這份百年的神聖寧靜...", 
        fullDesc: "...", 
        addr: "..." 
    },

    { 
        id: 5, 
        name: "東榮村火車頭公園", 
        lat:23.3787119,
        lng:120.2441868,
        cover: "./media/intro/id-05.JPG", 
        images: ["./media/intro/id-05.JPG"], 
        desc: "東後寮的鐵道旁，時間彷彿走得特別慢。昔日的五分車與不老的水牛，守候著被封存的糖業記憶。不需要趕車，只需漫步舊鐵軌，聆聽這段凝結的歲月...", 
        fullDesc: "...", 
        addr: "..." 
    },

    { 
        id: 6, 
        name: "中正堂彩繪", 
        lat:23.3365561,
        lng:120.2459599,
        cover: "./media/intro/id-06.JPG", 
        images: ["./media/intro/id-06.JPG"], 
        desc: "巨大的英文字母上，竟藏著無數張珍貴老照片？這座結合歷史與現代的裝置藝術，訴說著義竹人的集體回憶。來這裡用鏡頭閱讀故事，發現更多隱藏驚喜...", 
        fullDesc: "...", 
        addr: "..." 
    },

    { 
        id: 7, 
        name: "義竹修緣禪寺", 
        lat:23.3346879,
        lng:120.2445254,
        cover: "./media/intro/id-07.JPG", 
        images: ["./media/intro/id-07.JPG"], 
        desc: "義竹田間竟藏著一座氣勢磅礡的皇宮級建築！「修緣」二字源自濟公俗名，這裡不只鐘鼓樓巍峨聳立，更充滿「笑看人生」的自在氛圍。想領悟這份獨特的豁達...", 
        fullDesc: "...", 
        addr: "..." 
    },

    { 
        id: 8, 
        name: "義竹慈化寺", 
        lat:23.3343399,
        lng:120.2441555,
        cover: "./media/intro/id-08.JPG", 
        images: ["./media/intro/id-08.JPG"], 
        desc: "義竹鄉半數人口都姓翁，守護這個顯赫世家的竟是這尊「祖佛」！從康熙年間的私家神壇變身宏偉仿宋宮殿，慈化寺藏著一段跨海而來的開墾傳奇...", 
        fullDesc: "...", 
        addr: "..." 
    }
];
