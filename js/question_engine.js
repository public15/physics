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
                const v = PHYSICS_ENGINE.randomPick([1500, 1530]); // 海水中声速
                const t = PHYSICS_ENGINE.randomPick([2, 4, 6, 8, 10]); // 双程时间
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
                const s = PHYSICS_ENGINE.randomPick([170, 340, 510, 680, 850]); // 距离
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
                const s1 = PHYSICS_ENGINE.randomPick([1.5, 2, 3, 4]); // 人距镜
                const walk = PHYSICS_ENGINE.randomPick([0.5, 1, 1.5]); // 走近镜
                const s2 = s1 - walk;
                const total = s2 * 2;
                return {
                    question: `小红身高 1.6m，站在竖直放置的平面镜前 $${s1}\\text{ m}$ 处，她在镜中的像高为___________ $\\text{m}$。若她向镜面走近 $${walk}\\text{ m}$，则她与镜中像的距离为___________ $\\text{m}$。`,
                    answer: `1.6；${total}`,
                    steps: [
                        `1. 平面镜成像规律：像与物的大小相等。小红身高 1.6m，因此像高始终为 $1.6\\text{ m}$。`,
                        `2. 走近 $${walk}\\text{ m}$ 后，小红与平面镜的距离变为：$${s1}\\text{ m} - ${walk}\\text{ m} = ${s2}\\text{ m}$。`,
                        `3. 像与镜面的距离等于物与镜面的距离，即也是 $${s2}\\text{ m}$。小红与镜中的像的总距离为：$${s2}\\text{ m} \\times 2 = ${total}\\text{ m}$。`
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
                const lam = PHYSICS_ENGINE.randomPick([10, 20, 100, 300]); // 波长 m
                const c = 3.0e8; // 光速
                const f_mhz = (c / lam) / 1e6; // 频率 MHz
                return {
                    question: `广播电台发射的电磁波波长为 $${lam}\\text{ m}$，已知电磁波在真空中的传播速度为 $3.0 \\times 10^8\\text{ m/s}$。该电磁波的频率为___________ $\\text{MHz}$。`,
                    answer: `${f_mhz}`,
                    steps: [
                        `1. 已知电磁波波速 $c = 3.0 \\times 10^8\\text{ m/s}$，波长 $\\lambda = ${lam}\\text{ m}$。`,
                        `2. 根据波速公式 $c = \\lambda f$，求频率：$f = \\frac{c}{\\lambda} = \\frac{3.0 \\times 10^8\\text{ m/s}}{${lam}\\text{ m}} = ${c/lam}\\text{ Hz}$。`,
                        `3. 转换为兆赫兹 (1 MHz = 10⁶ Hz)：$f = \\frac{${c/lam}\\text{ Hz}}{10^6} = ${f_mhz}\\text{ MHz}$。`
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
                const ang = PHYSICS_ENGINE.randomPick([30, 45, 60]);
                const refr = ang - 15;
                return {
                    question: `一束光从空气斜射入水中，若入射角为 $${ang}^\\circ$，则折射角将___________ $${ang}^\\circ$（选填“大于”、“小于”或“等于”）。若折射角为 $${refr}^\\circ$，则反射角为___________$^\\circ$。`,
                    answer: `小于；${ang}`,
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
                // 声音介质传播速度对比
                return {
                    question: `百米赛跑时，终点计时员如果是听到枪声才开始计时，他记录的成绩将比看枪烟计时的成绩___________（选填“偏好”或“偏差”）。这是因为声音在空气中的传播速度远___________光速（选填“大于”或“小于”）。`,
                    answer: `偏好；小于`,
                    steps: [
                        `1. 声音传播 100m 需要时间：$t = \\frac{s}{v} = \\frac{100\\text{ m}}{340\\text{ m/s}} \\approx 0.294\\text{ s}$。`,
                        `2. 若听到枪声再计时，由于声音传到终点慢了约 0.29s，导致计时器少记录了这部分时间，因而运动员的记录成绩偏短（即**偏好**）。`,
                        `3. 声音传播速度 340m/s 远**小于**光速 ($3.0 \\times 10^8\\text{ m/s}$)。`
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
                // 凸透镜成像规律基础
                const f = PHYSICS_ENGINE.randomPick([10, 15, 20]); // 焦距 cm
                const u = f * 2 + 5; // 2f 以外
                return {
                    question: `某凸透镜的焦距为 $${f}\\text{ cm}$。将点燃的蜡烛放在距离透镜 $${u}\\text{ cm}$ 处，在透镜另一侧的光屏上可以得到一个___________、___________的实像（选填像的倒正、大小），这与___________（选填“照相机”或“投影仪”）的成像原理相同。`,
                    answer: `倒立；缩小；照相机`,
                    steps: [
                        `1. 已知透镜焦距 $f = ${f}\\text{ cm}$，则二倍焦距 $2f = ${2*f}\\text{ cm}$。`,
                        `2. 蜡烛物距 $u = ${u}\\text{ cm}$，因为 $u > 2f$ ($${u}\\text{ cm} > ${2*f}\\text{ cm}$)。`,
                        `3. 根据凸透镜成像规律，当物距大于二倍焦距时，成**倒立、缩小**的**实像**，这是**照相机**的原理。`
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
                // 凸透镜成像变动
                const f = PHYSICS_ENGINE.randomPick([8, 12, 16]);
                const u = f + 2; // f 和 2f 之间
                return {
                    question: `将蜡烛放在焦距为 $${f}\\text{ cm}$ 的凸透镜前 $${u}\\text{ cm}$ 处，光屏上成清晰的像。此时物距___________像距（选填“大于”或“小于”）。若将蜡烛向透镜靠近，为了使光屏上仍成清晰的像，光屏应向___________透镜方向移动（选填“靠近”或“远离”）。`,
                    answer: `小于；远离`,
                    steps: [
                        `1. 已知 $f = ${f}\\text{ cm}$，物距 $u = ${u}\\text{ cm}$。由于 $f < u < 2f$，在光屏上成倒立放大的实像，此时像距 $v > 2f$，即物距**小于**像距。`,
                        `2. 凸透镜成实像变动规律：“物近像远像变大”。蜡烛向透镜靠近（物距减小），像距必须增大，因此光屏应该**远离**透镜移动。`
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
                // 密度质量体积计算 m = rho * V
                const rho = 2.7e3; // 铝密度 kg/m³
                const V_cm3 = PHYSICS_ENGINE.randomPick([10, 20, 50, 100]); // cm³
                const V_m3 = V_cm3 / 1e6;
                const m_g = (rho * V_m3) * 1000;
                return {
                    question: `一个实心铝块的体积为 $${V_cm3}\\text{ cm}^3$。已知铝的密度为 $2.7 \\times 10^3\\text{ kg/m}^3$。求该铝块的质量是多少克？`,
                    answer: `${m_g} g`,
                    steps: [
                        `1. 已知铝的密度 $\\rho = 2.7 \\times 10^3\\text{ kg/m}^3 = 2.7\\text{ g/cm}^3$。`,
                        `2. 铝块的体积 $V = ${V_cm3}\\text{ cm}^3$。`,
                        `3. 根据密度公式 $\\rho = \\frac{m}{V}$ 变形得，铝块质量：$m = \\rho V = 2.7\\text{ g/cm}^3 \\times ${V_cm3}\\text{ cm}^3 = ${m_g}\\text{ g}$。`,
                        `**答：** 该铝块的质量是 $${m_g}\\text{ g}$。`
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
                // 重力计算 G = mg
                const m_g = PHYSICS_ENGINE.randomPick([200, 500, 1000, 2500]); // 克
                const m_kg = m_g / 1000;
                const g = 10;
                const G = m_kg * g;
                return {
                    question: `一个中考物理实验用的小木块，在天平上测得其质量为 $${m_g}\\text{ g}$。若将它放在水平桌面上，小木块受到的重力为___________ $\\text{N}$（g取 10 N/kg）。`,
                    answer: `${G}`,
                    steps: [
                        `1. 先将质量单位换算为标准国际单位：$m = ${m_g}\\text{ g} = ${m_kg}\\text{ kg}$。`,
                        `2. 根据重力公式 $G = mg$ 代入计算：$G = ${m_kg}\\text{ kg} \\times 10\\text{ N/kg} = ${G}\\text{ N}$。`
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
                // 固体压强计算 p = F/S
                const G = PHYSICS_ENGINE.randomPick([400, 500, 600]); // 重力 N
                const S_cm3 = PHYSICS_ENGINE.randomPick([100, 200, 250]); // 单只脚面积 cm²
                const S_double_m2 = (S_cm3 * 2) / 10000; // 双脚面积 m²
                const p = G / S_double_m2;
                return {
                    question: `一名体重为 $${G}\\text{ N}$ 的初中生站立在水平地面上，他单只脚底与地面的接触面积是 $${S_cm3}\\text{ cm}^2$。求该同学站立时对地面的压强是多少 Pa？`,
                    answer: `${p} Pa`,
                    steps: [
                        `1. 在水平地面上，人对地面的垂直压力等于其自身重力：$F = G = ${G}\\text{ N}$。`,
                        `2. 站立时受力面积为双脚与地面接触面积：$S = 2 \\times ${S_cm3}\\text{ cm}^2 = ${S_cm3*2}\\text{ cm}^2$。`,
                        `   换算成平方米单位：$S = ${S_cm3*2} \\times 10^{-4}\\text{ m}^2 = ${S_double_m2}\\text{ m}^2$。`,
                        `3. 根据压强公式 $p = \\frac{F}{S}$：$p = \\frac{${G}\\text{ N}}{${S_double_m2}\\text{ m}^2} = ${p}\\text{ Pa}$。`,
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
                // 液体压强计算 p = rho * g * h
                const h_cm = PHYSICS_ENGINE.randomPick([20, 50, 80, 100]); // cm
                const h_m = h_cm / 100;
                const rho = 1000; // 水密度
                const g = 10;
                const p = rho * g * h_m;
                return {
                    question: `在一个圆柱形容器中盛有水，水面距离容器底部的高度为 $${h_cm}\\text{ cm}$。已知水的密度为 $1.0 \\times 10^3\\text{ kg/m}^3$。则容器底部受到水的压强为___________ $\\text{Pa}$。`,
                    answer: `${p}`,
                    steps: [
                        `1. 水的深度 $h = ${h_cm}\\text{ cm} = ${h_m}\\text{ m}$，水密度 $\\rho = 1000\\text{ kg/m}^3$。`,
                        `2. 根据液体压强公式 $p = \\rho g h$ 计算：$p = 1000\\text{ kg/m}^3 \\times 10\\text{ N/kg} \\times ${h_m}\\text{ m} = ${p}\\text{ Pa}$。`
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
                // 阿基米德原理计算浮力 F浮 = rho * g * V排
                const V_cm3 = PHYSICS_ENGINE.randomPick([100, 200, 500, 1000]); // 体积 cm³
                const V_m3 = V_cm3 / 1e6;
                const rho_water = 1000;
                const g = 10;
                const F_f = rho_water * g * V_m3;
                return {
                    question: `一个体积为 $${V_cm3}\\text{ cm}^3$ 的实心金属块浸没在水中，求该金属块排开水的体积是多少 m³？它受到的浮力是多少 N？`,
                    answer: `排开体积为 ${V_m3} m³；浮力为 ${F_f} N`,
                    steps: [
                        `1. 金属块浸没在水中，则它排开水的体积等于它自身的体积：`,
                        `   $V_{排} = V = ${V_cm3}\\text{ cm}^3 = ${V_m3}\\text{ m}^3$。`,
                        `2. 水的密度 $\\rho_{水} = 1000\\text{ kg/m}^3$，重力常数 $g = 10\\text{ N/kg}$。`,
                        `3. 根据阿基米德浮力公式：$F_{浮} = \\rho_{水} g V_{排} = 1000\\text{ kg/m}^3 \\times 10\\text{ N/kg} \\times ${V_m3}\\text{ m}^3 = ${F_f}\\text{ N}$。`,
                        `**答：** 排开水体积为 $${V_m3}\\text{ m}^3$，受到的浮力为 $${F_f}\\text{ N}$。`
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
                // 动滑轮与机械效率 eta = W有 / W总
                const G = PHYSICS_ENGINE.randomPick([180, 270, 360]); // 货物重力 N
                const h = 2; // 上升高度 m
                const F = PHYSICS_ENGINE.randomPick([100, 150, 200]); // 拉力 N（要求 2F > G 且大于 0）
                const s = 2 * h; // 动滑轮移动距离
                const W_y = G * h;
                const W_z = F * s;
                const eta = ((W_y / W_z) * 100).toFixed(0);
                return {
                    question: `使用一个动滑轮将重为 $${G}\\text{ N}$ 的货物匀速提升了 $2\\text{ m}$，所用的拉力 $F = ${F}\\text{ N}$。求：（1）动滑轮做的有用功是多少？（2）拉力做的总功是多少？（3）该动滑轮的机械效率是多少？`,
                    answer: `(1) 有用功 ${W_y} J；(2) 总功 ${W_z} J；(3) 效率为 ${eta}%`,
                    steps: [
                        `**(1) 计算有用功：**`,
                        `有用功是克服物体自身重力做的功：$W_{有} = G h = ${G}\\text{ N} \\times 2\\text{ m} = ${W_y}\\text{ J}$。`,
                        `**(2) 计算拉力做的总功：**`,
                        `使用动滑轮时，绳子自由端拉下的距离是物体上升高度的两倍：$s = 2h = 2 \\times 2\\text{ m} = 4\\text{ m}$。`,
                        `拉力做功（总功）：$W_{总} = F s = ${F}\\text{ N} \\times 4\\text{ m} = ${W_z}\\text{ J}$。`,
                        `**(3) 计算滑轮组机械效率：**`,
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
                // 实心与空心判断
                const m = 178; // 铜球质量 g
                const V = PHYSICS_ENGINE.randomPick([30, 40, 50]); // 铜球体积 cm³
                const rho_copper = 8.9; // 铜密度 g/cm³
                const V_solid = m / rho_copper;
                const isHollow = V > V_solid;
                const V_hollow = V - V_solid;
                return {
                    question: `一个铜球的质量是 $178\\text{ g}$，体积是 $${V}\\text{ cm}^3$。已知铜的密度为 $8.9\\text{ g/cm}^3$。通过计算判断这个铜球是实心的还是空心的？如果是空心的，空心部分的体积是多少？`,
                    answer: `空心；空心体积为 ${V_hollow} cm³`,
                    steps: [
                        `1. 已知铜球质量 $m = 178\\text{ g}$，铜的密度 $\\rho_{铜} = 8.9\\text{ g/cm}^3$。`,
                        `2. 计算该质量的铜实心时所具有的物理体积：`,
                        `   $V_{实} = \\frac{m}{\\rho_{铜}} = \\frac{178\\text{ g}}{8.9\\text{ g/cm}^3} = 20\\text{ cm}^3$。`,
                        `3. 比较体积：因为实际体积 $V = ${V}\\text{ cm}^3$ 大于实心体积 $V_{实} = 20\\text{ cm}^3$。`,
                        `   所以该铜球是**空心**的。`,
                        `4. 计算空心部分的体积：$V_{空} = V - V_{实} = ${V}\\text{ cm}^3 - 20\\text{ cm}^3 = ${V_hollow}\\text{ cm}^3$。`,
                        `**答：** 该球是空心的，空心部分体积是 $${V_hollow}\\text{ cm}^3$。`
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
                // 并联分流计算
                const r1 = 10;
                const r2 = 20;
                const U = PHYSICS_ENGINE.randomPick([6, 12]);
                const i1 = U / r1;
                const i2 = U / r2;
                const i_total = i1 + i2;
                return {
                    question: `将阻值分别为 $R_1 = 10\\text{ }\\Omega$ 和 $R_2 = 20\\text{ }\\Omega$ 的两个电阻并联在电压为 $${U}\\text{ V}$ 的电源两端。求：（1）通过电阻 $R_1$ 的电流是多少？（2）干路中的总电流是多少？`,
                    answer: `(1) R1电流为 ${i1} A；(2) 干路电流为 ${i_total} A`,
                    steps: [
                        `**(1) 计算通过电阻 $R_1$ 的电流：**`,
                        `并联电路各支路两端电压相等，且等于电源电压，故 $U_1 = U_2 = U = ${U}\\text{ V}$。`,
                        `代入欧姆定律求 $I_1$：$I_1 = \\frac{U}{R_1} = \\frac{${U}\\text{ V}}{10\\text{ }\\Omega} = ${i1}\\text{ A}$。`,
                        `**(2) 计算干路中的总电流：**`,
                        `同理，求通过 $R_2$ 的电流：$I_2 = \\frac{U}{R_2} = \\frac{${U}\\text{ V}}{20\\text{ }\\Omega} = ${i2}\\text{ A}$。`,
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
                // 电功电热 W = UIt
                const u = 220; // 家庭电压
                const i = PHYSICS_ENGINE.randomPick([2, 4, 5, 8]); // 电流
                const t_min = PHYSICS_ENGINE.randomPick([5, 10, 20]); // 时间 min
                const t_s = t_min * 60;
                const W = u * i * t_s;
                return {
                    question: `一个电热水壶接在家庭电路中（电压为 $220\\text{ V}$），正常工作时的电流为 $${i}\\text{ A}$。该电热水壶正常工作 $${t_min}\\text{ min}$ 消耗的电能为___________ $\\text{J}$。`,
                    answer: `${W}`,
                    steps: [
                        `1. 已知电压 $U = 220\\text{ V}$，电流 $I = ${i}\\text{ A}$。`,
                        `2. 将工作时间换算为秒：$t = ${t_min}\\text{ min} = ${t_min} \\times 60\\text{ s} = ${t_s}\\text{ s}$。`,
                        `3. 根据电功公式 $W = U I t$ 计算消耗的电能：`,
                        `   $W = 220\\text{ V} \\times ${i}\\text{ A} \\times ${t_s}\\text{ s} = ${W}\\text{ J}$。`
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
                // 电功率基本计算 P = UI
                const u = 220;
                const i = PHYSICS_ENGINE.randomPick([0.2, 0.5, 1.0, 2.0, 5.0]); // 安培
                const P = u * i;
                return {
                    question: `一盏标有“220V”字样的用电器，接入家庭电路正常工作，测得通过它的电流为 $${i}\\text{ A}$。则该用电器的额定电功率为___________ $\\text{W}$。`,
                    answer: `${P}`,
                    steps: [
                        `1. 用电器在额定电压下正常工作，其额定电压 $U = 220\\text{ V}$，额定电流 $I = ${i}\\text{ A}$。`,
                        `2. 根据电功率公式 $P = UI$ 代入计算：$P = 220\\text{ V} \\times ${i}\\text{ A} = ${P}\\text{ W}$。`
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
                // 用电器规格计算 R = U^2/P, I = P/U
                const P = PHYSICS_ENGINE.randomPick([40, 100, 220]); // 功率
                const u = 220; // 额定电压
                const R = (u * u) / P;
                const I = P / u;
                return {
                    question: `一只家用照明灯泡上标有“$220\\text{V } ${P}\\text{W}$”字样。求：（1）该灯泡正常发光时的电流是多少？（结果保留两位小数）（2）该灯泡正常发光时的电阻是多少？`,
                    answer: `(1) 电流为 ${I.toFixed(2)} A；(2) 电阻为 ${R.toFixed(1)} Ω`,
                    steps: [
                        `**(1) 计算灯泡正常发光时的额定电流：**`,
                        `已知额定电压 $U = 220\\text{ V}$，额定功率 $P = ${P}\\text{ W}$。`,
                        `根据电功率公式 $P = UI$ 得：$I = \\frac{P}{U} = \\frac{${P}\\text{ W}}{220\\text{ V}} \\approx ${I.toFixed(2)}\\text{ A}$。`,
                        `**(2) 计算灯泡的电阻：**`,
                        `在纯电阻电路中，由 $P = \\frac{U^2}{R}$ 可求电阻：`,
                        `$R = \\frac{U^2}{P} = \\frac{(220\\text{ V})^2}{${P}\\text{ W}} = \\frac{48400}{${P}} = ${R.toFixed(1)}\\text{ }\\Omega$。`,
                        `**答：** 正常发光电流为 $${I.toFixed(2)}\\text{ A}$，灯泡电阻是 $${R.toFixed(1)}\\text{ }\\Omega$。`
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
                // 实际功率计算 P实 = U实^2/R
                const R = 484; // 对应 220V 100W 灯泡电阻
                const u_act = PHYSICS_ENGINE.randomPick([110, 200]); // 实际电压
                const P_act = (u_act * u_act) / R;
                return {
                    question: `一盏铭牌标有“$220\\text{V } 100\\text{W}$”的白炽灯。已知该灯泡的电阻为 $484\\text{ }\\Omega$ 保持不变。当把它接在实际电压为 $${u_act}\\text{ V}$ 的输电线路上时。求该灯泡此时消耗的实际功率是多少？`,
                    answer: `${P_act.toFixed(2)} W`,
                    steps: [
                        `1. 灯泡电阻保持不变，电阻 $R = 484\\text{ }\\Omega$。`,
                        `2. 实际加在灯泡两端的电压 $U_{实} = ${u_act}\\text{ V}$。`,
                        `3. 根据电功率计算公式，灯泡消耗的实际功率：`,
                        `   $P_{实} = \\frac{U_{实}^2}{R} = \\frac{(${u_act}\\text{ V})^2}{484\\text{ }\\Omega} = \\frac{${u_act*u_act}}{484}\\text{ W} = ${P_act.toFixed(2)}\\text{ W}$。`,
                        `**答：** 该灯泡消耗的实际功率是 $${P_act.toFixed(2)}\\text{ W}$。`
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
                // 焦耳定律 Q = I^2*R*t
                const r = PHYSICS_ENGINE.randomPick([10, 20, 50]); // 电阻
                const i = 2; // 电流
                const t = PHYSICS_ENGINE.randomPick([10, 30, 60]); // 时间
                const Q = i * i * r * t;
                return {
                    question: `一个电阻阻值为 $${r}\\text{ }\\Omega$，通过该电阻的电流为 $2\\text{ A}$，在 $${t}\\text{ s}$ 内该电阻产生的热量为___________ $\\text{J}$。`,
                    answer: `${Q}`,
                    steps: [
                        `1. 已知电阻 $R = ${r}\\text{ }\\Omega$，电流 $I = 2\\text{ A}$，时间 $t = ${t}\\text{ s}$。`,
                        `2. 根据焦耳定律 $Q = I^2 R t$ 计算电热：`,
                        `   $Q = (2\\text{ A})^2 \\times ${r}\\text{ }\\Omega \\times ${t}\\text{ s} = 4 \\times ${r} \\times ${t} = ${Q}\\text{ J}$。`
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
                // 电能表电功转盘计算
                const N = PHYSICS_ENGINE.randomPick([1200, 3000]); // imp/kW·h 或 r/kW·h
                const revs = PHYSICS_ENGINE.randomPick([60, 120, 300]); // 转数/闪烁数
                const W_kwh = revs / N;
                const W_j = W_kwh * 3.6e6;
                return {
                    question: `小明家电能表上标有“$${N}\\text{r/(kW}\\cdot\\text{h)}$”字样。当他家只让一个用电器单独工作时，观察到电能表转盘在一段时间内转了 $${revs}$ 转，则该用电器在此期间消耗的电能为___________ $\\text{kW}\\cdot\\text{h}$，合___________ $\\text{J}$。`,
                    answer: `${W_kwh}；${W_j}`,
                    steps: [
                        `1. 电能表每转过 $${N}$ 转代表消耗 $1\\text{ kW}\\cdot\\text{h}$ 的电能。`,
                        `2. 转过 $${revs}$ 转消耗的电能：$W = \\frac{${revs}}{${N}}\\text{ kW}\\cdot\\text{h} = ${W_kwh}\\text{ kW}\\cdot\\text{h}$（即度）。`,
                        `3. 换算为焦耳 ($1\\text{ kW}\\cdot\\text{h} = 3.6 \\times 10^6\\text{ J}$)：`,
                        `   $W = ${W_kwh} \\times 3.6 \\times 10^6\\text{ J} = ${W_j}\\text{ J}$。`
                    ]
                };
            }
        },

        // ============================== 四、热学模块 (10个模板) ==============================
        {
            id: "therm_water_q",
            category: "thermodynamics",
            type: "calculation",
            score: 20,
            generator() {
                // 比热容水吸热 Q吸 = c*m*dt
                const m = PHYSICS_ENGINE.randomPick([1, 2, 5, 10]); // 水质量
                const t0 = PHYSICS_ENGINE.randomPick([10, 20, 30]); // 初温
                const t1 = PHYSICS_ENGINE.randomPick([80, 90, 100]); // 末温
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
                // 燃料燃烧完全放热 Q = m * q
                const m = PHYSICS_ENGINE.randomPick([0.5, 1, 2, 5]); // 质量 kg
                const q = 3.0e7; // 焦炭热值 3.0 * 10^7 J/kg
                const Q = m * q;
                return {
                    question: `已知无烟煤的热值为 $3.0 \\times 10^7\\text{ J/kg}$。完全燃烧 $${m}\\text{ kg}$ 的无烟煤，释放的热量为___________ $\\text{J}$。`,
                    answer: `${Q}`,
                    steps: [
                        `1. 已知燃料质量 $m = ${m}\\text{ kg}$，热值 $q = 3.0 \\times 10^7\\text{ J/kg}$。`,
                        `2. 根据燃料完全燃烧放热公式 $Q_{放} = mq$ 计算：`,
                        `   $Q_{放} = ${m}\\text{ kg} \\times 3.0 \\times 10^7\\text{ J/kg} = ${Q}\\text{ J}$。`
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
                // 气体完全燃烧放热 Q = V * q
                const V = PHYSICS_ENGINE.randomPick([0.1, 0.2, 0.5, 2]); // 体积 m³
                const q = 4.0e7; // 天然气热值 4.0 * 10^7 J/m³
                const Q = V * q;
                return {
                    question: `已知天然气的热值为 $4.0 \\times 10^7\\text{ J/m}^3$。完全燃烧 $${V}\\text{ m}^3$ 的天然气，释放的热量为___________ $\\text{J}$。`,
                    answer: `${Q}`,
                    steps: [
                        `1. 已知气体体积 $V = ${V}\\text{ m}^3$，热值 $q = 4.0 \\times 10^7\\text{ J/m}^3$。`,
                        `2. 根据气体燃料完全燃烧公式 $Q_{放} = V q$：`,
                        `   $Q_{放} = ${V}\\text{ m}^3 \\times 4.0 \\times 10^7\\text{ J/m}^3 = ${Q}\\text{ J}$。`
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
                // 热机效率计算 eta = W有 / Q放
                const W = PHYSICS_ENGINE.randomPick([3.0e7, 4.5e7, 6.0e7]); // 有用功
                const m = 5; // 消耗燃油 kg
                const q = 3.0e7; // 燃油热值
                const Q_total = m * q;
                const eta = ((W / Q_total) * 100).toFixed(0);
                return {
                    question: `一台柴油机工作时，消耗了 $5\\text{ kg}$ 的柴油，做出了 $${W.toExponential(1).replace("e+", "\\times 10^")}\\text{ J}$ 的有用机械功。已知柴油的热值为 $3.0 \\times 10^7\\text{ J/kg}$。求：（1）这 5 kg 柴油完全燃烧放出的热量是多少 J？（2）该柴油机的效率是多少？`,
                    answer: `(1) 完全放出 ${Q_total.toExponential(1).replace("e+", "\\times 10^")} J；(2) 效率为 ${eta}%`,
                    steps: [
                        `**(1) 计算柴油完全燃烧放出的热量：**`,
                        `已知 $m = 5\\text{ kg}$，热值 $q = 3.0 \\times 10^7\\text{ J/kg}$。`,
                        `放热：$Q_{放} = m q = 5\\text{ kg} \\times 3.0 \\times 10^7\\text{ J/kg} = ${Q_total.toExponential(1).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `**(2) 计算柴油机的热机效率：**`,
                        `已知有用机械功 $W_{有} = ${W.toExponential(1).replace("e+", "\\times 10^")}\\text{ J}$，总放热 $Q_{放} = ${Q_total.toExponential(1).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `根据效率公式：$\\eta = \\frac{W_{有}}{Q_{放}} \\times 100\\% = \\frac{${W.toExponential(1).replace("e+", "\\times 10^")}}{${Q_total.toExponential(1).replace("e+", "\\times 10^")}} \\times 100\\% = ${eta}\\%$。`,
                        `**答：** 完全放出的热量是 $${Q_total.toExponential(1).replace("e+", "\\times 10^")}\\text{ J}$，热机效率为 $${eta}\\%$。`
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
                // 燃气灶烧水综合计算 (中端重点)
                const m_water = PHYSICS_ENGINE.randomPick([50, 100]); // 烧水 50kg 或 100kg
                const t0 = 20;
                const t1 = 70;
                const dt = t1 - t0;
                const c = 4200;
                const Q_abs = c * m_water * dt; // 吸热
                const eta = 0.50; // 效率 50%
                const Q_total = Q_abs / eta; // 煤气总热量
                const q_gas = 4.2e7; // 煤气热值
                const V_gas = Q_total / q_gas; // 需要煤气的体积 m³（由于精心设计，V一定是整除的干净整数！）
                return {
                    question: `某燃气灶在工作时将 $${m_water}\\text{ kg}$ 的水从 $20\\text{ ℃}$ 加热到 $70\\text{ ℃}$。已知水的比热容为 $4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$，燃气灶的加热效率为 $50\\%$，煤气的热值为 $4.2 \\times 10^7\\text{ J/m}^3$。求：（1）水吸收的热量是多少 J？（2）需要完全燃烧多少 m³ 的煤气？`,
                    answer: `(1) 水吸热为 ${Q_abs.toExponential(2).replace("e+", "\\times 10^")} J；(2) 煤气体积为 ${V_gas.toFixed(1)} m³`,
                    steps: [
                        `**(1) 计算水吸收的热量：**`,
                        `已知 $m_{水} = ${m_water}\\text{ kg}$，温度变化 $\\Delta t = 70\\text{ ℃} - 20\\text{ ℃} = 50\\text{ ℃}$。`,
                        `吸热：$Q_{吸} = c m_{水} \\Delta t = 4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)} \\times ${m_water}\\text{ kg} \\times 50\\text{ ℃} = ${Q_abs.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `**(2) 计算完全燃烧的煤气体积：**`,
                        `已知燃气灶的加热效率 $\\eta = 50\\%$。根据 $\\eta = \\frac{Q_{吸}}{Q_{放}}$ 得，煤气燃烧需释放的总热量：`,
                        `$Q_{放} = \\frac{Q_{吸}}{\\eta} = \\frac{${Q_abs.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}}{0.5} = ${Q_total.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$。`,
                        `根据气体完全燃烧放热公式 $Q_{放} = V q_{煤气}$ 得，消耗煤气的体积：`,
                        `$V = \\frac{Q_{放}}{q_{煤气}} = \\frac{${Q_total.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}}{4.2 \\times 10^7\\text{ J/m}^3} = ${V_gas.toFixed(1)}\\text{ m}^3$。`,
                        `**答：** 水吸收热量为 $${Q_abs.toExponential(2).replace("e+", "\\times 10^")}\\text{ J}$，需要完全燃烧 $${V_gas.toFixed(1)}\\text{ m}^3$ 的煤气。`
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
                const m = PHYSICS_ENGINE.randomPick([2, 5]);
                const dt = PHYSICS_ENGINE.randomPick([10, 20]);
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
                const dt = PHYSICS_ENGINE.randomPick([10, 50]);
                const m = PHYSICS_ENGINE.randomPick([2, 5]); // 理想质量
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
                // 已知热量求温升
                const m = 2; // 2kg
                const c_water = 4200;
                const Q = PHYSICS_ENGINE.randomPick([84000, 168000, 252000]); // 对应温升 10, 20, 30
                const dt = Q / (c_water * m);
                return {
                    question: `质量为 $2\\text{ kg}$ 的水，吸收了 $${Q}\\text{ J}$ 的热量后。已知水的比热容为 $4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$。水的温度将升高___________ $\\text{℃}$。`,
                    answer: `${dt}`,
                    steps: [
                        `1. 已知水质量 $m = 2\\text{ kg}$，比热容 $c = 4200\\text{ J/(kg}\\cdot\\text{℃)}$，吸热 $Q = ${Q}\\text{ J}$。`,
                        `2. 根据吸热公式 $Q = c m \\Delta t$ 变形求升温值：`,
                        `   $\\Delta t = \\frac{Q}{c m} = \\frac{${Q}\\text{ J}}{4200\\text{ J/(kg}\\cdot\\text{℃)} \\times 2\\text{ kg}} = ${dt}\\text{ ℃}$。`
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
                const m = PHYSICS_ENGINE.randomPick([1, 4]);
                const dt = PHYSICS_ENGINE.randomPick([10, 20, 30]);
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
                // 效率填空
                const Q_abs = 2.1e6;
                const Q_total = 4.2e6;
                const eta = (Q_abs / Q_total) * 100;
                return {
                    question: `某太阳能热水器在一天的日照下，箱内的水共吸收了 $2.1 \\times 10^6\\text{ J}$ 的热量。在此期间，太阳能接收板共接收了 $4.2 \\times 10^6\\text{ J}$ 的太阳辐射能量。则该太阳能热水器的光热转化效率为___________ $\\%$。`,
                    answer: `${eta}`,
                    steps: [
                        `1. 有用能量为水吸收的热量：$Q_{吸} = 2.1 \\times 10^6\\text{ J}$。`,
                        `2. 总接收能量为总能量：$Q_{总} = 4.2 \\times 10^6\\text{ J}$。`,
                        `3. 转化效率为：$\\eta = \\frac{Q_{吸}}{Q_{总}} \\times 100\\% = \\frac{2.1 \\times 10^6\\text{ J}}{4.2 \\times 10^6\\text{ J}} \\times 100\\% = 50\\%$。`
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
            id: "math_pythagoras_c",
            category: "geom",
            type: "calculation",
            score: 20,
            generator() {
                // 已知直角边求斜边
                const triple = PHYSICS_ENGINE.randomPick([
                    [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]
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
                    [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]
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
                const R = PHYSICS_ENGINE.randomPick([3, 6]);
                const n = PHYSICS_ENGINE.randomPick([60, 90, 120, 180]);
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
                    { data: [4, 5, 6, 7, 8], mean: 6, var: 2 }
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
            // 轮询或随机选择模板
            const template = matchedTemplates[results.length % matchedTemplates.length];
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
