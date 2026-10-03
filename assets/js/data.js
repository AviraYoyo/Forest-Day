/* =========================================================
   Forest Day — 所有資料都在這裡
   老師只需改最上面的 SCHOOL_CONFIG，其他不用動。
   本檔用「全域變數」而不是 fetch，所以雙擊 index.html 就能開。
   ========================================================= */

/* ★★★ 老師只需要改這裡 ★★★ */
const SCHOOL_CONFIG = {
  schoolName: "Fr. Cucchiara Memorial School",
  className: "P.2",
  tripDate: "2026-10-30",                       // 出發日期 YYYY-MM-DD
  tripPlace: "Tai Shui Hang, Ma On Shan",       // 大水坑
  teacherName: "Miss Lee"
};

/* 導覽列 */
const NAV = [
  { href: "index.html",     en: "Home",            cn: "首頁",       icon: "🌳" },
  { href: "book.html",      en: "Our Book",        cn: "電子繪本",   icon: "📖" },
  { href: "words.html",     en: "Words",           cn: "詞語銀行",   icon: "🔤" },
  { href: "sentences.html", en: "Sentences",       cn: "句子工場",   icon: "🧩" },
  { href: "quiz.html",      en: "Quiz",            cn: "小測驗",     icon: "⭐" },
  { href: "bring.html",     en: "What to Bring",   cn: "活動須知",   icon: "🎒" },
  { href: "parents.html",   en: "Grown-ups",       cn: "老師家長區", icon: "👨‍👩‍👧" }
];

/* =========================================================
   25 個目標詞（4 個主題組）
   ========================================================= */
const WORDS = [
  // A. 大自然與場地（7）
  { en: "forest",             cn: "森林",     grp: "nature",  pos: "n.",   icon: "🌲", sent: "Look! This is our forest." },
  { en: "river",              cn: "河流",     grp: "nature",  pos: "n.",   icon: "🏞️", sent: "The river is cold!" },
  { en: "rock",               cn: "石頭",     grp: "nature",  pos: "n.",   icon: "🪨", sent: "We are climbing on the rocks." },
  { en: "mud",                cn: "泥漿",     grp: "nature",  pos: "n.",   icon: "🟤", sent: "Mud on our hands!" },
  { en: "tree",               cn: "樹",       grp: "nature",  pos: "n.",   icon: "🌳", sent: "It is a big tree." },
  { en: "bird",               cn: "小鳥",     grp: "nature",  pos: "n.",   icon: "🐦", sent: "The bird is singing." },
  { en: "bamboo",             cn: "竹",       grp: "nature",  pos: "n.",   icon: "🎍", sent: "The bamboo is long and green.", note: "只要求指認圖片" },
  // B. 動作與物件（7）——現在進行式主力
  { en: "build",   ing: "building",   cn: "建造", grp: "action", pos: "v.", icon: "🧱", sent: "We are building a raft." },
  { en: "climb",   ing: "climbing",   cn: "攀爬", grp: "action", pos: "v.", icon: "🧗", sent: "She is climbing the rope." },
  { en: "catch",   ing: "catching",   cn: "捉",   grp: "action", pos: "v.", icon: "🐟", sent: "He is catching a fish." },
  { en: "splash",  ing: "splashing",  cn: "潑水", grp: "action", pos: "v.", icon: "💦", sent: "We are splashing in the water." },
  { en: "carry",   ing: "carrying",   cn: "搬運", grp: "action", pos: "v.", icon: "📦", sent: "Amy is carrying an inner tube." },
  { en: "tie",     ing: "tying",      cn: "綁",   grp: "action", pos: "v.", icon: "🪢", sent: "Tom is tying the bamboo.", note: "tie → tying（去 e 加 -ing）" },
  { en: "raft",               cn: "竹筏",     grp: "action",  pos: "n.",   icon: "🛶", sent: "Our raft is on the water!" },
  // C. 裝備
  { en: "long-sleeve shirt",  cn: "長袖衫",   grp: "bring", pos: "n.", icon: "👕", sent: "I have my long-sleeve shirt." },
  { en: "walking shoes",      cn: "步行鞋",   grp: "bring", pos: "n.", icon: "👟", sent: "My walking shoes are brown." },
  { en: "water shoes",        cn: "包趾水鞋", grp: "bring", pos: "n.", icon: "🩴", sent: "You must wear water shoes." },
  { en: "towel",              cn: "毛巾",     grp: "bring", pos: "n.", icon: "🧣", sent: "Where is my towel?" },
  { en: "hat",                cn: "帽子",     grp: "bring", pos: "n.", icon: "👒", sent: "My hat is yellow." },
  { en: "raincoat",           cn: "雨衣",     grp: "bring", pos: "n.", icon: "🧥", sent: "It is raining. Put on your raincoat." },
  { en: "mosquito repellent", cn: "驅蚊液",   grp: "bring", pos: "n.", icon: "🦟", sent: "I have mosquito repellent.", note: "只要求指認，不評量拼寫" },
  // D. 感受
  { en: "excited", cn: "興奮", grp: "feel", pos: "adj.", icon: "🤩", sent: "We are excited!" },
  { en: "scared",  cn: "害怕", grp: "feel", pos: "adj.", icon: "😨", sent: "I am scared. I can try." },
  { en: "brave",   cn: "勇敢", grp: "feel", pos: "adj.", icon: "🦁", sent: "Amy is very brave." },
  { en: "careful", cn: "小心", grp: "feel", pos: "adj.", icon: "🤝", sent: "You must be careful." }
];

const WORD_GROUPS = [
  { key: "nature",  en: "Nature & Place",           cn: "大自然與場地", emoji: "🌲" },
  { key: "action",  en: "Actions & Things We Make", cn: "動作與物件",   emoji: "🏃" },
  { key: "bring",   en: "Things to Bring",          cn: "裝備",         emoji: "🎒" },
  { key: "feel",    en: "Feelings",                 cn: "感受",         emoji: "💖" }
];

/* =========================================================
   《Our Big Forest Day》 v3 竹筏版 — 封面 + 11 頁 + 詩 + 規則封底
   角色：Tom（黃雨衣）· Amy（紅帽）· Miss Lee（老師）· 八哥天天
   ========================================================= */
const BOOK_PAGES = [
  { img: "p00-cover.jpg",  title: "Cover",
    en: "Our Big Forest Day. A Hong Kong Forest Adventures Story.",
    cn: "我們的大森林日。香港森林歷險記。",
    targets: ["forest", "day"] },
  { img: "p01.jpg",  n: 1,
    en: "Today is our Forest Day! We are going to the forest. We can't wait!",
    cn: "今天是我們的森林日！我們要去森林。我們等不及了！",
    targets: ["forest", "excited"] },
  { img: "p02.jpg",  n: 2,
    en: 'Miss Lee says, "Check your bag!" I have my hat and my water shoes.',
    cn: "李老師說：「檢查你的背包！」我有帽子和包趾水鞋。",
    targets: ["hat", "water shoes"] },
  { img: "p03.jpg",  n: 3, rules: true,
    en: '"You must stay with your group," says Miss Lee. "You must not run alone."',
    cn: "李老師說：「你必須跟著你的組別。」「你不可以獨自亂跑。」",
    targets: ["must", "must not"] },
  { img: "p04.jpg",  n: 4,
    en: "Look at the bamboo, the inner tubes and the ropes!",
    cn: "看看這些竹子、內胎和繩子！",
    targets: ["bamboo", "raft"] },
  { img: "p05.jpg",  n: 5,
    en: '"What are you doing?" asks Miss Lee. "We are building a raft!"',
    cn: "李老師問：「你們在做什麼？」「我們在造竹筏！」",
    targets: ["build", "raft"] },
  { img: "p06.jpg",  n: 6,
    en: 'My friend is carrying an inner tube. "Be careful!" says Miss Lee.',
    cn: "我的朋友在搬內胎。李老師說：「小心！」",
    targets: ["carry", "careful"] },
  { img: "p08.jpg",  n: 7, rules: true,
    en: "Here is the river. Look at the sign! You must not run on the rocks.",
    cn: "河流到了。看那個告示牌！你不可以在石頭上跑。",
    targets: ["river", "must not"] },
  { img: "p09.jpg",  n: 8,
    en: "Our raft is on the water! Tom is looking for fish. Splash!",
    cn: "我們的竹筏下水了！Tom 在找魚。嘩啦！",
    targets: ["raft", "catch"] },
  { img: "p10.jpg",  n: 9, brave: true,
    en: '"What is Amy doing?" "She is climbing." "You must go slowly!" says Miss Lee.',
    cn: "「Amy 在做什麼？」「她在攀爬。」「你必須慢慢走！」李老師說。",
    targets: ["climb", "must"] },
  { img: "p12.jpg",  n: 10,
    en: "Mud on our hands! We are laughing. What fun!",
    cn: "手上有泥！我們在笑。真好玩！",
    targets: ["mud", "splash"] },
  { img: "p14.jpg",  n: 11,
    en: "It is time to go home. We are tired but we are happy.",
    cn: "要回家了。我們很累，但是我們很開心。",
    targets: ["tired"] },
  { img: "p13.jpg",  title: "In the forest — by P.2 ___", poem: true,
    en: "What are we doing?\nWe are playing in the forest. What fun!\nWhat is Tom doing?\nHe is looking for fish.\nWhat is Amy doing?\nShe is climbing. How brave!\nLook at the bird. What is it doing?\nIt is singing in the tree.\nWhat are we doing now?\nWe are going home.",
    cn: "我們在做什麼？\n我們在森林裡玩。真好玩！\nTom 在做什麼？\n他在找魚。\nAmy 在做什麼？\n她在攀爬。真勇敢！\n看看那隻小鳥。牠在做什麼？\n牠在樹上唱歌。\n我們現在在做什麼？\n我們要回家了。",
    targets: ["bird", "sing"] },
  { img: "p15-rules.jpg",  title: "The Forest Rules",
    en: "You must stay with your group. You must wear water shoes. You must go slowly. You must try. You must not run on the rocks. You must not push your friends. You must not go alone.",
    cn: "你必須跟著你的組別。你必須穿水鞋。你必須慢慢走。你必須試試。你不可以在石頭上跑。你不可以推朋友。你不可以獨自走。",
    targets: ["must", "must not"] }
];

/* 《I Can Try!》 6 頁迷你讀本 */
const TRY_PAGES = [
  { img: "try-01.jpg", n: 1, en: "Look at the rope. It is high.",              cn: "看看那條繩。它好高。" },
  { img: "try-02.jpg", n: 2, en: '"I am scared," says Amy.',                   cn: "Amy 說：「我好害怕。」" },
  { img: "try-03.jpg", n: 3, en: 'Her friends say, "You can try!"',            cn: "她的朋友說：「你可以試試！」" },
  { img: "try-04.jpg", n: 4, en: "Amy is climbing. Slowly, slowly.",           cn: "Amy 在爬。慢慢地，慢慢地。" },
  { img: "try-05.jpg", n: 5, en: "She is at the top. She is brave!",           cn: "她到頂了。她很勇敢！" },
  { img: "try-06.jpg", n: 6, en: "I am scared. I can try!",                    cn: "我很害怕。我可以試試！" }
];

/* =========================================================
   規則 You must / You must not
   ========================================================= */
const MUST_RULES = [
  { en: "stay with your group",          cn: "跟著你的組別" },
  { en: "wear water shoes",              cn: "穿水鞋" },
  { en: "go slowly",                     cn: "慢慢走" },
  { en: "try",                           cn: "試試看" },
  { en: "put on your raincoat when it rains", cn: "下雨時穿上雨衣" },
  { en: "take your rubbish home",        cn: "把垃圾帶回家" },
  { en: "drink water",                   cn: "喝水" },
  { en: "listen to the teachers",        cn: "聽老師的話" }
];

const MUST_NOT_RULES = [
  { en: "run on the rocks",              cn: "在石頭上跑" },
  { en: "push your friends",             cn: "推朋友" },
  { en: "go alone",                      cn: "獨自走" },
  { en: "run near the river",            cn: "在河邊跑" },
  { en: "forget your hat",               cn: "忘記戴帽子" },
  { en: "worry about getting muddy",     cn: "怕弄髒" }
];

/* 規則分類遊戲的 8 張卡 */
const SORT_CARDS = [
  { en: "stay with your group",   cn: "跟著組別",   bucket: "must" },
  { en: "run on the wet rocks",   cn: "在濕石上跑", bucket: "mustnot" },
  { en: "wear water shoes",       cn: "穿水鞋",     bucket: "must" },
  { en: "push your friends",      cn: "推朋友",     bucket: "mustnot" },
  { en: "put on your raincoat",   cn: "穿上雨衣",   bucket: "must" },
  { en: "go alone",               cn: "獨自走",     bucket: "mustnot" },
  { en: "go slowly on the rocks", cn: "在石頭上慢慢走", bucket: "must" },
  { en: "run near the river",     cn: "在河邊跑",   bucket: "mustnot" }
];

/* =========================================================
   拖曳造句遊戲
   ========================================================= */
const SUBJECTS = [
  { s: "He",   be: "is"  }, { s: "She",  be: "is"  }, { s: "It",   be: "is"  },
  { s: "I",    be: "am"  }, { s: "We",   be: "are" }, { s: "They", be: "are" }
];
const ACTION_VERBS = ["building", "climbing", "catching", "splashing", "carrying", "tying", "laughing", "singing"];

/* =========================================================
   小測驗 10 題
   ========================================================= */
const QUIZ = [
  { q: "What is Amy doing?", img: "p10.jpg", opts: ["She is climbing.", "She is sleeping.", "She is swimming."], a: 0 },
  { q: "What is it doing?",  img: "p13.jpg", opts: ["It is jumping.", "It is singing.", "It is eating."], a: 1 },
  { q: "What are they doing?", img: "p12.jpg", opts: ["They are playing in the mud.", "They are reading.", "They are running."], a: 0 },
  { q: "What is he doing?",  img: "p09.jpg", opts: ["He is looking for fish.", "He is riding a bike.", "He is drawing."], a: 0 },
  { q: "What are you doing?", img: "p05.jpg", opts: ["We are building a raft!", "We are reading a book.", "We are sleeping."], a: 0 },
  { q: "What is she doing?", img: "p06.jpg", opts: ["She is carrying an inner tube.", "She is carrying a fish.", "She is carrying a bird."], a: 0 },
  { q: "You ______ wear water shoes in the river.", img: "p08.jpg", opts: ["must", "must not", "do not"], a: 0 },
  { q: "You ______ push your friends.", img: "p03.jpg", opts: ["must", "must not", "can"], a: 1 },
  { q: "You ______ go alone in the forest.", img: "p03.jpg", opts: ["must", "must not", "always"], a: 1 },
  { q: "You ______ take your rubbish home.", img: "p14.jpg", opts: ["must not", "must", "am"], a: 1 }
];

/* =========================================================
   Bring List（來自官網 /bring）
   ========================================================= */
const BRING_LIST = [
  { en: "long-sleeve shirt and long pants", cn: "長袖衫和長褲（防蚊）", icon: "👕", must: true },
  { en: "comfortable walking shoes",        cn: "舒適的步行鞋",         icon: "👟", must: true },
  { en: "closed-toe water shoes",           cn: "包趾水鞋",             icon: "🩴", must: true },
  { en: "a hat",                            cn: "帽子",                 icon: "👒", must: true },
  { en: "a raincoat",                       cn: "雨衣",                 icon: "🧥", must: true },
  { en: "a towel",                          cn: "毛巾",                 icon: "🧣", must: true },
  { en: "mosquito repellent",               cn: "驅蚊液",               icon: "🦟", must: true },
  { en: "sunscreen",                        cn: "防曬霜",               icon: "🧴", must: true },
  { en: "an extra set of dry clothes",      cn: "一套備用乾衣服",       icon: "🧺", must: true },
  { en: "snack / lunch and water",          cn: "小食／午餐和水",       icon: "🥪", must: true }
];

/* =========================================================
   延伸閱讀書目（只列推薦，不含內頁）
   ========================================================= */
const BOOKSHELF = [
  { title: "We're Going on a Bear Hunt", author: "Michael Rosen / Helen Oxenbury",
    isbn: "978-0-7445-2323-2", pub: "Walker Books · 1989 · 40pp",
    why: "首句 We're going on a bear hunt 就是現在進行式。grass / river / mud / forest 四段正好對應大水坑場景，全班跟著做動作誦唱。",
    use: "課堂 3 分鐘 TPR 誦唱（只做四段，勿全讀）", tag: "同課使用", hk: false },
  { title: "Not a Stick", author: "Antoinette Portis",
    isbn: "978-0-06-112325-2", pub: "HarperCollins · 2008 · 32pp",
    why: "小豬把一根樹枝變成劍、釣竿、畫筆、馬。比 Not a Box 更貼森林——森林裡最多的就是樹枝，而且 loose parts 的想像力轉換一樣成立。",
    use: "閱讀角・自由翻閱（不入 40 分鐘課堂）", tag: "閱讀角", hk: false },
  { title: "Tree: A Peek-Through Picture Book", author: "Britta Teckentrup",
    isbn: "978-1-1019-3242-1", pub: "Little Tiger / Doubleday · 2016 · 32pp",
    why: "洞洞書，文字極少，四季森林天然產出 It is raining / The bird is singing。是練習 It is ...ing 最好的素材。",
    use: "晨讀或圖書角", tag: "閱讀角", hk: false },
  { title: "The Koala Who Could", author: "Rachel Bright / Jim Field",
    isbn: "978-1-4083-3164-4", pub: "Orchard Books · 2017 · 32pp",
    why: "樹熊 Kevin 抱著樹不敢下來，最後發現沒那麼可怕 —— I can't 變成 I can。押韻字少，比 Jabari Jumps 更適合 P2。",
    use: "活動後讀（學生經歷過才共鳴）", tag: "活動後", hk: false },
  { title: "Jabari Jumps", author: "Gaia Cornwall",
    isbn: "978-0-7636-7838-8", pub: "Candlewick · 2017 · 32pp",
    why: "對應 HKFA「鼓勵冒險」和成人退後一步。但 cannonball / somersault 等詞偏難且場景是泳池，故移出課堂。",
    use: "活動後親子共讀（不要求輸出）", tag: "活動後", hk: false },
  { title: "The Most Magnificent Thing", author: "Ashley Spires",
    isbn: "978-1-5545-3704-4", pub: "Kids Can Press · 2014 · 32pp",
    why: "女孩反覆失敗仍堅持做出「最了不起的東西」—— 對應 HKFA「重過程不重成品」與 tinkering 環節。",
    use: "延伸閱讀（只需抓 try again）", tag: "閱讀角", hk: false },
  { title: "Pickle the Porcupine: And the Wild Hong Kong Adventure", author: "Lindsay Varty / Catherine Choi",
    isbn: "978-988-76749-3-1", pub: "Blacksmith Books · 36pp",
    why: "香港出版社出版。箭豬 Pickle 住在香港山上，迷路到市區要找回森林的家 —— 唯一有香港在地連結的一本。",
    use: "活動前後皆可 · 香港書店有售", tag: "香港出版", hk: true },
  { title: "Welly the Wild Boar: And the Quest for the Egg Puffs", author: "Lindsay Varty / Catherine Choi",
    isbn: "978-988-75546-5-3", pub: "Blacksmith Books · 2022 · 28pp",
    why: "野豬是香港郊野常見動物，大水坑一帶也有出沒。但主題其實是街頭小食，森林詞彙不會出現 —— 貼合度中等偏低。",
    use: "延伸「香港森林有什麼動物」· 不放進課堂", tag: "香港出版", hk: true },
  { title: "The Hike", author: "Alison Farrell",
    isbn: "978-1-4521-7461-7", pub: "Chronicle Books · 2019 · 56pp",
    why: "三個女孩帶地圖去森林遠足、迷路、畫動物腳印 —— 結構最接近「一群孩子去森林玩一天」。56 頁偏長。",
    use: "只給能力較強的學生 · 或影印 glossary 做詞彙牆", tag: "能力較強", hk: false }
];

/* =========================================================
   家長在家支援（5 條具體建議）
   ========================================================= */
const PARENT_TIPS = [
  { en: "Ask in Chinese, let your child answer in one English word.", cn: "用中文問「今天做了咩？」，讓孩子用一個英文詞回答即可。", icon: "💬" },
  { en: "Read the Bring List together and let your child tick the box.", cn: "一起讀行李清單，讓孩子自己勾選，而不是你替他收拾。", icon: "🎒" },
  { en: "Say the sentence: I am scared. I can try.", cn: "每天跟孩子說一次這句話，出發前再說一次。", icon: "🦁" },
  { en: "Do not worry about mud. It washes off. The confidence does not.", cn: "不用怕髒。泥會洗掉，但孩子的自信不會。", icon: "🟤" },
  { en: "After the trip, ask: What were you doing? Let them answer in one English sentence.", cn: "活動後問「你當時在做什麼？」讓孩子用一句英文回答，不用長。", icon: "📸" }
];
