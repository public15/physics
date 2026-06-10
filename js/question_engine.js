/**
 * 初中物理提分宝典 - 智能习题生成引擎
 * 提供声、光、力、热、电五大板块 40+ 核心计算模板
 * 内置“整除因子计算法”，确保随机生成的所有题目数值真实、可整除，且自动输出完整的 LaTeX 公式推导步骤
 */

const PHYSICS_ENGINE = {
    // 随机数助手：从数组中随机挑选一个元素
    randomPick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // 随机数范围助手：生成指定范围内的整数
    randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 根式化简助手
    simplifySqrt(n) {
        if (n < 0) return "无实根";
        if (n === 0) return "0";
        let out = 1;
        let inside = n;
        for (let i = Math.floor(Math.sqrt(n)); i >= 2; i--) {
            if (inside % (i * i) === 0) {
                out *= i;
                inside /= (i * i);
            }
        }
        if (inside === 1) return `${out}`;
        if (out === 1) return `\\sqrt{${inside}}`;
        return `${out}\\sqrt{${inside}}`;
    },

    // 模板数据库
    templates: [
        // ============================== 一、声学与光学 (10个模板) ==============================
        {
            id: "sound_echo_s",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                // 已知回声时间求海底深度
                const v = PHYSICS_ENGINE.randomPick([1500, 1520, 1530, 1540]); // 海水中声速
                const t = PHYSICS_ENGINE.randomPick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 双程时间
                const s = 0.5 * v * t;
                return {
                    question: `一艘海洋测量船向海底垂直发射超声波，经过 $${t}\\text{ s}$ 后收到回声信号。已知超声波在海水中的传播速度为 $${v}\\text{ m/s}$，则该处海底的深度为___________ $\\text{m}$。`,
                    answer: `${s}`,
                    steps: [
                        `1. 声音从发射到接收共经过了双倍的距离：时间 $t = ${t}\\text{ s}$，声速 $v = ${v}\\text{ m/s}$。`,
                        `2. 根据回声测距公式：$s = \\frac{1}{2}vt = \\frac{1}{2} \\times ${v}\\text{ m/s} \\times ${t}\\text{ s} = ${s}\\text{ m}$。`
                    ]
                };
            }
        },
        {
            id: "sound_echo_t",
            category: "acoustics-optics",
            type: "calculation",
            score: 20,
            generator() {
                // 求听到回声的时间
                const v = 340; // 空气中声速
                const s = PHYSICS_ENGINE.randomPick([85, 170, 255, 340, 425, 510, 595, 680, 765, 850]); // 距离
                const t = (2 * s) / v;
                return {
                    question: `小明站在一座大山前大喊一声，若他距离大山 $${s}\\text{ m}$。已知空气中的声速为 $340\\text{ m/s}$。求他发出声音到听到回声需要多少时间？`,
                    answer: `${t} s`,
                    steps: [
                        `1. 已知声源到大山的单向距离 $s = ${s}\\text{ m}$，空气声速 $v = 340\\text{ m/s}$。`,
                        `2. 声音往返的双向总位移为 $2s = 2 \\times ${s}\\text{ m} = ${2*s}\\text{ m}$。`,
                        `3. 根据速度公式变形，听到回声的总时间：$t = \\frac{2s}{v} = \\frac{2 \\times ${s}\\text{ m}}{340\\text{ m/s}} = ${t}\\text{ s}$。`,
                        `**答：** 听到回声需要 $${t}\\text{ s}$。`
                    ]
                };
            }
        },
        {
            id: "wave_speed",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                // 波长频率计算 c = λf
                const f = PHYSICS_ENGINE.randomPick([100, 200, 500, 1000]); // 频率 Hz
                const lam = PHYSICS_ENGINE.randomPick([1, 2, 4, 5]); // 波长 m
                const c = lam * f;
                return {
                    question: `某一列声波的频率为 $${f}\\text{ Hz}$，在某种介质中的波长为 $${lam}\\text{ m}$。则该声波在此介质中的传播速度为___________ $\\text{m/s}$。`,
                    answer: `${c}`,
                    steps: [
                        `1. 已知声波频率 $f = ${f}\\text{ Hz}$，波长 $\\lambda = ${lam}\\text{ m}$。`,
                        `2. 根据波速公式 $v = \\lambda f$ 代入计算：$v = ${lam}\\text{ m} \\times ${f}\\text{ Hz} = ${c}\\text{ m/s}$。`
                    ]
                };
            }
        },
        {
            id: "light_angle",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                // 入射角与反射角计算
                const input = PHYSICS_ENGINE.randomRange(25, 65);
                const reflect = input;
                const total = input + reflect;
                const border = 90 - input;
                return {
                    question: `一束光线与镜面成 $${border}^\\circ$ 角射向平面镜，则入射角是___________$^\\circ$；反射光线与入射光线的夹角是___________$^\\circ$。`,
                    answer: `${input}；${total}`,
                    steps: [
                        `1. 入射角是入射光线与法线的夹角。法线垂直于镜面，所以入射角 = $90^\\circ - ${border}^\\circ = ${input}^\\circ$。`,
                        `2. 根据光的反射定律，反射角等于入射角，即反射角也是 $${reflect}^\\circ$。`,
                        `3. 反射光线与入射光线的夹角为入射角与反射角之和：$${input}^\\circ + ${reflect}^\\circ = ${total}^\\circ$。`
                    ]
                };
            }
        },
        {
            id: "mirror_distance",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                // 平面镜成像距离
                const H = PHYSICS_ENGINE.randomPick([1.2, 1.4, 1.5, 1.6, 1.7, 1.8]); // 人高
                const s1 = PHYSICS_ENGINE.randomPick([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]); // 人距镜
                const walk = PHYSICS_ENGINE.randomPick([0.5, 0.8, 1, 1.2, 1.5, 2]); // 走近镜
                let s2 = s1 - walk;
                if (s2 <= 0) s2 = 0.5; // 安全保护
                const total = Number((s2 * 2).toFixed(1));
                return {
                    question: `人身高 $${H}\\text{ m}$，站在竖直放置的平面镜前 $${s1}\\text{ m}$ 处，他在镜中的像高为___________ $\\text{m}$。若他向镜面走近 $${walk}\\text{ m}$，则他与镜中像的距离为___________ $\\text{m}$。`,
                    answer: `${H}；${total}（物距 ${s1}m，走近 ${walk}m）`,
                    steps: [
                        `1. 平面镜成像规律：像与物的大小相等。人身高 $${H}\\text{ m}$，因此像高始终为 $${H}\\text{ m}$。`,
                        `2. 走近 $${walk}\\text{ m}$ 后，人与平面镜的距离变为：$${s1}\\text{ m} - ${walk}\\text{ m} = ${s2.toFixed(1)}\\text{ m}$。`,
                        `3. 像与镜面的距离等于物与镜面的距离，即也是 $${s2.toFixed(1)}\\text{ m}$。人与镜中的像的总距离为：$${s2.toFixed(1)}\\text{ m} \\times 2 = ${total}\\text{ m}$。`
                    ]
                };
            }
        },
        {
            id: "light_speed_f",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                // 电磁波传播 c = λf
                const lam = PHYSICS_ENGINE.randomPick([5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000]); // 波长 m
                const c = 3.0e8; // 光速
                const f_mhz = Number(((c / lam) / 1e6).toFixed(3)); // 频率 MHz
                return {
                    question: `广播电台发射的电磁波波长为 $${lam}\\text{ m}$，已知电磁波在真空中的传播速度为 $3.0 \\times 10^8\\text{ m/s}$。该电磁波的频率为___________ $\\text{MHz}$。`,
                    answer: `${f_mhz}`,
                    steps: [
                        `1. 已知电磁波波速 $c = 3.0 \\times 10^8\\text{ m/s}$，波长 $\\lambda = ${lam}\\text{ m}$。`,
                        `2. 根据波速公式 $c = \\lambda f$，求频率：$f = \\frac{c}{\\lambda} = \\frac{3.0 \\times 10^8\\text{ m/s}}{${lam}\\text{ m}} = ${(c/lam).toFixed(0)}\\text{ Hz}$。`,
                        `3. 转换为兆赫兹 (1 MHz = 10⁶ Hz)：$f = \\frac{${(c/lam).toFixed(0)}\\text{ Hz}}{10^6} = ${f_mhz}\\text{ MHz}$。`
                    ]
                };
            }
        },
        {
            id: "optics_refraction",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                // 折射现象基础
                const ang = PHYSICS_ENGINE.randomPick([20, 30, 40, 45, 50, 60, 70, 80]);
                const diff = PHYSICS_ENGINE.randomPick([8, 10, 12, 15, 20]);
                let refr = ang - diff;
                if (refr <= 0) refr = 12; // 安全保护
                return {
                    question: `一束光从空气斜射入水中，若入射角为 $${ang}^\\circ$，则折射角将___________ $${ang}^\\circ$（选填“大于”、“小于”或“等于”）。若折射角为 $${refr}^\\circ$，则反射角为___________$^\\circ$。`,
                    answer: `小于；${ang}（折射角 ${refr}°）`,
                    steps: [
                        `1. 光从空气斜射入水中时，折射光线向法线偏折，折射角小于入射角，故填**小于**。`,
                        `2. 反射定律中反射角等于入射角，入射角为 $${ang}^\\circ$，所以反射角为 $${ang}^\\circ$。折射角大小不影响反射角。`
                    ]
                };
            }
        },
        {
            id: "sound_speed",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                // 声音介质传播速度与百米计时分析
                const s = PHYSICS_ENGINE.randomPick([100, 150, 200, 250, 300, 400, 600, 800, 1000]);
                const env = PHYSICS_ENGINE.randomPick([
                    { temp: 0, v: 331 },
                    { temp: 5, v: 334 },
                    { temp: 15, v: 340 },
                    { temp: 20, v: 343 },
                    { temp: 25, v: 346 },
                    { temp: 30, v: 349 },
                    { temp: 35, v: 352 }
                ]);
                const t = (s / env.v).toFixed(2);
                return {
                    question: `在学校运动会 $${s}\\text{ m}$ 赛跑中，若当时空气温度为 $${env.temp}\\text{ ℃}$，声音在空气中的传播速度为 $${env.v}\\text{ m/s}$。如果终点计时员听到枪声才开始计时，他记录的成绩将比看枪烟计时的成绩___________（选填“偏好”或“偏差”）；所记录的时间与实际时间相差___________ $\\text{s}$（结果保留两位小数）。`,
                    answer: `偏好；${t}（距离 ${s}m，温度 ${env.temp}℃）`,
                    steps: [
                        `1. 听到枪声才计时，由于声音从起点传到终点需要时间，因此计时员少记了声音传播 $${s}\\text{ m}$ 的时间。`,
                        `2. 已知距离 $s = ${s}\\text{ m}$，当时声速 $v = ${env.v}\\text{ m/s}$。`,
                        `3. 根据速度变形公式，误差时间为：$\\Delta t = \\frac{s}{v} = \\frac{${s}\\text{ m}}{${env.v}\\text{ m/s}} \\approx ${t}\\text{ s}$。`,
                        `4. 因为少记了这部分时间，所以计时员记录的运动员成绩将比实际成绩偏短（即**偏好**）。`
                    ]
                };
            }
        },
        {
            id: "optics_lens",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                // 凸透镜成像规律基础多档扩展
                const f = PHYSICS_ENGINE.randomPick([8, 10, 12, 15, 20]); // 焦距
                const type = PHYSICS_ENGINE.randomPick(["2f_beyond", "f_2f_between", "f_within"]);
                
                let u, ans, typeDesc, app;
                if (type === "2f_beyond") {
                    u = f * 2 + PHYSICS_ENGINE.randomPick([3, 5, 8, 10]);
                    ans = `倒立；缩小；实；照相机（u = ${u}cm，f = ${f}cm）`;
                    typeDesc = "倒立、缩小的实像";
                    app = "照相机";
                } else if (type === "f_2f_between") {
                    u = f + PHYSICS_ENGINE.randomPick([2, 3, f - 2 > 3 ? f - 2 : 4]);
                    if (u >= f * 2) u = f * 1.5; // 安全保护
                    u = Math.round(u);
                    ans = `倒立；放大；实；投影仪（u = ${u}cm，f = ${f}cm）`;
                    typeDesc = "倒立、放大的实像";
                    app = "投影仪";
                } else {
                    u = PHYSICS_ENGINE.randomPick([2, 3, 5, Math.floor(f / 2)]);
                    if (u >= f) u = f - 2; // 安全保护
                    ans = `正立；放大；虚；放大镜（u = ${u}cm，f = ${f}cm）`;
                    typeDesc = "正立、放大的虚像";
                    app = "放大镜";
                }
                
                return {
                    question: `某凸透镜的焦距为 $${f}\\text{ cm}$。将点燃的蜡烛放在距离该凸透镜 $${u}\\text{ cm}$ 处，在另一侧的光屏上可以得到一个___________、___________的___________像（选填像的倒正、大小、虚实），这与___________（选填“照相机”、“投影仪”或“放大镜”）的成像原理相同。`,
                    answer: ans,
                    steps: [
                        `1. 已知凸透镜焦距 $f = ${f}\\text{ cm}$，二倍焦距 $2f = ${2*f}\\text{ cm}$。`,
                        `2. 蜡烛物距为 $u = ${u}\\text{ cm}$。`,
                        `3. 判定成像区间与特点：`,
                        `   - 当物距 $u = ${u}\\text{ cm}$ 满足时，其在透镜的判定结论为：成**${typeDesc}**。`,
                        `   - 其典型的生活实际应用是**${app}**。`
                    ]
                };
            }
        },
        {
            id: "optics_lens_v",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                // 凸透镜成像规律动态推导
                const f = PHYSICS_ENGINE.randomPick([5, 8, 10, 12, 15]);
                const dir = PHYSICS_ENGINE.randomPick(["closer", "further"]);
                
                let u, action, targetPos, targetSize;
                if (dir === "closer") {
                    u = f + PHYSICS_ENGINE.randomPick([2, 3, 4]);
                    if (u >= f * 2) u = f * 1.5;
                    u = Math.round(u);
                    action = "靠近";
                    targetPos = "远离";
                    targetSize = "变大";
                } else {
                    u = f + PHYSICS_ENGINE.randomPick([1, 2]);
                    u = Math.round(u);
                    action = "远离";
                    targetPos = "靠近";
                    targetSize = "变小";
                }
                
                return {
                    question: `在探究凸透镜成像规律的实验中，将蜡烛放在焦距为 $${f}\\text{ cm}$ 的凸透镜前 $${u}\\text{ cm}$ 处，光屏上成清晰的像。此时物距___________像距（选填“大于”或“小于”）。若将蜡烛向凸透镜${action}，为了使光屏上仍成清晰的像，光屏应向___________凸透镜的方向移动（选填“靠近”或“远离”），此时像的大小将___________（选填“变大”或“变小”）。`,
                    answer: `小于；${targetPos}；${targetSize}（u = ${u}cm，f = ${f}cm，向凸透镜${action}）`,
                    steps: [
                        `1. 已知焦距 $f = ${f}\\text{ cm}$，物距 $u = ${u}\\text{ cm}$。由于 $f < u < 2f$，在光屏上成倒立放大的实像，此时像距 $v > 2f$，即物距**小于**像距。`,
                        `2. 凸透镜成实像动态移动规律：“物近像远像变大，物远像近像变小”。`,
                        `3. 当蜡烛向透镜${action}时，为了能在光屏上承接清晰的像，光屏应向**${targetPos}**凸透镜的方向移动，此时像的尺寸将**${targetSize}**。`
                    ]
                };
            }
        },

        // ============================== 二、力学模块 (10个模板) ==============================
        {
            id: "mech_speed_t",
            category: "mechanics",
            type: "calculation",
            score: 20,
            generator() {
                // 速度路程时间互求 v = s/t
                const v_kmh = PHYSICS_ENGINE.randomPick([72, 108, 144]); // km/h
                const v_ms = v_kmh / 3.6;
                const s_km = PHYSICS_ENGINE.randomPick([6, 12, 18, 24]); // km
                const s_m = s_km * 1000;
                const t_s = s_m / v_ms; // 保证能除尽
                const t_min = t_s / 60;
                return {
                    question: `一辆动车组列车以 $${v_kmh}\\text{ km/h}$ 的速度在水平轨道上匀速前进。求：（1）该列车换算为国际单位制的速度是多少 m/s？（2）若列车以此速度前行 $${s_km}\\text{ km}$，需要耗时多少分钟？`,
                    answer: `(1) 速度为 ${v_ms} m/s；(2) 耗时 ${t_min} min`,
                    steps: [
                        `**(1) 换算列车的速度：**`,
                        `$v = ${v_kmh}\\text{ km/h} = \\frac{${v_kmh}}{3.6}\\text{ m/s} = ${v_ms}\\text{ m/s}$。`,
                        `**(2) 计算所花的时间：**`,
                        `已知路程 $s = ${s_km}\\text{ km} = ${s_m}\\text{ m}$，速度 $v = ${v_ms}\\text{ m/s}$。`,
                        `根据速度公式 $v = \\frac{s}{t}$ 得：$t = \\frac{s}{v} = \\frac{${s_m}\\text{ m}}{${v_ms}\\text{ m/s}} = ${t_s}\\text{ s}$。`,
                        `转换为分钟：$t = \\frac{${t_s}}{60}\\text{ min} = ${t_min}\\text{ min}$。`,
                        `**答：** 列车速度是 $${v_ms}\\text{ m/s}$，行驶 $${s_km}\\text{ km}$ 需要 $${t_min}\\text{ min}$。`
                    ]
                };
            }
        },
        {
            id: "mech_density_m",
            category: "mechanics",
            type: "calculation",
            score: 20,
            generator() {
                // 密度质量体积计算多物质版 m = rho * V
                const material = PHYSICS_ENGINE.randomPick([
                    { name: "铝块", rho: 2.7, rho_si: 2.7e3 },
                    { name: "铁块", rho: 7.9, rho_si: 7.9e3 },
                    { name: "铜块", rho: 8.9, rho_si: 8.9e3 },
                    { name: "金块", rho: 19.3, rho_si: 19.3e3 }
                ]);
                const V_cm3 = PHYSICS_ENGINE.randomPick([10, 20, 30, 40, 50, 80, 100, 150, 200, 250, 300, 400, 500]); // cm³
                const m_g = Math.round(material.rho * V_cm3 * 100) / 100;
                return {
                    question: `一个实心${material.name}的体积为 $${V_cm3}\\text{ cm}^3$。已知其密度为 $${material.rho} \\times 10^3\\text{ kg/m}^3$。求该${material.name}的质量是多少克？`,
                    answer: `${m_g} g`,
                    steps: [
                        `1. 已知${material.name}的密度 $\\rho = ${material.rho} \\times 10^3\\text{ kg/m}^3 = ${material.rho}\\text{ g/cm}^3$。`,
                        `2. 实心体的体积 $V = ${V_cm3}\\text{ cm}^3$。`,
                        `3. 根据密度公式 $\\rho = \\frac{m}{V}$ 变形，计算其质量：$m = \\rho V = ${material.rho}\\text{ g/cm}^3 \\times ${V_cm3}\\text{ cm}^3 = ${m_g}\\text{ g}$。`,
                        `**答：** 该${material.name}的质量是 $${m_g}\\text{ g}$。`
                    ]
                };
            }
        },
        {
            id: "mech_gravity_g",
            category: "mechanics",
            type: "fill",
            score: 10,
            generator() {
                // 重力计算 G = mg (支持 9.8 和 10 双标准)
                const item = PHYSICS_ENGINE.randomPick([
                    { name: "物理实验用小木块", m_g: PHYSICS_ENGINE.randomPick([200, 500, 800, 1000, 1500, 2000, 2500]) },
                    { name: "学生双肩背包", m_g: PHYSICS_ENGINE.randomPick([3000, 4000, 5000, 6000]) }
                ]);
                const m_kg = item.m_g / 1000;
                const g = PHYSICS_ENGINE.randomPick([9.8, 10]);
                const G = Math.round(m_kg * g * 100) / 100;
                return {
                    question: `一个${item.name}，测得其质量为 $${item.m_g}\\text{ g}$。若将它静止放在水平桌面上，它受到的重力为___________ $\\text{N}$（常数 $g$ 取 $${g}\\text{ N/kg}$）。`,
                    answer: `${G}`,
                    steps: [
                        `1. 将质量单位换算为标准国际单位：$m = ${item.m_g}\\text{ g} = ${m_kg}\\text{ kg}$。`,
                        `2. 根据重力公式 $G = mg$ 代入计算：$G = ${m_kg}\\text{ kg} \\times ${g}\\text{ N/kg} = ${G}\\text{ N}$。`
                    ]
                };
            }
        },
        {
            id: "mech_pressure_p",
            category: "mechanics",
            type: "calculation",
            score: 20,
            generator() {
                // 固体压强计算 p = F/S 双脚站立扩展版
                const G = PHYSICS_ENGINE.randomPick([400, 450, 480, 500, 520, 540, 560, 600, 640]); // 重力 N
                const S_cm3 = PHYSICS_ENGINE.randomPick([120, 150, 160, 180, 200, 220, 240, 250]); // 单只脚面积 cm²
                const S_double_m2 = (S_cm3 * 2) / 10000; // 双脚面积 m²
                const p = Math.round(G / S_double_m2 * 10) / 10;
                return {
                    question: `一名体重为 $${G}\\text{ N}$ 的学生双脚站立在水平地面上，他单只脚底与地面的接触面积是 $${S_cm3}\\text{ cm}^2$。求该同学静止站立时对地面的压强是多少 Pa？`,
                    answer: `${p} Pa`,
                    steps: [
                        `1. 在水平地面上，人对地面的垂直压力等于其重力大小：$F = G = ${G}\\text{ N}$。`,
                        `2. 站立时受力面积为双脚接触面积：$S = 2 \\times ${S_cm3}\\text{ cm}^2 = ${S_cm3*2}\\text{ cm}^2$。`,
                        `   换算成标准单位平方米：$S = ${S_cm3*2} \\times 10^{-4}\\text{ m}^2 = ${S_double_m2}\\text{ m}^2$。`,
                        `3. 根据压强公式 $p = \\frac{F}{S}$ 计算：$p = \\frac{${G}\\text{ N}}{${S_double_m2}\\text{ m}^2} \\approx ${p}\\text{ Pa}$。`,
                        `**答：** 站立时对地面的压强是 $${p}\\text{ Pa}$。`
                    ]
                };
            }
        },
        {
            id: "mech_liq_pressure",
            category: "mechanics",
            type: "fill",
            score: 10,
            generator() {
                // 液体压强计算多液体版 p = rho * g * h
                const liq = PHYSICS_ENGINE.randomPick([
                    { name: "水", rho: 1000 },
                    { name: "酒精", rho: 800 },
                    { name: "盐水", rho: 1200 },
                    { name: "煤油", rho: 800 }
                ]);
                const h_cm = PHYSICS_ENGINE.randomPick([10, 20, 30, 45, 50, 60, 80, 100, 120, 150]); // cm
                const h_m = h_cm / 100;
                const g = 10;
                const p = liq.rho * g * h_m;
                return {
                    question: `在一个直立圆柱形容器中盛有深度为 $${h_cm}\\text{ cm}$ 的${liq.name}。已知${liq.name}的密度为 $${liq.rho/1000} \\times 10^3\\text{ kg/m}^3$。则容器底部受到${liq.name}的压强为___________ $\\text{Pa}$（g取 10 N/kg）。`,
                    answer: `${p}`,
                    steps: [
                        `1. 液体深度 $h = ${h_cm}\\text{ cm} = ${h_m}\\text{ m}$，密度 $\\rho = ${liq.rho}\\text{ kg/m}^3$。`,
                        `2. 根据液体压强公式 $p = \\rho g h$ 求解：$p = ${liq.rho}\\text{ kg/m}^3 \\times 10\\text{ N/kg} \\times ${h_m}\\text{ m} = ${p}\\text{ Pa}$。`
                    ]
                };
            }
        },
        {
            id: "mech_buoyancy_arch",
            category: "mechanics",
            type: "calculation",
            score: 20,
            generator() {
                // 阿基米德浮力公式多液体与比例浸没版 F浮 = rho * g * V排
                const liq = PHYSICS_ENGINE.randomPick([
                    { name: "水", rho: 1000 },
                    { name: "酒精", rho: 800 },
                    { name: "盐水", rho: 1200 }
                ]);
                const state = PHYSICS_ENGINE.randomPick([
                    { name: "浸没", factor: 1.0, term: "浸没在" },
                    { name: "一半浸入", factor: 0.5, term: "有一半体积浸入在" },
                    { name: "三分之二浸入", factor: 2/3, term: "有三分之二体积浸入在" }
                ]);
                const V_cm3 = PHYSICS_ENGINE.randomPick([100, 200, 300, 500, 600, 900, 1200, 1500, 2000]); // 体积 cm³
                const V_m3 = V_cm3 / 1e6;
                const V_rep_m3 = V_m3 * state.factor;
                const g = 10;
                const F_f = Math.round(liq.rho * g * V_rep_m3 * 100) / 100;
                
                // 将 V_rep_m3 用分数或科学记数法合理表示以使步骤清晰
                const v_rep_sci = (V_rep_m3).toFixed(6).replace(/\.?0+$/, '');
                
                return {
                    question: `一个体积为 $${V_cm3}\\text{ cm}^3$ 的实心物体${state.term}${liq.name}中保持静止。已知${liq.name}的密度为 $${liq.rho/1000} \\times 10^3\\text{ kg/m}^3$。求：物体排开${liq.name}的体积是多少 m³？它受到的浮力是多少 N？（g取 10 N/kg）`,
                    answer: `排开体积为 ${v_rep_sci} m³；浮力为 ${F_f} N`,
                    steps: [
                        `1. **计算物体排开液体的体积**：`,
                        `   物体的总体积 $V = ${V_cm3}\\text{ cm}^3 = ${V_m3}\\text{ m}^3$。`,
                        `   排开体积的比例因子为 $${state.factor === 1 ? "1" : state.factor === 0.5 ? "0.5" : "\\frac{2}{3}"}$。`,
                        `   $V_{排} = V \\times ${state.factor === 1 ? "1" : state.factor === 0.5 ? "0.5" : "\\frac{2}{3}"} = ${v_rep_sci}\\text{ m}^3$。`,
                        `2. **计算浮力大小**：`,
                        `   已知液体密度 $\\rho_{液} = ${liq.rho}\\text{ kg/m}^3$。`,
                        `   代入阿基米德浮力公式：$F_{浮} = \\rho_{液} g V_{排} = ${liq.rho}\\text{ kg/m}^3 \\times 10\\text{ N/kg} \\times ${v_rep_sci}\\text{ m}^3 = ${F_f}\\text{ N}$。`,
                        `**答：** 排开液体体积是 $${v_rep_sci}\\text{ m}^3$，受到的浮力是 $${F_f}\\text{ N}$。`
                    ]
                };
            }
        },
        {
            id: "mech_lever_f",
            category: "mechanics",
            type: "fill",
            score: 10,
            generator() {
                // 杠杆平衡 F1*L1 = F2*L2
                const l1 = PHYSICS_ENGINE.randomPick([60, 80, 100]); // cm
                const l2 = PHYSICS_ENGINE.randomPick([20, 30, 40]); // cm
                const f2 = PHYSICS_ENGINE.randomPick([12, 24, 36]); // N
                const f1 = (f2 * l2) / l1;
                return {
                    question: `一根轻质杠杆处于水平平衡状态。动力臂 $L_1 = ${l1}\\text{ cm}$，阻力臂 $L_2 = ${l2}\\text{ cm}$。若阻力 $F_2 = ${f2}\\text{ N}$，则需要施加的动力 $F_1$ 为___________ $\\text{N}$。`,
                    answer: `${f1}`,
                    steps: [
                        `1. 已知动力臂 $L_1 = ${l1}\\text{ cm}$，阻力臂 $L_2 = ${l2}\\text{ cm}$，阻力 $F_2 = ${f2}\\text{ N}$。`,
                        `2. 根据杠杆平衡条件：$F_1 L_1 = F_2 L_2$。`,
                        `3. 变形求动力：$F_1 = \\frac{F_2 L_2}{L_1} = \\frac{${f2}\\text{ N} \\times ${l2}\\text{ cm}}{${l1}\\text{ cm}} = ${f1}\\text{ N}$。`
                    ]
                };
            }
        },
        {
            id: "mech_work_w",
            category: "mechanics",
            type: "calculation",
            score: 20,
            generator() {
                // 功与功率 W = Fs, P = W/t
                const F = PHYSICS_ENGINE.randomPick([100, 200, 300]); // 拉力 N
                const s = PHYSICS_ENGINE.randomPick([5, 10, 15]); // 距离 m
                const t = PHYSICS_ENGINE.randomPick([10, 20, 30]); // 时间 s
                const W = F * s;
                const P = W / t;
                return {
                    question: `用一个水平拉力 $${F}\\text{ N}$ 拉着一辆重为 500 N 的小车，在水平地面上匀速移动了 $${s}\\text{ m}$，耗时 $${t}\\text{ s}$。求：（1）拉力对小车做了多少功？（2）拉力做功的功率是多少？`,
                    answer: `(1) 功为 ${W} J；(2) 功率为 ${P} W`,
                    steps: [
                        `**(1) 计算拉力所做的功：**`,
                        `已知拉力 $F = ${F}\\text{ N}$，在力方向上的位移 $s = ${s}\\text{ m}$（注意：小车重力方向垂直向下，在水平运动中重力不做功）。`,
                        `代入功公式：$W = F s = ${F}\\text{ N} \\times ${s}\\text{ m} = ${W}\\text{ J}$。`,
                        `**(2) 计算拉力做功的功率：**`,
                        `已知做功时间 $t = ${t}\\text{ s}$，总功 $W = ${W}\\text{ J}$。`,
                        `代入功率公式：$P = \\frac{W}{t} = \\frac{${W}\\text{ J}}{${t}\\text{ s}} = ${P}\\text{ W}$。`,
                        `**答：** 拉力做功为 $${W}\\text{ J}$，拉力的功率是 $${P}\\text{ W}$。`
                    ]
                };
            }
        },
        {
            id: "mech_pulley_eff",
            category: "mechanics",
            type: "calculation",
            score: 20,
            generator() {
                // 动滑轮/滑轮组与机械效率 eta = W有 / W总
                const n = PHYSICS_ENGINE.randomPick([2, 3]); // 绳子段数
                const G = PHYSICS_ENGINE.randomPick([120, 180, 240, 270, 300, 360, 450, 480, 600]); // 货物重力 N
                const h = PHYSICS_ENGINE.randomPick([1.5, 2, 2.5, 3]); // 上升高度 m
                
                // 选择拉力 F（要求 n * F > G，使机械效率小于 100% 且合理）
                let F;
                if (n === 2) {
                    F = PHYSICS_ENGINE.randomPick([80, 100, 150, 200, 250, 300, 400]);
                    while (2 * F <= G) { F += 50; }
                } else {
                    F = PHYSICS_ENGINE.randomPick([50, 80, 100, 120, 150, 200, 250]);
                    while (3 * F <= G) { F += 30; }
                }
                
                const s = n * h; // 自由端拉下距离
                const W_y = G * h;
                const W_z = F * s;
                const eta = ((W_y / W_z) * 100).toFixed(1).replace(/\.0$/, '');
                
                const deviceName = n === 2 ? "动滑轮" : "滑轮组（承担绳子股数 n = 3）";
                
                return {
                    question: `使用一个${deviceName}将重为 $${G}\\text{ N}$ 的货物匀速提升了 $${h}\\text{ m}$，所用的拉力 $F = ${F}\\text{ N}$。求：（1）提升货物所做的有用功是多少？（2）拉力做的总功是多少？（3）该机械的效率是多少？`,
                    answer: `(1) 有用功 ${W_y} J；(2) 总功 ${W_z} J；(3) 效率为 ${eta}%`,
                    steps: [
                        `**(1) 计算有用功：**`,
                        `有用功是克服物体自身重力做的功：$W_{有} = G h = ${G}\\text{ N} \\times ${h}\\text{ m} = ${W_y}\\text{ J}$。`,
                        `**(2) 计算拉力做的总功：**`,
                        `使用该装置，绳子自由端拉下的距离是物体上升高度的 $${n}$ 倍：$s = ${n}h = ${n} \\times ${h}\\text{ m} = ${s}\\text{ m}$。`,
                        `拉力做的总功为：$W_{总} = F s = ${F}\\text{ N} \\times ${s}\\text{ m} = ${W_z}\\text{ J}$。`,
                        `**(3) 计算机械效率：**`,
                        `根据效率公式：$\\eta = \\frac{W_{有}}{W_{总}} \\times 100\\% = \\frac{${W_y}\\text{ J}}{${W_z}\\text{ J}} \\times 100\\% \\approx ${eta}\\%$。`,
                        `**答：** 有用功是 $${W_y}\\text{ J}$，总功是 $${W_z}\\text{ J}$，机械效率为 $${eta}\\%$。`
                    ]
                };
            }
        },
        {
            id: "mech_hollow_ball",
            category: "mechanics",
            type: "calculation",
            score: 20,
            generator() {
                // 实心与空心判断多金属版
                const mat = PHYSICS_ENGINE.randomPick([
                    { name: "铜球", rho: 8.9, m: 178 },
                    { name: "铁球", rho: 7.9, m: 158 },
                    { name: "铝球", rho: 2.7, m: 54 }
                ]);
                const V_solid = mat.m / mat.rho; // 20 cm³
                const type = PHYSICS_ENGINE.randomPick(["solid", "hollow", "hollow_large"]);
                
                let V, isHollow, V_hollow, ans;
                if (type === "solid") {
                    V = V_solid;
                    isHollow = false;
                    V_hollow = 0;
                    ans = `实心；空心体积为 0 cm³`;
                } else if (type === "hollow") {
                    V = V_solid + PHYSICS_ENGINE.randomPick([5, 10, 15]);
                    isHollow = true;
                    V_hollow = V - V_solid;
                    ans = `空心；空心体积为 ${V_hollow} cm³`;
                } else {
                    V = V_solid + PHYSICS_ENGINE.randomPick([20, 25, 30]);
                    isHollow = true;
                    V_hollow = V - V_solid;
                    ans = `空心；空心体积为 ${V_hollow} cm³`;
                }
                
                return {
                    question: `一个${mat.name}的质量是 $${mat.m}\\text{ g}$，体积是 $${V}\\text{ cm}^3$。已知其金属密度为 $${mat.rho}\\text{ g/cm}^3$。通过计算判断这个${mat.name}是实心的还是空心的？如果是空心的，空心部分的体积是多少？`,
                    answer: ans,
                    steps: [
                        `1. 已知${mat.name}的质量 $m = ${mat.m}\\text{ g}$，密度 $\\rho = ${mat.rho}\\text{ g/cm}^3$。`,
                        `2. 计算该质量的金属在实心状态下所具有的物理体积：`,
                        `   $V_{实} = \\frac{m}{\\rho} = \\frac{${mat.m}\\text{ g}}{${mat.rho}\\text{ g/cm}^3} = ${V_solid}\\text{ cm}^3$。`,
                        `3. 判定球是实心还是空心：`,
                        `   - 因为给定的实际体积 $V = ${V}\\text{ cm}^3$ ${isHollow ? "大于" : "等于"} 实心体积 $V_{实} = ${V_solid}\\text{ cm}^3$。`,
                        `   - 所以该${mat.name}是**${isHollow ? "空心" : "实心"}**的。`,
                        `4. 计算空心部分的体积：$V_{空} = V - V_{实} = ${V}\\text{ cm}^3 - ${V_solid}\\text{ cm}^3 = ${V_hollow}\\text{ cm}^3$。`
                    ]
                };
            }
        },

        // ============================== 三、电学模块 (10个模板) ==============================
        {
            id: "elec_ohms_i",
            category: "electricity",
            type: "fill",
            score: 10,
            generator() {
                // 欧姆定律 I = U/R
                const u = PHYSICS_ENGINE.randomPick([3, 6, 9, 12]); // 电压 V
                const r = PHYSICS_ENGINE.randomPick([5, 10, 15, 20]); // 电阻
                const i = u / r;
                return {
                    question: `一个电阻阻值为 $${r}\\text{ }\\Omega$，在它两端加上 $${u}\\text{ V}$ 的电压时，通过该电阻的电流为___________ $\\text{A}$。`,
                    answer: `${i}`,
                    steps: [
                        `1. 已知电阻 $R = ${r}\\text{ }\\Omega$，电压 $U = ${u}\\text{ V}$。`,
                        `2. 根据欧姆定律 $I = \\frac{U}{R}$：$I = \\frac{${u}\\text{ V}}{${r}\\text{ }\\Omega} = ${i}\\text{ A}$。`
                    ]
                };
            }
        },
        {
            id: "elec_ohms_u",
            category: "electricity",
            type: "fill",
            score: 10,
            generator() {
                // 欧姆定律 U = I*R
                const i = PHYSICS_ENGINE.randomPick([0.2, 0.5, 0.6, 1.2]); // 电流 A
                const r = PHYSICS_ENGINE.randomPick([10, 15, 20, 30]); // 电阻
                const u = i * r;
                return {
                    question: `通过某导体的电流为 $${i}\\text{ A}$，该导体的电阻为 $${r}\\text{ }\\Omega$，则导体两端的电压为___________ $\\text{V}$。`,
                    answer: `${u}`,
                    steps: [
                        `1. 已知电流 $I = ${i}\\text{ A}$，电阻 $R = ${r}\\text{ }\\Omega$。`,
                        `2. 根据欧姆定律变形求电压：$U = I R = ${i}\\text{ A} \\times ${r}\\text{ }\\Omega = ${u}\\text{ V}$。`
                    ]
                };
            }
        },
        {
            id: "elec_series_r",
            category: "electricity",
            type: "calculation",
            score: 20,
            generator() {
                // 串联分压计算
                const r1 = PHYSICS_ENGINE.randomPick([10, 15, 20]);
                const r2 = PHYSICS_ENGINE.randomPick([20, 30, 40]);
                const U = PHYSICS_ENGINE.randomPick([6, 9, 12]);
                const r_total = r1 + r2;
                const I = U / r_total;
                const u1 = I * r1;
                const u2 = I * r2;
                return {
                    question: `电阻 $R_1 = ${r1}\\text{ }\\Omega$ 和 $R_2 = ${r2}\\text{ }\\Omega$ 串联接在电压为 $${U}\\text{ V}$ 的电源两端。求：（1）电路中的总电阻是多少？（2）电路中的总电流是多少？（3）电阻 $R_1$ 两端的电压是多少？`,
                    answer: `(1) 总电阻为 ${r_total} Ω；(2) 电流为 ${I.toFixed(2)} A；(3) R1电压为 ${u1.toFixed(1)} V`,
                    steps: [
                        `**(1) 计算串联电路总电阻：**`,
                        `根据串联电阻规律：$R_{总} = R_1 + R_2 = ${r1}\\text{ }\\Omega + ${r2}\\text{ }\\Omega = ${r_total}\\text{ }\\Omega$。`,
                        `**(2) 计算总电流：**`,
                        `已知总电压 $U = ${U}\\text{ V}$，总电阻 $R_{总} = ${r_total}\\text{ }\\Omega$。`,
                        `代入欧姆定律：$I = \\frac{U}{R_{总}} = \\frac{${U}\\text{ V}}{${r_total}\\text{ }\\Omega} = ${I.toFixed(2)}\\text{ A}$。`,
                        `**(3) 计算 $R_1$ 两端电压：**`,
                        `串联电路电流处处相等，$I_1 = I = ${I.toFixed(2)}\\text{ A}$。`,
                        `根据欧姆定律：$U_1 = I_1 R_1 = ${I.toFixed(2)}\\text{ A} \\times ${r1}\\text{ }\\Omega = ${u1.toFixed(1)}\\text{ V}$。`,
                        `**答：** 总电阻是 $${r_total}\\text{ }\\Omega$，电路总电流是 $${I.toFixed(2)}\\text{ A}$，$R_1$ 两端分得电压 $${u1.toFixed(1)}\\text{ V}$。`
                    ]
                };
            }
        },
        {
            id: "elec_parallel_i",
            category: "electricity",
            type: "calculation",
            score: 20,
            generator() {
                // 并联分流计算多组合版
                const combo = PHYSICS_ENGINE.randomPick([
                    { r1: 5, r2: 10 },
                    { r1: 10, r2: 15 },
                    { r1: 10, r2: 20 },
                    { r1: 15, r2: 30 },
                    { r1: 20, r2: 30 },
                    { r1: 20, r2: 40 },
                    { r1: 30, r2: 60 }
                ]);
                const U = PHYSICS_ENGINE.randomPick([6, 12, 18, 24, 30, 36]);
                const i1 = Math.round(U / combo.r1 * 100) / 100;
                const i2 = Math.round(U / combo.r2 * 100) / 100;
                const i_total = Math.round((i1 + i2) * 100) / 100;
                return {
                    question: `将阻值分别为 $R_1 = ${combo.r1}\\text{ }\\Omega$ 和 $R_2 = ${combo.r2}\\text{ }\\Omega$ 的两个电阻并联在电压为 $${U}\\text{ V}$ 的电源两端。求：（1）通过电阻 $R_1$ 的电流是多少？（2）干路中的总电流是多少？`,
                    answer: `(1) R1电流为 ${i1} A；(2) 干路电流为 ${i_total} A`,
                    steps: [
                        `**(1) 计算通过电阻 $R_1$ 的电流：**`,
                        `并联电路各支路两端电压相等，且等于电源电压：$U_1 = U_2 = U = ${U}\\text{ V}$。`,
                        `根据欧姆定律求 $I_1$：$I_1 = \\frac{U}{R_1} = \\frac{${U}\\text{ V}}{${combo.r1}\\text{ }\\Omega} = ${i1}\\text{ A}$。`,
                        `**(2) 计算干路中的总电流：**`,
                        `同理，求通过 $R_2$ 的电流：$I_2 = \\frac{U}{R_2} = \\frac{${U}\\text{ V}}{${combo.r2}\\text{ }\\Omega} = ${i2}\\text{ A}$。`,
                        `根据并联电路电流规律，干路总电流等于各支路电流之和：`,
                        `$I_{干} = I_1 + I_2 = ${i1}\\text{ A} + ${i2}\\text{ A} = ${i_total}\\text{ A}$。`,
                        `**答：** 通过 $R_1$ 的电流是 $${i1}\\text{ A}$，干路总电流是 $${i_total}\\text{ A}$。`
                    ]
                };
            }
        },
        {
            id: "elec_work_w",
            category: "electricity",
            type: "fill",
            score: 10,
            generator() {
                // 电功电热 W = UIt 多参数版
                const appliance = PHYSICS_ENGINE.randomPick([
                    { name: "电热水壶", u: 220, i: PHYSICS_ENGINE.randomPick([3, 4, 5, 8]) },
                    { name: "车载加热杯", u: 12, i: PHYSICS_ENGINE.randomPick([4, 5, 6]) },
                    { name: "LED台灯", u: 5, i: PHYSICS_ENGINE.randomPick([0.5, 1.0, 1.5]) }
                ]);
                const t_min = PHYSICS_ENGINE.randomPick([2, 5, 10, 15, 20]); // 时间 min
                const t_s = t_min * 60;
                const W = appliance.u * appliance.i * t_s;
                return {
                    question: `一个${appliance.name}接在电压为 $${appliance.u}\\text{ V}$ 的电源两端，正常工作时的电流为 $${appliance.i}\\text{ A}$。该${appliance.name}正常工作 $${t_min}\\text{ min}$ 消耗的电能为___________ $\\text{J}$。`,
                    answer: `${W}`,
                    steps: [
                        `1. 已知电压 $U = ${appliance.u}\\text{ V}$，电流 $I = ${appliance.i}\\text{ A}$。`,
                        `2. 将工作时间换算为标准秒单位：$t = ${t_min}\\text{ min} = ${t_min} \\times 60\\text{ s} = ${t_s}\\text{ s}$。`,
                        `3. 根据电功计算公式 $W = U I t$ 计算：`,
                        `   $W = ${appliance.u}\\text{ V} \\times ${appliance.i}\\text{ A} \\times ${t_s}\\text{ s} = ${W}\\text{ J}$。`
                    ]
                };
            }
        },
        {
            id: "elec_power_p",
            category: "electricity",
            type: "fill",
            score: 10,
            generator() {
                // 电功率基本计算 P = UI 多电位版
                const u = PHYSICS_ENGINE.randomPick([6, 12, 24, 36, 110, 220]);
                const i = PHYSICS_ENGINE.randomPick([0.1, 0.2, 0.5, 1.0, 1.5, 2.0, 3.0, 5.0]); // 安培
                const P = Math.round(u * i * 10) / 10;
                return {
                    question: `一盏标有“$${u}\\text{V}$”字样的用电器，接入对应额定电压的电路中正常工作，测得通过它的电流为 $${i}\\text{ A}$。则该用电器的电功率为___________ $\\text{W}$。`,
                    answer: `${P}`,
                    steps: [
                        `1. 用电器在额定电压下正常工作，其额定电压 $U = ${u}\\text{ V}$，工作电流 $I = ${i}\\text{ A}$。`,
                        `2. 根据电功率公式 $P = UI$ 代入计算：$P = ${u}\\text{ V} \\times ${i}\\text{ A} = ${P}\\text{ W}$。`
                    ]
                };
            }
        },
        {
            id: "elec_resistor_r",
            category: "electricity",
            type: "calculation",
            score: 20,
            generator() {
                // 用电器规格计算 R = U^2/P, I = P/U 多规格版
                const item = PHYSICS_ENGINE.randomPick([
                    { name: "家用照明灯泡", u: 220, P: PHYSICS_ENGINE.randomPick([25, 40, 60, 100]) },
                    { name: "电热水器", u: 220, P: PHYSICS_ENGINE.randomPick([1000, 1500, 2000]) },
                    { name: "车载记录仪", u: 12, P: PHYSICS_ENGINE.randomPick([6, 12, 18]) }
                ]);
                const R = Math.round((item.u * item.u) / item.P * 100) / 100;
                const I = Math.round(item.P / item.u * 100) / 100;
                return {
                    question: `一只${item.name}上标有“$${item.u}\\text{V } ${item.P}\\text{W}$”字样。求：（1）该${item.name}正常工作时的电流是多少？（结果保留两位小数）（2）该${item.name}正常工作时的电阻是多少？（结果保留两位小数）`,
                    answer: `(1) 电流为 ${I} A；(2) 电阻为 ${R} Ω`,
                    steps: [
                        `**(1) 计算用电器正常工作时的额定电流：**`,
                        `已知其额定电压 $U = ${item.u}\\text{ V}$，额定功率 $P = ${item.P}\\text{ W}$。`,
                        `根据电功率公式 $P = UI$：$I = \\frac{P}{U} = \\frac{${item.P}\\text{ W}}{${item.u}\\text{ V}} \\approx ${I}\\text{ A}$。`,
                        `**(2) 计算用电器正常工作时的电阻：**`,
                        `由电功率公式在纯电阻用电器下的推导式 $P = \\frac{U^2}{R}$ 可得：`,
                        `$R = \\frac{U^2}{P} = \\frac{(${item.u}\\text{ V})^2}{${item.P}\\text{ W}} \\approx ${R}\\text{ }\\Omega$。`,
                        `**答：** 正常发光时的电流约为 $${I}\\text{ A}$，电阻约为 $${R}\\text{ }\\Omega$。`
                    ]
                };
            }
        },
        {
            id: "elec_actual_power",
            category: "electricity",
            type: "calculation",
            score: 20,
            generator() {
                // 实际功率计算多用电器版 P实 = U实^2/R
                const bulb = PHYSICS_ENGINE.randomPick([
                    { name: "白炽灯", u_rated: 220, P_rated: 100, R: 484, u_act: [110, 176, 200] },
                    { name: "指示灯", u_rated: 220, P_rated: 40, R: 1210, u_act: [110, 198, 200] },
                    { name: "车载灯", u_rated: 12, P_rated: 24, R: 6, u_act: [6, 8, 9, 10] },
                    { name: "小灯泡", u_rated: 6, P_rated: 12, R: 3, u_act: [3, 4, 5] }
                ]);
                const u_act = PHYSICS_ENGINE.randomPick(bulb.u_act);
                const P_act = Math.round((u_act * u_act) / bulb.R * 100) / 100;
                return {
                    question: `一盏铭牌标有“$${bulb.u_rated}\\text{V } ${bulb.P_rated}\\text{W}$”的${bulb.name}。已知其电阻为 $${bulb.R}\\text{ }\\Omega$ 保持不变。当把它接在实际电压为 $${u_act}\\text{ V}$ 的电路两端时。求该${bulb.name}此时消耗的实际功率是多少？（结果保留两位小数）`,
                    answer: `${P_act} W`,
                    steps: [
                        `1. 已知${bulb.name}电阻保持不变：$R = ${bulb.R}\\text{ }\\Omega$。`,
                        `2. 实际电压 $U_{实} = ${u_act}\\text{ V}$。`,
                        `3. 根据实际电功率公式进行代入计算：`,
                        `   $P_{实} = \\frac{U_{实}^2}{R} = \\frac{(${u_act}\\text{ V})^2}{${bulb.R}\\text{ }\\Omega} = \\frac{${u_act*u_act}}{${bulb.R}}\\text{ W} \\approx ${P_act}\\text{ W}$。`,
                        `**答：** 该${bulb.name}消耗的实际功率是 $${P_act}\\text{ W}$。`
                    ]
                };
            }
        },
        {
            id: "elec_joule_q",
            category: "electricity",
            type: "fill",
            score: 10,
            generator() {
                // 焦耳定律 Q = I^2*R*t 多电流版
                const r = PHYSICS_ENGINE.randomPick([5, 10, 20, 25, 40, 50, 80, 100]); // 电阻
                const i = PHYSICS_ENGINE.randomPick([1, 2, 3, 4, 5]); // 电流
                const t = PHYSICS_ENGINE.randomPick([10, 20, 30, 45, 60, 90, 120]); // 时间
                const Q = i * i * r * t;
                return {
                    question: `一个电阻阻值为 $${r}\\text{ }\\Omega$，通过该电阻的电流为 $${i}\\text{ A}$，在 $${t}\\text{ s}$ 内该电阻产生的热量为___________ $\\text{J}$。`,
                    answer: `${Q}`,
                    steps: [
                        `1. 已知电阻 $R = ${r}\\text{ }\\Omega$，电流 $I = ${i}\\text{ A}$，通电时间 $t = ${t}\\text{ s}$。`,
                        `2. 根据焦耳定律 $Q = I^2 R t$ 进行代入计算：`,
                        `   $Q = (${i}\\text{ A})^2 \\times ${r}\\text{ }\\Omega \\times ${t}\\text{ s} = ${i*i} \\times ${r} \\times ${t} = ${Q}\\text{ J}$。`
                    ]
                };
            }
        },
        {
            id: "elec_meter_w",
            category: "electricity",
            type: "fill",
            score: 10,
            generator() {
                // 电能表电功转盘计算多电位版
                const N = PHYSICS_ENGINE.randomPick([600, 1200, 1600, 2400, 3000, 3200]); // 转数/闪烁数进率
                const revs = PHYSICS_ENGINE.randomPick([30, 60, 100, 120, 150, 300, 600]); // 实际转过圈数
                const W_kwh = Math.round((revs / N) * 10000) / 10000;
                const W_j = Math.round(W_kwh * 3.6e6 * 100) / 100;
                return {
                    question: `小明家电能表上标有“$${N}\\text{r/(kW}\\cdot\\text{h)}$”字样。当他家只让一个用电器单独工作时，观察到电能表转盘在一段时间内转了 $${revs}$ 转，则该用电器在此期间消耗的电能为___________ $\\text{kW}\\cdot\\text{h}$，合___________ $\\text{J}$。`,
                    answer: `${W_kwh}；${W_j}`,
                    steps: [
                        `1. 电能表参数 $${N}\\text{r/(kW}\\cdot\\text{h)}$ 表示电能表每转过 $${N}$ 转，消耗电能为 $1\\text{ kW}\\cdot\\text{h}$。`,
                        `2. 消耗电能为：$W = \\frac{${revs}}{${N}}\\text{ kW}\\cdot\\text{h} = ${W_kwh}\\text{ kW}\\cdot\\text{h}$。`,
                        `3. 乘以焦耳进率换算（$1\\text{ kW}\\cdot\\text{h} = 3.6 \\times 10^6\\text{ J}$）：`,
                        `   $W = ${W_kwh} \\times 3.6 \\times 10^6\\text{ J} = ${W_j}\\text{ J}$。`
                    ]
                };
            }
        },

        // ============================== 四、热学模块 (10个模板) ==============================
        {
            id: "elec_ampere_rule",
            category: "electricity",
            type: "fill",
            score: 10,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { polarity: "左正右负", winding: "前方导线电流向下", left: "S", right: "N", step: "电流从左端流入、右端流出。右手四指弯曲指向前方电流向下的方向，大拇指指向右端，故右端为 N 极，left 端为 S 极。" },
                    { polarity: "左正右负", winding: "前方导线电流向上", left: "N", right: "S", step: "电流从左端流入、右端流出。右手四指弯曲指向前方电流向上的方向，大拇指指向左端，故左端为 N 极，右端为 S 极。" },
                    { polarity: "左负右正", winding: "前方导线电流向下", left: "N", right: "S", step: "电流从右端流入、左端流出。右手四指弯曲指向前方电流向下的方向，大拇指指向左端，故左端为 N 极，右端为 S 极。" },
                    { polarity: "左负右正", winding: "前方导线电流向上", left: "S", right: "N", step: "电流从右端流入、左端流出。右手四指弯曲指向前方电流向上的方向，大拇指指向右端，故右端为 N 极，左端为 S 极。" }
                ]);
                return {
                    question: `通电螺线管极性判定：如图，电源连接为“$${combo.polarity}$”。若螺线管的绕线使得$${combo.winding}$，则通电螺线管的左端为___________极（选填“N”或“S”）。`,
                    answer: `${combo.left}`,
                    steps: [
                        `1. **确定电流流入方向**：根据电源“${combo.polarity}”，确定电流方向。`,
                        `2. **右手螺旋定则（安培定则）判定**：`,
                        `   ${combo.step}`,
                        `3. **得出结论**：左端为 **${combo.left}** 极。`
                    ]
                };
            }
        },
        {
            id: "elec_generator_motor_diff",
            category: "electricity",
            type: "choice",
            score: 10,
            generator() {
                const isGenerator = PHYSICS_ENGINE.randomPick([true, false]);
                if (isGenerator) {
                    return {
                        question: `关于电与磁，下列说法正确的是（___________）<br>` +
                                  `A. 发电机是利用通电线圈在磁场中受力转动的原理制成的<br>` +
                                  `B. 发电机工作时将电能转化为机械能<br>` +
                                  `C. 发电机是利用电磁感应现象制成的，工作时将机械能转化为电能<br>` +
                                  `D. 发电机内部是没有磁体的`,
                        answer: `C`,
                        steps: [
                            `1. **发电机原理分析**：发电机是利用英国物理学家法拉第发现的**电磁感应现象**制成的。因此 A 错误，C 正确。`,
                            `2. **能量转化分析**：发电机工作时，通过消耗机械能（转动）来产生电能，即将**机械能转化为电能**。因此 B 错误。`,
                            `3. **构造分析**：发电机必须有强磁体以提供磁场。因此 D 错误。`
                        ]
                    };
                } else {
                    return {
                        question: `关于电风扇和电动机，下列说法正确的是（___________）<br>` +
                                  `A. 电动机是利用电磁感应原理制成的，工作时将机械能转化为电能<br>` +
                                  `B. 电动机是利用通电导体在磁场中受力转动的原理制成的，工作时将电能转化为机械能<br>` +
                                  `C. 电动机与发电机的工作原理完全相同<br>` +
                                  `D. 电动机工作时不需要消耗电能`,
                        answer: `B`,
                        steps: [
                            `1. **电动机原理分析**：电动机是利用**通电导体在磁场中受到力的作用而转动**的原理制成的。因此 A 错误，B 正确。`,
                            `2. **能量转化分析**：电动机通电工作，消耗电能产生机械能（转动），即将**电能转化为机械能**。因此 D 错误。`,
                            `3. **对比分析**：发电机原理为电磁感应，电动机原理为磁场对电流的作用，两者工作原理不同。因此 C 错误。`
                        ]
                    };
                }
            }
        },
        {
            id: "therm_water_q",
            category: "thermodynamics",
            type: "calculation",
            score: 20,
            generator() {
                // 比热容水吸热 Q吸 = c*m*dt
                const m = PHYSICS_ENGINE.randomPick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 8, 10]); // 水质量
                const t0 = PHYSICS_ENGINE.randomPick([10, 15, 20, 25, 30]); // 初温
                const t1 = PHYSICS_ENGINE.randomPick([50, 60, 70, 80, 90, 100]); // 末温
                const dt = t1 - t0;
                const c = 4200; // 水比热容 J/(kg·℃)
                const Q = c * m * dt;
                return {
                    question: `将质量为 $${m}\\text{ kg}$ 的水温度从 $${t0}\\text{ ℃}$ 加热到 $${t1}\\text{ ℃}$。已知水的比热容为 $4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$。求这些水吸收的热量是多少 J？`,
                    answer: `${Q} J`,
                    steps: [
                        `1. 已知水质量 $m = ${m}\\text{ kg}$，水的比热容 $c = 4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$。`,
                        `2. 温度上升变化量：$\\Delta t = t_{末} - t_{初} = ${t1}\\text{ ℃} - ${t0}\\text{ ℃} = ${dt}\\text{ ℃}$。`,
                        `3. 根据吸热计算公式：`,
                        `   $Q_{吸} = c m \\Delta t = 4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)} \\times ${m}\\text{ kg} \\times ${dt}\\text{ ℃} = ${Q}\\text{ J}$。`,
                        `**答：** 水吸收的热量是 $${Q}\\text{ J}$。`
                    ]
                };
            }
        },
        {
            id: "therm_coal_q",
            category: "thermodynamics",
            type: "fill",
            score: 10,
            generator() {
                // 燃料燃烧完全放热多燃料版 Q = m * q
                const fuel = PHYSICS_ENGINE.randomPick([
                    { name: "无烟煤", q_sci: "3.0 \\times 10^7", q: 3.0e7 },
                    { name: "焦炭", q_sci: "3.0 \\times 10^7", q: 3.0e7 },
                    { name: "干木柴", q_sci: "1.2 \\times 10^7", q: 1.2e7 },
                    { name: "烟煤", q_sci: "2.9 \\times 10^7", q: 2.9e7 }
                ]);
                const m = PHYSICS_ENGINE.randomPick([0.2, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 10]); // 质量 kg
                const Q = m * fuel.q;
                return {
                    question: `已知${fuel.name}的热值为 $${fuel.q_sci}\\text{ J/kg}$。完全燃烧 $${m}\\text{ kg}$ 的${fuel.name}，释放的热量为___________ $\\text{J}$。`,
                    answer: `${Q}`,
                    steps: [
                        `1. 已知燃料质量 $m = ${m}\\text{ kg}$，热值 $q = ${fuel.q_sci}\\text{ J/kg}$。`,
                        `2. 根据燃料完全燃烧放热公式 $Q_{放} = mq$ 代入计算：`,
                        `   $Q_{放} = ${m}\\text{ kg} \\times ${fuel.q_sci}\\text{ J/kg} = ${Q}\\text{ J}$。`
                    ]
                };
            }
        },
        {
            id: "therm_gas_q",
            category: "thermodynamics",
            type: "fill",
            score: 10,
            generator() {
                // 气体完全燃烧放热多气体版 Q = V * q
                const fuel = PHYSICS_ENGINE.randomPick([
                    { name: "天然气", q_sci: "4.0 \\times 10^7", q: 4.0e7 },
                    { name: "煤气", q_sci: "4.2 \\times 10^7", q: 4.2e7 }
                ]);
                const V = PHYSICS_ENGINE.randomPick([0.1, 0.2, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5]); // 体积 m³
                const Q = V * fuel.q;
                return {
                    question: `已知${fuel.name}的热值为 $${fuel.q_sci}\\text{ J/m}^3$。完全燃烧 $${V}\\text{ m}^3$ 的${fuel.name}，释放的热量为___________ $\\text{J}$。`,
                    answer: `${Q}`,
                    steps: [
                        `1. 已知气体体积 $V = ${V}\\text{ m}^3$，热值 $q = ${fuel.q_sci}\\text{ J/m}^3$。`,
                        `2. 根据气体燃料完全燃烧放热公式 $Q_{放} = V q$ 求解：`,
                        `   $Q_{放} = ${V}\\text{ m}^3 \\times ${fuel.q_sci}\\text{ J/m}^3 = ${Q}\\text{ J}$。`
                    ]
                };
            }
        },
        {
            id: "therm_engine_eff",
            category: "thermodynamics",
            type: "calculation",
            score: 20,
            generator() {
                // 热机效率计算多参数整除版 eta = W有 / Q放
                const fuel = PHYSICS_ENGINE.randomPick([
                    { name: "柴油", q: 3.3e7, q_sci: "3.3 \\times 10^7" },
                    { name: "汽油", q: 4.6e7, q_sci: "4.6 \\times 10^7" }
                ]);
                const m = PHYSICS_ENGINE.randomPick([2, 3, 4, 5, 8, 10]); // 消耗质量 kg
                const Q_total = m * fuel.q;
                
                // 选择可以计算出漂亮整除机械效率的有用功 W
                const eta_percent = PHYSICS_ENGINE.randomPick([25, 30, 35, 40]); // 效率 25%-40% 
                const W = Q_total * (eta_percent / 100);
                
                return {
                    question: `一台${fuel.name}机工作时，消耗了 $${m}\\text{ kg}$ 的${fuel.name}，做出了 $${W.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$ 的有用机械功。已知${fuel.name}的热值为 $${fuel.q_sci}\\text{ J/kg}$。求：（1）这 $${m}\\text{ kg}$ 的${fuel.name}完全燃烧放出的热量是多少 J？（2）该${fuel.name}机的热机效率是多少？`,
                    answer: `(1) 完全放出 ${Q_total.toExponential(2).replace("e+", "\\times 10^")} J；(2) 效率为 ${eta_percent}%`,
                    steps: [
                        `**(1) 计算燃料完全燃烧放出的热量**：`,
                        `已知消耗质量 $m = ${m}\\text{ kg}$，热值 $q = ${fuel.q_sci}\\text{ J/kg}$。`,
                        `根据公式 $Q_{放} = m q$：`,
                        `$Q_{放} = ${m}\\text{ kg} \\times ${fuel.q_sci}\\text{ J/kg} = ${Q_total.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `**(2) 计算该热机的效率**：`,
                        `已知有用功 $W_{有} = ${W.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$，输入总热量 $Q_{放} = ${Q_total.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `根据机械效率公式：$\\eta = \\frac{W_{有}}{Q_{放}} \\times 100\\% = \\frac{${W.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}}{${Q_total.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}} \\times 100\\% = ${eta_percent}\\%$。`,
                        `**答：** 完全放出的热量是 $${Q_total.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$，热机效率为 $${eta_percent}\\%$。`
                    ]
                };
            }
        },
        {
            id: "therm_stove_eff",
            category: "thermodynamics",
            type: "calculation",
            score: 20,
            generator() {
                // 燃气灶烧水综合计算完美整除多组合版
                const combo = PHYSICS_ENGINE.randomPick([
                    { m: 20, dt: 50, eta: 0.5, V: 0.2 },
                    { m: 50, dt: 50, eta: 0.5, V: 0.5 },
                    { m: 100, dt: 50, eta: 0.5, V: 1.0 },
                    { m: 150, dt: 50, eta: 0.5, V: 1.5 },
                    { m: 200, dt: 50, eta: 0.5, V: 2.0 },
                    { m: 40, dt: 60, eta: 0.4, V: 0.6 },
                    { m: 80, dt: 60, eta: 0.4, V: 1.2 },
                    { m: 60, dt: 70, eta: 0.3, V: 1.4 },
                    { m: 120, dt: 70, eta: 0.3, V: 2.8 }
                ]);
                
                const c = 4200;
                const Q_abs = c * combo.m * combo.dt;
                const Q_total = Q_abs / combo.eta;
                const q_gas = 4.2e7; // 煤气热值 4.2e7
                
                const eta_pct = combo.eta * 100;
                
                return {
                    question: `某燃气灶在工作时将 $${combo.m}\\text{ kg}$ 的水温度升高了 $${combo.dt}\\text{ ℃}$。已知水的比热容为 $4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$，燃气灶的加热效率为 $${eta_pct}\\%$，煤气的热值为 $4.2 \\times 10^7\\text{ J/m}^3$。求：（1）水吸收的热量是多少 J？（2）需要完全燃烧多少 m³ 的煤气？`,
                    answer: `(1) 水吸热为 ${Q_abs.toExponential(2).replace("e+", "\\times 10^")} J；(2) 煤气体积为 ${combo.V.toFixed(2).replace(/\.?0+$/, "")} m³`,
                    steps: [
                        `**(1) 计算水吸收的热量**：`,
                        `已知水的质量 $m_{水} = ${combo.m}\\text{ kg}$，升高的温度 $\\Delta t = ${combo.dt}\\text{ ℃}$。`,
                        `根据吸热公式：$Q_{吸} = c m_{水} \\Delta t = 4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)} \\times ${combo.m}\\text{ kg} \\times ${combo.dt}\\text{ ℃} = ${Q_abs.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `**(2) 计算完全燃烧煤气的体积**：`,
                        `已知燃气灶的加热效率 $\\eta = ${eta_pct}\\%$。`,
                        `由 $\\eta = \\frac{Q_{吸}}{Q_{放}}$，得煤气完全燃烧需释放的总热量：`,
                        `$Q_{放} = \\frac{Q_{吸}}{\\eta} = \\frac{${Q_abs.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}}{${combo.eta}} = ${Q_total.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `根据燃料放热公式 $Q_{放} = V q_{煤气}$ 得，需要完全燃烧的煤气体积：`,
                        `$V = \\frac{Q_{放}}{q_{煤气}} = \\frac{${Q_total.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}}{4.2 \\times 10^7\\text{ J/m}^3} = ${combo.V.toFixed(2).replace(/\.?0+$/, "")}\\text{ m}^3$。`,
                        `**答：** 水吸收热量为 $${Q_abs.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$，需要完全燃烧 $${combo.V.toFixed(2).replace(/\.?0+$/, "")}\\text{ m}^3$ 的煤气。`
                    ]
                };
            }
        },
        {
            id: "therm_sand_q",
            category: "thermodynamics",
            type: "fill",
            score: 10,
            generator() {
                // 沙石吸热对比
                const m = PHYSICS_ENGINE.randomPick([1, 2, 4, 5, 8, 10]);
                const dt = PHYSICS_ENGINE.randomPick([5, 10, 15, 20, 25, 30]);
                const c_sand = 900; // 比热容 J/(kg·℃)
                const Q = c_sand * m * dt;
                return {
                    question: `质量为 $${m}\\text{ kg}$ 的干沙子，温度升高了 $${dt}\\text{ ℃}$。已知沙子的比热容为 $0.9 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$。这些沙子吸收的热量为___________ $\\text{J}$。`,
                    answer: `${Q}`,
                    steps: [
                        `1. 已知沙子质量 $m = ${m}\\text{ kg}$，比热容 $c = 900\\text{ J/(kg}\\cdot\\text{℃)}$，升温 $\\Delta t = ${dt}\\text{ ℃}$。`,
                        `2. 根据吸热公式 $Q = c m \\Delta t$ 计算：`,
                        `   $Q_{吸} = 900\\text{ J/(kg}\\cdot\\text{℃)} \\times ${m}\\text{ kg} \\times ${dt}\\text{ ℃} = ${Q}\\text{ J}$。`
                    ]
                };
            }
        },
        {
            id: "therm_iron_m",
            category: "thermodynamics",
            type: "fill",
            score: 10,
            generator() {
                // 已知吸热求铁块质量
                const c_iron = 460; // 铁比热容 J/(kg·℃)
                const dt = PHYSICS_ENGINE.randomPick([10, 20, 25, 30, 40, 50]);
                const m = PHYSICS_ENGINE.randomPick([0.5, 1, 2, 3, 4, 5, 8, 10]); // 理想质量
                const Q = c_iron * m * dt;
                return {
                    question: `一块铁的温度升高了 $${dt}\\text{ ℃}$，共吸收了 $${Q}\\text{ J}$ 的热量。已知铁的比热容为 $0.46 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$。该铁块的质量为___________ $\\text{kg}$。`,
                    answer: `${m}`,
                    steps: [
                        `1. 已知比热容 $c = 460\\text{ J/(kg}\\cdot\\text{℃)}$，升温 $\\Delta t = ${dt}\\text{ ℃}$，吸热 $Q = ${Q}\\text{ J}$。`,
                        `2. 根据吸热公式 $Q = c m \\Delta t$ 变形求质量：`,
                        `   $m = \\frac{Q}{c \\Delta t} = \\frac{${Q}\\text{ J}}{460\\text{ J/(kg}\\cdot\\text{℃)} \\times ${dt}\\text{ ℃}} = ${m}\\text{ kg}$。`
                    ]
                };
            }
        },
        {
            id: "therm_temp_change",
            category: "thermodynamics",
            type: "fill",
            score: 10,
            generator() {
                // 已知热量求温升多组合版
                const m = PHYSICS_ENGINE.randomPick([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20]); // 质量 kg
                const c_water = 4200;
                const dt = PHYSICS_ENGINE.randomPick([5, 10, 15, 20, 25, 30, 35, 40, 50]); // 对应温升
                const Q = c_water * m * dt;
                return {
                    question: `质量为 $${m}\\text{ kg}$ 的水，吸收了 $${Q}\\text{ J}$ 的热量。已知水的比热容为 $4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$。水的温度将升高___________ $\\text{℃}$。`,
                    answer: `${dt}`,
                    steps: [
                        `1. 已知水质量 $m = ${m}\\text{ kg}$，比热容 $c = 4200\\text{ J/(kg}\\cdot\\text{℃)}$，吸收热量 $Q = ${Q}\\text{ J}$。`,
                        `2. 根据吸热公式 $Q = c m \\Delta t$ 变形，计算升高的温度：`,
                        `   $\\Delta t = \\frac{Q}{c m} = \\frac{${Q}\\text{ J}}{4200\\text{ J/(kg}\\cdot\\text{℃)} \\times ${m}\\text{ kg}} = ${dt}\\text{ ℃}$。`
                    ]
                };
            }
        },
        {
            id: "therm_heat_loss",
            category: "thermodynamics",
            type: "fill",
            score: 10,
            generator() {
                // 铜块放热计算 Q放 = c*m*dt
                const m = PHYSICS_ENGINE.randomPick([1, 2, 3, 4, 5, 8, 10]);
                const dt = PHYSICS_ENGINE.randomPick([10, 15, 20, 25, 30, 40, 50]);
                const c_copper = 390; // 铜比热容
                const Q = c_copper * m * dt;
                return {
                    question: `质量为 $${m}\\text{ kg}$ 的铜块，温度降低了 $${dt}\\text{ ℃}$。已知铜的比热容为 $0.39 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$。铜块在此过程中放出的热量为___________ $\\text{J}$。`,
                    answer: `${Q}`,
                    steps: [
                        `1. 已知铜质量 $m = ${m}\\text{ kg}$，比热容 $c = 390\\text{ J/(kg}\\cdot\\text{℃)}$，降温 $\\Delta t = ${dt}\\text{ ℃}$。`,
                        `2. 根据放热公式 $Q_{放} = c m \\Delta t$ 计算：`,
                        `   $Q_{放} = 390\\text{ J/(kg}\\cdot\\text{℃)} \\times ${m}\\text{ kg} \\times ${dt}\\text{ ℃} = ${Q}\\text{ J}$。`
                    ]
                };
            }
        },
        {
            id: "therm_stove_efficiency_f",
            category: "thermodynamics",
            type: "fill",
            score: 10,
            generator() {
                // 效率填空多组合版
                const combo = PHYSICS_ENGINE.randomPick([
                    { q_abs: 1.2e6, q_tot: 3.0e6, eta: 40, q_abs_sci: "1.2 \\times 10^6", q_tot_sci: "3.0 \\times 10^6" },
                    { q_abs: 1.5e6, q_tot: 3.0e6, eta: 50, q_abs_sci: "1.5 \\times 10^6", q_tot_sci: "3.0 \\times 10^6" },
                    { q_abs: 1.6e6, q_tot: 4.0e6, eta: 40, q_abs_sci: "1.6 \\times 10^6", q_tot_sci: "4.0 \\times 10^6" },
                    { q_abs: 2.0e6, q_tot: 4.0e6, eta: 50, q_abs_sci: "2.0 \\times 10^6", q_tot_sci: "4.0 \\times 10^6" },
                    { q_abs: 2.1e6, q_tot: 4.2e6, eta: 50, q_abs_sci: "2.1 \\times 10^6", q_tot_sci: "4.2 \\times 10^6" },
                    { q_abs: 1.8e6, q_tot: 6.0e6, eta: 30, q_abs_sci: "1.8 \\times 10^6", q_tot_sci: "6.0 \\times 10^6" },
                    { q_abs: 2.4e6, q_tot: 6.0e6, eta: 40, q_abs_sci: "2.4 \\times 10^6", q_tot_sci: "6.0 \\times 10^6" },
                    { q_abs: 3.0e6, q_tot: 6.0e6, eta: 50, q_abs_sci: "3.0 \\times 10^6", q_tot_sci: "6.0 \\times 10^6" },
                    { q_abs: 2.4e6, q_tot: 8.0e6, eta: 30, q_abs_sci: "2.4 \\times 10^6", q_tot_sci: "8.0 \\times 10^6" },
                    { q_abs: 3.2e6, q_tot: 8.0e6, eta: 40, q_abs_sci: "3.2 \\times 10^6", q_tot_sci: "8.0 \\times 10^6" }
                ]);
                return {
                    question: `某太阳能热水器在一天的日照下，箱内的水共吸收了 $${combo.q_abs_sci}\\text{ J}$ 的热量。在此期间，太阳能接收板共接收了 $${combo.q_tot_sci}\\text{ J}$ 的太阳辐射能量。则该太阳能热水器的光热转化效率为___________ $\\%$。`,
                    answer: `${combo.eta}`,
                    steps: [
                        `1. 有用能量为水吸收的热量：$Q_{吸} = ${combo.q_abs_sci}\\text{ J}$。`,
                        `2. 输入总能量为接收板吸收的总太阳能：$Q_{总} = ${combo.q_tot_sci}\\text{ J}$。`,
                        `3. 根据效率计算公式：`,
                        `   $\\eta = \\frac{Q_{吸}}{Q_{总}} \\times 100\\% = \\frac{${combo.q_abs_sci}\\text{ J}}{${combo.q_tot_sci}\\text{ J}} \\times 100\\% = ${combo.eta}\\%$。`
                    ]
                };
            }
        },

        // ============================== 三、数学：数与式 (3个模板) ==============================
        {
            id: "math_perfect_sq",
            category: "num-exp",
            type: "calculation",
            score: 20,
            generator() {
                // 已知和与积求平方和
                const sum = PHYSICS_ENGINE.randomPick([5, 6, 7, 8]);
                const prod = PHYSICS_ENGINE.randomPick([2, 3, 4, 5, 6]);
                const sqSum = sum * sum - 2 * prod;
                return {
                    question: `已知两个数 $a$ 和 $b$ 满足关系式：$a + b = ${sum}$，$ab = ${prod}$。求 $a^2 + b^2$ 的代数式值。`,
                    answer: `${sqSum}`,
                    steps: [
                        `1. 根据初中代数完全平方公式展开：$(a + b)^2 = a^2 + 2ab + b^2$。`,
                        `2. 变形可得求平方和的公式：$a^2 + b^2 = (a + b)^2 - 2ab$。`,
                        `3. 代入已知数 $a+b = ${sum}$ 和 $ab = ${prod}$：`,
                        `   $a^2 + b^2 = (${sum})^2 - 2 \\times ${prod} = ${sum*sum} - ${2*prod} = ${sqSum}$。`,
                        `**答：** $a^2 + b^2$ 的值是 $${sqSum}$。`
                    ]
                };
            }
        },
        {
            id: "math_square_diff",
            category: "num-exp",
            type: "fill",
            score: 10,
            generator() {
                // 平方差公式计算
                const sum = PHYSICS_ENGINE.randomPick([5, 6, 8, 10]);
                const diff = PHYSICS_ENGINE.randomPick([2, 3, 4]);
                const ans = sum * diff;
                return {
                    question: `已知 $x + y = ${sum}$，$x - y = ${diff}$，则代数式 $x^2 - y^2$ 的值为___________。`,
                    answer: `${ans}`,
                    steps: [
                        `1. 根据平方差公式进行因式分解：$x^2 - y^2 = (x + y)(x - y)$。`,
                        `2. 代入已知项 $x+y = ${sum}$ 和 $x-y = ${diff}$：`,
                        `   $x^2 - y^2 = ${sum} \\times ${diff} = ${ans}$。`
                    ]
                };
            }
        },
        {
            id: "math_sqrt_simplify",
            category: "num-exp",
            type: "fill",
            score: 10,
            generator() {
                // 二次根式化简
                const raw = PHYSICS_ENGINE.randomPick([8, 12, 18, 20, 24, 27, 28, 32, 40, 45, 48, 50, 72, 75]);
                const simplified = PHYSICS_ENGINE.simplifySqrt(raw);
                return {
                    question: `化简二次根式：$\\sqrt{${raw}} = $___________。`,
                    answer: `${simplified}`,
                    steps: [
                        `1. 将被开方数 $${raw}$ 拆解为最大完全平方数与其他因数的乘积。`,
                        `2. 寻找因数：找出 $${raw}$ 中的平方数因子，并通过 $\\sqrt{a^2 b} = a\\sqrt{b}$ 进行开方提取。`,
                        `   化简结果为：$${simplified}$。`
                    ]
                };
            }
        },
        {
            id: "math_factor_extract",
            category: "num-exp",
            type: "fill",
            score: 10,
            generator() {
                // 结构 1: Ax^2 - Bx = Ax(x - C)
                // 结构 2: Aa^2b + Aab^2 = Aab(a + b)
                const isStructureA = Math.random() < 0.5;
                if (isStructureA) {
                    const A = PHYSICS_ENGINE.randomRange(2, 6);
                    const C = PHYSICS_ENGINE.randomRange(2, 6);
                    const B = A * C;
                    return {
                        question: `对多项式进行因式分解：$${A}x^2 - ${B}x = $___________。`,
                        answer: `${A}x(x - ${C})`,
                        steps: [
                            `1. **寻找公因式**：观察多项式 $${A}x^2 - ${B}x$ 的各项，二次项是 $${A}x^2$，一次项是 $-${B}x$。`,
                            `2. **确定公因式**：两项的系数 $${A}$ 和 $-${B}$ 的公约数是 $${A}$，字母部分共有因式是 $x$，因此最大公因式为 $${A}x$。`,
                            `3. **提取公因式**：用多项式除以公因式，得到各项剩下的因式，即：$${A}x^2 \\div ${A}x = x$，$-${B}x \\div ${A}x = -${C}$。`,
                            `4. **写出因式分解结果**：$${A}x(x - ${C})$。`
                        ]
                    };
                } else {
                    const A = PHYSICS_ENGINE.randomRange(2, 6);
                    return {
                        question: `对多项式进行因式分解：$${A}a^2b + ${A}ab^2 = $___________。`,
                        answer: `${A}ab(a + b)`,
                        steps: [
                            `1. **寻找公因式**：观察多项式 $${A}a^2b + ${A}ab^2$ 的各项，两项均含有因数 $${A}$，且字母部分均含有 $a$ 和 $b$。`,
                            `2. **确定公因式**：两项的共同因式中，字母最低次数分别为 $a^1$ 和 $b^1$，因此最大公因式为 $${A}ab$。`,
                            `3. **提取公因式**：将多项式各项除以公因式 $${A}ab$，各项剩下的部分分别为 $a$ 和 $b$。`,
                            `4. **写出因式分解结果**：$${A}ab(a + b)$。`
                        ]
                    };
                }
            }
        },
        {
            id: "math_factor_formula",
            category: "num-exp",
            type: "fill",
            score: 10,
            generator() {
                // 结构 1 (平方差): a^2 x^2 - b^2 = (ax + b)(ax - b)
                // 结构 2 (完全平方): x^2 ± 2ax + a^2 = (x ± a)^2
                const isDiff = Math.random() < 0.5;
                if (isDiff) {
                    const primes = [[2,3], [3,2], [2,5], [5,2], [3,4], [4,3], [3,5], [5,3]];
                    const pick = PHYSICS_ENGINE.randomPick(primes);
                    const a = pick[0];
                    const b = pick[1];
                    const a2 = a * a;
                    const b2 = b * b;
                    return {
                        question: `对多项式进行因式分解：$${a2}x^2 - ${b2} = $___________。`,
                        answer: `(${a}x + ${b})(${a}x - ${b})`,
                        steps: [
                            `1. **识别公式结构**：多项式 $${a2}x^2 - ${b2}$ 是两项的平方差形式，符合平方差公式 $A^2 - B^2 = (A + B)(A - B)$。`,
                            `2. **写成平方形式**：可以将 $${a2}x^2$ 写成 $(${a}x)^2$，将 $${b2}$ 写成 $${b}^2$，即变形为：$(${a}x)^2 - ${b}^2$。`,
                            `3. **代入公式分解**：以 $${a}x$ 作为 $A$，以 $${b}$ 作为 $B$ 代入平方差公式：`,
                            `   $(${a}x)^2 - ${b}^2 = (${a}x + ${b})(${a}x - ${b})$。`
                        ]
                    };
                } else {
                    const a = PHYSICS_ENGINE.randomRange(2, 6);
                    const isPlus = Math.random() < 0.5;
                    const doubleA = 2 * a;
                    const a2 = a * a;
                    const signStr = isPlus ? "+" : "-";
                    return {
                        question: `对多项式进行因式分解：$x^2 ${signStr} ${doubleA}x + ${a2} = $___________。`,
                        answer: isPlus ? `(x + ${a})^2` : `(x - ${a})^2`,
                        steps: [
                            `1. **识别公式结构**：多项式 $x^2 ${signStr} ${doubleA}x + ${a2}$ 是三项式，两端的项 $x^2$ 和 $${a2}$ 均为完全平方项。`,
                            `2. **验证中间项**：中间项 $${signStr}${doubleA}x$ 恰好是两端底数 $x$ 与 $${a}$ 的乘积的 2 倍（即 $2 \\times x \\times ${a} = ${doubleA}x$）。`,
                            `3. **匹配公式**：符合完全平方公式 $A^2 \\pm 2AB + B^2 = (A \\pm B)^2$。`,
                            `4. **写出因式分解结果**：$x^2 ${signStr} 2 \\cdot x \\cdot ${a} + ${a}^2 = (x ${signStr} ${a})^2$。`
                        ]
                    };
                }
            }
        },
        {
            id: "math_factor_cross",
            category: "num-exp",
            type: "calculation",
            score: 20,
            generator() {
                // 生成 x^2 + (p+q)x + pq = (x+p)(x+q)
                // 限制 p, q 范围为 [-5, 5] 之间的非零整数，且 p != q 且 p+q != 0
                let p = 0, q = 0;
                while (true) {
                    p = PHYSICS_ENGINE.randomRange(-5, 5);
                    q = PHYSICS_ENGINE.randomRange(-5, 5);
                    if (p !== 0 && q !== 0 && p !== q && (p + q) !== 0) {
                        break;
                    }
                }
                
                // 确保答案的一致性规范，按升序排列
                const sorted = [p, q].sort((a,b)=>a-b);
                const p_sorted = sorted[0];
                const q_sorted = sorted[1];
                
                const sum = p + q;
                const prod = p * q;
                
                let sumText = sum > 0 ? `+ ${sum}x` : `- ${Math.abs(sum)}x`;
                if (sum === 1) sumText = "+ x";
                else if (sum === -1) sumText = "- x";
                
                const prodText = prod > 0 ? `+ ${prod}` : `- ${Math.abs(prod)}`;
                
                const formatP = p > 0 ? `+ ${p}` : `- ${Math.abs(p)}`;
                const formatQ = q > 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
                
                const formatP_sorted = p_sorted > 0 ? `+ ${p_sorted}` : `- ${Math.abs(p_sorted)}`;
                const formatQ_sorted = q_sorted > 0 ? `+ ${q_sorted}` : `- ${Math.abs(q_sorted)}`;
                
                return {
                    question: `对二次三项式进行因式分解：$x^2 ${sumText} ${prodText}$。`,
                    answer: `(x ${formatP_sorted})(x ${formatQ_sorted})`,
                    steps: [
                        `1. **观察各项系数**：二次项系数是 $1$，一次项系数是 $${sum}$，常数项是 $${prod}$。`,
                        `2. **尝试十字相乘法**：寻找两个整数 $p$ 和 $q$，使得它们的积等于常数项 $${prod}$，和等于一次项系数 $${sum}$。`,
                        `3. **锁定因子**：经过尝试，找到这两个数为 $${p}$ 和 $${q}$：`,
                        `   积：$(${p}) \\times (${q}) = ${prod}$；`,
                        `   和：$(${p}) + (${q}) = ${sum}$。`,
                        `4. **十字相乘图示**：`,
                        `   <div style="text-align:center; margin:10px 0;">$\\begin{array}{ccc} 1 & & ${p} \\\\ & \\times & \\\\ 1 & & ${q} \\end{array}$</div>`,
                        `   交叉相乘相加验证：$1 \\times (${q}) + 1 \\times (${p}) = ${sum}$。`,
                        `5. **写出因式分解结果**：$(x ${formatP})(x ${formatQ})$（习惯上可将常数项较小的因式写在前面，即：$(x ${formatP_sorted})(x ${formatQ_sorted})$）。`
                    ]
                };
            }
        },
        // ============================== 四、数学：方程与函数 (3个模板) ==============================
        {
            id: "math_quadratic_eq",
            category: "eq-func",
            type: "calculation",
            score: 20,
            generator() {
                // 保证整根的一元二次方程求解
                const x1 = PHYSICS_ENGINE.randomPick([-3, -2, -1, 1, 2, 3]);
                const x2 = PHYSICS_ENGINE.randomPick([4, 5, -4, -5]); // 保证根不相等
                const b_coeff = -(x1 + x2);
                const c_coeff = x1 * x2;
                
                let bText = b_coeff >= 0 ? `+ ${b_coeff}` : `- ${Math.abs(b_coeff)}`;
                if (b_coeff === 0) bText = "";
                let cText = c_coeff >= 0 ? `+ ${c_coeff}` : `- ${Math.abs(c_coeff)}`;
                if (c_coeff === 0) cText = "";

                const delta = b_coeff * b_coeff - 4 * c_coeff;
                const roots = [x1, x2].sort((a,b)=>a-b);

                return {
                    question: `解一元二次方程：$x^2 ${bText}x ${cText} = 0$。`,
                    answer: `x1 = ${roots[0]}, x2 = ${roots[1]}`,
                    steps: [
                        `1. 确定方程系数：$a = 1$，$b = ${b_coeff}$，$c = ${c_coeff}$。`,
                        `2. 计算根的判别式 $\\Delta$：`,
                        `   $\\Delta = b^2 - 4ac = (${b_coeff})^2 - 4 \\times 1 \\times (${c_coeff}) = ${b_coeff*b_coeff} - (${4*c_coeff}) = ${delta}$。`,
                        `   因为 $\\Delta = ${delta} > 0$，所以方程有两个不相等的实数根。`,
                        `3. 代入求根公式 $x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$：`,
                        `   $x = \\frac{-(${b_coeff}) \\pm \\sqrt{${delta}}}{2 \\times 1} = \\frac{-${b_coeff} \\pm ${Math.sqrt(delta)}}{2}$。`,
                        `4. 拆分求解两个实数根：`,
                        `   $x_1 = \\frac{-${b_coeff} + ${Math.sqrt(delta)}}{2} = ${x1}$；`,
                        `   $x_2 = \\frac{-${b_coeff} - ${Math.sqrt(delta)}}{2} = ${x2}$。`,
                        `**答：** 方程的解为 $x_1 = ${roots[0]}$，$x_2 = ${roots[1]}$。`
                    ]
                };
            }
        },
        {
            id: "math_linear_func",
            category: "eq-func",
            type: "calculation",
            score: 20,
            generator() {
                // 待定系数法求一次函数
                const k = PHYSICS_ENGINE.randomPick([2, 3, -1, -2]);
                const b = PHYSICS_ENGINE.randomPick([1, 2, 4, 5, -1, -3]);
                const x1 = 1;
                const y1 = k * x1 + b;
                const x2 = 3;
                const y2 = k * x2 + b;
                
                let bText = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
                if (b === 0) bText = "";

                return {
                    question: `已知一次函数 $y = kx + b$ 的图象经过两点 $A(1, ${y1})$ 和 $B(3, ${y2})$。求该一次函数的解析式。`,
                    answer: `y = ${k}x ${bText}`,
                    steps: [
                        `1. 将点 $A(1, ${y1})$ 和 $B(3, ${y2})$ 的坐标分别代入解析式中，列出二元一次方程组：`,
                        `   $\\begin{cases} ${y1} = k + b \\quad \\text{①} \\\\ ${y2} = 3k + b \\quad \\text{②} \\end{cases}$。`,
                        `2. 采用加减消元法，用方程 ② 减去方程 ① 消去 $b$：`,
                        `   $(${y2}) - (${y1}) = 3k - k \\implies ${y2-y1} = 2k \\implies k = ${k}$。`,
                        `3. 将 $k = ${k}$ 代入方程 ① 求解常数项 $b$：`,
                        `   $${y1} = ${k} + b \\implies b = ${y1} - ${k} = ${b}$。`,
                        `4. 确定一次函数解析式：`,
                        `   $y = ${k}x ${bText}$。`,
                        `**答：** 该一次函数的解析式为 $y = ${k}x ${bText}$。`
                    ]
                };
            }
        },
        {
            id: "math_quadratic_vertex",
            category: "eq-func",
            type: "fill",
            score: 10,
            generator() {
                // 二次函数顶点对称轴
                const xv = PHYSICS_ENGINE.randomPick([1, 2, 3, -1, -2]);
                const yv = PHYSICS_ENGINE.randomPick([2, 3, 5, -1, -4]);
                // y = (x-xv)^2 + yv = x^2 - 2xv*x + xv^2+yv
                const b = -2 * xv;
                const c = xv * xv + yv;
                
                let bText = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
                if (b === 0) bText = "";
                let cText = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
                if (c === 0) cText = "";

                return {
                    question: `抛物线 $y = x^2 ${bText}x ${cText}$ 的对称轴方程为___________；该抛物线的顶点坐标是___________。`,
                    answer: `直线 x = ${xv}；(${xv}, ${yv})`,
                    steps: [
                        `1. 对称轴公式：$x = -\\frac{b}{2a} = -\\frac{${b}}{2 \\times 1} = ${xv}$。对称轴为直线 $x = ${xv}$。`,
                        `2. 将对称轴的横坐标 $x = ${xv}$ 代入抛物线解析式，求顶点纵坐标：`,
                        `   $y = (${xv})^2 ${b>=0?'+':'-'} ${Math.abs(b)} \\times (${xv}) ${c>=0?'+':'-'} ${Math.abs(c)} = ${xv*xv} ${b>=0?'+':'-'} ${Math.abs(b*xv)} ${c>=0?'+':'-'} ${Math.abs(c)} = ${yv}$。`,
                        `   也可以代入公式 $y = \\frac{4ac-b^2}{4a} = \\frac{4 \\times 1 \\times ${c} - (${b})^2}{4} = ${yv}$。`,
                        `3. 因此顶点坐标为 $(${xv}, ${yv})$。`
                    ]
                };
            }
        },

        // ============================== 五、数学：几何与图形 (3个模板) ==============================
        {
            id: "math_inequality_sys_solve",
            category: "eq-func",
            type: "calculation",
            score: 20,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { eq1: "2x - 1 > 3", step1: "2x > 4 \\implies x > 2", eq2: "3x - 5 \\le 7", step2: "3x \\le 12 \\implies x \\le 4", ans: "2 < x \\le 4", key1: "x > 2", key2: "x \\le 4" },
                    { eq1: "x - 3 \\ge 1", step1: "x \\ge 4", eq2: "2x - 1 < 15", step2: "2x < 16 \\implies x < 8", ans: "4 \\le x < 8", key1: "x \\ge 4", key2: "x < 8" },
                    { eq1: "3x + 2 > -4", step1: "3x > -6 \\implies x > -2", eq2: "x - 1 \\le 2", step2: "x \\le 3", ans: "-2 < x \\le 3", key1: "x > -2", key2: "x \\le 3" },
                    { eq1: "2x + 5 \\ge 1", step1: "2x \\ge -4 \\implies x \\ge -2", eq2: "3x - 2 < 10", step2: "3x < 12 \\implies x < 3", ans: "-2 \\le x < 3", key1: "x \\ge -2", key2: "x < 3" },
                    { eq1: "x + 2 > 5", step1: "x > 3", eq2: "4x - 3 \\le 17", step2: "4x \\le 20 \\implies x \\le 5", ans: "3 < x \\le 5", key1: "x > 3", key2: "x \\le 5" },
                    { eq1: "3x - 1 \\ge 8", step1: "3x \\ge 9 \\implies x \\ge 3", eq2: "2x + 3 < 17", step2: "2x < 14 \\implies x < 7", ans: "3 \\le x < 7", key1: "x \\ge 3", key2: "x < 7" },
                    { eq1: "5x - 2 > 8", step1: "5x > 10 \\implies x > 2", eq2: "x + 4 \\le 9", step2: "x \\le 5", ans: "2 < x \\le 5", key1: "x > 2", key2: "x \\le 5" },
                    { eq1: "x - 1 \\ge -3", step1: "x \\ge -2", eq2: "3x + 1 < 7", step2: "3x < 6 \\implies x < 2", ans: "-2 \\le x < 2", key1: "x \\ge -2", key2: "x < 2" }
                ]);
                return {
                    question: `解不等式组：$\\begin{cases} ${combo.eq1} \\quad \\text{①} \\\\ ${combo.eq2} \\quad \\text{②} \\end{cases}$。`,
                    answer: `${combo.ans}`,
                    steps: [
                        `解不等式 ① 得：$${combo.step1}$；`,
                        `解不等式 ② 得：$${combo.step2}$；`,
                        `在数轴上表示两个不等式的解集并求其公共部分（利用口诀“大小小大中间找”）：`,
                        `因此，原不等式组的解集为：<strong>$${combo.ans}$</strong>。`
                    ]
                };
            }
        },
        {
            id: "math_pythagoras_c",
            category: "geom",
            type: "calculation",
            score: 20,
            generator() {
                // 已知直角边求斜边
                const triple = PHYSICS_ENGINE.randomPick([
                    [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17],
                    [9, 12, 15], [12, 16, 20], [15, 20, 25], [7, 24, 25],
                    [10, 24, 26], [20, 21, 29], [12, 35, 37], [9, 40, 41],
                    [11, 60, 61], [13, 84, 85]
                ]);
                const a = triple[0];
                const b = triple[1];
                const c = triple[2];
                return {
                    question: `在直角三角形 $ABC$ 中，$\\angle C = 90^\\circ$。已知两条直角边分别为 $a = ${a}$ 和 $b = ${b}$。求斜边 $c$ 的长度。`,
                    answer: `${c}`,
                    steps: [
                        `1. 在直角三角形中，已知两直角边，根据勾股定理可求斜边：$a^2 + b^2 = c^2$。`,
                        `2. 代入直角边数值 $a = ${a}$，$b = ${b}$：`,
                        `   $c = \\sqrt{a^2 + b^2} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a*a} + ${b*b}} = \\sqrt{${a*a+b*b}} = ${c}$。`,
                        `**答：** 斜边 $c$ 的长度是 $${c}$。`
                    ]
                };
            }
        },
        {
            id: "math_pythagoras_a",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                // 已知斜边求直角边
                const triple = PHYSICS_ENGINE.randomPick([
                    [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17],
                    [9, 12, 15], [12, 16, 20], [15, 20, 25], [7, 24, 25],
                    [10, 24, 26], [20, 21, 29], [12, 35, 37], [9, 40, 41],
                    [11, 60, 61], [13, 84, 85]
                ]);
                const a = triple[0];
                const b = triple[1];
                const c = triple[2];
                return {
                    question: `在直角三角形中，斜边长度为 $${c}$，其中一条直角边长度为 $${b}$。则另一条直角边长度为___________。`,
                    answer: `${a}`,
                    steps: [
                        `1. 根据直角三角形勾股定理公式 $a^2 + b^2 = c^2$，变形求直角边：`,
                        `   $a = \\sqrt{c^2 - b^2}$。`,
                        `2. 代入已知数据 $c = ${c}$，$b = ${b}$：`,
                        `   $a = \\sqrt{${c}^2 - ${b}^2} = \\sqrt{${c*c} - ${b*b}} = \\sqrt{${c*c-b*b}} = ${a}$。`
                    ]
                };
            }
        },
        {
            id: "math_sector_area",
            category: "geom",
            type: "calculation",
            score: 20,
            generator() {
                // 扇形面积
                const R = PHYSICS_ENGINE.randomPick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
                const n = PHYSICS_ENGINE.randomPick([30, 45, 60, 90, 120, 135, 150, 180, 240, 270, 300]);
                const piCoef = (n * R * R) / 360;
                const ans = piCoef * Math.PI;
                return {
                    question: `已知扇形的圆心角为 $${n}^\\circ$，半径为 $${R}\\text{ cm}$。求这个扇形的面积是多少 $\\text{cm}^2$？（结果保留 $\\pi$）`,
                    answer: `${piCoef.toFixed(2).replace(/\.?0+$/, '')}π`,
                    steps: [
                        `1. 已知圆心角度数 $n = ${n}^\\circ$，半径 $R = ${R}\\text{ cm}$。`,
                        `2. 根据扇形面积公式 $S = \\frac{n \\pi R^2}{360}$ 展开代入：`,
                        `   $S = \\frac{${n} \\times \\pi \\times ${R}^2}{360} = \\frac{${n} \\times ${R*R} \\pi}{360} = \\frac{${n*R*R}\\pi}{360} = ${piCoef.toFixed(2).replace(/\.?0+$/, '')}\\pi$。`,
                        `**答：** 扇形的面积是 $${piCoef.toFixed(2).replace(/\.?0+$/, '')}\\pi\\text{ cm}^2$。`
                    ]
                };
            }
        },

        // ============================== 六、数学：概率与统计 (1个模板) ==============================
        {
            id: "math_rhombus_area",
            category: "geom",
            type: "calculation",
            score: 10,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { d1: 6, d2: 8, half1: 3, half2: 4, side: 5, area: 24, circum: 20 },
                    { d1: 10, d2: 24, half1: 5, half2: 12, side: 13, area: 120, circum: 52 },
                    { d1: 12, d2: 16, half1: 6, half2: 8, side: 10, area: 96, circum: 40 },
                    { d1: 16, d2: 30, half1: 8, half2: 15, side: 17, area: 240, circum: 68 }
                ]);
                return {
                    question: `已知菱形 $ABCD$ 的两条对角线 $AC$ 和 $BD$ 的长度分别为 $${combo.d1}\text{ cm}$ 和 $${combo.d2}\text{ cm}$。求：（1）该菱形的面积；（2）该菱形的周长。`,
                    answer: `面积为 ${combo.area} cm²，周长为 ${combo.circum} cm`,
                    steps: [
                        `**(1) 计算菱形的面积**：`,
                        `   根据对角线求面积公式：$S = \\frac{1}{2} AC \\times BD = \\frac{1}{2} \\times ${combo.d1} \\times ${combo.d2} = ${combo.area}\\text{ cm}^2$。`,
                        `**(2) 计算菱形的周长**：`,
                        `   菱形的对角线互相垂直且平分。设对角线交点为 $O$。`,
                        `   则对角线的一半分别为：$OA = \\frac{1}{2} AC = ${combo.half1}\\text{ cm}$，$OB = \\frac{1}{2} BD = ${combo.half2}\\text{ cm}$。`,
                        `   在直角三角形 $AOB$ 中，根据勾股定理求边长 $AB$：`,
                        `   $AB = \\sqrt{OA^2 + OB^2} = \\sqrt{${combo.half1}^2 + ${combo.half2}^2} = \\sqrt{${combo.half1*combo.half1} + ${combo.half2*combo.half2}} = \\sqrt{${combo.half1*combo.half1 + combo.half2*combo.half2}} = ${combo.side}\\text{ cm}$。`,
                        `   菱形四条边相等，因此周长为：$C = 4 \\times AB = 4 \\times ${combo.side}\\text{ cm} = ${combo.circum}\\text{ cm}$。`
                    ]
                };
            }
        },
        {
            id: "math_trapezoid_pythagoras",
            category: "geom",
            type: "calculation",
            score: 10,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { a: 5, b: 8, diff: 3, h: 4, c: 5 },
                    { a: 7, b: 12, diff: 5, h: 12, c: 13 },
                    { a: 4, b: 10, diff: 6, h: 8, c: 10 },
                    { a: 8, b: 23, diff: 15, h: 8, c: 17 }
                ]);
                return {
                    question: `如图，在直角梯形 $ABCD$ 中，$AD \\parallel BC$，$\\angle B = 90^\\circ$。已知上底 $AD = ${combo.a}$，下底 $BC = ${combo.b}$，高 $AB = ${combo.h}$。求非直角腰 $CD$ 的长度。`,
                    answer: `${combo.c}`,
                    steps: [
                        `1. **过点 $D$ 作高线**：过点 $D$ 作 $DE \\perp BC$ 于点 $E$。`,
                        `2. **利用矩形性质求段长**：`,
                        `   因为 $AD \\parallel BC$，$\\angle B = 90^\\circ$，且 $DE \\perp BC$。`,
                        `   所以四边形 $ABED$ 是矩形。可得：`,
                        `   $BE = AD = ${combo.a}$；$DE = AB = ${combo.h}$。`,
                        `3. **求三角形底边长**：`,
                        `   $EC = BC - BE = ${combo.b} - ${combo.a} = ${combo.diff}$。`,
                        `4. **勾股定理求斜边**：`,
                        `   在直角三角形 $DEC$ 中，$\\angle DEC = 90^\\circ$：`,
                        `   $CD = \\sqrt{DE^2 + EC^2} = \\sqrt{${combo.h}^2 + ${combo.diff}^2} = \\sqrt{${combo.h*combo.h} + ${combo.diff*combo.diff}} = \\sqrt{${combo.h*combo.h + combo.diff*combo.diff}} = ${combo.c}$。`
                    ]
                };
            }
        },
        {
            id: "math_stat_variance",
            category: "stat-prob",
            type: "calculation",
            score: 20,
            generator() {
                // 平均数与方差计算
                const dataset = PHYSICS_ENGINE.randomPick([
                    { data: [2, 4, 6, 8, 10], mean: 6, var: 8 },
                    { data: [1, 3, 5, 7, 9], mean: 5, var: 8 },
                    { data: [3, 4, 5, 6, 7], mean: 5, var: 2 },
                    { data: [4, 5, 6, 7, 8], mean: 6, var: 2 },
                    { data: [5, 5, 5, 5, 5], mean: 5, var: 0 },
                    { data: [6, 7, 8, 9, 10], mean: 8, var: 2 },
                    { data: [1, 2, 5, 8, 9], mean: 5, var: 10 },
                    { data: [2, 3, 6, 9, 10], mean: 6, var: 10 },
                    { data: [3, 4, 7, 10, 11], mean: 7, var: 10 },
                    { data: [4, 5, 8, 11, 12], mean: 8, var: 10 },
                    { data: [0, 2, 4, 6, 8], mean: 4, var: 8 },
                    { data: [2, 4, 5, 6, 8], mean: 5, var: 4 },
                    { data: [3, 5, 6, 7, 9], mean: 6, var: 4 },
                    { data: [4, 6, 7, 8, 10], mean: 7, var: 4 },
                    { data: [5, 7, 8, 9, 11], mean: 8, var: 4 },
                    { data: [1, 2, 3, 4, 5], mean: 3, var: 2 },
                    { data: [2, 3, 4, 5, 6], mean: 4, var: 2 },
                    { data: [7, 8, 9, 10, 11], mean: 9, var: 2 },
                    { data: [8, 9, 10, 11, 12], mean: 10, var: 2 },
                    { data: [0, 5, 10, 15, 20], mean: 10, var: 50 },
                    { data: [1, 6, 11, 16, 21], mean: 11, var: 50 },
                    { data: [1, 5, 7, 9, 13], mean: 7, var: 16 },
                    { data: [2, 6, 8, 10, 14], mean: 8, var: 16 },
                    { data: [3, 7, 9, 11, 15], mean: 9, var: 16 },
                    { data: [0, 4, 6, 8, 12], mean: 6, var: 16 }
                ]);
                const str = dataset.data.join("，");
                const n = dataset.data.length;
                const mean = dataset.mean;
                const v = dataset.var;

                const diffSqStr = dataset.data.map(x => `(${x} - ${mean})^2`).join(" + ");
                const diffValStr = dataset.data.map(x => `(${x-mean})^2`).join(" + ");
                const sqSum = dataset.data.map(x => (x-mean)*(x-mean)).join(" + ");
                const sqSumVal = dataset.data.map(x => (x-mean)*(x-mean)).reduce((a,b)=>a+b, 0);

                return {
                    question: `已知一组数据为：$${str}$。求：（1）这组数据的平均数是多少？（2）这组数据的方差是多少？`,
                    answer: `(1) 平均数是 ${mean}；(2) 方差是 ${v}`,
                    steps: [
                        `**(1) 计算这组数据的平均数：**`,
                        `数据的个数 $n = ${n}$。`,
                        `平均数：$\\bar{x} = \\frac{${dataset.data.join(" + ")}}{${n}} = \\frac{${dataset.data.reduce((a,b)=>a+b,0)}}{${n}} = ${mean}$。`,
                        `**(2) 计算这组数据的方差：**`,
                        `根据方差公式 $s^2 = \\frac{1}{n} \\left[ (x_1 - \\bar{x})^2 + \\dots + (x_n - \\bar{x})^2 \\right]$：`,
                        `$s^2 = \\frac{1}{${n}} \\left[ ${diffSqStr} \\right]$`,
                        `$s^2 = \\frac{1}{${n}} \\left[ ${diffValStr} \\right]$`,
                        `$s^2 = \\frac{1}{${n}} \\left[ ${sqSum} \\right]$`,
                        `$s^2 = \\frac{1}{${n}} \\times ${sqSumVal} = ${v}$。`,
                        `**答：** 这组数据的平均数是 $${mean}$，方差是 $${v}$。`
                    ]
                };
            }
        },
        // ============================== 八、光学透镜成像定性规律模板 (3个追加) ==============================
        {
            id: "optics_lens_rule_match",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                const f = PHYSICS_ENGINE.randomPick([8, 10, 12, 15, 20]);
                const cases = [
                    { u_factor: 2.5, result: `倒立；缩小；实；照相机`, desc: `物距大于二倍焦距 ($u > 2f$)`, type: "缩小实像", app: "照相机" },
                    { u_factor: 1.5, result: `倒立；放大；实；投影仪`, desc: `物距在一倍到二倍焦距之间 ($f < u < 2f$)`, type: "放大实像", app: "投影仪" },
                    { u_factor: 0.6, result: `正立；放大；虚；放大镜`, desc: `物距小于一倍焦距 ($u < f$)`, type: "放大虚像", app: "放大镜" }
                ];
                const c = PHYSICS_ENGINE.randomPick(cases);
                const u = Math.round(c.u_factor * f * 10) / 10;
                return {
                    question: `在探究“凸透镜成像规律”的实验中，凸透镜的焦距为 $${f}\\text{ cm}$。若将点燃的蜡烛放在距离该凸透镜 $${u}\\text{ cm}$ 处。移动光屏，在另一侧的光屏上（或透过透镜直接观察）可以得到一个___________、___________的___________像，在生活中的典型应用是___________。`,
                    answer: `${c.result}（u = ${u}cm，f = ${f}cm）`,
                    steps: [
                        `1. **确定已知条件**：焦距 $f = ${f}\\text{ cm}$，二倍焦距 $2f = ${2*f}\\text{ cm}$。蜡烛物距 $u = ${u}\\text{ cm}$。`,
                        `2. **判定成像位置**：由于 $u = ${u}\\text{ cm}$ 满足条件 ${c.desc}。`,
                        `3. **推导成像规律**：`,
                        `   - 当 ${c.desc} 时，成**${c.type}**。实像可被光屏承接，且都是倒立的；虚像不能被光屏承接，且是正立 of 的；`,
                        `   - 该规律在生活中的典型应用是**${c.app}**。`,
                        `**答：** 依次填入：${c.result.split("；").join("、")}。`
                    ]
                };
            }
        },
        {
            id: "optics_lens_range_reverse",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                const f = PHYSICS_ENGINE.randomPick([8, 10, 12, 15, 20]);
                const cases = [
                    { type: "倒立、缩小", ans: `u > ${2*f}cm；${f}cm < v < ${2*f}cm`, uRange: `u > 2f`, vRange: `f < v < 2f` },
                    { type: "倒立、放大", ans: `${f}cm < u < ${2*f}cm；v > ${2*f}cm`, uRange: `f < u < 2f`, vRange: `v > 2f` }
                ];
                const c = PHYSICS_ENGINE.randomPick(cases);
                return {
                    question: `已知某凸透镜的焦距为 $${f}\\text{ cm}$。实验时在光屏上得到了一个清晰、${c.type}的实像。由此可知，此时蜡烛到凸透镜的物距 $u$ 的取值范围是___________，光屏到凸透镜的像距 $v$ 的取值范围是___________。`,
                    answer: c.ans,
                    steps: [
                        `1. **成像性质分析**：光屏上得到了一个清晰、${c.type}的实像。`,
                        `2. **物距与像距反推**：根据凸透镜成像规律：`,
                        `   - 当成${c.type}的实像时，物距必须满足 $${c.uRange}$，即对应的物距范围为 $${c.ans.split("；")[0]}$；`,
                        `   - 与之对应的像距必须满足 $${c.vRange}$，即像距范围为 $${c.ans.split("；")[1]}$。`
                    ]
                };
            }
        },
        {
            id: "optics_lens_dynamic_trend",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                const f = PHYSICS_ENGINE.randomPick([10, 12, 15]);
                const dir = PHYSICS_ENGINE.randomPick(["closer", "further"]);
                
                let action, targetPos, targetSize;
                if (dir === "closer") {
                    action = "靠近（物距减小，但蜡烛依然在焦点以外）";
                    targetPos = "远离";
                    targetSize = "变大";
                } else {
                    action = "远离（物距增大）";
                    targetPos = "靠近";
                    targetSize = "变小";
                }
                
                return {
                    question: `在探究凸透镜成像实验中，在焦距为 $${f}\\text{ cm}$ 的凸透镜另一侧光屏上得到了蜡烛清晰的像。若将蜡烛向${action}移动，为了能在光屏上再次得到清晰的像，光屏应向___________凸透镜的方向移动（选填“靠近”或“远离”），此时光屏上所成的像将___________（选填“变大”、“变小”或“不变”）。`,
                    answer: `${targetPos}；${targetSize}（f = ${f}cm，向凸透镜${dir === "closer" ? "靠近" : "远离"}）`,
                    steps: [
                        `1. **中考核心变化规律**：对于凸透镜成实像，遵循“物近像远像变大，物远像近像变小”的动态变化规律。`,
                        `2. **过程推导**：`,
                        `   - 当蜡烛向${dir === "closer" ? "靠近" : "远离"}透镜移动时，物距减小（或增大），像距必须增大（或减小），因此光屏必须**${targetPos}**凸透镜移动。`,
                        `   - 随着像距的增大（或减小），所成像的尺寸将相应地**${targetSize}**。`
                    ]
                };
            }
        },
        {
            id: "optics_light_speed_unit",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                const target = PHYSICS_ENGINE.randomPick([
                    { name: "月球", t: 1.28, dist_sci: "3.84 \\times 10^5", dist_val: 384000 },
                    { name: "太阳", t: 500, dist_sci: "1.5 \\times 10^8", dist_val: 150000000 },
                    { name: "火星", t: 180, dist_sci: "5.4 \\times 10^7", dist_val: 54000000 },
                    { name: "木星", t: 2000, dist_sci: "6.0 \\times 10^8", dist_val: 600000000 },
                    { name: "土星", t: 4000, dist_sci: "1.2 \\times 10^9", dist_val: 1200000000 },
                    { name: "金星", t: 135, dist_sci: "4.05 \\times 10^7", dist_val: 40500000 },
                    { name: "水星", t: 270, dist_sci: "8.1 \\times 10^7", dist_val: 81000000 },
                    { name: "天王星", t: 9000, dist_sci: "2.7 \\times 10^9", dist_val: 2700000000 },
                    { name: "海王星", t: 15000, dist_sci: "4.5 \\times 10^9", dist_val: 4500000000 },
                    { name: "同步通信卫星", t: 0.12, dist_sci: "3.6 \\times 10^4", dist_val: 36000 }
                ]);
                return {
                    question: `光在真空中传播速度为 $3.0 \\times 10^8\\text{ m/s}$，合___________ $\\text{km/s}$。若光从${target.name}传到地球大约需要 $${target.t}\\text{ s}$，则该天体到地球的距离约为___________ $\\text{km}$（结果用科学记数法表示）。`,
                    answer: `3.0 \\times 10^5；${target.dist_sci}`,
                    steps: [
                        `1. **真空中的光速单位换算：**`,
                        `   $c = 3.0 \\times 10^8\\text{ m/s} = \\frac{3.0 \\times 10^8}{1000}\\text{ km/s} = 3.0 \\times 10^5\\text{ km/s}$。`,
                        `2. **计算${target.name}到地球的距离：**`,
                        `   已知传播时间 $t = ${target.t}\\text{ s}$，光速 $c = 3.0 \\times 10^5\\text{ km/s}$。`,
                        `   根据路程公式：$s = ct = 3.0 \\times 10^5\\text{ km/s} \\times ${target.t}\\text{ s} = ${target.dist_val}\\text{ km}$。`,
                        `3. **科学记数法表示**：将 $${target.dist_val}$ 转换为 $${target.dist_sci}\\text{ km}$。`
                    ]
                };
            }
        },
        {
            id: "sound_wave_formula_trans",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                const lam = PHYSICS_ENGINE.randomPick([10, 15, 20, 25, 30, 50, 60, 100, 150, 300]);
                const c = 3.0e8; // 电磁波速
                const freq_hz = c / lam;
                const freq_mhz = freq_hz / 1e6;
                return {
                    question: `波速公式为 $v = \\lambda f$。已知某一电磁波在真空中的传播速度为 $3.0 \\times 10^8\\text{ m/s}$，波长为 $\\lambda = ${lam}\\text{ m}$，求频率的变形公式是 $f = $___________；代入计算所得该波的频率为___________ $\\text{MHz}$。`,
                    answer: `\\frac{v}{\\lambda}；${freq_mhz}`,
                    steps: [
                        `1. **公式变形**：根据波速公式 $v = \\lambda f$，等式两边同除以波长 $\\lambda$，即可求得频率公式：$f = \\frac{v}{\\lambda}$。`,
                        `2. **代入数据计算**：$f = \\frac{3.0 \\times 10^8\\text{ m/s}}{${lam}\\text{ m}} = ${freq_hz}\\text{ Hz}$。`,
                        `3. **单位换算为兆赫兹 (MHz)**：因为 $1\\text{ MHz} = 10^6\\text{ Hz}$，所以 $f = \\frac{${freq_hz}\\text{ Hz}}{10^6} = ${freq_mhz}\\text{ MHz}$。`
                    ]
                };
            }
        },
        {
            id: "sound_speed_temp_trans",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                const s = PHYSICS_ENGINE.randomPick([100, 150, 200, 250, 300, 400, 500, 600, 800]);
                const env = PHYSICS_ENGINE.randomPick([
                    { temp: 0, v: 331 },
                    { temp: 5, v: 334 },
                    { temp: 15, v: 340 },
                    { temp: 20, v: 343 },
                    { temp: 25, v: 346 },
                    { temp: 30, v: 349 },
                    { temp: 35, v: 352 }
                ]);
                const L = PHYSICS_ENGINE.randomPick([100, 200, 400]);
                const error_t = (L / env.v).toFixed(2);
                return {
                    question: `声音在 $${env.temp}\\text{ ℃}$ 空气中的传播速度为 $${env.v}\\text{ m/s}$。若人对着悬崖大喊，听到回声的时间为 $t$，求声源到悬崖单向距离的变形公式为 $s = $___________。在 $${env.temp}\\text{ ℃}$ 时进行 $${L}\\text{ m}$ 赛跑，若计时员听到枪声才计时，他少记的成绩（时间误差）为___________ $\\text{s}$（保留两位小数）。`,
                    answer: `\\frac{1}{2}vt；${error_t}（距离 ${L}m，声速 ${env.v}m/s）`,
                    steps: [
                        `1. **回声定位距离公式推导**：`,
                        `   声音从发出到听到回声经过了双倍的距离：$2s = vt$，因而求声源到悬崖单向距离公式为：$s = \\frac{1}{2}vt$（或 $\\frac{vt}{2}$）。`,
                        `2. **赛跑计时误差计算**：`,
                        `   听到枪声才计时，声音传播 $${L}\\text{ m}$ 消耗的时间即为计时误差。`,
                        `   根据时间公式 $t = \\frac{s}{v}$，代入计算：$t = \\frac{${L}\\text{ m}}{${env.v}\\text{ m/s}} \\approx ${error_t}\\text{ s}$。`
                    ]
                };
            }
        },
        {
            id: "acoustics_frequency_unit",
            category: "acoustics-optics",
            type: "fill",
            score: 10,
            generator() {
                const raw_khz = PHYSICS_ENGINE.randomPick([30, 40, 50, 60, 80, 100, 120]);
                const raw_hz = raw_khz * 1000;
                const upper_hz = PHYSICS_ENGINE.randomPick([18000, 20000, 22000]);
                const upper_khz = upper_hz / 1000;
                return {
                    question: `人耳能听到的声音频率范围是 $20\\text{ Hz}$ 到 $${upper_hz}\\text{ Hz}$。其中人耳听觉上限频率 $${upper_hz}\\text{ Hz}$ 合___________ $\\text{kHz}$。某蝙蝠发出的超声波频率为 $${raw_khz}\\text{ kHz}$，合___________ $\\text{Hz}$。`,
                    answer: `${upper_khz}；${raw_hz}`,
                    steps: [
                        `1. **物理频率进率**：$1\\text{ kHz} = 1000\\text{ Hz}$。`,
                        `2. **单位换算**：`,
                        `   - 上限频率换算：$${upper_hz}\\text{ Hz} = \\frac{${upper_hz}}{1000}\\text{ kHz} = ${upper_khz}\\text{ kHz}$。`,
                        `   - 超声波频率换算：$${raw_khz}\\text{ kHz} = ${raw_khz} \\times 1000\\text{ Hz} = ${raw_hz}\\text{ Hz}$。`
                    ]
                };
            }
        },
        // ------------------------------ 2. 力学模块 (5个) ------------------------------
        {
            id: "mech_speed_unit_convert",
            category: "mechanics",
            type: "fill",
            score: 10,
            generator() {
                const ms = PHYSICS_ENGINE.randomPick([10, 15, 20, 25]);
                const kmh = ms * 3.6;
                const kmh_input = PHYSICS_ENGINE.randomPick([36, 54, 72, 90, 108]);
                const ms_output = (kmh_input / 3.6).toFixed(0);
                return {
                    question: `速度单位双向换算：$${ms}\\text{ m/s} = $___________ $\\text{km/h}$；$${kmh_input}\\text{ km/h} = $___________ $\\text{m/s}$。`,
                    answer: `${kmh}；${ms_output}`,
                    steps: [
                        `1. **从 m/s 换算为 km/h（乘以 3.6）：**`,
                        `   $${ms}\\text{ m/s} = ${ms} \\times 3.6\\text{ km/h} = ${kmh}\\text{ km/h}$。`,
                        `2. **从 km/h 换算为 m/s（除以 3.6）：**`,
                        `   $${kmh_input}\\text{ km/h} = \\frac{${kmh_input}}{3.6}\\text{ m/s} = ${ms_output}\\text{ m/s}$。`
                    ]
                };
            }
        },
        {
            id: "mech_density_unit_convert",
            category: "mechanics",
            type: "fill",
            score: 10,
            generator() {
                const metals = [
                    { name: "铝", gcm3: 2.7, kgm3: 2700 },
                    { name: "铁", gcm3: 7.9, kgm3: 7900 },
                    { name: "铜", gcm3: 8.9, kgm3: 8900 },
                    { name: "金", gcm3: 19.3, kgm3: 19300 },
                    { name: "银", gcm3: 10.5, kgm3: 10500 },
                    { name: "铅", gcm3: 11.3, kgm3: 11300 },
                    { name: "钢", gcm3: 7.9, kgm3: 7900 },
                    { name: "冰", gcm3: 0.9, kgm3: 900 },
                    { name: "酒精", gcm3: 0.8, kgm3: 800 },
                    { name: "煤油", gcm3: 0.8, kgm3: 800 },
                    { name: "水银", gcm3: 13.6, kgm3: 13600 }
                ];
                const metal = PHYSICS_ENGINE.randomPick(metals);
                return {
                    question: `水的密度为 $1.0 \\times 10^3\\text{ kg/m}^3$，合___________ $\\text{g/cm}^3$；实心${metal.name}块的密度为 $${metal.gcm3}\\text{ g/cm}^3$，合___________ $\\text{kg/m}^3$。`,
                    answer: `1；${metal.kgm3}`,
                    steps: [
                        `1. **密度单位换算进率：** $1\\text{ g/cm}^3 = 1.0 \\times 10^3\\text{ kg/m}^3$。`,
                        `2. **水的密度换算：**`,
                        `   $1.0 \\times 10^3\\text{ kg/m}^3 = 1\\text{ g/cm}^3$。`,
                        `3. **金属${metal.name}的密度换算：**`,
                        `   $${metal.gcm3}\\text{ g/cm}^3 = ${metal.gcm3} \\times 10^3\\text{ kg/m}^3 = ${metal.kgm3}\\text{ kg/m}^3$。`
                    ]
                };
            }
        },
        {
            id: "mech_volume_unit_convert",
            category: "mechanics",
            type: "fill",
            score: 10,
            generator() {
                const dm3 = PHYSICS_ENGINE.randomPick([5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150]);
                const m3 = (dm3 / 1000).toFixed(3).replace(/\.?0+$/, "");
                const cm3 = dm3 * 1000;
                const cm2 = PHYSICS_ENGINE.randomPick([10, 20, 30, 50, 80, 100, 120, 150, 200, 240, 250, 300, 400]);
                const m2 = (cm2 / 10000).toFixed(4).replace(/\.?0+$/, "");
                return {
                    question: `单位体积与面积换算：$${dm3}\\text{ dm}^3 = $___________ $\\text{m}^3 = $___________ $\\text{cm}^3$。物体与桌面的受力面积为 $${cm2}\\text{ cm}^2 = $___________ $\\text{m}^2$。`,
                    answer: `${m3}；${cm3}；${m2}`,
                    steps: [
                        `1. **体积单位换算：** $1\\text{ m}^3 = 1000\\text{ dm}^3 = 10^6\\text{ cm}^3$。`,
                        `   $${dm3}\\text{ dm}^3 = \\frac{${dm3}}{1000}\\text{ m}^3 = ${m3}\\text{ m}^3$。`,
                        `   $${dm3}\\text{ dm}^3 = ${dm3} \\times 1000\\text{ cm}^3 = ${cm3}\\text{ cm}^3$。`,
                        `2. **面积单位换算：** $1\\text{ m}^2 = 10000\\text{ cm}^2$。`,
                        `   $${cm2}\\text{ cm}^2 = \\frac{${cm2}}{10000}\\text{ m}^2 = ${m2}\\text{ m}^2$。`
                    ]
                };
            }
        },
        {
            id: "mech_formula_trans_density",
            category: "mechanics",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `公式基本变形：已知密度公式 $\\rho = \\frac{m}{V}$，其求质量的变形公式为 $m = $___________，求体积的变形公式为 $V = $___________；已知重力公式 $G = mg$，若已知物体的重力 $G$，求质量的变形公式为 $m = $___________。`,
                    answer: `\\rho V；\\frac{m}{\\rho}；\\frac{G}{g}`,
                    steps: [
                        `1. **密度公式变形：**`,
                        `   由 $\\rho = \\frac{m}{V}$ 等式两边同乘以 $V$，得求质量公式: $m = \\rho V$。`,
                        `   等式两边同乘以 $V$ 再同除以 $\\rho$，得求体积公式: $V = \\frac{m}{\\rho}$。`,
                        `2. **重力公式变形：**`,
                        `   由 $G = mg$ 两边同除以重力常数 $g$，得求质量公式: $m = \\frac{G}{g}$。`
                    ]
                };
            }
        },
        {
            id: "mech_formula_trans_pressure",
            category: "mechanics",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `公式变形强化：已知压强公式 $p = \\frac{F}{S}$，则求物体所受垂直压力变形公式为 $F = $___________；已知液体压强公式 $p = \\rho g h$，求物体在液体中深度的变形公式为 $h = $___________；已知阿基米德浮力公式 $F_{浮} = \\rho_{液} g V_{排}$，求排开液体体积的变形公式为 $V_{排} = $___________。`,
                    answer: `pS；\\frac{p}{\\rho g}；\\frac{F_{浮}}{\\rho_{液} g}`,
                    steps: [
                        `1. **压强公式变形：** $p = \\frac{F}{S} \\implies F = pS$。`,
                        `2. **液体压强公式变形：** $p = \\rho g h \\implies h = \\frac{p}{\\rho g}$。`,
                        `3. **阿基米德原理变形：** $F_{浮} = \rho_{液} g V_{排} \implies V_{排} = \frac{F_{浮}}{\rho_{液} g}$。`
                    ]
                };
            }
        },
        {
            id: "mech_torricelli_calc",
            category: "mechanics",
            type: "fill",
            score: 10,
            generator() {
                const h_mm = PHYSICS_ENGINE.randomPick([740, 750, 755, 760, 765, 770, 775]);
                const rho = 13600; // 水银密度 13.6 × 10³ kg/m³
                const g = 10;
                const P0 = rho * g * (h_mm / 1000);
                return {
                    question: `托里拆利实验测大气压：在实验中，玻璃管内水银柱的高度为 $${h_mm}\text{ mm}$。已知水银的密度为 $13.6 \times 10^3\text{ kg/m}^3$，$g$ 取 $10\text{ N/kg}$，则此时产生压强的大气压强值为___________ $\text{Pa}$。`,
                    answer: `${P0}`,
                    steps: [
                        `1. **统一单位**：水银柱高度 $h = ${h_mm}\text{ mm} = ${h_mm / 1000}\text{ m}$。`,
                        `2. **应用公式计算大气压强**：`,
                        `   根据托里拆利实验原理，大气压强等于水银柱产生的压强。`,
                        `   $P_0 = \\rho_{水银} g h = 13.6 \times 10^3\\text{ kg/m}^3 \\times 10\\text{ N/kg} \\times ${h_mm / 1000}\\text{ m} = ${P0}\\text{ Pa}$。`
                    ]
                };
            }
        },
        {
            id: "math_poly_angles_calc",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                const isForward = PHYSICS_ENGINE.randomPick([true, false]);
                const n = PHYSICS_ENGINE.randomPick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30]);
                const name = { 5: "五", 6: "六", 8: "八", 9: "九", 10: "十", 12: "十二", 15: "十五", 18: "十八", 20: "二十", 24: "二十四", 30: "三十" }[n];
                const sum_in = (n - 2) * 180;
                const angle_in = sum_in / n;
                if (isForward) {
                    return {
                        question: `多边形内角和应用：凸 $${n}$ 边形的内角和为___________$^\\circ$；若一个正多边形为正 $${name}$ 边形，则它的每个内角的度数为___________$^\\circ$。`,
                        answer: `${sum_in}；${angle_in.toFixed(1).replace(/\.0$/, '')}`,
                        steps: [
                            `1. **内角和计算**：`,
                            `   代入多边形内角和公式：$S_{内} = (n - 2) \\times 180^\\circ$。`,
                            `   已知边数 $n = ${n}$：$S_{内} = (${n} - 2) \\times 180^\\circ = ${n-2} \\times 180^\\circ = ${sum_in}^\\circ$。`,
                            `2. **正多边形单个内角计算**：`,
                            `   每个内角的度数：$A_{内} = \\frac{S_{内}}{n} = \\frac{${sum_in}^\\circ}{${n}} = ${angle_in.toFixed(1).replace(/\.0$/, '')}^\\circ$。`
                        ]
                    };
                } else {
                    return {
                        question: `多边形内角和逆用：若一个凸多边形的内角和为 $${sum_in}^\\circ$，则这个多边形的边数为___________；若一个正多边形的每个内角均为 $${angle_in.toFixed(1).replace(/\.0$/, '')}^\\circ$，则它是正___________边形。`,
                        answer: `${n}；${name}`,
                        steps: [
                            `1. **根据内角和逆解边数**：`,
                            `   根据多边形内角和公式：$S_{内} = (n - 2) \\times 180^\\circ$。`,
                            `   已知 $S_{内} = ${sum_in}^\\circ$，代入公式：$(n - 2) \\times 180 = ${sum_in} \\implies n - 2 = ${sum_in / 180} \\implies n = ${n}$。`,
                            `2. **根据单个内角逆解正多边形边数**：`,
                            `   正多边形的每个内角为 $${angle_in.toFixed(1).replace(/\.0$/, '')}^\\circ$。`,
                            `   则每个外角的度数为：$180^\\circ - ${angle_in.toFixed(1).replace(/\.0$/, '')}^\\circ = ${(180 - angle_in).toFixed(1).replace(/\.0$/, '')}^\\circ$。`,
                            `   因为多边形外角和为 $360^\\circ$，所以边数 $n = \\frac{360}{(180 - ${angle_in.toFixed(1).replace(/\.0$/, '')})} = ${n}$。`,
                            `   所以它是正 $${name}$ 边形。`
                        ]
                    };
                }
            }
        },
        {
            id: "math_poly_ext_angles",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                const isForward = PHYSICS_ENGINE.randomPick([true, false]);
                if (isForward) {
                    const angle_out = PHYSICS_ENGINE.randomPick([15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120]);
                    const n = 360 / angle_out;
                    const sum_in = (n - 2) * 180;
                    return {
                        question: `多边形外角和经典考题：若一个正多边形的每个外角都等于 $${angle_out}^\\circ$，则这个正多边形的边数 $n = $___________；该正多边形的内角和为___________$^\\circ$。`,
                        answer: `${n}；${sum_in}`,
                        steps: [
                            `1. **根据外角和逆解边数**：`,
                            `   因为多边形的外角和恒等于 $360^\\circ$，且该正多边形的每个外角都相等。`,
                            `   所以边数 $n = \\frac{360^\\circ}{A_{外}} = \\frac{360^\\circ}{${angle_out}^\\circ} = ${n}$（其为正 $${n}$ 边形）。`,
                            `2. **内角和计算**：`,
                            `   代入内角和公式：$S_{内} = (n - 2) \\times 180^\\circ = (${n} - 2) \\times 180^\\circ = ${n-2} \\times 180^\\circ = ${sum_in}^\\circ$。`
                        ]
                    };
                } else {
                    const combo = PHYSICS_ENGINE.randomPick([
                        { k: 1, x: 90, n: 4 },
                        { k: 2, x: 60, n: 6 },
                        { k: 3, x: 45, n: 8 },
                        { k: 4, x: 36, n: 10 },
                        { k: 5, x: 30, n: 12 },
                        { k: 9, x: 18, n: 20 },
                        { k: 11, x: 15, n: 24 },
                        { k: 14, x: 12, n: 30 }
                    ]);
                    const sum_in = (combo.n - 2) * 180;
                    const name = { 4: "四", 6: "六", 8: "八", 10: "十", 12: "十二", 20: "二十", 24: "二十四", 30: "三十" }[combo.n];
                    return {
                        question: `正多边形内角与外角倍数问题：若一个正多边形的每个内角是其相邻外角的 $${combo.k}$ 倍，则这个正多边形的边数 $n = $___________；它是正___________边形，其内角和为___________$^\\circ$。`,
                        answer: `${combo.n}；${name}；${sum_in}（倍数 ${combo.k}）`,
                        steps: [
                            `1. **列出角度关系方程**：`,
                            `   设该正多边形的每个外角为 $x^\\circ$，则每个内角为 $${combo.k}x^\\circ$。`,
                            `   因为内角与相邻外角互补（和为 $180^\\circ$），所以：$x + ${combo.k}x = 180 \\implies ${(combo.k+1)}x = 180$。`,
                            `   解得外角 $x = ${combo.x}^\\circ$。`,
                            `2. **计算边数**：`,
                            `   正多边形外角和为 $360^\\circ$，因此边数 $n = \\frac{360}{${combo.x}} = ${combo.n}$，即它是正 $${name}$ 边形。`,
                            `3. **计算内角和**：`,
                            `   $S_{内} = (n - 2) \\times 180^\\circ = (${combo.n} - 2) \\times 180^\\circ = ${sum_in}^\\circ$。`
                        ]
                    };
                }
            }
        },
        {
            id: "math_similarity_ratio",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                const ratios = PHYSICS_ENGINE.randomPick([
                    { kNum: 2, kDen: 3, sNum: 4, sDen: 9 },
                    { kNum: 3, kDen: 4, sNum: 9, sDen: 16 },
                    { kNum: 4, kDen: 5, sNum: 16, sDen: 25 },
                    { kNum: 1, kDen: 2, sNum: 1, sDen: 4 },
                    { kNum: 2, kDen: 5, sNum: 4, sDen: 25 },
                    { kNum: 1, kDen: 3, sNum: 1, sDen: 9 },
                    { kNum: 1, kDen: 4, sNum: 1, sDen: 16 },
                    { kNum: 1, kDen: 5, sNum: 1, sDen: 25 },
                    { kNum: 3, kDen: 5, sNum: 9, sDen: 25 },
                    { kNum: 3, kDen: 7, sNum: 9, sDen: 49 },
                    { kNum: 4, kDen: 7, sNum: 16, sDen: 49 },
                    { kNum: 5, kDen: 6, sNum: 25, sDen: 36 },
                    { kNum: 5, kDen: 7, sNum: 25, sDen: 49 },
                    { kNum: 5, kDen: 8, sNum: 25, sDen: 64 },
                    { kNum: 6, kDen: 7, sNum: 36, sDen: 49 },
                    { kNum: 7, kDen: 8, sNum: 49, sDen: 64 },
                    { kNum: 7, kDen: 9, sNum: 49, sDen: 81 },
                    { kNum: 8, kDen: 9, sNum: 64, sDen: 81 },
                    { kNum: 2, kDen: 7, sNum: 4, sDen: 49 },
                    { kNum: 3, kDen: 8, sNum: 9, sDen: 64 }
                ]);
                return {
                    question: `已知 $\\triangle ABC \\sim \\triangle A'B'C'$，它们的相似比（对应边长比）为 $${ratios.kNum} : ${ratios.kDen}$，则它们的周长之比为___________；若已知两个相似三角形的面积之比为 $${ratios.sNum} : ${ratios.sDen}$，则它们的对应高之比为___________。`,
                    answer: `${ratios.kNum}:${ratios.kDen}；${ratios.kNum}:${ratios.kDen}（相似比为 ${ratios.kNum}:${ratios.kDen}）`,
                    steps: [
                        `1. **相似三角形周长比的性质**：`,
                        `   相似三角形的周长比等于相似比。因此周长比为 $${ratios.kNum} : ${ratios.kDen}$。`,
                        `2. **相似三角形高之比与面积比的性质**：`,
                        `   相似三角形的面积比等于相似比的平方。因此，相似比等于面积比的算术平方根。`,
                        `   已知面积比为 $\\frac{S}{S'} = \\frac{${ratios.sNum}}{${ratios.sDen}}$，故相似比 $k = \\sqrt{\\frac{${ratios.sNum}}{${ratios.sDen}}} = \\frac{${ratios.kNum}}{${ratios.kDen}}$。`,
                        `   因为相似三角形对应高之比也等于相似比，所以对应高之比为 $${ratios.kNum} : ${ratios.kDen}$。`
                    ]
                };
            }
        },
        {
            id: "math_similarity_apply",
            category: "geom",
            type: "calculation",
            score: 20,
            generator() {
                const peopleHeight = 1.6;
                const peopleShadow = PHYSICS_ENGINE.randomPick([2.0, 2.4, 2.5, 3.2]);
                const treeShadow = PHYSICS_ENGINE.randomPick([10, 12, 15, 20]);
                const treeHeight = (peopleHeight * treeShadow) / peopleShadow;
                return {
                    question: `相似实际应用：在同一时刻，身高 $${peopleHeight}\\text{ m}$ 的小明测得他在阳光下的影长为 $${peopleShadow}\\text{ m}$。若此时测得一棵大树在阳光下的影长为 $${treeShadow}\\text{ m}$，求这棵大树的高度是多少米？`,
                    answer: `${treeHeight.toFixed(1).replace(/\.0$/, '')} m`,
                    steps: [
                        `1. **抽象相似三角形数学模型**：`,
                        `   设大树高度为 $H\\text{ m}$。同一时刻，人高、人影长与树高、树影长分别构成两个相似直角三角形。`,
                        `2. **建立相似比例关系式**：`,
                        `   根据相似三角形对应边成比例：$\\frac{\\text{人高}}{\\text{人影长}} = \\frac{\\text{树高}}{\\text{树影长}}$。`,
                        `   即：$\\frac{${peopleHeight}}{${peopleShadow}} = \\frac{H}{${treeShadow}}$。`,
                        `3. **求解大树高度**：`,
                        `   $H = \\frac{${peopleHeight} \\times ${treeShadow}}{${peopleShadow}} = ${treeHeight.toFixed(2).replace(/\.?0+$/, '')}\\text{ m}$。`,
                        `**答：** 这棵大树的高度是 $${treeHeight.toFixed(1).replace(/\.0$/, '')}\\text{ m}$。`
                    ]
                };
            }
        },
        {
            id: "math_unit_convert_vol",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                const m3 = PHYSICS_ENGINE.randomPick([0.5, 0.8, 1.2, 1.5, 1.8, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 8, 10]);
                const dm3 = m3 * 1000;
                const l = dm3;
                const ml = PHYSICS_ENGINE.randomPick([200, 300, 400, 500, 600, 750, 800, 900, 1200, 1500, 2000, 2500, 3000, 4000, 5000]);
                const cm3 = ml;
                const l_out = (ml / 1000).toFixed(2).replace(/\.?0+$/, '');
                return {
                    question: `体积与容积换算：正方体水箱体积为 $${m3}\\text{ m}^3 = $___________ $\\text{dm}^3 = $___________ $\\text{L}$；一个水杯的容积为 $${ml}\\text{ mL} = $___________ $\\text{cm}^3 = $___________ $\\text{L}$。`,
                    answer: `${dm3}；${l}；${cm3}；${l_out}`,
                    steps: [
                        `1. **体积与容积换算关系：** $1\\text{ m}^3 = 1000\\text{ dm}^3$，$1\\text{ dm}^3 = 1\\text{ L} = 1000\\text{ mL}$，$1\\text{ mL} = 1\\text{ cm}^3$。`,
                        `2. **水箱换算：**`,
                        `   $${m3}\\text{ m}^3 = ${m3} \\times 1000\\text{ dm}^3 = ${dm3}\\text{ dm}^3 = ${l}\\text{ L}$。`,
                        `3. **水杯换算：**`,
                        `   $${ml}\\text{ mL} = ${cm3}\\text{ cm}^3$。`,
                        `   $${ml}\\text{ mL} = \\frac{${ml}}{1000}\\text{ L} = ${l_out}\\text{ L}$。`
                    ]
                };
            }
        },
        {
            id: "therm_formula_trans",
            category: "thermodynamics",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `热学公式与单位：比热容吸热公式为 $Q_{吸} = cm\\Delta t$，其求物体比热容的变形公式是 $c = $___________；燃料完全燃烧放热公式 $Q_{放} = mq$，若已知燃料完全燃烧放出的热量与热值，其求质量的变形公式为 $m = $___________。水吸收了 $4.2 \\times 10^5\\text{ J}$ 的热量，合___________ $\\text{kJ}$。`,
                    answer: `\\frac{Q_{吸}}{m\\Delta t}；\\frac{Q_{放}}{q}；420`,
                    steps: [
                        `1. **吸热公式变形：** $Q_{吸} = cm\\Delta t \\implies c = \\frac{Q_{吸}}{m\\Delta t}$。`,
                        `2. **完全燃烧公式变形：** $Q_{放} = mq \\implies m = \\frac{Q_{放}}{q}$。`,
                        `3. **热量单位换算：** $1\\text{ kJ} = 1000\\text{ J}$。`,
                        `   $4.2 \\times 10^5\\text{ J} = 420000\\text{ J} = \\frac{420000}{1000}\\text{ kJ} = 420\\text{ kJ}$。`
                    ]
                };
            }
        },
        // ------------------------------ 5. 数学：数与式 (3个) ------------------------------
        {
            id: "math_formula_trans_perfect_sq",
            category: "num-exp",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `完全平方公式基本变形：已知两数和与积，其求两数的平方和公式为 $a^2 + b^2 = (a+b)^2 - $___________；已知两数差与积，其求平方和变形公式为 $a^2 + b^2 = (a-b)^2 + $___________。`,
                    answer: `2ab；2ab`,
                    steps: [
                        `1. **和的完全平方展开：** $(a+b)^2 = a^2 + 2ab + b^2 \\implies a^2+b^2 = (a+b)^2 - 2ab$。`,
                        `2. **差的完全平方展开：** $(a-b)^2 = a^2 - 2ab + b^2 \\implies a^2+b^2 = (a-b)^2 + 2ab$。`
                    ]
                };
            }
        },
        {
            id: "math_formula_trans_perfect_sq_two",
            category: "num-exp",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `代数恒等变形：已知和与差，求两数乘积 $ab$ 的变形表达式为 $ab = \\frac{(a+b)^2 - (a-b)^2}{}$___________；平方差的乘法公式为 $(a+b)(a-b) = $___________。`,
                    answer: `4；a^2 - b^2`,
                    steps: [
                        `1. **求解积的恒等式：**`,
                        `   展开：$(a+b)^2 - (a-b)^2 = (a^2+2ab+b^2) - (a^2-2ab+b^2) = 4ab$。`,
                        `   移项除以 4，得: $ab = \\frac{(a+b)^2 - (a-b)^2}{4}$。`,
                        `2. **平方差公式：** $(a+b)(a-b) = a^2 - b^2$。`
                    ]
                };
            }
        },
        {
            id: "math_sq_diff_simp_calc",
            category: "num-exp",
            type: "fill",
            score: 10,
            generator() {
                const base = PHYSICS_ENGINE.randomPick([50, 100, 200, 1000]);
                const diff = PHYSICS_ENGINE.randomPick([1, 2, 3, 5]);
                const num1 = base + diff;
                const num2 = base - diff;
                const ans = num1 * num2;
                return {
                    question: `利用平方差公式进行简便乘法计算：$${num1} \\times ${num2} = $___________。`,
                    answer: `${ans}`,
                    steps: [
                        `1. 观察数字特点，可将乘积变形为平方差公式的标准形式：`,
                        `   $${num1} \\times ${num2} = (${base} + ${diff})(${base} - ${diff})$。`,
                        `2. 应用平方差公式 $(a+b)(a-b) = a^2 - b^2$：`,
                        `   $(${base} + ${diff})(${base} - ${diff}) = ${base}^2 - ${diff}^2$。`,
                        `3. 计算得出最终结果：`,
                        `   $${base}^2 - ${diff}^2 = ${base * base} - ${diff * diff} = ${ans}$。`
                    ]
                };
            }
        },
        {
            id: "math_sq_diff_algebra_calc",
            category: "num-exp",
            type: "fill",
            score: 10,
            generator() {
                const x_y_sum = PHYSICS_ENGINE.randomPick([6, 8, 10, 12, 16]);
                const x_y_diff = PHYSICS_ENGINE.randomPick([2, 4, 6]);
                const sq_diff = x_y_sum * x_y_diff;
                const coef = PHYSICS_ENGINE.randomPick([2, 3, 5]);
                const ans = coef * x_y_sum;
                return {
                    question: `若实数 $x, y$ 满足关系式 $x - y = ${x_y_diff}$，且平方差 $x^2 - y^2 = ${sq_diff}$，则代数式 $${coef}(x + y)$ 的值为___________。`,
                    answer: `${ans}`,
                    steps: [
                        `1. 根据平方差公式的乘法恒等变形：$x^2 - y^2 = (x + y)(x - y)$。`,
                        `2. 将已知数值 $x - y = ${x_y_diff}$ 且 $x^2 - y^2 = ${sq_diff}$ 代入公式中：`,
                        `   $${sq_diff} = (x + y) \\times ${x_y_diff}$。`,
                        `3. 解方程求得两数之和：$x + y = \\frac{${sq_diff}}{${x_y_diff}} = ${x_y_sum}$。`,
                        `4. 乘上系数求代数式的值：$${coef}(x + y) = ${coef} \\times ${x_y_sum} = ${ans}$。`
                    ]
                };
            }
        },
        {
            id: "math_sq_diff_expand",
            category: "num-exp",
            type: "fill",
            score: 10,
            generator() {
                const coefA = PHYSICS_ENGINE.randomPick([2, 3, 4, 5]);
                const coefB = PHYSICS_ENGINE.randomPick([1, 2, 3, 5]);
                const termA = `${coefA}x`;
                const termB = coefB === 1 ? "y" : `${coefB}y`;
                const ans_str = `${coefA * coefA}x^2 - ${coefB * coefB}y^2`;
                const ans_str_no_space = `${coefA * coefA}x^2-${coefB * coefB}y^2`;
                return {
                    question: `利用平方差公式展开整式乘积（请使用小写字母表示，不含空格，如 4x^2-9y^2）：$( ${termA} + ${termB} )( ${termA} - ${termB} ) = $___________。`,
                    answer: `${ans_str_no_space}`,
                    steps: [
                        `1. 观察已知多项式乘积：$( ${termA} + ${termB} )( ${termA} - ${termB} )$，其符合平方差公式的形式。`,
                        `2. 识别公式对应的项：$a = ${termA}$， $b = ${termB}$。`,
                        `3. 代入平方差展开公式 $(a+b)(a-b) = a^2 - b^2$：`,
                        `   $( ${termA} + ${termB} )( ${termA} - ${termB} ) = (${termA})^2 - (${termB})^2$。`,
                        `4. 分别计算平方项并合并：$(${termA})^2 = ${coefA * coefA}x^2$，$(${termB})^2 = ${coefB * coefB}y^2$。`,
                        `   最终展开式为：$${ans_str}$。`
                    ]
                };
            }
        },
        {
            id: "math_unit_convert_area",
            category: "num-exp",
            type: "fill",
            score: 10,
            generator() {
                const hc = PHYSICS_ENGINE.randomPick([0.5, 0.8, 1.2]);
                const m2 = hc * 10000;
                const dm = PHYSICS_ENGINE.randomPick([2, 4, 6]);
                const cm = dm * 10;
                const cm2 = PHYSICS_ENGINE.randomPick([150, 200, 300]);
                const dm2 = (cm2 / 100).toFixed(2).replace(/\.?0+$/, "");
                return {
                    question: `几何与长度换算：中考体育测试某操场占地面积为 $${hc}\\text{ 公顷} = $___________ $\\text{m}^2$；数学作图题中，线段长度 $${dm}\\text{ dm} = $___________ $\\text{cm}$，图形面积 $${cm2}\\text{ cm}^2 = $___________ $\\text{dm}^2$。`,
                    answer: `${m2}；${cm}；${dm2}`,
                    steps: [
                        `1. **公顷与平方米换算（$1\\text{ 公顷} = 10000\\text{ m}^2$）：**`,
                        `   $${hc}\\text{ 公顷} = ${hc} \\times 10000\\text{ m}^2 = ${m2}\\text{ m}^2$。`,
                        `2. **长度换算（$1\\text{ dm} = 10\\text{ cm}$）：**`,
                        `   $${dm}\\text{ dm} = ${dm} \\times 10\\text{ cm} = ${cm}\\text{ cm}$。`,
                        `3. **平方分米与平方厘米换算（$1\\text{ dm}^2 = 100\\text{ cm}^2$）：**`,
                        `   $${cm2}\\text{ cm}^2 = \\frac{${cm2}}{100}\\text{ dm}^2 = ${dm2}\\text{ dm}^2$。`
                    ]
                };
            }
        },
        // ------------------------------ 6. 数学：方程与函数 (3个) ------------------------------
        {
            id: "math_formula_trans_quadratic",
            category: "eq-func",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `方程求根公式：一元二次方程 $ax^2 + bx + c = 0\\ (a \\neq 0)$ 的根的判别式为 $\\Delta = $___________。当 $\\Delta \\ge 0$ 时，该一元二次方程的求根公式为 $x = $___________。`,
                    answer: `b^2 - 4ac；\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}`,
                    steps: [
                        `1. **根的判别式：** 一元二次方程根的判别式为 $\\Delta = b^2 - 4ac$。`,
                        `2. **求根公式：** 当 $\\Delta \\ge 0$ 时，方程有实数解，根据求根公式得: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$。`
                    ]
                };
            }
        },
        {
            id: "math_formula_trans_linear_prop",
            category: "eq-func",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `一次函数性质：一次函数 $y = kx + b$ 的图象经过第一、二、四象限。则一次项系数的范围是 $k$___________ $0$，常数项的范围是 $b$___________ $0$（选填“$>$”或“$<$”）。`,
                    answer: `<；>`,
                    steps: [
                        `1. **分析斜率 $k$ 的符号：** 图象向右下方倾斜，函数值随自变量的增大而减小，因此 $k < 0$。`,
                        `2. **分析截距 $b$ 的符号：** 图象与 y 轴的正半轴相交，即 $x=0$ 时 $y=b > 0$，因此常数项 $b > 0$。`
                    ]
                };
            }
        },
        {
            id: "math_formula_trans_vertex",
            category: "eq-func",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `二次函数顶点公式：二次函数一般式为 $y = ax^2 + bx + c\\ (a \\neq 0)$，其图象的对称轴方程是直线 $x = $___________；其顶点坐标的纵坐标变形表达式为 $y_{顶} = $___________。`,
                    answer: `-\\frac{b}{2a}；\\frac{4ac-b^2}{4a}`,
                    steps: [
                        `1. **二次函数对称轴方程：** 经过顶点且垂直于 x 轴的直线，方程为 $x = -\\frac{b}{2a}$。`,
                        `2. **顶点纵坐标公式：** 对称轴横坐标代入一般式或进行配方得到: $y_{顶} = \\frac{4ac - b^2}{4a}$。`
                    ]
                };
            }
        },
        // ------------------------------ 7. 数学：几何与图形 (3个) ------------------------------
        {
            id: "math_formula_trans_pythagoras",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `直角三角形勾股定理：在直角三角形 $ABC$ 中，$\\angle C = 90^\\circ$，斜边为 $c$，直角边为 $a, b$。已知斜边 $c$ 与直角边 $b$，求另一条直角边 $a$ 的变形公式为 $a = $___________；若直角边 $a = 5$（原题为a，这里随机生成），若直角边 $b = 12$，斜边 $c = 13$，则直角边 $a = $___________。`,
                    answer: `\\sqrt{c^2 - b^2}；5`,
                    steps: [
                        `1. **勾股定理公式变形：**`,
                        `   根据勾股定理 $a^2 + b^2 = c^2$。`,
                        `   移项: $a^2 = c^2 - b^2$。两边开平方: $a = \\sqrt{c^2 - b^2}$。`,
                        `2. **代入数据求值：**`,
                        `   $a = \\sqrt{13^2 - 12^2} = \\sqrt{169 - 144} = \\sqrt{25} = 5$。`
                    ]
                };
            }
        },
        {
            id: "math_formula_trans_sector",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `扇形公式变形：已知扇形面积公式为 $S = \\frac{n\\pi R^2}{360}$，若已知面积 $S$ 和半径 $R$，求圆心角 $n$ 的变形公式为 $n = $___________；已知扇形弧长公式为 $l = \\frac{n\\pi R}{180}$，求半径 $R$ 的变形公式为 $R = $___________。`,
                    answer: `\\frac{360S}{\\pi R^2}；\\frac{180l}{n\\pi}`,
                    steps: [
                        `1. **求圆心角变形公式：**`,
                        `   由 $S = \\frac{n\\pi R^2}{360}$ 等式两边同乘以 360，再同除以 $\\pi R^2$，得: $n = \\frac{360S}{\\pi R^2}$。`,
                        `2. **求半径变形公式：**`,
                        `   由 $l = \\frac{n\\pi R}{180}$ 两边同乘以 180，再同除以 $n\\pi$，得: $R = \\frac{180l}{n\\pi}$。`
                    ]
                };
            }
        },
        {
            id: "math_poly_angles_calc",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                const n = PHYSICS_ENGINE.randomPick([5, 6, 8, 10, 12]);
                const name = { 5: "五", 6: "六", 8: "八", 10: "十", 12: "十二" }[n];
                const sum_in = (n - 2) * 180;
                const angle_in = sum_in / n;
                return {
                    question: `多边形内角和应用：凸 $${n}$ 边形的内角和为___________$^\\circ$；若一个正多边形为正 $${name}$ 边形，则它的每个内角的度数为___________$^\\circ$。`,
                    answer: `${sum_in}；${angle_in.toFixed(1).replace(/\.0$/, '')}`,
                    steps: [
                        `1. **内角和计算**：`,
                        `   代入多边形内角和公式：$S_{内} = (n - 2) \\times 180^\\circ$。`,
                        `   已知边数 $n = ${n}$：$S_{内} = (${n} - 2) \\times 180^\\circ = ${n-2} \\times 180^\\circ = ${sum_in}^\\circ$。`,
                        `2. **正多边形单个内角计算**：`,
                        `   每个内角的度数：$A_{内} = \\frac{S_{内}}{n} = \\frac{${sum_in}^\\circ}{${n}} = ${angle_in.toFixed(1).replace(/\.0$/, '')}^\\circ$。`
                    ]
                };
            }
        },
        {
            id: "math_poly_ext_angles",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                const angle_out = PHYSICS_ENGINE.randomPick([30, 36, 40, 45, 60]);
                const n = 360 / angle_out;
                const sum_in = (n - 2) * 180;
                return {
                    question: `多边形外角和经典考题：若一个正多边形的每个外角都等于 $${angle_out}^\\circ$，则这个正多边形的边数 $n = $___________；该正多边形的内角和为___________$^\\circ$。`,
                    answer: `${n}；${sum_in}`,
                    steps: [
                        `1. **根据外角和逆解边数**：`,
                        `   因为多边形的外角和恒等于 $360^\\circ$，且该正多边形的每个外角都相等。`,
                        `   所以边数 $n = \\frac{360^\\circ}{A_{外}} = \\frac{360^\\circ}{${angle_out}^\\circ} = ${n}$（其为正 $${n}$ 边形）。`,
                        `2. **内角和计算**：`,
                        `   代入内角和公式：$S_{内} = (n - 2) \\times 180^\\circ = (${n} - 2) \\times 180^\\circ = ${n-2} \\times 180^\\circ = ${sum_in}^\\circ$。`
                    ]
                };
            }
        },
        {
            id: "math_similarity_ratio",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                const ratios = PHYSICS_ENGINE.randomPick([
                    { kNum: 2, kDen: 3, sNum: 4, sDen: 9 },
                    { kNum: 3, kDen: 4, sNum: 9, sDen: 16 },
                    { kNum: 4, kDen: 5, sNum: 16, sDen: 25 },
                    { kNum: 1, kDen: 2, sNum: 1, sDen: 4 },
                    { kNum: 2, kDen: 5, sNum: 4, sDen: 25 }
                ]);
                return {
                    question: `已知 $\\triangle ABC \\sim \\triangle A'B'C'$，它们的相似比（对应边长比）为 $${ratios.kNum} : ${ratios.kDen}$，则它们的周长之比为___________；若已知两个相似三角形的面积之比为 $${ratios.sNum} : ${ratios.sDen}$，则它们的对应高之比为___________。`,
                    answer: `${ratios.kNum}:${ratios.kDen}；${ratios.kNum}:${ratios.kDen}`,
                    steps: [
                        `1. **相似三角形周长比的性质**：`,
                        `   相似三角形的周长比等于相似比。因此周长比为 $${ratios.kNum} : ${ratios.kDen}$。`,
                        `2. **相似三角形高之比与面积比的性质**：`,
                        `   相似三角形的面积比等于相似比的平方。因此，相似比等于面积比的算术平方根。`,
                        `   已知面积比为 $\\frac{S}{S'} = \\frac{${ratios.sNum}}{${ratios.sDen}}$，故相似比 $k = \\sqrt{\\frac{${ratios.sNum}}{${ratios.sDen}}} = \\frac{${ratios.kNum}}{${ratios.kDen}}$。`,
                        `   因为相似三角形对应高之比也等于相似比，所以对应高之比为 $${ratios.kNum} : ${ratios.kDen}$。`
                    ]
                };
            }
        },
        {
            id: "math_similarity_apply",
            category: "geom",
            type: "calculation",
            score: 20,
            generator() {
                const peopleHeight = 1.6;
                const peopleShadow = PHYSICS_ENGINE.randomPick([2.0, 2.4, 2.5, 3.2]);
                const treeShadow = PHYSICS_ENGINE.randomPick([10, 12, 15, 20]);
                const treeHeight = (peopleHeight * treeShadow) / peopleShadow;
                return {
                    question: `相似实际应用：在同一时刻，身高 $${peopleHeight}\\text{ m}$ 的小明测得他在阳光下的影长为 $${peopleShadow}\\text{ m}$。若此时测得一棵大树在阳光下的影长为 $${treeShadow}\\text{ m}$，求这棵大树的高度是多少米？`,
                    answer: `${treeHeight.toFixed(1).replace(/\.0$/, '')} m`,
                    steps: [
                        `1. **抽象相似三角形数学模型**：`,
                        `   设大树高度为 $H\\text{ m}$。同一时刻，人高、人影长与树高、树影长分别构成两个相似直角三角形。`,
                        `2. **建立相似比例关系式**：`,
                        `   根据相似三角形对应边成比例：$\\frac{\\text{人高}}{\\text{人影长}} = \\frac{\\text{树高}}{\\text{树影长}}$。`,
                        `   即：$\\frac{${peopleHeight}}{${peopleShadow}} = \\frac{H}{${treeShadow}}$。`,
                        `3. **求解大树高度**：`,
                        `   $H = \\frac{${peopleHeight} \\times ${treeShadow}}{${peopleShadow}} = ${treeHeight.toFixed(2).replace(/\.?0+$/, '')}\\text{ m}$。`,
                        `**答：** 这棵大树的高度是 $${treeHeight.toFixed(1).replace(/\.0$/, '')}\\text{ m}$。`
                    ]
                };
            }
        },
        {
            id: "math_unit_convert_vol",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                const m3 = PHYSICS_ENGINE.randomPick([1.2, 1.5, 2]);
                const dm3 = m3 * 1000;
                const l = dm3;
                const ml = PHYSICS_ENGINE.randomPick([500, 600, 800]);
                const cm3 = ml;
                const l_out = (ml / 1000).toFixed(1);
                return {
                    question: `体积与容积换算：正方体水箱体积为 $${m3}\\text{ m}^3 = $___________ $\\text{dm}^3 = $___________ $\\text{L}$；一个水杯的容积为 $${ml}\\text{ mL} = $___________ $\\text{cm}^3 = $___________ $\\text{L}$。`,
                    answer: `${dm3}；${l}；${cm3}；${l_out}`,
                    steps: [
                        `1. **体积与容积换算关系：** $1\\text{ m}^3 = 1000\\text{ dm}^3$，$1\\text{ dm}^3 = 1\\text{ L} = 1000\\text{ mL}$，$1\\text{ mL} = 1\\text{ cm}^3$。`,
                        `2. **水箱换算：**`,
                        `   $${m3}\\text{ m}^3 = ${m3} \\times 1000\\text{ dm}^3 = ${dm3}\\text{ dm}^3 = ${l}\\text{ L}$。`,
                        `3. **水杯换算：**`,
                        `   $${ml}\\text{ mL} = ${cm3}\\text{ cm}^3$。`,
                        `   $${ml}\\text{ mL} = \\frac{${ml}}{1000}\\text{ L} = ${l_out}\\text{ L}$。`
                    ]
                };
            }
        },
        // ------------------------------ 8. 数学：概率与统计 (2个) ------------------------------
        {
            id: "math_formula_trans_variance",
            category: "stat-prob",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `方差定义与波动：已知一组数据 $x_1, x_2, \\dots, x_n$ 的平均数为 $\\bar{x}$，这组数据的方差公式为 $s^2 = $___________；若这组数据的方差为 $2.5$，现将这组数据中的每个数都乘以 $3$ 得到一组新数据，新数据的方差为___________。`,
                    answer: `\\frac{1}{n}[(x_1-\\bar{x})^2+\\dots+(x_n-\\bar{x})^2]；22.5`,
                    steps: [
                        `1. **方差公式：** $s^2 = \\frac{1}{n} \\left[ (x_1 - \\bar{x})^2 + (x_2 - \\bar{x})^2 + \\dots + (x_n - \\bar{x})^2 \\right]$。`,
                        `2. **方差比例缩放规律：**`,
                        `   若数据每个数都乘以 $k$，则新数据的方差变为原方差的 $k^2$ 倍。`,
                        `   原方差 $s^2 = 2.5$，乘以 3，新方差 $s'^2 = 3^2 \\times 2.5 = 9 \\times 2.5 = 22.5$。`
                    ]
                };
            }
        },
        {
            id: "math_formula_trans_mean_prop",
            category: "stat-prob",
            type: "fill",
            score: 10,
            generator() {
                return {
                    question: `数据平移属性：一组数据 $x_1, x_2, \\dots, x_n$ 的平均数为 $\\bar{x}$，极差为 $R$。若将每个数据都加上 $5$ 得到一组新数据，则新数据的平均数是___________；新数据的极差将___________（选填“变大”、“变小”或“不变”）。`,
                    answer: `\\bar{x} + 5；不变`,
                    steps: [
                        `1. **平移对平均数的影响：** 数据中每个数都加上 $a$，平均数也随之加上 $a$。因此新平均数为 $\\bar{x} + 5$。`,
                        `2. **平移对极差的影响：** 数据中每个数都加上相同的常数，最大值与最小值的差值保持不变，因此极差**不变**。`
                    ]
                };
            }
        },
        // ============================== 新增热学经典模板 (4个) ==============================
        {
            id: "therm_stove_efficiency_electric",
            category: "thermodynamics",
            type: "calculation",
            score: 20,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { m: 1, t0: 20, dt: 80, eta: 0.8, P: 1000, t: 420 },
                    { m: 2, t0: 20, dt: 80, eta: 0.8, P: 1400, t: 600 },
                    { m: 2, t0: 10, dt: 90, eta: 0.9, P: 1400, t: 600 },
                    { m: 1.5, t0: 20, dt: 80, eta: 0.8, P: 1050, t: 600 },
                    { m: 2, t0: 30, dt: 70, eta: 0.7, P: 1200, t: 700 }
                ]);
                const c = 4200;
                const Q_abs = c * combo.m * combo.dt;
                const W = Q_abs / combo.eta;
                const eta_pct = Math.round(combo.eta * 100);
                return {
                    question: `用一只标有“220V ${combo.P}W”字样的电热水壶，在额定电压下将质量为 $${combo.m}\\text{ kg}$、初温为 $${combo.t0}\\text{ ℃}$ 的水烧开（未计热量损失，末温为 $100\\text{ ℃}$，当时气压为标准大气压）。已知电热水壶的加热效率为 $${eta_pct}\\%$，水的比热容为 $4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$。求：（1）水吸收的热量是多少 J？（2）电热水壶烧开这壶水需要消耗的电能是多少 J？（3）烧开这壶水需要多少秒？`,
                    answer: `(1) 吸热 ${Q_abs.toExponential(2).replace("e+", "\\times 10^")} J；(2) 消耗电能 ${W.toExponential(2).replace("e+", "\\times 10^")} J；(3) 耗时 ${combo.t} s`,
                    steps: [
                        `**(1) 计算水吸收的热量：**`,
                        `已知 $m = ${combo.m}\\text{ kg}$，初温 $t_0 = ${combo.t0}\\text{ ℃}$，末温 $t = 100\\text{ ℃}$。`,
                        `温度升高量：$\\Delta t = 100\\text{ ℃} - ${combo.t0}\\text{ ℃} = ${combo.dt}\\text{ ℃}$。`,
                        `根据吸热公式得：$Q_{吸} = c m \\Delta t = 4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)} \\times ${combo.m}\\text{ kg} \\times ${combo.dt}\\text{ ℃} = ${Q_abs.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `**(2) 计算消耗的总电能：**`,
                        `已知加热效率 $\\eta = ${eta_pct}\\%$。根据 $\\eta = \\frac{Q_{吸}}{W}$ 得，消耗的总电能：`,
                        `$W = \\frac{Q_{吸}}{\\eta} = \\frac{${Q_abs.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}}{${combo.eta}} = ${W.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `**(3) 计算加热时间：**`,
                        `电热水壶在额定电压下工作，实际功率等于额定功率 $P = ${combo.P}\\text{ W}$。`,
                        `根据电功公式 $W = P t$ 得：$t = \\frac{W}{P} = \\frac{${W.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}}{${combo.P}\\text{ W}} = ${combo.t}\\text{ s}$。`,
                        `**答：** 水吸收的热量为 $${Q_abs.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$，电水壶消耗电能为 $${W.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$，烧开水共需要 $${combo.t}\\text{ s}$。`
                    ]
                };
            }
        },
        {
            id: "therm_specific_heat_ratio",
            category: "thermodynamics",
            type: "fill",
            score: 10,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { m1: 2, m2: 1, c1: 1, c2: 3, ans1: "3:2", ans2: "2:3" },
                    { m1: 1, m2: 2, c1: 2, c2: 1, ans1: "1:1", ans2: "1:1" },
                    { m1: 3, m2: 2, c1: 4, c2: 3, ans1: "1:2", ans2: "2:1" },
                    { m1: 1, m2: 3, c1: 2, c2: 5, ans1: "15:2", ans2: "2:15" },
                    { m1: 2, m2: 3, c1: 3, c2: 4, ans1: "2:1", ans2: "1:2" }
                ]);
                return {
                    question: `比热容与温度变化比例：甲、乙两物体的质量之比为 $m_1 : m_2 = ${combo.m1} : ${combo.m2}$，比热容之比为 $c_1 : c_2 = ${combo.c1} : ${combo.c2}$。若它们吸收了相同的热量，则它们升高的温度之比 $\\Delta t_1 : \\Delta t_2$ 为___________；若它们升高的温度相同，则它们吸收的热量之比 $Q_1 : Q_2$ 为___________。`,
                    answer: `${combo.ans1}；${combo.ans2}`,
                    steps: [
                        `1. **根据吸热公式** $Q = cm\\Delta t$ 得，升温变化量为：$\\Delta t = \\frac{Q}{cm}$。`,
                        `2. 当吸收热量相同时（即 $Q_1 = Q_2$）：`,
                        `   $\\frac{\\Delta t_1}{\\Delta t_2} = \\frac{c_2 m_2}{c_1 m_1} = \\frac{c_2}{c_1} \\times \\frac{m_2}{m_1} = \\frac{${combo.c2}}{${combo.c1}} \\times \\frac{${combo.m2}}{${combo.m1}} = ${combo.ans1}$。`,
                        `3. 当升高温度相同时（即 $\\Delta t_1 = \\Delta t_2$）：`,
                        `   $\\frac{Q_1}{Q_2} = \\frac{c_1 m_1 \\Delta t_1}{c_2 m_2 \\Delta t_2} = \\frac{c_1}{c_2} \\times \\frac{m_1}{m_2} = \\frac{${combo.c1}}{${combo.c2}} \\times \\frac{${combo.m1}}{${combo.m2}} = ${combo.ans2}$。`
                    ]
                };
            }
        },
        {
            id: "therm_ice_melting_q",
            category: "thermodynamics",
            type: "fill",
            score: 10,
            generator() {
                const m = PHYSICS_ENGINE.randomPick([0.5, 1, 2, 5]);
                const c_ice = 2100;
                const L_ice = 3.36e5;
                const Q1 = c_ice * m * 10;
                const Q2 = m * L_ice;
                return {
                    question: `冰雪熔化计算：质量为 $${m}\\text{ kg}$ 的冰，温度从 $-10\\text{ ℃}$ 升高到 $0\\text{ ℃}$（未熔化）需要吸收的热量为___________ $\\text{J}$。若这些冰在 $0\\text{ ℃}$ 下完全熔化成水，已知冰的熔化热为 $3.36 \\times 10^5\\text{ J/kg}$，则熔化过程共需吸收热量___________ $\\text{J}$。[已知冰的比热容为 $2.1 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$]`,
                    answer: `${Q1}；${Q2}`,
                    steps: [
                        `1. **计算冰升温吸收的热量：**`,
                        `   已知冰的质量 $m = ${m}\\text{ kg}$，比热容 $c = 2100\\text{ J/(kg}\\cdot\\text{℃)}$，温度升高量 $\\Delta t = 0\\text{ ℃} - (-10\\text{ ℃}) = 10\\text{ ℃}$。`,
                        `   $Q_{吸1} = c_{冰} m \\Delta t = 2100 \\times ${m} \\times 10 = ${Q1}\\text{ J}$。`,
                        `2. **计算冰熔化吸收的热量：**`,
                        `   已知熔化热 $\\lambda = 3.36 \\times 10^5\\text{ J/kg}$。`,
                        `   完全熔化吸收的热量：$Q_{吸2} = m \\lambda = ${m} \\times 3.36 \\times 10^5\\text{ J/kg} = ${Q2}\\text{ J}$。`
                    ]
                };
            }
        },
        {
            id: "therm_gas_burner_co2",
            category: "thermodynamics",
            type: "fill",
            score: 10,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { V: 0.07, m: 8, dt: 50 },
                    { V: 0.07, m: 10, dt: 40 },
                    { V: 0.07, m: 20, dt: 20 },
                    { V: 0.07, m: 40, dt: 10 },
                    { V: 0.14, m: 16, dt: 50 },
                    { V: 0.14, m: 20, dt: 40 },
                    { V: 0.14, m: 40, dt: 20 }
                ]);
                const q = 4.0e7;
                const Q_total = combo.V * q;
                const Q_abs = Q_total * 0.6;
                return {
                    question: `天然气灶烧水计算：某天然气灶完全燃烧 $${combo.V}\\text{ m}^3$ 的天然气，可释放出热量为___________ $\\text{J}$。若这些热量的 $60\\%$ 被水吸收，可使 $${combo.m}\\text{ kg}$ 的水温度升高___________ $\\text{℃}$。[已知天然气热值为 $4.0 \\times 10^7\\text{ J/m}^3$，水的比热容为 $4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$]`,
                    answer: `${Q_total.toExponential(1).replace("e+", "\\times 10^")}；${combo.dt}`,
                    steps: [
                        `1. **计算天然气完全燃烧释放的热量：**`,
                        `   $Q_{放} = V q = ${combo.V}\\text{ m}^3 \\times 4.0 \\times 10^7\\text{ J/m}^3 = ${Q_total.toExponential(1).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `2. **计算水吸收的热量：**`,
                        `   $Q_{吸} = Q_{放} \\times 60\\% = ${Q_total.toExponential(1).replace("e+", "\\times 10^")}\\text{ J} \\times 0.6 = ${Q_abs.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `3. **根据吸热公式求升高的温度：**`,
                        `   $\\Delta t = \\frac{Q_{吸}}{4200 \\times ${combo.m}} = ${combo.dt}\\text{ ℃}$。`
                    ]
                };
            }
        },
        // ============================== 新增方程与函数经典模板 (4个) ==============================
        {
            id: "math_linear_equation_sys",
            category: "eq-func",
            type: "calculation",
            score: 20,
            generator() {
                let x = 0, y = 0;
                let A1 = 0, B1 = 0, A2 = 0, B2 = 0;
                let D = 0;
                while (true) {
                    x = PHYSICS_ENGINE.randomRange(-5, 5);
                    y = PHYSICS_ENGINE.randomRange(-5, 5);
                    A1 = PHYSICS_ENGINE.randomRange(-4, 4);
                    B1 = PHYSICS_ENGINE.randomRange(-4, 4);
                    A2 = PHYSICS_ENGINE.randomRange(-4, 4);
                    B2 = PHYSICS_ENGINE.randomRange(-4, 4);
                    D = A1 * B2 - A2 * B1;
                    if (x !== 0 && y !== 0 && A1 !== 0 && B1 !== 0 && A2 !== 0 && B2 !== 0 && D !== 0) {
                        break;
                    }
                }
                const C1 = A1 * x + B1 * y;
                const C2 = A2 * x + B2 * y;

                const formatTerm = (coef, char) => {
                    if (coef === 1) return `+ ${char}`;
                    if (coef === -1) return `- ${char}`;
                    return coef > 0 ? `+ ${coef}${char}` : `- ${Math.abs(coef)}${char}`;
                };

                const eq1_str = `${A1 === 1 ? "" : A1 === -1 ? "-" : A1}x ${formatTerm(B1, "y")} = ${C1}`;
                const eq2_str = `${A2 === 1 ? "" : A2 === -1 ? "-" : A2}x ${formatTerm(B2, "y")} = ${C2}`;

                return {
                    question: `解二元一次方程组：$\\begin{cases} ${eq1_str} \\\\ ${eq2_str} \\end{cases}$。`,
                    answer: `x = ${x}, y = ${y}`,
                    steps: [
                        `1. 设方程组为：`,
                        `   $\\begin{cases} ${eq1_str} \\quad \\text{①} \\\\ ${eq2_str} \\quad \\text{②} \\end{cases}$`,
                        `2. 采用消元法。将方程 ① 乘以 $${Math.abs(A2)}$，方程 ② 乘以 $${Math.abs(A1)}$，通过加减消去未知数 $x$：`,
                        `   解得：$y = ${y}$。`,
                        `3. 将 $y = ${y}$ 代入方程 ① 求解未知数 $x$：`,
                        `   代入得：$x = ${x}$。`,
                        `**答：** 方程组的解为 $\\begin{cases} x = ${x} \\\\ y = ${y} \\end{cases}$。`
                    ]
                };
            }
        },
        {
            id: "math_fractional_equation",
            category: "eq-func",
            type: "calculation",
            score: 20,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { A: 3, B: 2, p: 1, q: 3, ans: 7 },
                    { A: 2, B: 1, p: -2, q: 2, ans: 6 },
                    { A: 5, B: 3, p: 2, q: 4, ans: 7 },
                    { A: 4, B: 3, p: -1, q: 1, ans: 7 },
                    { A: 3, B: 1, p: 1, q: 5, ans: 7 },
                    { A: 4, B: 2, p: 2, q: 4, ans: 6 },
                    { A: 5, B: 2, p: -1, q: 5, ans: 9 },
                    { A: 3, B: 2, p: -2, q: 1, ans: 7 },
                    { A: 5, B: 1, p: 1, q: 9, ans: 11 },
                    { A: 2, B: 1, p: -3, q: 1, ans: 5 },
                    { A: 6, B: 4, p: 2, q: 5, ans: 11 },
                    { A: 5, B: 3, p: -2, q: 2, ans: 8 },
                    { A: 4, B: 1, p: 2, q: 8, ans: 10 },
                    { A: 3, B: 2, p: -4, q: -1, ans: 5 },
                    { A: 5, B: 2, p: -3, q: 3, ans: 7 }
                ]);
                const p_sign = combo.p > 0 ? `-${combo.p}` : `+${Math.abs(combo.p)}`;
                const q_sign = combo.q > 0 ? `-${combo.q}` : `+${Math.abs(combo.q)}`;
                return {
                    question: `解分式方程：$\\frac{${combo.A}}{x ${p_sign}} = \\frac{${combo.B}}{x ${q_sign}}$。`,
                    answer: `x = ${combo.ans}`,
                    steps: [
                        `1. **去分母**：方程两边同乘以最简公分母 $(x ${p_sign})(x ${q_sign})$，得：`,
                        `   $${combo.A}(x ${q_sign}) = ${combo.B}(x ${p_sign})$。`,
                        `2. **去括号**：展开多项式，得：`,
                        `   $${combo.A}x ${combo.q*combo.A > 0 ? '+' : ''}${ -combo.q*combo.A } = ${combo.B}x ${combo.p*combo.B > 0 ? '+' : ''}${ -combo.p*combo.B }$。`,
                        `3. **移项并合并同类项**：将未知数移到左边，常数移到右边：`,
                        `   $(${combo.A} - ${combo.B})x = ${combo.A*combo.q - combo.B*combo.p}$。`,
                        `   解得：$x = ${combo.ans}$。`,
                        `4. **检验**：将 $x = ${combo.ans}$ 代入最简公分母中：`,
                        `   $(x ${p_sign})(x ${q_sign}) = (${combo.ans} ${p_sign})(${combo.ans} ${q_sign}) = ${combo.ans - combo.p} \\times ${combo.ans - combo.q} = ${(combo.ans - combo.p)*(combo.ans - combo.q)} \\neq 0$。`,
                        `   因为分母不为 0，所以 $x = ${combo.ans}$ 是原分式方程的解。`,
                        `**答：** 原方程的解为 $x = ${combo.ans}$。`
                    ]
                };
            }
        },
        {
            id: "math_linear_func_intersection",
            category: "eq-func",
            type: "calculation",
            score: 20,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { k1: 1, b1: 2, k2: -1, b2: 4, x: 1, y: 3, xa: -2, xb: 4, S: 9 },
                    { k1: 2, b1: -4, k2: -1, b2: 5, x: 3, y: 2, xa: 2, xb: 5, S: 3 },
                    { k1: 1, b1: -1, k2: -2, b2: 8, x: 3, y: 2, xa: 1, xb: 4, S: 3 },
                    { k1: 1, b1: 1, k2: -1, b2: 5, x: 2, y: 3, xa: -1, xb: 5, S: 9 },
                    { k1: 2, b1: -2, k2: -1, b2: 7, x: 3, y: 4, xa: 1, xb: 7, S: 12 },
                    { k1: 3, b1: -6, k2: -2, b2: 9, x: 3, y: 3, xa: 2, xb: 4.5, S: 3.75 },
                    { k1: 1, b1: 3, k2: -1, b2: 7, x: 2, y: 5, xa: -3, xb: 7, S: 25 },
                    { k1: 2, b1: -6, k2: -1, b2: 3, x: 3, y: 0, xa: 3, xb: 3, S: 0 },
                    { k1: 1, b1: -2, k2: -1, b2: 8, x: 5, y: 3, xa: 2, xb: 8, S: 9 },
                    { k1: 1, b1: 4, k2: -2, b2: 10, x: 2, y: 6, xa: -4, xb: 5, S: 27 },
                    { k1: 2, b1: 2, k2: -1, b2: 8, x: 2, y: 6, xa: -1, xb: 8, S: 27 },
                    { k1: 1, b1: -3, k2: -3, b2: 9, x: 3, y: 0, xa: 3, xb: 3, S: 0 }
                ]);
                const b1_sign = combo.b1 >= 0 ? `+ ${combo.b1}` : `- ${Math.abs(combo.b1)}`;
                const b2_sign = combo.b2 >= 0 ? `+ ${combo.b2}` : `- ${Math.abs(combo.b2)}`;
                return {
                    question: `一次函数交点与面积：已知两直线解析式为 $l_1: y = ${combo.k1 === 1 ? "" : combo.k1}x ${b1_sign}$，以及 $l_2: y = ${combo.k2 === -1 ? "-" : combo.k2}x ${b2_sign}$。求：（1）这二条直线的交点坐标 $P$；（2）这两条直线与 $x$ 轴围成的三角形面积。`,
                    answer: `P(${combo.x}, ${combo.y})；面积为 ${combo.S}`,
                    steps: [
                        `**(1) 联立求解交点坐标：**`,
                        `令 $y_1 = y_2$ 联立方程：$${combo.k1 === 1 ? "" : combo.k1}x ${b1_sign} = ${combo.k2 === -1 ? "-" : combo.k2}x ${b2_sign}$。`,
                        `解得：$x = ${combo.x}$。`,
                        `将 $x = ${combo.x}$ 代入 $l_1$ 中求得：$y = ${combo.y}$。`,
                        `因此，交点坐标为 $P(${combo.x}, ${combo.y})$。`,
                        `**(2) 计算直线与 x 轴围成图形面积：**`,
                        `令 $y = 0$，求得 $l_1$ 与 x 轴交点为 $A(${combo.xa}, 0)$；求得 $l_2$ 与 x 轴交点为 $B(${combo.xb}, 0)$。`,
                        `底边 $AB$ 长度为：$|x_B - x_A| = |${combo.xb} - (${combo.xa})| = ${Math.abs(combo.xb - combo.xa)}$。`,
                        `三角形以 $AB$ 为底，高为交点 $P$ 纵坐标的绝对值 $h = |y_P| = ${combo.y}$。`,
                        `代入三角形面积公式得：$S = \\frac{1}{2} \\times \\text{底} \\times \\text{高} = \\frac{1}{2} \\times ${Math.abs(combo.xb - combo.xa)} \\times ${combo.y} = ${combo.S}$。`,
                        `**答：** 两直线交点坐标为 $P(${combo.x}, ${combo.y})$，围成的三角形面积为 $${combo.S}$。`
                    ]
                };
            }
        },
        {
            id: "math_inverse_func",
            category: "eq-func",
            type: "calculation",
            score: 20,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { x0: 2, y0: 6, k: 12, x1: 3, y1: 4 },
                    { x0: 3, y0: 4, k: 12, x1: 4, y1: 3 },
                    { x0: 2, y0: -4, k: -8, x1: 4, y1: -2 },
                    { x0: -2, y0: -5, k: 10, x1: 5, y1: 2 },
                    { x0: 1, y0: 6, k: 6, x1: 2, y1: 3 },
                    { x0: -3, y0: -2, k: 6, x1: 6, y1: 1 },
                    { x0: 2, y0: 8, k: 16, x1: 4, y1: 4 },
                    { x0: 4, y0: 5, k: 20, x1: 5, y1: 4 },
                    { x0: -2, y0: 9, k: -18, x1: 6, y1: -3 },
                    { x0: 3, y0: -8, k: -24, x1: 6, y1: -4 },
                    { x0: 5, y0: 6, k: 30, x1: 10, y1: 3 },
                    { x0: 4, y0: 9, k: 36, x1: 6, y1: 6 },
                    { x0: -4, y0: -8, k: 32, x1: 8, y1: 4 },
                    { x0: 2, y0: -10, k: -20, x1: 5, y1: -4 },
                    { x0: -3, y0: 12, k: -36, x1: 9, y1: -4 }
                ]);
                return {
                    question: `反比例函数待定系数法：已知一个反比例函数 $y = \\frac{k}{x}$ 的图象经过点 $P(${combo.x0}, ${combo.y0})$。求：（1）该反比例函数的解析式；（2）当自变量 $x = ${combo.x1}$ 时，求对应的函数值 $y$。`,
                    answer: `y = \\frac{${combo.k}}{x}；y = ${combo.y1}`,
                    steps: [
                        `**(1) 求解反比例函数解析式：**`,
                        `将点 $P(${combo.x0}, ${combo.y0})$ 代入函数解析式 $y = \\frac{k}{x}$ 中得：`,
                        `$${combo.y0} = \\frac{k}{${combo.x0}} \\implies k = ${combo.x0} \\times ${combo.y0} = ${combo.k}$。`,
                        `所以，该反比例函数的解析式为：$y = \\frac{${combo.k}}{x}$。`,
                        `**(2) 计算特定点函数值：**`,
                        `将 $x = ${combo.x1}$ 代入求得的解析式中：`,
                        `$y = \\frac{${combo.k}}{${combo.x1}} = ${combo.y1}$。`,
                        `**答：** 解析式为 $y = \\frac{${combo.k}}{x}$，当 $x = ${combo.x1}$ 时 $y = ${combo.y1}$。`
                    ]
                };
            }
        },
        // ============================== 新增几何与图形经典模板 (4个) ==============================
        {
            id: "math_trig_values",
            category: "geom",
            type: "calculation",
            score: 20,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { a: 3, b: 4, c: 5, sinA: "3/5", tanA: "3/4" },
                    { a: 6, b: 8, c: 10, sinA: "3/5", tanA: "3/4" },
                    { a: 5, b: 12, c: 13, sinA: "5/13", tanA: "5/12" },
                    { a: 8, b: 15, c: 17, sinA: "8/17", tanA: "8/15" },
                    { a: 9, b: 12, c: 15, sinA: "3/5", tanA: "3/4" },
                    { a: 12, b: 16, c: 20, sinA: "3/5", tanA: "3/4" },
                    { a: 12, b: 5, c: 13, sinA: "12/13", tanA: "12/5" },
                    { a: 15, b: 8, c: 17, sinA: "15/17", tanA: "15/8" },
                    { a: 7, b: 24, c: 25, sinA: "7/25", tanA: "7/24" },
                    { a: 24, b: 7, c: 25, sinA: "24/25", tanA: "24/7" },
                    { a: 20, b: 21, c: 29, sinA: "20/29", tanA: "20/21" },
                    { a: 21, b: 20, c: 29, sinA: "21/29", tanA: "21/20" }
                ]);
                return {
                    question: `直角三角形与锐角三角比：在直角三角形 $ABC$ 中，$\\angle C = 90^\\circ$。已知直角边 $a = ${combo.a}$，斜边 $c = ${combo.c}$。求：（1）另一条直角边 $b$ 的长度；（2）$\\angle A$ 的正弦值 $\\sin A$ 和正切值 $\\tan A$。`,
                    answer: `b = ${combo.b}；sin A = ${combo.sinA}，tan A = ${combo.tanA}`,
                    steps: [
                        `**(1) 求解直角边 b 的长度：**`,
                        `根据勾股定理：$a^2 + b^2 = c^2 \\implies b = \\sqrt{c^2 - a^2}$。`,
                        `代入数据：$b = \\sqrt{${combo.c}^2 - ${combo.a}^2} = \\sqrt{${combo.c*combo.c} - ${combo.a*combo.a}} = \\sqrt{${combo.c*combo.c - combo.a*combo.a}} = ${combo.b}$。`,
                        `**(2) 计算锐角三角比：**`,
                        `根据直角三角形中锐角三角比的定义：`,
                        `正弦值：$\\sin A = \\frac{\\text{对边}}{\\text{斜边}} = \\frac{a}{c} = \\frac{${combo.a}}{${combo.c}} = ${combo.sinA}$。`,
                        `正切值：$\\tan A = \\frac{\\text{对边}}{\\text{邻边}} = \\frac{a}{b} = \\frac{${combo.a}}{${combo.b}} = ${combo.tanA}$。`,
                        `**答：** 直角边 $b = ${combo.b}$，$\\sin A = ${combo.sinA}$，$\\tan A = ${combo.tanA}$。`
                    ]
                };
            }
        },
        {
            id: "math_circle_circum_area",
            category: "geom",
            type: "calculation",
            score: 20,
            generator() {
                const isRadius = PHYSICS_ENGINE.randomPick([true, false]);
                const R = PHYSICS_ENGINE.randomPick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 25, 30, 35, 40, 50]);
                const circumCoef = 2 * R;
                const areaCoef = R * R;
                if (isRadius) {
                    return {
                        question: `圆的周长与面积：已知一个圆的半径为 $${R}\\text{ cm}$。求：（1）这个圆 of 的周长是多少 $\\text{cm}$？（2）这个圆的面积是多少 $\\text{cm}^2$？（结果均保留 $\\pi$）`,
                        answer: `周长为 ${circumCoef}π cm；面积为 ${areaCoef}π cm²`,
                        steps: [
                            `**(1) 计算圆的周长：**`,
                            `已知半径 $R = ${R}\\text{ cm}$，根据圆周长公式：$C = 2 \\pi R$。`,
                            `代入计算：$C = 2 \\times \\pi \\times ${R}\\text{ cm} = ${circumCoef}\\pi\\text{ cm}$。`,
                            `**(2) 计算圆的面积：**`,
                            `根据圆面积公式：$S = \\pi R^2$。`,
                            `代入计算：$S = \\pi \\times (${R}\\text{ cm})^2 = ${areaCoef}\\pi\\text{ cm}^2$。`,
                            `**答：** 周长是 $${circumCoef}\\pi\\text{ cm}$，面积是 $${areaCoef}\\pi\\text{ cm}^2$。`
                        ]
                    };
                } else {
                    const D = R * 2;
                    return {
                        question: `圆的周长与面积：已知一个圆的直径为 $${D}\\text{ cm}$。求：（1）这个圆的周长是多少 $\\text{cm}$？（2）这个圆的面积是多少 $\\text{cm}^2$？（结果均保留 $\\pi$）`,
                        answer: `周长为 ${circumCoef}π cm；面积为 ${areaCoef}π cm²（直径为 ${D}cm）`,
                        steps: [
                            `**(1) 计算圆的周长：**`,
                            `已知直径 $D = ${D}\\text{ cm}$，则半径 $R = D / 2 = ${R}\\text{ cm}$，根据圆周长公式：$C = \\pi D$。`,
                            `代入计算：$C = \\pi \\times ${D}\\text{ cm} = ${circumCoef}\\pi\\text{ cm}$。`,
                            `**(2) 计算圆的面积：**`,
                            `根据圆面积公式：$S = \\pi R^2$。`,
                            `代入计算：$S = \\pi \\times (${R}\\text{ cm})^2 = ${areaCoef}\\pi\\text{ cm}^2$。`,
                            `**答：** 周长是 $${circumCoef}\\pi\\text{ cm}$，面积是 $${areaCoef}\\pi\\text{ cm}^2$。`
                        ]
                    };
                }
            }
        },
        {
            id: "math_sector_arc_length",
            category: "geom",
            type: "fill",
            score: 10,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { n: 60, l: 2, R: 6 },
                    { n: 90, l: 3, R: 6 },
                    { n: 120, l: 4, R: 6 },
                    { n: 90, l: 2, R: 4 },
                    { n: 60, l: 1, R: 3 },
                    { n: 120, l: 2, R: 3 },
                    { n: 30, l: 1, R: 6 },
                    { n: 45, l: 2, R: 8 },
                    { n: 135, l: 6, R: 8 },
                    { n: 150, l: 5, R: 6 },
                    { n: 240, l: 8, R: 6 },
                    { n: 270, l: 9, R: 6 },
                    { n: 300, l: 10, R: 6 },
                    { n: 30, l: 2, R: 12 },
                    { n: 45, l: 3, R: 12 },
                    { n: 60, l: 4, R: 12 },
                    { n: 90, l: 6, R: 12 },
                    { n: 120, l: 8, R: 12 },
                    { n: 150, l: 10, R: 12 },
                    { n: 180, l: 12, R: 12 },
                    { n: 240, l: 16, R: 12 },
                    { n: 270, l: 18, R: 12 },
                    { n: 36, l: 1, R: 5 },
                    { n: 72, l: 2, R: 5 },
                    { n: 108, l: 3, R: 5 },
                    { n: 144, l: 4, R: 5 },
                    { n: 40, l: 2, R: 9 },
                    { n: 80, l: 4, R: 9 },
                    { n: 160, l: 8, R: 9 },
                    { n: 200, l: 10, R: 9 }
                ]);
                return {
                    question: `扇形弧长变形应用：已知一个扇形的圆心角为 $${combo.n}^\\circ$，它的弧长为 $${combo.l}\\pi\\text{ cm}$。则该扇形的半径为___________ $\\text{cm}$。`,
                    answer: `${combo.R}（圆心角 ${combo.n}°，弧长 ${combo.l}π cm）`,
                    steps: [
                        `1. 已知圆心角 $n = ${combo.n}^\\circ$，弧长 $l = ${combo.l}\\pi\\text{ cm}$。`,
                        `2. 根据扇形弧长公式：$l = \\frac{n \\pi R}{180}$。`,
                        `3. 变形求半径 $R$ 的公式：$R = \\frac{180 l}{n \\pi}$。`,
                        `4. 代入数据计算：$R = \\frac{180 \\times ${combo.l}\\pi}{${combo.n} \\pi} = \\frac{180 \\times ${combo.l}}{${combo.n}} = ${combo.R}\\text{ cm}$。`
                    ]
                };
            }
        },
        {
            id: "math_pythagoras_word_problem",
            category: "geom",
            type: "calculation",
            score: 20,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { H: 9, d: 3, x: 4 },
                    { H: 16, d: 8, x: 6 },
                    { H: 25, d: 5, x: 12 },
                    { H: 27, d: 9, x: 12 },
                    { H: 24, d: 12, x: 9 },
                    { H: 36, d: 12, x: 16 },
                    { H: 32, d: 16, x: 12 },
                    { H: 45, d: 15, x: 20 },
                    { H: 40, d: 20, x: 15 },
                    { H: 18, d: 12, x: 5 },
                    { H: 50, d: 10, x: 24 },
                    { H: 36, d: 24, x: 10 },
                    { H: 32, d: 8, x: 15 },
                    { H: 25, d: 15, x: 8 },
                    { H: 49, d: 7, x: 24 },
                    { H: 32, d: 24, x: 7 },
                    { H: 81, d: 9, x: 40 },
                    { H: 50, d: 40, x: 9 },
                    { H: 72, d: 12, x: 35 },
                    { H: 49, d: 35, x: 12 }
                ]);
                return {
                    question: `折竹问题（勾股定理应用）：今有一根竹子高为 $${combo.H}$ 尺，折断后竹梢触地，着地点与竹根的距离为 $${combo.d}$ 尺。求竹子折断处距离地面的高度是多少尺？`,
                    answer: `${combo.x} 尺（总高 ${combo.H} 尺，地面距离 ${combo.d} 尺）`,
                    steps: [
                        `1. **构建数学几何模型**：`,
                        `   折断后的竹子与地面构成一个直角三角形。设竹子折断处离地面的高度（即直角三角形的一条直角边）为 $x$ 尺。`,
                        `2. **确定三边关系**：`,
                        `   - 地面上的直角边：$d = ${combo.d}$ 尺；`,
                        `   - 竖直的直角边：$x$ 尺；`,
                        `   - 斜边（即折断倒下的部分）：为总高减去竖直高，即 $( ${combo.H} - x )$ 尺。`,
                        `3. **代入勾股定理公式** $a^2 + b^2 = c^2$：`,
                        `   $x^2 + ${combo.d}^2 = (${combo.H} - x)^2$。`,
                        `4. **展开并求解一元一次方程**：`,
                        `   $x^2 + ${combo.d*combo.d} = ${combo.H*combo.H} - ${2*combo.H}x + x^2$。`,
                        `   消去 $x^2$ 得：$${2*combo.H}x = ${combo.H*combo.H} - ${combo.d*combo.d}$。`,
                        `   解得：$x = ${combo.x}$。`,
                        `**答：** 竹子折断处离地面的高度是 $${combo.x}$ 尺。`
                    ]
                };
            }
        },
        // ============================== 新增概率与统计经典模板 (5个) ==============================
        {
            id: "math_stat_median_mode",
            category: "stat-prob",
            type: "fill",
            score: 10,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { raw: "85，90，90，80，95，85，90", sorted: "80, 85, 85, 90, 90, 90, 95", median: 90, mode: 90, range: 15 },
                    { raw: "75，80，85，80，90，80，95", sorted: "75, 80, 80, 80, 85, 90, 95", median: 80, mode: 80, range: 20 },
                    { raw: "88，92，85，92，90，92，80", sorted: "80, 85, 88, 90, 92, 92, 92", median: 90, mode: 92, range: 12 },
                    { raw: "95，98，95，90，92，95，88", sorted: "88, 90, 92, 95, 95, 95, 98", median: 95, mode: 95, range: 10 },
                    { raw: "60，70，80，70，90，70，85", sorted: "60, 70, 70, 70, 80, 85, 90", median: 70, mode: 70, range: 30 },
                    { raw: "82，85，82，80，88，82，90", sorted: "80, 82, 82, 82, 85, 88, 90", median: 82, mode: 82, range: 10 },
                    { raw: "90，90，92，96，90，94，88", sorted: "88, 90, 90, 90, 92, 94, 96", median: 90, mode: 90, range: 8 },
                    { raw: "70，75，75，80，75，85，90", sorted: "70, 75, 75, 75, 80, 85, 90", median: 75, mode: 75, range: 20 },
                    { raw: "86，88，86，84，92，86，90", sorted: "84, 86, 86, 86, 88, 92, 90", median: 86, mode: 86, range: 8 },
                    { raw: "93，95，93，90，98，93，96", sorted: "90, 93, 93, 93, 95, 96, 98", median: 93, mode: 93, range: 8 },
                    { raw: "78，82，78，75，85，78，80", sorted: "75, 78, 78, 78, 80, 82, 85", median: 78, mode: 78, range: 10 },
                    { raw: "84，86，84，82，90，84，88", sorted: "82, 84, 84, 84, 86, 88, 90", median: 84, mode: 84, range: 8 },
                    { raw: "91，93，91，88，96., 91，94", sorted: "88, 91, 91, 91, 93, 94, 96", median: 91, mode: 91, range: 8 },
                    { raw: "76，78，76，74，82，76，80", sorted: "74, 76, 76, 76, 78, 80, 82", median: 76, mode: 76, range: 8 },
                    { raw: "80，85，80，78，88，80，82", sorted: "78, 80, 80, 80, 85, 88, 82", median: 80, mode: 80, range: 10 },
                    { raw: "85，88，85，82，90，85，92", sorted: "82, 85, 85, 85, 88, 90, 92", median: 85, mode: 85, range: 10 },
                    { raw: "72，75，72，70，78，72，80", sorted: "70, 72, 72, 72, 75, 78, 80", median: 72, mode: 72, range: 10 },
                    { raw: "94，96，94，92，100，94，98", sorted: "92, 94, 94, 94, 96, 98, 100", median: 94, mode: 94, range: 8 },
                    { raw: "65，70，65，60，75，65，80", sorted: "60, 65, 65, 65, 70, 75, 80", median: 65, mode: 65, range: 20 },
                    { raw: "87，89，87，85，93，87，91", sorted: "85, 87, 87, 87, 89, 91, 93", median: 87, mode: 87, range: 8 }
                ]);
                return {
                    question: `中位数与众数统计：某小组 7 名同学在一次测试中的成绩（单位：分）分别为：$${combo.raw}$。则这组数据的中位数是___________分，众数是___________分，极差是___________分。`,
                    answer: `${combo.median}；${combo.mode}；${combo.range}`,
                    steps: [
                        `1. **计算中位数**：`,
                        `   先将这组数据从小到大进行重新排序：$${combo.sorted}$。`,
                        `   数据个数为 $7$（奇数），处于最中间位置（第 4 个数）的值即为中位数，即为 $${combo.median}$ 分。`,
                        `2. **计算众数**：`,
                        `   这组数据中出现次数最多的数是 $${combo.mode}$（共出现了 3 次），故众数为 $${combo.mode}$ 分。`,
                        `3. **计算极差**：`,
                        `   极差为最大值与最小值的差值：$\\text{极差} = \\text{最大值} - \\text{最小值} = ${combo.sorted.split(", ").pop()} - ${combo.sorted.split(", ")[0]} = ${combo.range}$ 分。`
                    ]
                };
            }
        },
        {
            id: "math_probability_balls",
            category: "stat-prob",
            type: "fill",
            score: 10,
            generator() {
                const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
                const R = PHYSICS_ENGINE.randomPick([1, 2, 3, 4, 5, 6, 7, 8]);
                const W = PHYSICS_ENGINE.randomPick([1, 2, 3, 4, 5, 6, 7, 8]);
                const total = R + W;
                const g1 = gcd(R, total);
                const p1 = `${R/g1}/${total/g1}`;
                const g2 = gcd(W*W, total*total);
                const p2 = `${(W*W)/g2}/${(total*total)/g2}`;
                return {
                    question: `摸球实验经典概率：一个不透明的口袋中装有 $${R}$ 个红球和 $${W}$ 个白球，这些球除颜色外无其他差别。随机摸出一个球，摸到红球的概率是___________；若摸出一个球放回并摇匀，再随机摸出一个球，两次摸出的球都是白球的概率是___________。（请用最简分数表示，如 2/5）`,
                    answer: `${p1}；${p2}`,
                    steps: [
                        `1. **计算摸出红球概率**：`,
                        `   口袋中球的总数为：$${R} + ${W} = ${total}$ 个。`,
                        `   其中红球有 $${R}$ 个，因此随机摸出一个球是红球的概率为：$P_{红} = \\frac{${R}}{${total}} = ${p1}$。`,
                        `2. **计算两次都摸出白球的概率**：`,
                        `   由于是有放回摸球，每次摸球为独立事件。单次摸出白球的概率为 $P_{白} = \\frac{${W}}{${total}}$。`,
                        `   两次都摸出白球的概率为：$P = P_{白} \\times P_{白} = \\frac{${W}}{${total}} \\times \\frac{${W}}{${total}} = \\frac{${W*W}}{${total*total}} = ${p2}$。`
                    ]
                };
            }
        },
        {
            id: "math_probability_coin_die",
            category: "stat-prob",
            type: "fill",
            score: 10,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { descCoin: "两枚硬币全部正面朝上", pCoin: "1/4", descDie: "掷出的点数大于 4", pDie: "1/3", stepsCoin: "正正、正反、反正、反反共 4 种情况，全部朝上的只有 1 种", stepsDie: "点数大于 4 有 5, 6 共 2 种情况，总数 6 种" },
                    { descCoin: "两枚硬币一正一反", pCoin: "1/2", descDie: "掷出的点数是偶数", pDie: "1/2", stepsCoin: "一正一反有 正反、反正共 2 种情况，总数 4 种", stepsDie: "偶数点数有 2, 4, 6 共 3 种情况，总数 6 种" },
                    { descCoin: "两枚硬币全部反面朝上", pCoin: "1/4", descDie: "掷出的点数是质数", pDie: "1/2", stepsCoin: "全部反面朝上只有 1 种情况（反反），总数 4 种", stepsDie: "质数点数有 2, 3, 5 共 3 种情况，总数 6 种" },
                    { descCoin: "两枚硬币一正一反", pCoin: "1/2", descDie: "掷出的点数小于 3", pDie: "1/3", stepsCoin: "一正一反有 正反、反正共 2 种情况，总数 4 种", stepsDie: "点数小于 3 有 1, 2 共 2 种情况，总数 6 种" }
                ]);
                return {
                    question: `硬币与骰子概率计算：同时随机抛掷两枚质地均匀的硬币，则___________的概率是___________；若随机掷一枚质地均匀的骰子，则___________的概率是___________。（请用最简分数表示，如 1/4）`,
                    answer: `${combo.descCoin}；${combo.pCoin}；${combo.descDie}；${combo.pDie}`,
                    steps: [
                        `1. **硬币概率分析**：`,
                        `   随机抛掷两枚硬币，所有可能的结果有 4 种：（正，正）、（正，反）、（反，正）、（反，反）。且每种结果出现可能性均等。`,
                        `   符合条件“${combo.descCoin}”的情况：${combo.stepsCoin}。`,
                        `   代入概率公式得：$P_{硬币} = ${combo.pCoin}$。`,
                        `2. **骰子概率分析**：`,
                        `   掷一枚骰子所有可能的结果有 6 种（1点至6点）。`,
                        `   符合条件“${combo.descDie}”的情况：${combo.stepsDie}。`,
                        `   代入概率公式得：$P_{骰子} = \\frac{\\text{符合数}}{\\text{总数}} = ${combo.pDie}$。`
                    ]
                };
            }
        },
        {
            id: "math_probability_card",
            category: "stat-prob",
            type: "fill",
            score: 10,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { raw: "1，2，3，4，5", limit: 3, p1: "3/5", p2: "2/5", step1: "质数有 2, 3, 5（共 3 个）", step2: "大于 3 的有 4, 5（共 2 个）" },
                    { raw: "2，3，4，5，6", limit: 4, p1: "3/5", p2: "2/5", step1: "质数有 2, 3, 5（共 3 个）", step2: "大于 4 的有 5, 6（共 2 个）" },
                    { raw: "1，3，5，7，9", limit: 5, p1: "3/5", p2: "2/5", step1: "质数有 3, 5, 7（共 3 个）", step2: "大于 5 的有 7, 9（共 2 个）" },
                    { raw: "2，4，6，8，10", limit: 6, p1: "1/5", p2: "2/5", step1: "质数仅有 2（共 1 个）", step2: "大于 6 的有 8, 10（共 2 个）" },
                    { raw: "1，2，4，5，6", limit: 3, p1: "2/5", p2: "3/5", step1: "质数有 2, 5（共 2 个）", step2: "大于 3 的有 4, 5, 6（共 3 个）" },
                    { raw: "3，4，5，6，7", limit: 5, p1: "3/5", p2: "2/5", step1: "质数有 3, 5, 7（共 3 个）", step2: "大于 5 的有 6, 7（共 2 个）" },
                    { raw: "4，5，6，7，8", limit: 6, p1: "2/5", p2: "2/5", step1: "质数有 5, 7（共 2 个）", step2: "大于 6 的有 7, 8（共 2 个）" },
                    { raw: "5，6，7，8，9", limit: 7, p1: "2/5", p2: "2/5", step1: "质数有 5, 7（共 2 个）", step2: "大于 7 的有 8, 9（共 2 个）" },
                    { raw: "6，7，8，9，10", limit: 8, p1: "1/5", p2: "2/5", step1: "质数仅有 7（共 1 个）", step2: "大于 8 的有 9, 10（共 2 个）" },
                    { raw: "1，2，3，5，7", limit: 3, p1: "4/5", p2: "2/5", step1: "质数有 2, 3, 5, 7（共 4 个）", step2: "大于 3 的有 5, 7（共 2 个）" },
                    { raw: "2，3，5，7，11", limit: 5, p1: "5/5", p2: "2/5", step1: "五个数均为质数（共 5 个）", step2: "大于 5 的有 7, 11（共 2 个）" },
                    { raw: "3，5，7，9，11", limit: 7, p1: "4/5", p2: "2/5", step1: "质数有 3, 5, 7, 11（共 4 个）", step2: "大于 7 的有 9, 11（共 2 个）" },
                    { raw: "1，4，9，16，25", limit: 9, p1: "0/5", p2: "2/5", step1: "无质数（共 0 个）", step2: "大于 9 的有 16, 25（共 2 个）" },
                    { raw: "1，2，3，4，6", limit: 3, p1: "2/5", p2: "2/5", step1: "质数有 2, 3（共 2 个）", step2: "大于 3 的有 4, 6（共 2 个）" },
                    { raw: "2，4，5，7，9", limit: 5, p1: "3/5", p2: "2/5", step1: "质数有 2, 5, 7（共 3 个）", step2: "大于 5 的有 7, 9（共 2 个）" }
                ]);
                return {
                    question: `卡片抽取经典古典概率：桌面上放有 5 张相同卡片，上面分别写有数字：$${combo.raw}$。现从中随机抽取一张，抽到的数字是质数的概率是___________；抽到的数字大于 $${combo.limit}$ 的概率是___________。（请用最简分数表示）`,
                    answer: `${combo.p1}；${combo.p2}`,
                    steps: [
                        `1. 卡片数字总共有 5 个，因此抽取的总可能结果数为 $5$ 种。`,
                        `2. **计算抽到质数的概率**：`,
                        `   在卡片数字中，${combo.step1}。`,
                        `   根据古典概率公式：$P_{质} = ${combo.p1}$。`,
                        `3. **计算抽到大于** $${combo.limit}$ **的概率**：`,
                        `   在卡片数字中，${combo.step2}。`,
                        `   根据古典概率公式：$P = ${combo.p2}$。`
                    ]
                };
            }
        },
        {
            id: "math_formula_trans_probability",
            category: "stat-prob",
            type: "fill",
            score: 10,
            generator() {
                const combo = PHYSICS_ENGINE.randomPick([
                    { N: 10, P: "0.4", P_new: "0.5", R: 4, W: 6, x: 2 },
                    { N: 12, P: "0.25", P_new: "0.4", R: 3, W: 9, x: 3 },
                    { N: 15, P: "0.2", P_new: "0.5", R: 3, W: 12, x: 9 },
                    { N: 20, P: "0.3", P_new: "0.5", R: 6, W: 14, x: 8 },
                    { N: 10, P: "0.2", P_new: "0.5", R: 2, W: 8, x: 4 },
                    { N: 15, P: "0.4", P_new: "0.5", R: 6, W: 9, x: 3 },
                    { N: 8, P: "0.25", P_new: "0.5", R: 2, W: 6, x: 2 },
                    { N: 12, P: "0.5", P_new: "0.6", R: 6, W: 6, x: 3 },
                    { N: 16, P: "0.25", P_new: "0.4", R: 4, W: 12, x: 4 },
                    { N: 10, P: "0.3", P_new: "0.5", R: 3, W: 7, x: 4 },
                    { N: 15, P: "0.2", P_new: "0.4", R: 3, W: 12, x: 5 },
                    { N: 20, P: "0.25", P_new: "0.5", R: 5, W: 15, x: 10 }
                ]);
                return {
                    question: `概率公式变形与应用：在一个不透明的袋子中装有红球和白球共 $${combo.N}$ 个，这些球除颜色外无差别。已知从中随机摸出一个球是红球的概率为 $${combo.P}$。则：（1）袋中红球的个数是___________个；（2）若想使随机摸到红球的概率变为 $${combo.P_new}$，需要往袋中再放入___________个红球（保持白球个数不变）。`,
                    answer: `${combo.R}；${combo.x}`,
                    steps: [
                        `**(1) 求解红球的基本个数：**`,
                        `袋中球的总数 $N = ${combo.N}$，摸到红球的概率 $P = ${combo.P}$。`,
                        `根据概率定义公式：$P = \\frac{R}{N}$，变形求红球数：$R = N \\times P = ${combo.N} \\times ${combo.P} = ${combo.R}$ 个。`,
                        `则白球数 $W = N - R = ${combo.N} - ${combo.R} = ${combo.W}$ 个。`,
                        `**(2) 计算需追加放入的红球个数：**`,
                        `设需要再放入 $x$ 个红球，放入后红球总数变为 $${combo.R} + x$ 个，袋中球的总数变为 $${combo.N} + x$ 个。`,
                        `新概率关系为：$\\frac{${combo.R} + x}{${combo.N} + x} = ${combo.P_new}$。`,
                        `代入解得：$x = ${combo.x}$。`,
                        `**答：** 原红球有 $${combo.R}$ 个，需再放入 $${combo.x}$ 个红球。`
                    ]
                };
            }
        }
    ],

    // 智能引擎批量生成函数：为指定类别动态生成指定数量(count)的唯一题目
    generateQuestions(category, count = 100) {
        // 筛选该类别的所有可用模板
        const matchedTemplates = this.templates.filter(t => t.category === category);
        
        if (matchedTemplates.length === 0) {
            console.error(`未找到对应类别 [${category}] 的物理模板`);
            return [];
        }

        let results = [];
        let generatedSignatures = new Set(); // 防止物理参数碰撞生成重复题目

        let iterations = 0;
        const maxIterations = count * 15; // 避免无限死循环

        while (results.length < count && iterations < maxIterations) {
            iterations++;
            // 随机选择模板，以支持干涸模板跳过、高容量模板自动补充，避免死循环碰撞
            const template = this.randomPick(matchedTemplates);
            const q = template.generator();

            // 生成唯一的物理题目特征哈希串以校验重复
            const signature = `${template.id}_${q.answer}`;
            
            if (!generatedSignatures.has(signature)) {
                generatedSignatures.add(signature);
                results.push({
                    id: `${template.id}_gen_${results.length}`,
                    category: template.category,
                    type: template.type,
                    score: template.score,
                    question: q.question,
                    answer: q.answer,
                    steps: q.steps
                });
            }
        }

        // 如果随机组合依然不够（通常 10 个模版随机抽取参数矩阵，可以组成数百种完全不同的合法整除算式），
        // 我们可以退而求其次允许极少量参数碰撞，或者返回全部生成的题目
        return results;
    }
};
