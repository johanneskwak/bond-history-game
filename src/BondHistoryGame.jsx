import { useState } from "react";

const motion = {
  div: ({ children, ...props }) => {
    const safeProps = { ...props };
    delete safeProps.initial;
    delete safeProps.animate;
    delete safeProps.exit;
    delete safeProps.transition;
    return <div {...safeProps}>{children}</div>;
  },
};
const AnimatePresence = ({ children }) => <>{children}</>;


// Constants and Data
const BEGINNER_EXPLAINERS = {
    "디플레이션": "물가가 내려가면 미래에 받을 고정 이자의 가치가 커져 국채가 유리해집니다.",
    "인플레이션": "물가가 오르면 미래 이자의 실질 가치가 깎여 만기가 긴 채권일수록 불리합니다.",
    "금리 인상": "새 채권 이자가 높을수록, 예전 채권 가격은 내려가기 쉽습니다.",
    "금리 인하": "기존 채권의 이자가 좋아 보여 기존 채권 가격이 올라가기 쉽습니다.",
    "안전자산 선호": "위기 시, 투자자들은 이자가 적어도 안전한 국채로 몰립니다.",
    "듀레이션": "금리 변화에 따른 가격의 민감도로, 대체로 만기가 길수록 더 큽니다.",
    "QE": "중앙은행이 채권을 직접 사들여 금리를 낮추고 가격을 올리는 효과가 있습니다."
};

const COLOR_MAP = {
    "blue": ["#eaf2ff", "#d5e4ff", "#678df2"],
    "teal": ["#e8fbf7", "#d0f5eb", "#32b89c"],
    "gold": ["#fff8e8", "#ffe9b0", "#d8a11e"],
    "rose": ["#fff0f4", "#ffd5df", "#db6791"],
    "slate": ["#f2f5f9", "#dde5f0", "#6b7b93"],
    "mint": ["#eefcf4", "#d7f6e3", "#51b57c"]
};

const SCENARIOS = [
    { year:"1929년", title:"대공황의 시작", image_url:"assets/scene_1.png", fed_news:"주식 시장 붕괴 이후 연준은 초기에 적극적으로 금리를 내리지 않았고, 심각한 디플레이션 발생", concept:"디플레이션 시기에는 고정된 이자를 주는 안전자산이 강세", event_icon:"⬡", choices:["우량 국채 매수", "회사채 매수"], results:[0.20, -0.50], result_texts:["디플레이션 속 안전자산 선호로 국채 가격 상승", "기업 부도 위험 증가로 회사채 폭락"], choice_icons:["▣", "▲"], difficulty:1, easy_bond_explanation:"정부 채권이 기업 채권보다 훨씬 안전하다고 여겨집니다.", beginner_tip:"급격히 나빠질 때는 '안전'이 최고입니다.", keyword:"디플레이션", teacher_commentary:"디플레이션은 고정현금흐름 증가 및 기업 부도율을 동시에 발생시킵니다.", discussion_prompt:"왜 높은 이자보다 안전성이 중요해질까요?", event_palette:"blue", choice_palettes:["blue","rose"], portfolio_shift:[{gov_bonds:0.14, cash:-0.04, duration:0.08, credit:-0.10, inflation:-0.02}, {credit:0.16, cash:-0.06, gov_bonds:-0.08, duration:0.02}], mini_quiz:{question:"디플레이션 시기 유리한 자산은?", options:["고정 이자를 주는 안전 국채", "부도 위험이 큰 회사채", "현금흐름 불안한 채권"], answer_idx:0, explanation:"안전자산 선호 강화"} }
];

// Add the rest of the scenarios dynamically
SCENARIOS.push(
    { year:"1973년", title:"제1차 오일쇼크", image_url:"assets/scene_2.png", fed_news:"유가 급등으로 스태그플레이션 발생", concept:"인플레이션은 장기채 투자자에게 특히 불리함", event_icon:"◈", choices:["단기채 보유", "장기채 매수"], results:[-0.02, -0.15], result_texts:["짧은 만기로 금리 충격 최소화", "장기채는 금리상승 충격을 강하게 받음"], choice_icons:["◆", "▭"], difficulty:1, easy_bond_explanation:"만기가 긴 채권일수록 금리 변화에 더 크게 흔들립니다.", beginner_tip:"금리가 오를 땐 단기채가 덜 아픕니다.", keyword:"인플레이션", teacher_commentary:"물가 압력이 금리를 자극하므로 듀레이션 관리가 핵심", discussion_prompt:"장기채가 왜 단기채보다 금리에 더 민감한가?", event_palette:"gold", choice_palettes:["mint","gold"], portfolio_shift:[{short_bonds:0.16, duration:-0.12}, {long_bonds:0.18, duration:0.18}], mini_quiz:{question:"금리 상승기 크게 흔들리는 것은?", options:["단기채", "장기채", "현금"], answer_idx:1, explanation:"듀레이션이 길기 때문"} },
    { year:"1979년", title:"폴커 쇼크", image_url:"assets/scene_3.png", fed_news:"폴 볼커 의장의 초고금리 긴축정책", concept:"급격한 금리인상은 기존 저금리 채권을 폭락시킴", event_icon:"✦", choices:["현금 보유", "장기국채 매수"], results:[0.00, -0.40], result_texts:["현금 방어로 충격 회피", "금리 급등 정면 충돌로 대규모 손실"], choice_icons:["■", "◉"], difficulty:2, easy_bond_explanation:"새로운 채권 이자가 훨씬 높으면 기존 채권은 매력이 사라집니다.", beginner_tip:"금리 급등기엔 무포지션(현금)도 훌륭한 전략입니다.", keyword:"금리 인상", teacher_commentary:"기존 장기채의 폭력적 밸류에이션 리셋 과정", discussion_prompt:"현금 보유가 전략이 되는 이유는?", event_palette:"rose", choice_palettes:["slate","rose"], portfolio_shift:[{cash:0.18, duration:-0.18}, {long_bonds:0.22, duration:0.25}], mini_quiz:{question:"기존 채권 가격 폭락 이유는?", options:["새 채권 금리가 매력적이어서", "국채는 항상 위험해서", "현금이 사라져서"], answer_idx:0, explanation:"수익률 상대비교 때문"} },
    { year:"1987년", title:"블랙 먼데이", image_url:"assets/scene_4.png", fed_news:"주식시장이 하루 만에 폭락했고, 연준은 유동성 공급과 완화적 대응 의지를 보였다.", concept:"위기 상황에서 연준의 완화 기대는 장기채 가격 상승으로 이어질 수 있다.", event_icon:"✺", choices:["현금 관망", "장기 국채 매수"], results:[0.00, 0.18], result_texts:["자산은 지켰지만 큰 기회는 얻지 못했다.", "완화 기대를 앞서 읽고 장기 국채 상승을 잡았다."], choice_icons:["▤", "⬢"], difficulty:2, easy_bond_explanation:"위기가 오면 중앙은행이 금리를 낮출 것이라는 기대가 생겨 장기채 가격이 먼저 오르기 시작할 수 있습니다.", beginner_tip:"중앙은행이 시장을 살릴 것 같으면 채권은 먼저 반응합니다.", keyword:"금리 인하", teacher_commentary:"시장 붕괴는 즉시 완화 기대를 키웠고, 장기금리 하락 기대가 장기채 가격을 밀어 올렸다.", discussion_prompt:"왜 주식 폭락이 채권 상승 재료가 될 수 있을까요?", event_palette:"slate", choice_palettes:["slate", "blue"], portfolio_shift:[{"cash":0.14,"gov_bonds":-0.04,"duration":-0.02},{"long_bonds":0.18,"duration":0.18,"cash":-0.12}], mini_quiz:{question:"위기 때 장기 국채가 강해질 수 있는 이유는?", options:["중앙은행의 완화 기대가 생기기 때문", "단기채보다 항상 안전해서", "물가가 오르기 때문"], answer_idx:0, explanation:"위기 상황의 금리 인하 및 안전자산 선호 영향"} },
    { year:"1994년", title:"채권 대학살", image_url:"assets/scene_5.png", fed_news:"시장 예상보다 강한 금리 인상으로 채권시장이 급락했다.", concept:"기습적 금리 인상기에는 고정금리 장기채보다 변동금리 자산이 유리할 수 있다.", event_icon:"✹", choices:["변동금리부 채권 매수", "고정금리 장기채 매수"], results:[0.05, -0.25], result_texts:["금리가 오를수록 이자도 조정되어 방어에 성공했다.", "고정금리 장기채가 금리 상승 충격을 강하게 받았다."], choice_icons:["◫", "▥"], difficulty:2, easy_bond_explanation:"변동금리채는 금리가 오르면 받는 이자도 따라 올라가 방어력이 매우 높습니다.", beginner_tip:"금리가 예상보다 빨리 오르면 고정금리 장기채가 가장 위험합니다.", keyword:"금리 인상", teacher_commentary:"서프라이즈 긴축은 듀레이션이 긴 자산일수록 불리하고, 플로팅 구조가 유리합니다.", discussion_prompt:"변동금리채는 왜 상승기 방어력이 높을까요?", event_palette:"teal", choice_palettes:["teal", "gold"], portfolio_shift:[{"credit":0.06,"short_bonds":0.08,"duration":-0.10},{"long_bonds":0.18,"duration":0.20,"cash":-0.06}], mini_quiz:{question:"변동금리가 금리 상승기에 유리한 이유는?", options:["이자가 시장 금리에 맞춰 조정되어서", "가격 변동이 없어서", "무조건 원금이 두 배가 되어서"], answer_idx:0, explanation:"금리 연동에 따른 쿠폰 조정 시스템"} },
    { year:"2008년", title:"글로벌 금융위기", image_url:"assets/scene_6.png", fed_news:"리먼 파산 이후 무제한 양적완화(QE) 개시", concept:"중앙은행의 매입은 채권 가격을 밀어올림", event_icon:"✵", choices:["초우량 장기국채 매수", "금리상승 베팅"], results:[0.25, -0.20], result_texts:["안전 선호와 QE가 국채를 폭등시킴", "정책을 거스른 대가로 큰 손실"], choice_icons:["⬣", "▽"], difficulty:2, easy_bond_explanation:"중앙은행이 시장에서 채권을 사주면 가격이 당연히 오릅니다.", beginner_tip:"중앙은행을 거스르지 마라.", keyword:"QE", teacher_commentary:"리세션+안전선호+QE 3요소가 결합된 초강세장", discussion_prompt:"양적완화가 금리를 낮추는 이유는?", event_palette:"blue", choice_palettes:["mint","rose"], portfolio_shift:[{gov_bonds:0.14, long_bonds:0.16}, {cash:0.03, duration:-0.10}], mini_quiz:{question:"QE란?", options:["중앙은행이 채권을 매입하는 것", "세금 인상", "금리 인상"], answer_idx:0, explanation:"직접적인 유동성 공급과 채권수요 창출"} },
    { year:"2020년", title:"코로나 팬데믹", image_url:"assets/scene_7.png", fed_news:"제로금리와 함께 회사채 매입까지 나선 연준", concept:"정책이 회사채 시장을 받쳐주면 빠른 가격반등이 일어남", event_icon:"✹", choices:["우량 회사채 매수", "현금 관망"], results:[0.20, 0.00], result_texts:["정책 백스톱 신용프리미엄 축소 구간 수익", "안전했지만 반등 랠리를 놓침"], choice_icons:["◫", "■"], difficulty:2, easy_bond_explanation:"회사채도 연준이 사주겠다고 선언하면 엄청나게 강력해집니다.", beginner_tip:"가장 강력한 매수자는 중앙은행입니다.", keyword:"QE", teacher_commentary:"전례없는 회사채 지지선언에 따른 리스크 프리미엄 소멸", discussion_prompt:"정책 개입이 성과를 어떻게 가르는가?", event_palette:"mint", choice_palettes:["teal","slate"], portfolio_shift:[{credit:0.18}, {cash:0.12}], mini_quiz:{question:"중앙은행이 회사채 지지하면 기대되는 변화는?", options:["회사채 위험프리미엄 축소", "국채 발행 중단", "영구 고정금리"], answer_idx:0, explanation:"신용 스프레드 축소"} },
    { year:"최종장", title:"연준의 모호한 신호", image_url:"assets/scene_8.png", fed_news:"물가와 경기침체 양쪽 다 주시하겠다는 모호한 발언", concept:"알 수 없을 때는 지키는 포지션이 정답", event_icon:"✪", choices:["보수적 분산 포지션", "레버리지 장기채 올인"], results:[0.10, -0.20], result_texts:["유연한 방어로 변동성 국면 통과", "기대만 믿고 올인했다 폭락"], choice_icons:["◧", "◉"], difficulty:3, easy_bond_explanation:"헷갈릴 땐 무리해서 베팅하지 않고 지키는 게 최고입니다.", beginner_tip:"생존형 포트폴리오가 승리합니다.", keyword:"듀레이션", teacher_commentary:"모호한 가이던스 구간에서 확실한 베팅은 리스크가 과도합니다.", discussion_prompt:"왜 올인 전략이 더 위험할까요?", event_palette:"slate", choice_palettes:["mint","rose"], portfolio_shift:[{cash:0.08, duration:-0.02}, {long_bonds:0.20, duration:0.20}], mini_quiz:{question:"불확실성 장세 원칙은?", options:["크게 한방", "생존 가능 규모 포지션", "무조건 장기채"], answer_idx:1, explanation:"변동성 대비"} }
);

function moneyStr(amount) {
    return (amount / 100).toLocaleString(undefined, {minimumFractionDigits:1, maximumFractionDigits:1}) + "억 원";
}
function pctStr(r) { return (r > 0 ? "+" : "") + (r * 100).toFixed(1) + "%"; }
function safeRatio(bal, orig) { return orig === 0 ? 0 : bal / orig; }

function getEnding(ratio) {
    if (ratio >= 2.0) return {grade: "S급", title: "JP모건 싱가포르 본부장", icon: "👑", desc: "시장을 누구보다 먼저 읽어냈습니다."};
    if (ratio >= 1.6) return {grade: "A급+", title: "골드만삭스 아시아 매크로 헤드", icon: "💼", desc: "불확실성을 완전히 통제했습니다."};
    if (ratio >= 1.3) return {grade: "A급", title: "NH투자증권 전임운용역", icon: "📊", desc: "수준급 실무 감각과 포지션 관리."};
    if (ratio >= 1.1) return {grade: "B급+", title: "연기금 주니어 매니저", icon: "🏦", desc: "큰 실수 없이 기회를 잡았습니다."};
    if (ratio >= 0.9) return {grade: "B급", title: "증권사 채권영업부", icon: "📝", desc: "시장의 감은 있지만 버티지 못했습니다."};
    return {grade: "C급", title: "리스크관리팀 인턴", icon: "⚠️", desc: "채권은 인내심이 필요합니다."};
}

// SVG Renderers
function BannerSVG({ title, subtitle, accent = "blue", icon = "◆" }) {
    const [bg, bg2, line] = COLOR_MAP[accent] || COLOR_MAP.blue;
    return (
        <svg viewBox="0 0 1200 330" className="w-full h-auto rounded-3xl" style={{ border: `1px solid ${line}` }}>
            <defs>
                <linearGradient id={`g-${accent}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={bg}/>
                <stop offset="100%" stopColor="#ffffff"/>
                </linearGradient>
            </defs>
            <rect width="1200" height="330" rx="28" fill={`url(#g-${accent})`}/>
            <circle cx="985" cy="65" r="120" fill={bg2} opacity="0.8"/>
            <circle cx="1115" cy="260" r="95" fill={bg2} opacity="0.55"/>
            <rect x="42" y="42" width="150" height="150" rx="28" fill="#ffffff" opacity="0.96" stroke={line} strokeWidth="3"/>
            <text x="117" y="138" textAnchor="middle" fontSize="78" fontWeight="700" fill={line}>{icon}</text>
            <text x="230" y="116" fontFamily="Arial" fontSize="20" fill="#64748b">Bond History Event Card</text>
            <text x="230" y="168" fontFamily="Arial" fontSize="38" fontWeight="700" fill="#17213b">{title}</text>
            <text x="230" y="212" fontFamily="Arial" fontSize="24" fill="#475569">{subtitle}</text>
            <rect x="230" y="240" width="170" height="14" rx="7" fill={line} opacity="0.75"/>
        </svg>
    )
}

function ChoiceSVG({ title, tag, accent = "teal", icon = "■" }) {
    const [bg, bg2, line] = COLOR_MAP[accent] || COLOR_MAP.teal;
    return (
        <svg viewBox="0 0 900 240" className="w-full h-auto rounded-2xl mb-3">
            <defs>
                <linearGradient id={`g2-${accent}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor={bg}/>
                </linearGradient>
            </defs>
            <rect width="900" height="240" rx="24" fill={`url(#g2-${accent})`} stroke={bg2} strokeWidth="2"/>
            <circle cx="118" cy="120" r="72" fill={bg2}/>
            <text x="118" y="145" textAnchor="middle" fontSize="72" fontWeight="700" fill={line}>{icon}</text>
            <text x="220" y="92" fontFamily="Arial" fontSize="20" fill="#64748b">Decision</text>
            <text x="220" y="136" fontFamily="Arial" fontSize="30" fontWeight="700" fill="#17213b">{title}</text>
            <rect x="220" y="160" width="105" height="34" rx="17" fill={bg2}/>
            <text x="272" y="183" textAnchor="middle" fontFamily="Arial" fontSize="18" fontWeight="700" fill="#21436b">{tag}</text>
        </svg>
    )
}

function FallbackImage({ src, fallbackSvg }) {
    const [error, setError] = useState(false);
    if(error || !src) return fallbackSvg;
    return <img src={src} className="card-art" onError={() => setError(true)} alt="Event Art" />;
}

// --- Main Game Component ---
function GameApp() {
    // States
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [mode, setMode] = useState("교사용"); // 학생용 / 교사용
    const [difficulty, setDifficulty] = useState("보통");
    const [balance, setBalance] = useState(10000.0);
    const initialBalance = 10000.0;
    const survivalLimit = 6000.0;
    const [turn, setTurn] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [shield, setShield] = useState(1);
    const [hint, setHint] = useState(3);
    const [lastHintText, setLastHintText] = useState("");
    const [portfolio, setPortfolio] = useState({ cash:0.28, gov_bonds:0.24, credit:0.18, short_bonds:0.14, long_bonds:0.16 });
    const [metrics, setMetrics] = useState({ duration: 0.50, credit_risk: 0.48, inflation_sensitivity: 0.44 });
    const [logs, setLogs] = useState([]);
    const [lastResult, setLastResult] = useState(null);
    
    // Render Header & Setup
    if (!started) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 pt-10">
                <div className="hero">
                    <div className="text-4xl font-black mb-2 text-[#172341]">Bond History Premium Game</div>
                    <div className="text-gray-500 mb-4">연준의 역사적 결정 속에서 살아남아라. 채권을 어렵게 외우지 않고 직접 선택하며 배우는 인터랙티브 시뮬레이션</div>
                    <div className="flex flex-wrap gap-2">
                        <span className="chip">학생용/교사용</span>
                        <span className="chip">포트폴리오 추적</span>
                        <span className="chip">미니 퀴즈 보상</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-3xl border border-gray-200">
                        <h3 className="font-bold mb-4 text-lg border-b pb-2">게임 설정</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">모드</label>
                                <select value={mode} onChange={e => setMode(e.target.value)} className="w-full p-2 rounded-xl bg-gray-50 border outline-none">
                                    <option>학생용</option>
                                    <option>교사용</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">난이도</label>
                                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-2 rounded-xl bg-gray-50 border outline-none">
                                    <option>쉬움</option>
                                    <option>보통</option>
                                    <option>어려움</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={() => {
                            setStarted(true);
                            if(difficulty === "쉬움") setHint(4);
                            if(difficulty === "어려움") setHint(2);
                        }} className="w-full mt-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-lg">
                            시큐리티 체크 통과 · 트레이딩 시작
                        </button>
                    </div>

                    <div className="learn-box h-full flex flex-col justify-center">
                        <h3 className="font-black text-amber-800 mb-3 text-lg">초보자 매뉴얼</h3>
                        <ul className="list-disc pl-5 space-y-2 text-amber-900 font-medium">
                            <li><b>금리 등정</b>: 예전 채권 가격은 내려갑니다.</li>
                            <li><b>위기 상황</b>: 위험자산을 피하고 안전자산(국채)이 인기를 끕니다.</li>
                            <li><b>단기/장기채</b>: 장기 만기 채권은 이자율 충격에 훨씬 취약합니다. (듀레이션 효과)</li>
                            <li><b>QE(양적완화)</b>: 중앙은행이 채권을 쓸어 담으면 채권 가치는 치솟습니다.</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // Results Screen
    if (finished) {
        const ratio = safeRatio(balance, initialBalance);
        const returnPct = (ratio - 1) * 100;
        const endData = getEnding(ratio);

        return (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-4xl mx-auto bg-white rounded-3xl p-10 border shadow-2xl mt-10 text-center">
                <div className="text-6xl mb-4">{endData.icon}</div>
                <h2 className="text-3xl font-black mb-2">시즌 종료: {endData.grade}</h2>
                <h3 className="text-blue-600 font-bold text-xl mb-4">{endData.title}</h3>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">{endData.desc}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-gray-50 rounded-2xl border">
                        <div className="text-sm text-gray-400 font-bold mb-1">최종 자산</div>
                        <div className="text-2xl font-black">{moneyStr(balance)}</div>
                        <div className={`text-sm mt-1 font-bold ${returnPct > 0 ? "text-green-500" : "text-red-500"}`}>{returnPct.toFixed(1)}%</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border">
                        <div className="text-sm text-gray-400 font-bold mb-1">정확도</div>
                        <div className="text-2xl font-black">{correctCount} <span className="text-lg text-gray-400 font-normal">/ {SCENARIOS.length}</span></div>
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <button onClick={()=>window.location.reload()} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold">새 게임</button>
                </div>
            </motion.div>
        );
    }

    // Normal Game Loop
    const scenario = SCENARIOS[turn];
    
    const handleChoice = (choiceIdx) => {
        const resultsArr = scenario.results;
        const optimalIdx = resultsArr.indexOf(Math.max(...resultsArr));
        const isCorrect = choiceIdx === optimalIdx;
        let actualReturn = resultsArr[choiceIdx];
        
        let usedShield = false;
        if (actualReturn < -0.20 && shield > 0) {
            actualReturn *= 0.5;
            setShield(s => s - 1);
            usedShield = true;
        }

        if (isCorrect) {
            setCorrectCount(c => c + 1);
            setStreak((prev) => {
              const next = prev + 1;
              setBestStreak((bs) => Math.max(bs, next));
              return next;
            });
        } else {
            setStreak(0);
        }

        const newBalance = balance * (1 + actualReturn);
        setBalance(Math.max(0, newBalance));
        
        setLogs(prev => [...prev, {
            turn: turn+1, year:scenario.year, choice: scenario.choices[choiceIdx], returnAmt: actualReturn, correct: isCorrect
        }]);

        setLastResult({ isCorrect, actualReturn, usedShield, optimalIdx, choiceIdx });
    };

    const nextTurn = () => {
        setLastResult(null);
        setLastHintText("");
        if (turn + 1 >= SCENARIOS.length || balance <= survivalLimit) setFinished(true);
        else setTurn(t => t + 1);
    };

    const useHint = () => {
        if (hint > 0) {
            setHint(h => h - 1);
            setLastHintText(`[힌트] 초보자 통찰: ${scenario.beginner_tip} | 상대적으로 유리한 방향은 ${scenario.choices[scenario.results.indexOf(Math.max(...scenario.results))]}에 가깝습니다.`);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar Menu / Dashboard */}
            <div className="col-span-1 space-y-4">
                <div className="kpi">
                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">총 자산 (생존선: 60억)</div>
                    <div className="text-3xl font-black text-gray-800">{moneyStr(balance)}</div>
                    <div className="text-xs font-bold text-gray-400 mt-2">수익률: {(safeRatio(balance,initialBalance)-1)*100 > 0 ? '+':''}{((safeRatio(balance,initialBalance)-1)*100).toFixed(1)}%</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-2xl border">
                        <div className="text-xs text-blue-400 font-bold mb-1">힌트 재화</div>
                        <div className="text-xl font-black">{hint} 개</div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border">
                        <div className="text-xs text-amber-500 font-bold mb-1">안전 실드</div>
                        <div className="text-xl font-black">{shield} 회</div>
                    </div>
                </div>
                
                <div className="portfolio-card">
                    <h4 className="font-bold text-sm mb-3 text-gray-700">포트폴리오 비중</h4>
                    {Object.entries(portfolio).map(([k, v]) => (
                        <div key={k} className="mb-2">
                            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                <span>{k}</span> <span>{(v*100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full" style={{width: `${v*100}%`}}></div></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Event Area */}
            <div className="col-span-1 lg:col-span-3">
                {!lastResult ? (
                    <AnimatePresence mode="wait">
                        <motion.div key={turn} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="grid lg:grid-cols-2 gap-8">
                            {/* Event Brief */}
                            <div className="event-card">
                                <FallbackImage 
                                    src={scenario.image_url} 
                                    fallbackSvg={<BannerSVG title={scenario.title} subtitle={scenario.year} accent={scenario.event_palette} icon={scenario.event_icon} />}
                                />
                                <span className="chip mt-3">{scenario.year}</span> <span className="chip">키워드: {scenario.keyword}</span>
                                <h2 className="text-2xl font-black mb-4">{scenario.title}</h2>
                                
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                                    <div className="text-xs text-gray-400 font-bold mb-1">Fed 뉴스라인</div>
                                    <p className="text-gray-700 leading-relaxed font-medium">{scenario.fed_news}</p>
                                </div>

                                <div className="explain-box">
                                    <div className="font-bold text-blue-900 mb-2">이 장면을 쉽게 푼다면?</div>
                                    <p className="text-sm text-blue-800 leading-relaxed">{scenario.easy_bond_explanation}</p>
                                </div>

                                {mode === "교사용" && (
                                    <div className="learn-box mt-4">
                                        <div className="font-bold text-amber-900 mb-2">교사회설 / 토론</div>
                                        <p className="text-sm text-amber-800 leading-relaxed mb-2">{scenario.teacher_commentary}</p>
                                        <p className="text-xs text-amber-700 italic border-t border-amber-200 border-dashed pt-2">Q: {scenario.discussion_prompt}</p>
                                    </div>
                                )}
                                
                                {lastHintText && <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg">{lastHintText}</div>}
                                <button onClick={useHint} disabled={hint<=0} className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 disabled:opacity-50">힌트 사용하기 (-1개)</button>
                            </div>

                            {/* Action Choices */}
                            <div>
                                <h3 className="text-xl font-black mb-4">투자 결정</h3>
                                {scenario.choices.map((choice, i) => (
                                    <div key={i} className="choice-card" onClick={() => handleChoice(i)}>
                                        <ChoiceSVG title={choice} tag={`선택지 ${i+1}`} accent={scenario.choice_palettes[i]} icon={scenario.choice_icons[i]} />
                                    </div>
                                ))}
                                <div className="p-4 bg-gray-100 rounded-xl mt-6">
                                    <div className="text-sm font-bold text-gray-600 mb-2">판단 추천사항</div>
                                    <ul className="text-xs text-gray-500 space-y-1">
                                        <li>• 금리를 올릴 것 같으면 짧은 만기나 방어적 포트폴리오를.</li>
                                        <li>• 불안한 위기면 가장 안전한 국채를.</li>
                                        <li>• 혼란스러우면 나눠 담기를 선택하세요.</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className={lastResult.isCorrect ? "good-result" : "bad-result"}>
                        <div className="text-center py-6">
                            <div className="text-4xl mb-4">{lastResult.isCorrect ? '🎯' : '📉'}</div>
                            <h2 className={`text-2xl font-black mb-2 ${lastResult.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                {lastResult.isCorrect ? "정확한 뷰였습니다!" : "시장의 역풍을 맞았습니다."}
                            </h2>
                            <p className="text-gray-600 mb-6">{scenario.result_texts[lastResult.choiceIdx]}</p>
                            
                            <div className="p-4 bg-white/60 rounded-xl inline-block mb-6">
                                <div className="text-sm text-gray-500 mb-1">결과 수익률</div>
                                <div className={`text-3xl font-black ${lastResult.actualReturn > 0 ? "text-green-600" : "text-red-600"}`}>
                                    {(lastResult.actualReturn * 100).toFixed(1)}% 
                                    {lastResult.usedShield && <span className="ml-2 text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded">실드 방어 작동!</span>}
                                </div>
                            </div>
                            
                            {!lastResult.isCorrect && (
                                <div className="text-sm text-gray-500 mt-2 mb-4">
                                    더 나은 대안: <span className="font-bold text-red-400">{scenario.choices[lastResult.optimalIdx]}</span>
                                </div>
                            )}

                            <div className="text-left bg-white rounded-xl p-6 border shadow-sm max-w-lg mx-auto">
                                <div className="text-xl font-bold mb-2">개념 복습: {scenario.keyword}</div>
                                <p className="text-gray-700 leading-relaxed">{BEGINNER_EXPLAINERS[scenario.keyword] || scenario.concept}</p>
                            </div>
                            
                            <button onClick={nextTurn} className="mt-8 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-xl transition-all hover:scale-105">
                                {turn + 1 >= SCENARIOS.length ? "최종 결과 보기" : "다음 연도로 리스케줄링"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default GameApp;
