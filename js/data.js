/**
 * 初中物理公式与定义手册 - 核心数据仓库
 * 包含力学、电学、热学、声学与光学各主要公式及定义、单位变换关系、例题及专项习题
 */

const PHYSICS_DB = {
    // 物理类别名称映射
    categories: {
        "all": "全部板块",
        "mechanics": "力学模块",
        "electricity": "电学模块",
        "thermodynamics": "热学模块",
        "acoustics-optics": "声学与光学"
    },

    // 公式手册数据
    formulas: [
        // ================= 力学部分 =================
        {
            id: "speed",
            imagePath: "images/illustrations/speed.png",
            category: "mechanics",
            title: "速度公式",
            symbolFormula: "v = \\frac{s}{t}",
            definition: "速度是描述物体运动快慢的物理量。在匀速直线运动中，速度等于物体在单位时间内通过的路程。",
            variables: [
                { symbol: "v", name: "速度", mainUnit: "m/s", altUnits: [{ unit: "km/h", factor: 3.6 }], conversionText: "1 m/s = 3.6 km/h" },
                { symbol: "s", name: "路程", mainUnit: "m", altUnits: [{ unit: "km", factor: 0.001 }, { unit: "cm", factor: 100 }], conversionText: "1 km = 1000 m" },
                { symbol: "t", name: "时间", mainUnit: "s", altUnits: [{ unit: "min", factor: 1/60 }, { unit: "h", factor: 1/3600 }], conversionText: "1 h = 60 min = 3600 s" }
            ],
            transformations: [
                { resultSymbol: "s", formula: "s = v t", description: "求物体通过的路程" },
                { resultSymbol: "t", formula: "t = \\frac{s}{v}", description: "求物体运动所花的时间" }
            ],
            // 交互式计算器参数设置：输入任意两个物理量，自动求第三个
            calculator: {
                variables: ["v", "s", "t"],
                solve: (inputs) => {
                    // inputs: { v, s, t }，其中一个是 undefined 或 null
                    let { v, s, t } = inputs;
                    if (v === null && s !== null && t !== null) {
                        return { v: s / t, step: "v = s / t = " + s + " / " + t + " = " + (s / t).toFixed(2) + " m/s" };
                    } else if (s === null && v !== null && t !== null) {
                        return { s: v * t, step: "s = v \\times t = " + v + " \\times " + t + " = " + (v * t).toFixed(2) + " m" };
                    } else if (t === null && v !== null && s !== null) {
                        if (v === 0) return { error: "速度不能为0" };
                        return { t: s / v, step: "t = s / v = " + s + " / " + v + " = " + (s / v).toFixed(2) + " s" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "一辆轿车在高速公路上行驶，它在 2 h 内通过的路程是 180 km。求这辆轿车行驶的速度是多少 km/h？合多少 m/s？",
                    steps: [
                        "1. 已知路程 $s = 180\\text{ km}$，时间 $t = 2\\text{ h}$。",
                        "2. 代入速度公式 $v = \\frac{s}{t}$ 计算：$v = \\frac{180\\text{ km}}{2\\text{ h}} = 90\\text{ km/h}$。",
                        "3. 进行单位换算：$90\\text{ km/h} = 90 \\times \\frac{1}{3.6}\\text{ m/s} = 25\\text{ m/s}$。",
                        "**答：** 这辆轿车行驶的速度是 $90\\text{ km/h}$，合 $25\\text{ m/s}$。"
                    ]
                }
            ]
        },
        {
            id: "density",
            category: "mechanics",
            title: "密度公式",
            symbolFormula: "\\rho = \\frac{m}{V}",
            definition: "单位体积某种物质的质量叫做这种物质的密度。密度是物质本身的一种物理特性，与物体的质量、体积大小无关。",
            variables: [
                { symbol: "\\rho", name: "密度", mainUnit: "kg/m³", altUnits: [{ unit: "g/cm³", factor: 0.001 }], conversionText: "1 g/cm³ = 1000 kg/m³" },
                { symbol: "m", name: "质量", mainUnit: "kg", altUnits: [{ unit: "g", factor: 1000 }, { unit: "t", factor: 0.001 }], conversionText: "1 kg = 1000 g" },
                { symbol: "V", name: "体积", mainUnit: "m³", altUnits: [{ unit: "dm³ (L)", factor: 1000 }, { unit: "cm³ (mL)", factor: 1000000 }], conversionText: "1 m³ = 1000 dm³ = 10⁶ cm³" }
            ],
            transformations: [
                { resultSymbol: "m", formula: "m = \\rho V", description: "已知密度和体积求物体的质量" },
                { resultSymbol: "V", formula: "V = \\frac{m}{\\rho}", description: "已知质量和密度求物体的体积" }
            ],
            calculator: {
                variables: ["\\rho", "m", "V"],
                solve: (inputs) => {
                    let rho = inputs["\\rho"];
                    let m = inputs["m"];
                    let V = inputs["V"];
                    if (rho === null && m !== null && V !== null) {
                        if (V === 0) return { error: "体积不能为0" };
                        return { "\\rho": m / V, step: "\\rho = m / V = " + m + " / " + V + " = " + (m / V).toFixed(2) + " kg/m³" };
                    } else if (m === null && rho !== null && V !== null) {
                        return { m: rho * V, step: "m = \\rho \\times V = " + rho + " \\times " + V + " = " + (rho * V).toFixed(2) + " kg" };
                    } else if (V === null && rho !== null && m !== null) {
                        if (rho === 0) return { error: "密度不能为0" };
                        return { V: m / rho, step: "V = m / \\rho = " + m + " / " + rho + " = " + (m / rho).toFixed(6) + " m³" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "一个铁球的质量为 395 g，体积是 80 cm³，求铁球的密度是多少？（铁的密度是 $7.9 \\times 10^3\\text{ kg/m}^3$）并分析该铁球是否是实心的？",
                    steps: [
                        "1. 已知铁球质量 $m = 395\\text{ g} = 0.395\\text{ kg}$，体积 $V = 80\\text{ cm}^3 = 8 \\times 10^{-5}\\text{ m}^3$。",
                        "2. 根据密度公式求铁球的实际密度：$\\rho_{球} = \\frac{m}{V} = \\frac{395\\text{ g}}{80\\text{ cm}^3} = 4.9375\\text{ g/cm}^3 = 4.94 \\times 10^3\\text{ kg/m}^3$。",
                        "3. 比较密度：因为 $\\rho_{球} = 4.94 \\times 10^3\\text{ kg/m}^3 < \\rho_{铁} = 7.9 \\times 10^3\\text{ kg/m}^3$。",
                        "**答：** 铁球的密度是 $4.94 \\times 10^3\\text{ kg/m}^3$，因为其密度小于铁的密度，所以该铁球是**空心**的。"
                    ]
                }
            ]
        },
        {
            id: "gravity",
            category: "mechanics",
            title: "重力公式",
            symbolFormula: "G = mg",
            definition: "物体由于地球的吸引而受到的力叫做重力。物体所受重力的大小跟它的质量成正比，比例常数 $g \\approx 9.8\\text{ N/kg}$ （在中考中通常取 $10\\text{ N/kg}$）。",
            variables: [
                { symbol: "G", name: "重力", mainUnit: "N", altUnits: [], conversionText: "力单位为牛顿 (N)" },
                { symbol: "m", name: "质量", mainUnit: "kg", altUnits: [{ unit: "g", factor: 1000 }], conversionText: "1 kg = 1000 g" },
                { symbol: "g", name: "常数", mainUnit: "N/kg", altUnits: [], conversionText: "通常取 9.8 N/kg 或 10 N/kg" }
            ],
            transformations: [
                { resultSymbol: "m", formula: "m = \\frac{G}{g}", description: "已知物体所受重力，求其质量" }
            ],
            calculator: {
                variables: ["G", "m", "g"],
                solve: (inputs) => {
                    let { G, m, g } = inputs;
                    if (g === null) g = 10; // 默认值
                    if (G === null && m !== null) {
                        return { G: m * g, step: "G = m \\times g = " + m + " \\times " + g + " = " + (m * g).toFixed(2) + " N" };
                    } else if (m === null && G !== null) {
                        if (g === 0) return { error: "g不能为0" };
                        return { m: G / g, step: "m = G / g = " + G + " / " + g + " = " + (G / g).toFixed(2) + " kg" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "一名中学生的质量是 50 kg，当他在地面上时，他所受到的重力大约是多少 N？（g取 10 N/kg）",
                    steps: [
                        "1. 已知学生质量 $m = 50\\text{ kg}$，重力加速度 $g = 10\\text{ N/kg}$。",
                        "2. 代入重力计算公式 $G = mg$：$G = 50\\text{ kg} \\times 10\\text{ N/kg} = 500\\text{ N}$。",
                        "**答：** 该中学生所受到的重力大约是 $500\\text{ N}$。"
                    ]
                }
            ]
        },
        {
            id: "pressure",
            category: "mechanics",
            title: "压强公式 (通用)",
            symbolFormula: "p = \\frac{F}{S}",
            definition: "物体单位面积上受到的压力叫做压强。压强是表示压力作用效果显著程度的物理量。",
            variables: [
                { symbol: "p", name: "压强", mainUnit: "Pa", altUnits: [{ unit: "kPa", factor: 0.001 }], conversionText: "1 Pa = 1 N/m²" },
                { symbol: "F", name: "压力", mainUnit: "N", altUnits: [], conversionText: "垂直作用在物体表面的力" },
                { symbol: "S", name: "受力面积", mainUnit: "m²", altUnits: [{ unit: "cm²", factor: 10000 }], conversionText: "1 m² = 10⁴ cm²" }
            ],
            transformations: [
                { resultSymbol: "F", formula: "F = p S", description: "已知压强和受力面积求垂直压力" },
                { resultSymbol: "S", formula: "S = \\frac{F}{p}", description: "已知压力和压强求受力面积" }
            ],
            calculator: {
                variables: ["p", "F", "S"],
                solve: (inputs) => {
                    let { p, F, S } = inputs;
                    if (p === null && F !== null && S !== null) {
                        if (S === 0) return { error: "面积不能为0" };
                        return { p: F / S, step: "p = F / S = " + F + " / " + S + " = " + (F / S).toFixed(2) + " Pa" };
                    } else if (F === null && p !== null && S !== null) {
                        return { F: p * S, step: "F = p \\times S = " + p + " \\times " + S + " = " + (p * S).toFixed(2) + " N" };
                    } else if (S === null && p !== null && F !== null) {
                        if (p === 0) return { error: "压强不能为0" };
                        return { S: F / p, step: "S = F / p = " + F + " / " + p + " = " + (F / p).toFixed(6) + " m²" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "重 480 N 的中学生双脚站立在水平地面上，单只鞋底与地面的接触面积是 150 cm²。求该同学站立时对地面的压强是多少 Pa？",
                    steps: [
                        "1. 水平地面上，人对地面的压力等于其重力：$F = G = 480\\text{ N}$。",
                        "2. 受力面积是双脚面积：$S = 2 \\times 150\\text{ cm}^2 = 300\\text{ cm}^2$。换算为平方米：$S = 300 \\times 10^{-4}\\text{ m}^2 = 0.03\\text{ m}^2$。",
                        "3. 代入压强公式 $p = \\frac{F}{S}$ 计算：$p = \\frac{480\\text{ N}}{0.03\\text{ m}^2} = 16000\\text{ Pa} = 16\\text{ kPa}$。",
                        "**答：** 站立时对地面的压强是 $16000\\text{ Pa}$。"
                    ]
                }
            ]
        },
        {
            id: "liquid-pressure",
            category: "mechanics",
            title: "液体压强公式",
            symbolFormula: "p = \\rho g h",
            definition: "液体由于重力且具有流动性，液体内部向各个方向都存在压强。在同种液体内部，深度越深，压强越大。",
            variables: [
                { symbol: "p", name: "液体压强", mainUnit: "Pa", altUnits: [], conversionText: "压强单位为帕斯卡 (Pa)" },
                { symbol: "\\rho", name: "液体密度", mainUnit: "kg/m³", altUnits: [{ unit: "g/cm³", factor: 0.001 }], conversionText: "水的密度为 1000 kg/m³" },
                { symbol: "g", name: "重力常数", mainUnit: "N/kg", altUnits: [], conversionText: "通常取 10 N/kg" },
                { symbol: "h", name: "液体深度", mainUnit: "m", altUnits: [{ unit: "cm", factor: 100 }], conversionText: "深度是从液体自由表面算起的垂直高度" }
            ],
            transformations: [
                { resultSymbol: "h", formula: "h = \\frac{p}{\\rho g}", description: "已知液体压强求深度" },
                { resultSymbol: "\\rho", formula: "\\rho = \\frac{p}{g h}", description: "已知压强和深度求液体密度" }
            ],
            calculator: {
                variables: ["p", "\\rho", "g", "h"],
                solve: (inputs) => {
                    let p = inputs["p"];
                    let rho = inputs["\\rho"];
                    let g = inputs["g"];
                    let h = inputs["h"];
                    if (g === null) g = 10;
                    if (p === null && rho !== null && h !== null) {
                        return { p: rho * g * h, step: "p = \\rho g h = " + rho + " \\times " + g + " \\times " + h + " = " + (rho * g * h).toFixed(2) + " Pa" };
                    } else if (h === null && p !== null && rho !== null) {
                        if (rho * g === 0) return { error: "除数不能为0" };
                        return { h: p / (rho * g), step: "h = p / (\\rho g) = " + p + " / (" + rho + " \\times " + g + ") = " + (p / (rho * g)).toFixed(2) + " m" };
                    } else if (rho === null && p !== null && h !== null) {
                        if (g * h === 0) return { error: "除数不能为0" };
                        return { "\\rho": p / (g * h), step: "\\rho = p / (g h) = " + p + " / (" + g + " \\times " + h + ") = " + (p / (g * h)).toFixed(2) + " kg/m³" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "三峡大坝蓄水池水深 175 m，求大坝底部承受水的压强是多少？（水密度 $\\rho = 1.0 \\times 10^3\\text{ kg/m}^3$，g取 10 N/kg）",
                    steps: [
                        "1. 已知水的密度 $\\rho = 1.0 \\times 10^3\\text{ kg/m}^3$，深度 $h = 175\\text{ m}$，常数 $g = 10\\text{ N/kg}$。",
                        "2. 代入液体压强公式 $p = \\rho g h$：$p = 1.0 \\times 10^3\\text{ kg/m}^3 \\times 10\\text{ N/kg} \\times 175\\text{ m} = 1.75 \\times 10^6\\text{ Pa} = 1.75\\text{ MPa}$。",
                        "**答：** 大坝底部承受水的压强是 $1.75 \\times 10^6\\text{ Pa}$。"
                    ]
                }
            ]
        },
        {
            id: "buoyancy",
            category: "mechanics",
            title: "阿基米德浮力公式",
            symbolFormula: "F_{浮} = \\rho_{液} g V_{排}",
            definition: "浸在液体中的物体，受到向上的浮力，浮力的大小等于它排开的液体所受的重力。这就是著名的阿基米德原理。",
            variables: [
                { symbol: "F_{浮}", name: "浮力", mainUnit: "N", altUnits: [] },
                { symbol: "\\rho_{液}", name: "液体密度", mainUnit: "kg/m³", altUnits: [{ unit: "g/cm³", factor: 0.001 }] },
                { symbol: "g", name: "重力常数", mainUnit: "N/kg", altUnits: [] },
                { symbol: "V_{排}", name: "排开液体体积", mainUnit: "m³", altUnits: [{ unit: "cm³", factor: 1000000 }] }
            ],
            transformations: [
                { resultSymbol: "V_{排}", formula: "V_{排} = \\frac{F_{浮}}{\\rho_{液} g}", description: "已知浮力求浸入液体中的体积" },
                { resultSymbol: "\\rho_{液}", formula: "\\rho_{液} = \\frac{F_{浮}}{g V_{排}}", description: "已知浮力和排开体积求未知液体密度" }
            ],
            calculator: {
                variables: ["F_{浮}", "\\rho_{液}", "g", "V_{排}"],
                solve: (inputs) => {
                    let Ff = inputs["F_{浮}"];
                    let rho = inputs["\\rho_{液}"];
                    let g = inputs["g"];
                    let Vp = inputs["V_{排}"];
                    if (g === null) g = 10;
                    if (Ff === null && rho !== null && Vp !== null) {
                        return { "F_{浮}": rho * g * Vp, step: "F_{浮} = \\rho_{液} g V_{排} = " + rho + " \\times " + g + " \\times " + Vp + " = " + (rho * g * Vp).toFixed(2) + " N" };
                    } else if (Vp === null && Ff !== null && rho !== null) {
                        if (rho * g === 0) return { error: "除数不能为0" };
                        return { "V_{排}": Ff / (rho * g), step: "V_{排} = F_{浮} / (\\rho_{液} g) = " + Ff + " / (" + rho + " \\times " + g + ") = " + (Ff / (rho * g)).toFixed(6) + " m³" };
                    } else if (rho === null && Ff !== null && Vp !== null) {
                        if (g * Vp === 0) return { error: "除数不能为0" };
                        return { "\\rho_{液}": Ff / (g * Vp), step: "\\rho_{液} = F_{浮} / (g V_{排}) = " + Ff + " / (" + g + " \\times " + Vp + ") = " + (Ff / (g * Vp)).toFixed(2) + " kg/m³" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "一个体积为 $200\\text{ cm}^3$ 的实心物体浸没在水中，求该物体受到的浮力是多少 N？（g取 10 N/kg）",
                    steps: [
                        "1. 物体浸没在水中，排开水的体积等于物体的体积：$V_{排} = V = 200\\text{ cm}^3 = 2 \\times 10^{-4}\\text{ m}^3$。",
                        "2. 水的密度 $\\rho_{水} = 1.0 \\times 10^3\\text{ kg/m}^3$。",
                        "3. 代入阿基米德浮力公式：$F_{浮} = \\rho_{水} g V_{排} = 1000\\text{ kg/m}^3 \\times 10\\text{ N/kg} \\times 2 \\times 10^{-4}\\text{ m}^3 = 2\\text{ N}$。",
                        "**答：** 该物体受到的浮力是 $2\\text{ N}$。"
                    ]
                }
            ]
        },
        {
            id: "lever",
            category: "mechanics",
            title: "杠杆平衡条件",
            symbolFormula: "F_1 L_1 = F_2 L_2",
            definition: "杠杆在动力和阻力作用下处于静止或匀速转动状态，称为杠杆平衡。平衡时，动力与动力臂的乘积等于阻力与阻力臂的乘积（也称杠杆原理）。",
            variables: [
                { symbol: "F_1", name: "动力", mainUnit: "N", altUnits: [] },
                { symbol: "L_1", name: "动力臂", mainUnit: "m", altUnits: [{ unit: "cm", factor: 100 }] },
                { symbol: "F_2", name: "阻力", mainUnit: "N", altUnits: [] },
                { symbol: "L_2", name: "阻力臂", mainUnit: "m", altUnits: [{ unit: "cm", factor: 100 }] }
            ],
            transformations: [
                { resultSymbol: "F_1", formula: "F_1 = \\frac{F_2 L_2}{L_1}", description: "已知阻力和力臂，求动力" },
                { resultSymbol: "L_1", formula: "L_1 = \\frac{F_2 L_2}{F_1}", description: "已知阻力和动力，求动力臂" }
            ],
            calculator: {
                variables: ["F_1", "L_1", "F_2", "L_2"],
                solve: (inputs) => {
                    let f1 = inputs["F_1"];
                    let l1 = inputs["L_1"];
                    let f2 = inputs["F_2"];
                    let l2 = inputs["L_2"];
                    if (f1 === null && l1 !== null && f2 !== null && l2 !== null) {
                        if (l1 === 0) return { error: "动力臂不能为0" };
                        return { "F_1": (f2 * l2) / l1, step: "F_1 = (F_2 \\times L_2) / L_1 = (" + f2 + " \\times " + l2 + ") / " + l1 + " = " + ((f2 * l2) / l1).toFixed(2) + " N" };
                    } else if (l1 === null && f1 !== null && f2 !== null && l2 !== null) {
                        if (f1 === 0) return { error: "动力不能为0" };
                        return { "L_1": (f2 * l2) / f1, step: "L_1 = (F_2 \\times L_2) / F_1 = (" + f2 + " \\times " + l2 + ") / " + f1 + " = " + ((f2 * l2) / f1).toFixed(2) + " m" };
                    } else if (f2 === null && f1 !== null && l1 !== null && l2 !== null) {
                        if (l2 === 0) return { error: "阻力臂不能为0" };
                        return { "F_2": (f1 * l1) / l2, step: "F_2 = (F_1 \\times L_1) / L_2 = (" + f1 + " \\times " + l1 + ") / " + l2 + " = " + ((f1 * l1) / l2).toFixed(2) + " N" };
                    } else if (l2 === null && f1 !== null && l1 !== null && f2 !== null) {
                        if (f2 === 0) return { error: "阻力不能为0" };
                        return { "L_2": (f1 * l1) / f2, step: "L_2 = (F_1 \\times L_1) / F_2 = (" + f1 + " \\times " + l1 + ") / " + f2 + " = " + ((f1 * l1) / f2).toFixed(2) + " m" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "一根轻质杠杆的动力臂是 1.2 m，阻力臂是 0.3 m。如果在阻力端挂一个重为 120 N 的物体，那么在动力端需要施加多大的力才能使杠杆保持水平平衡？",
                    steps: [
                        "1. 已知动力臂 $L_1 = 1.2\\text{ m}$，阻力臂 $L_2 = 0.3\\text{ m}$，阻力 $F_2 = G = 120\\text{ N}$。",
                        "2. 根据杠杆平衡条件：$F_1 L_1 = F_2 L_2$。",
                        "3. 代入数据求解动力 $F_1$：$F_1 = \\frac{F_2 L_2}{L_1} = \\frac{120\\text{ N} \\times 0.3\\text{ m}}{1.2\\text{ m}} = 30\\text{ N}$。",
                        "**答：** 在动力端需要施加 $30\\text{ N}$ 的力。"
                    ]
                }
            ]
        },
        {
            id: "work",
            category: "mechanics",
            title: "功的计算公式",
            symbolFormula: "W = F s",
            definition: "力学中的“功”包含两个必要因素：一是作用在物体上的力，二是物体在这个力的方向上移动的距离。功的大小等于力与距离的乘积。",
            variables: [
                { symbol: "W", name: "功", mainUnit: "J", altUnits: [{ unit: "kJ", factor: 0.001 }], conversionText: "1 J = 1 N·m" },
                { symbol: "F", name: "作用力", mainUnit: "N", altUnits: [] },
                { symbol: "s", name: "同向位移", mainUnit: "m", altUnits: [{ unit: "cm", factor: 100 }] }
            ],
            transformations: [
                { resultSymbol: "F", formula: "F = \\frac{W}{s}", description: "已知做功与移动距离求拉力" },
                { resultSymbol: "s", formula: "s = \\frac{W}{F}", description: "已知做功与拉力求移动的距离" }
            ],
            calculator: {
                variables: ["W", "F", "s"],
                solve: (inputs) => {
                    let { W, F, s } = inputs;
                    if (W === null && F !== null && s !== null) {
                        return { W: F * s, step: "W = F \\times s = " + F + " \\times " + s + " = " + (F * s).toFixed(2) + " J" };
                    } else if (F === null && W !== null && s !== null) {
                        if (s === 0) return { error: "距离不能为0" };
                        return { F: W / s, step: "F = W / s = " + W + " / " + s + " = " + (W / s).toFixed(2) + " N" };
                    } else if (s === null && W !== null && F !== null) {
                        if (F === 0) return { error: "力不能为0" };
                        return { s: W / F, step: "s = W / F = " + W + " / " + F + " = " + (W / F).toFixed(2) + " m" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "用 50 N 的水平推力将重 200 N 的箱子在水平地面上匀速推动 10 m，求推力对箱子做了多少功？重力对箱子做了多少功？",
                    steps: [
                        "1. 推力做功：推力为 $F = 50\\text{ N}$，箱子在推力方向上移动了 $s = 10\\text{ m}$。",
                        "   代入公式：$W_{推} = F s = 50\\text{ N} \\times 10\\text{ m} = 500\\text{ J}$。",
                        "2. 重力做功：重力的方向垂直向下，而箱子在水平方向上移动，没有在重力方向上通过位移（高度未变，位移为0）。",
                        "   根据功的概念，重力做功：$W_{重} = G \\times 0\\text{ m} = 0\\text{ J}$。",
                        "**答：** 推力做功为 $500\\text{ J}$，重力做功为 $0\\text{ J}$。"
                    ]
                }
            ]
        },
        {
            id: "power",
            category: "mechanics",
            title: "功率公式",
            symbolFormula: "P = \\frac{W}{t} = F v",
            definition: "功率是表示物体做功快慢的物理量。单位时间内所做的功叫做功率。当物体在力 $F$ 的作用下以速度 $v$ 匀速运动时，功率也等于 $F \\times v$。",
            variables: [
                { symbol: "P", name: "功率", mainUnit: "W", altUnits: [{ unit: "kW", factor: 0.001 }], conversionText: "1 kW = 1000 W" },
                { symbol: "W", name: "做功总量", mainUnit: "J", altUnits: [] },
                { symbol: "t", name: "做功时间", mainUnit: "s", altUnits: [{ unit: "min", factor: 1/60 }] },
                { symbol: "F", name: "拉力/推力", mainUnit: "N", altUnits: [] },
                { symbol: "v", name: "匀速速度", mainUnit: "m/s", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "W", formula: "W = P t", description: "已知功率和时间求所做的功" },
                { resultSymbol: "t", formula: "t = \\frac{W}{P}", description: "已知功率和总功求时间" }
            ],
            calculator: {
                variables: ["P", "W", "t"],
                solve: (inputs) => {
                    let { P, W, t } = inputs;
                    if (P === null && W !== null && t !== null) {
                        if (t === 0) return { error: "时间不能为0" };
                        return { P: W / t, step: "P = W / t = " + W + " / " + t + " = " + (W / t).toFixed(2) + " W" };
                    } else if (W === null && P !== null && t !== null) {
                        return { W: P * t, step: "W = P \\times t = " + P + " \\times " + t + " = " + (P * t).toFixed(2) + " J" };
                    } else if (t === null && P !== null && W !== null) {
                        if (P === 0) return { error: "功率不能为0" };
                        return { t: W / P, step: "t = W / P = " + W + " / " + P + " = " + (W / P).toFixed(2) + " s" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "一辆起重机在 20 s 内将重达 3000 N 的货物匀速提升了 10 m，求起重机提升货物的功率是多少 kW？",
                    steps: [
                        "1. 计算起重机对货物做的功：货物匀速提升，拉力等于重力 $F = G = 3000\\text{ N}$，高度 $s = 10\\text{ m}$。",
                        "   做功：$W = F s = 3000\\text{ N} \\times 10\\text{ m} = 30000\\text{ J}$。",
                        "2. 计算提升货物的功率：时间 $t = 20\\text{ s}$。",
                        "   功率：$P = \\frac{W}{t} = \\frac{30000\\text{ J}}{20\\text{ s}} = 1500\\text{ W} = 1.5\\text{ kW}$。",
                        "**答：** 起重机提升货物的功率是 $1.5\\text{ kW}$。"
                    ]
                }
            ]
        },
        {
            id: "torricelli-pressure",
            category: "mechanics",
            title: "托里拆利大气压公式",
            symbolFormula: "P_0 = \\rho_{水银} g h",
            definition: "托里拆利实验测出了大气压强的具体数值。在标准大气压下，大气压强等于 760 mm 高的水银柱产生的压强，大小约为 $1.013 \\times 10^5\\text{ Pa}$。",
            variables: [
                { symbol: "P_0", name: "大气压强", mainUnit: "Pa", altUnits: [{ unit: "kPa", factor: 0.001 }], conversionText: "标准大气压约为 1.013 × 10⁵ Pa" },
                { symbol: "\\rho_{水银}", name: "水银密度", mainUnit: "kg/m³", altUnits: [], conversionText: "通常取 13.6 × 10³ kg/m³" },
                { symbol: "g", name: "重力常数", mainUnit: "N/kg", altUnits: [], conversionText: "通常取 9.8 N/kg 或 10 N/kg" },
                { symbol: "h", name: "水银柱高度", mainUnit: "m", altUnits: [{ unit: "mm", factor: 1000 }], conversionText: "1 m = 1000 mm" }
            ],
            transformations: [
                { resultSymbol: "h", formula: "h = \\frac{P_0}{\\rho_{水银} g}", description: "已知大气压强求水银柱支持高度" }
            ],
            calculator: {
                variables: ["P_0", "\\rho_{水银}", "g", "h"],
                solve: (inputs) => {
                    let P = inputs["P_0"];
                    let rho = inputs["\\rho_{水银}"];
                    let g = inputs["g"];
                    let h = inputs["h"];
                    if (g === null) g = 10;
                    if (rho === null) rho = 13600;
                    if (P === null && h !== null) {
                        return { "P_0": rho * g * h, step: "P_0 = \\rho g h = " + rho + " \\times " + g + " \\times " + h + " = " + (rho * g * h).toFixed(0) + " Pa" };
                    } else if (h === null && P !== null) {
                        if (rho * g === 0) return { error: "除数不能为0" };
                        return { h: P / (rho * g), step: "h = P_0 / (\\rho g) = " + P + " / (" + rho + " \\times " + g + ") = " + (P / (rho * g)).toFixed(4) + " m" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "若托里拆利实验中玻璃管内水银柱高度为 750 mm，求此时的大气压强是多少 Pa？（水银密度为 $13.6 \\times 10^3\\text{ kg/m}^3$，g取 10 N/kg）",
                    steps: [
                        "1. 已知水银柱高度 $h = 750\\text{ mm} = 0.75\\text{ m}$，水银密度 $\\rho = 13.6 \\times 10^3\\text{ kg/m}^3$，常数 $g = 10\\text{ N/kg}$。",
                        "2. 根据液体压强公式计算大气压：$P_0 = \\rho g h = 13.6 \\times 10^3\\text{ kg/m}^3 \\times 10\\text{ N/kg} \\times 0.75\\text{ m} = 1.02 \\times 10^5\\text{ Pa}$。",
                        "**答：** 此时的大气压强是 $1.02 \\times 10^5\\text{ Pa}$。"
                    ]
                }
            ]
        },

        // ================= 电学部分 =================
        {
            id: "ohms-law",
            imagePath: "images/illustrations/ohms_law.png",
            category: "electricity",
            title: "欧姆定律",
            symbolFormula: "I = \\frac{U}{R}",
            definition: "导体中的电流，跟导体两端的电压成正比，跟导体的电阻成反比。这是直流电路计算的基础。",
            variables: [
                { symbol: "I", name: "电流", mainUnit: "A", altUnits: [{ unit: "mA", factor: 1000 }], conversionText: "1 A = 1000 mA" },
                { symbol: "U", name: "电压", mainUnit: "U", altUnits: [{ unit: "mV", factor: 1000 }], conversionText: "家庭电路电压为 220 V" },
                { symbol: "R", name: "电阻", mainUnit: "Ω", altUnits: [{ unit: "kΩ", factor: 0.001 }], conversionText: "电阻是导体对电流的阻碍作用" }
            ],
            transformations: [
                { resultSymbol: "U", formula: "U = I R", description: "已知电流和电阻求两端电压" },
                { resultSymbol: "R", formula: "R = \\frac{U}{I}", description: "已知电压和电流求电阻大小" }
            ],
            calculator: {
                variables: ["I", "U", "R"],
                solve: (inputs) => {
                    let { I, U, R } = inputs;
                    if (I === null && U !== null && R !== null) {
                        if (R === 0) return { error: "电阻不能为0" };
                        return { I: U / R, step: "I = U / R = " + U + " / " + R + " = " + (U / R).toFixed(2) + " A" };
                    } else if (U === null && I !== null && R !== null) {
                        return { U: I * R, step: "U = I \\times R = " + I + " \\times " + R + " = " + (I * R).toFixed(2) + " V" };
                    } else if (R === null && U !== null && I !== null) {
                        if (I === 0) return { error: "电流不能为0" };
                        return { R: U / I, step: "R = U / I = " + U + " / " + I + " = " + (U / I).toFixed(2) + " Ω" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "一个阻值为 20 Ω 的电阻两端加 6 V 的电压，求通过它的电流是多少 A？若电压变为 0 V，其电阻是多少 Ω？",
                    steps: [
                        "1. 已知电阻 $R = 20\\text{ }\\Omega$，电压 $U = 6\\text{ V}$。",
                        "2. 根据欧姆定律计算电流：$I = \\frac{U}{R} = \\frac{6\\text{ V}}{20\\text{ }\\Omega} = 0.3\\text{ A}$。",
                        "3. 电阻性质分析：电阻是导体本身的一种性质，只与导体的材料、长度、横截面积以及温度有关，与导体两端的电压和电流无关。所以即使电压变为 0 V，其电阻依然是 $20\\text{ }\\Omega$。",
                        "**答：** 通过它的电流是 $0.3\\text{ A}$，电压为 0 V 时其电阻仍然是 $20\\text{ }\\Omega$。"
                    ]
                }
            ]
        },
        {
            id: "electrical-work",
            category: "electricity",
            title: "电功计算公式",
            symbolFormula: "W = U I t",
            definition: "电能转化为其他形式能的过程就是电流做功的过程。电流做的功等于电压、电流和通电时间的乘积。",
            variables: [
                { symbol: "W", name: "电功", mainUnit: "J", altUnits: [{ unit: "kW·h (度)", factor: 1/3600000 }], conversionText: "1 kW·h (度) = 3.6 × 10⁶ J" },
                { symbol: "U", name: "电压", mainUnit: "V", altUnits: [] },
                { symbol: "I", name: "电流", mainUnit: "A", altUnits: [] },
                { symbol: "t", name: "通电时间", mainUnit: "s", altUnits: [{ unit: "h", factor: 1/3600 }] }
            ],
            transformations: [
                { resultSymbol: "U", formula: "U = \\frac{W}{I t}", description: "已知电功求两端电压" },
                { resultSymbol: "t", formula: "t = \\frac{W}{U I}", description: "已知电能消耗求工作时间" }
            ],
            calculator: {
                variables: ["W", "U", "I", "t"],
                solve: (inputs) => {
                    let { W, U, I, t } = inputs;
                    if (W === null && U !== null && I !== null && t !== null) {
                        return { W: U * I * t, step: "W = U I t = " + U + " \\times " + I + " \\times " + t + " = " + (U * I * t).toFixed(2) + " J" };
                    } else if (t === null && W !== null && U !== null && I !== null) {
                        if (U * I === 0) return { error: "电压或电流不能为0" };
                        return { t: W / (U * I), step: "t = W / (U I) = " + W + " / (" + U + " \\times " + I + ") = " + (W / (U * I)).toFixed(2) + " s" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "一只电热水壶接在 220 V 的家庭电路中，通过它的电流为 5 A，通电工作 10 min，消耗了多少 J 的电能？合多少度电？",
                    steps: [
                        "1. 已知电压 $U = 220\\text{ V}$，电流 $I = 5\\text{ A}$，时间 $t = 10\\text{ min} = 600\\text{ s}$。",
                        "2. 代入电功基本公式计算：$W = U I t = 220\\text{ V} \\times 5\\text{ A} \\times 600\\text{ s} = 6.6 \\times 10^5\\text{ J}$。",
                        "3. 将焦耳转换为度（千瓦时）：$W = \\frac{6.6 \\times 10^5\\text{ J}}{3.6 \\times 10^6\\text{ J/kW\\cdot h}} \\approx 0.183\\text{ kW\\cdot h}$。",
                        "**答：** 消耗了 $6.6 \\times 10^5\\text{ J}$ 的电能，合大约 $0.183$ 度电。"
                    ]
                }
            ]
        },
        {
            id: "electrical-power",
            category: "electricity",
            title: "电功率公式",
            symbolFormula: "P = UI = I^2R = \\frac{U^2}{R}",
            definition: "电功率表示电流做功的快慢。定义式为 $P = \\frac{W}{t}$，普适计算式为 $P = UI$。在纯电阻电路中，还可以使用欧姆定律推导出 $P = I^2R$ 和 $P = \\frac{U^2}{R}$。",
            variables: [
                { symbol: "P", name: "电功率", mainUnit: "W", altUnits: [{ unit: "kW", factor: 0.001 }] },
                { symbol: "U", name: "电压", mainUnit: "V", altUnits: [] },
                { symbol: "I", name: "电流", mainUnit: "A", altUnits: [] },
                { symbol: "R", name: "纯电阻", mainUnit: "Ω", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "I", formula: "I = \\frac{P}{U}", description: "已知电功率和额定电压求电流" },
                { resultSymbol: "R", formula: "R = \\frac{U^2}{P}", description: "已知用电器额定参数求其电阻" }
            ],
            calculator: {
                variables: ["P", "U", "I"],
                solve: (inputs) => {
                    let { P, U, I } = inputs;
                    if (P === null && U !== null && I !== null) {
                        return { P: U * I, step: "P = U \\times I = " + U + " \\times " + I + " = " + (U * I).toFixed(2) + " W" };
                    } else if (I === null && P !== null && U !== null) {
                        if (U === 0) return { error: "电压不能为0" };
                        return { I: P / U, step: "I = P / U = " + P + " / " + U + " = " + (P / U).toFixed(2) + " A" };
                    } else if (U === null && P !== null && I !== null) {
                        if (I === 0) return { error: "电流不能为0" };
                        return { U: P / I, step: "U = P / I = " + P + " / " + I + " = " + (P / I).toFixed(2) + " V" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "一盏标有“220V 40W”的日光灯。求：（1）该日光灯正常工作时的电阻是多少？（2）日光灯正常发光时的电流是多少？",
                    steps: [
                        "1. 已知额定电压 $U = 220\\text{ V}$，额定功率 $P = 40\\text{ W}$。",
                        "2. 计算日光灯正常工作时的电阻：在纯电阻用电器中，使用公式 $P = \\frac{U^2}{R}$ 可得：$R = \\frac{U^2}{P} = \\frac{(220\\text{ V})^2}{40\\text{ W}} = 1210\\text{ }\\Omega$。",
                        "3. 计算正常工作时的电流：使用公式 $P = UI$ 可得：$I = \\frac{P}{U} = \\frac{40\\text{ W}}{220\\text{ V}} \\approx 0.18\\text{ A}$。",
                        "**答：** 日光灯正常工作时的电阻是 $1210\\text{ }\\Omega$，正常发光时的电流大约是 $0.18\\text{ A}$。"
                    ]
                }
            ]
        },
        {
            id: "joules-law",
            category: "electricity",
            title: "焦耳定律",
            symbolFormula: "Q = I^2 R t",
            definition: "电流通过导体产生的热量跟电流的二次方成正比，跟导体的电阻成正比，跟通电时间成正比。如果是纯电阻电器，产生的热量 $Q$ 刚好等于消耗的电能 $W$。",
            variables: [
                { symbol: "Q", name: "电热量", mainUnit: "J", altUnits: [] },
                { symbol: "I", name: "通过电流", mainUnit: "A", altUnits: [] },
                { symbol: "R", name: "导体电阻", mainUnit: "Ω", altUnits: [] },
                { symbol: "t", name: "通电时间", mainUnit: "s", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "R", formula: "R = \\frac{Q}{I^2 t}", description: "已知产生的电热求导体电阻" }
            ],
            calculator: {
                variables: ["Q", "I", "R", "t"],
                solve: (inputs) => {
                    let Q = inputs["Q"];
                    let I = inputs["I"];
                    let R = inputs["R"];
                    let t = inputs["t"];
                    if (Q === null && I !== null && R !== null && t !== null) {
                        return { Q: I * I * R * t, step: "Q = I² R t = " + I + "² \\times " + R + " \\times " + t + " = " + (I * I * R * t).toFixed(2) + " J" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "一个阻值为 10 Ω 的电热丝，通过的电流为 2 A，通电时间为 1 min。求电热丝产生的热量是多少 J？",
                    steps: [
                        "1. 已知电阻 $R = 10\\text{ }\\Omega$，电流 $I = 2\\text{ A}$，通电时间 $t = 1\\text{ min} = 60\\text{ s}$。",
                        "2. 代入焦耳定律公式计算电热：$Q = I^2 R t = (2\\text{ A})^2 \\times 10\\text{ }\\Omega \\times 60\\text{ s} = 4 \\times 10 \\times 60 = 2400\\text{ J}$。",
                        "**答：** 电热丝通电 1 分钟产生的热量是 $2400\\text{ J}$。"
                    ]
                }
            ]
        },
        {
            id: "ampere-rule",
            category: "electricity",
            title: "通电螺线管安培定则",
            symbolFormula: "\\text{判定螺线管 } N/S \\text{ 极}",
            definition: "用右手握住螺线管，让四指弯向螺线管中电流的方向，则大拇指所指的那一端就是螺线管的 N 极。这对于判定电磁铁极性极其关键。",
            variables: [
                { symbol: "\\text{绕法}", name: "前面导线电流方向", mainUnit: "向上/向下", altUnits: [] },
                { symbol: "\\text{极性}", name: "电源左端极性", mainUnit: "正极/负极", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "\\text{磁极}", formula: "\\text{大拇指方向} \\implies N\\text{极}", description: "判断螺线管磁极" }
            ],
            calculator: {
                variables: ["\\text{绕法}", "\\text{极性}"],
                solve: (inputs) => {
                    let rawWinding = inputs["\\text{绕法}"]; 
                    let rawPolarity = inputs["\\text{极性}"]; 
                    if (rawWinding === null || rawPolarity === null) {
                        return { error: "请输入1（代表向上/正极）或0（代表向下/负极）" };
                    }
                    let isLeftN = (rawWinding === 1 && rawPolarity === 1) || (rawWinding === 0 && rawPolarity === 0);
                    let resultStr = isLeftN ? "左端为 N 极，右端为 S 极" : "左端为 S 极，右端为 N 极";
                    return { "\\text{磁极}": isLeftN ? 1 : 0, step: "依据右手螺旋定则判定得出：<strong>" + resultStr + "</strong>" };
                }
            },
            examples: [
                {
                    question: "已知一个螺线管，电流从左端流入，右端流出，从前方看绕线电流方向向下，求螺线管左端是什么极？",
                    steps: [
                        "1. 电流从左端流入，前方导线电流方向向下。",
                        "2. 用右手握住螺线管，让四指弯曲方向向下，大拇指指向右端。",
                        "3. 因此，螺线管的右端为 N 极，左端即为 S 极。",
                        "**答：** 螺线管左端是 S 极。"
                    ]
                }
            ]
        },
        {
            id: "electromagnetic-induction",
            category: "electricity",
            title: "发电机与电动机原理",
            symbolFormula: "\\text{发电机: 电磁感应} \\quad \\text{电动机: 磁场对电流作用}",
            definition: "1. 电磁感应：闭合电路的一部分导体在磁场中做切割磁感线运动，产生感应电流，是发电机的工作原理。<br>2. 磁场对通电导线的作用：通电导体在磁场中受到力的作用而发生运动，是电动机的工作原理。",
            variables: [
                { symbol: "\\text{现象}", name: "输入能量类型", mainUnit: "电能/机械能", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "\\text{应用}", formula: "\\text{能量转化方向}", description: "机械能转电能为发电机，反之为电动机" }
            ],
            calculator: {
                variables: ["\\text{现象}"],
                solve: (inputs) => {
                    let type = inputs["\\text{现象}"]; 
                    if (type === null) return { error: "请输入 1 (代表输入机械能) 或 0 (代表输入电能)" };
                    if (type === 1) {
                        return { "\\text{应用}": 1, step: "输入机械能产生电能：利用<strong>电磁感应原理</strong>，应用为<strong>发电机</strong>。" };
                    } else {
                        return { "\\text{应用}": 0, step: "输入电能产生机械能：利用<strong>通电导线在磁场中受力转动原理</strong>，应用为<strong>电动机</strong>。" };
                    }
                }
            },
            examples: [
                {
                    question: "微型风扇通电时能转动，但把它跟发光二极管连接，用力快速转动扇叶，二极管会发光。分析这两次过程中它的工作原理。",
                    steps: [
                        "1. 电风扇通电转动：输入电能转化为机械能，工作原理是**通电导体在磁场中受到力的作用**（电动机原理）。",
                        "2. 快速手转扇叶二极管发光：输入机械能转化为电能，产生感应电流，工作原理是**电磁感应现象**（发电机原理）。",
                        "**答：** 前者利用磁场对通电导线有力的作用，后者利用电磁感应现象。"
                    ]
                }
            ]
        },

        // ================= 热学部分 =================
        {
            id: "specific-heat",
            category: "thermodynamics",
            title: "比热容热量公式",
            symbolFormula: "Q = c m \\Delta t",
            definition: "物体温度升高（或降低）吸收（或放出）的热量，等于它的比热容、质量与温度变化量的乘积。其中，温度升高 $\\Delta t = t_{末} - t_{初}$，温度降低 $\\Delta t = t_{初} - t_{末}$。",
            variables: [
                { symbol: "Q", name: "热量", mainUnit: "J", altUnits: [] },
                { symbol: "c", name: "比热容", mainUnit: "J/(kg·℃)", altUnits: [], conversionText: "水的比热容为 4.2 × 10³ J/(kg·℃)" },
                { symbol: "m", name: "质量", mainUnit: "kg", altUnits: [{ unit: "g", factor: 1000 }] },
                { symbol: "\\Delta t", name: "变化温度", mainUnit: "℃", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "m", formula: "m = \\frac{Q}{c \\Delta t}", description: "已知吸热和升温求物体质量" },
                { resultSymbol: "\\Delta t", formula: "\\Delta t = \\frac{Q}{c m}", description: "已知吸收热量求温度升高值" }
            ],
            calculator: {
                variables: ["Q", "c", "m", "\\Delta t"],
                solve: (inputs) => {
                    let Q = inputs["Q"];
                    let c = inputs["c"];
                    let m = inputs["m"];
                    let dt = inputs["\\Delta t"];
                    if (c === null) c = 4200; // 默认水的比热容
                    if (Q === null && m !== null && dt !== null) {
                        return { Q: c * m * dt, step: "Q = c m \\Delta t = " + c + " \\times " + m + " \\times " + dt + " = " + (c * m * dt).toFixed(2) + " J" };
                    } else if (dt === null && Q !== null && m !== null) {
                        if (c * m === 0) return { error: "除数不能为0" };
                        return { "\\Delta t": Q / (c * m), step: "\\Delta t = Q / (c m) = " + Q + " / (" + c + " \\times " + m + ") = " + (Q / (c * m)).toFixed(2) + " ℃" };
                    } else if (m === null && Q !== null && dt !== null) {
                        if (c * dt === 0) return { error: "除数不能为0" };
                        return { m: Q / (c * dt), step: "m = Q / (c \\Delta t) = " + Q + " / (" + c + " \\times " + dt + ") = " + (Q / (c * dt)).toFixed(3) + " kg" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "质量为 2 kg 的水，温度从 20 ℃ 升高到 80 ℃，求水吸收的热量是多少 J？[水的比热容 $c = 4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$]",
                    steps: [
                        "1. 已知水质量 $m = 2\\text{ kg}$，初始温度 $t_1 = 20\\text{ ℃}$，末温 $t_2 = 80\\text{ ℃}$，温度变化量 $\\Delta t = t_2 - t_1 = 60\\text{ ℃}$。",
                        "2. 水的比热容 $c = 4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$。",
                        "3. 代入公式：$Q_{吸} = c m \\Delta t = 4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)} \\times 2\\text{ kg} \\times 60\\text{ ℃} = 5.04 \\times 10^5\\text{ J}$。",
                        "**答：** 水吸收的热量是 $5.04 \\times 10^5\\text{ J}$。"
                    ]
                }
            ]
        },
        {
            id: "fuel-combustion",
            category: "thermodynamics",
            title: "燃料燃烧放热公式",
            symbolFormula: "Q_{放} = mq \\text{ 或 } Q_{放} = Vq",
            definition: "燃料完全燃烧释放的热量，等于燃料的质量（或体积）乘以其热值。对于固体/液体燃料，计算式为 $Q = mq$；对于气体燃料，通常计算式为 $Q = Vq$。",
            variables: [
                { symbol: "Q_{放}", name: "燃烧释放热量", mainUnit: "J", altUnits: [] },
                { symbol: "q", name: "燃料热值", mainUnit: "J/kg 或 J/m³", altUnits: [] },
                { symbol: "m", name: "固体/液体质量", mainUnit: "kg", altUnits: [] },
                { symbol: "V", name: "气体燃料体积", mainUnit: "m³", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "q", formula: "q = \\frac{Q_{放}}{m}", description: "已知放热与消耗质量求燃料热值" }
            ],
            calculator: {
                variables: ["Q_{放}", "m", "q"],
                solve: (inputs) => {
                    let Qf = inputs["Q_{放}"];
                    let m = inputs["m"];
                    let q = inputs["q"];
                    if (Qf === null && m !== null && q !== null) {
                        return { "Q_{放}": m * q, step: "Q_{放} = m \\times q = " + m + " \\times " + q + " = " + (m * q).toFixed(2) + " J" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "完全燃烧 2 kg 的干木柴，能释放出多少 J 的热量？（干木柴的热值为 $1.2 \\times 10^7\\text{ J/kg}$）",
                    steps: [
                        "1. 已知干木柴的质量 $m = 2\\text{ kg}$，热值 $q = 1.2 \\times 10^7\\text{ J/kg}$。",
                        "2. 代入燃料完全燃烧放热公式 $Q_{放} = mq$：$Q_{放} = 2\\text{ kg} \\times 1.2 \\times 10^7\\text{ J/kg} = 2.4 \\times 10^7\\text{ J}$。",
                        "**答：** 完全燃烧干木柴能释放出 $2.4 \\times 10^7\\text{ J}$ 的热量。"
                    ]
                }
            ]
        },

        // ================= 声学与光学部分 =================
        {
            id: "sound-echo",
            category: "acoustics-optics",
            title: "回声测距公式",
            symbolFormula: "s = \\frac{1}{2} v t",
            definition: "声音遇到障碍物会被反射回来，人耳听到回声。由于声音一来一回经过了双倍的距离，因此声源与障碍物的单向距离等于声速乘以时间的一半。",
            variables: [
                { symbol: "s", name: "单向距离", mainUnit: "m", altUnits: [] },
                { symbol: "v", name: "声速", mainUnit: "m/s", altUnits: [], conversionText: "在 15℃ 的空气中，声速约为 340 m/s" },
                { symbol: "t", name: "听到回声总时间", mainUnit: "s", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "t", formula: "t = \\frac{2 s}{v}", description: "已知距离求发出到接收回声的时间" }
            ],
            calculator: {
                variables: ["s", "v", "t"],
                solve: (inputs) => {
                    let { s, v, t } = inputs;
                    if (v === null) v = 340;
                    if (s === null && t !== null) {
                        return { s: 0.5 * v * t, step: "s = 0.5 \\times v \\times t = 0.5 \\times " + v + " \\times " + t + " = " + (0.5 * v * t).toFixed(2) + " m" };
                    } else if (t === null && s !== null) {
                        if (v === 0) return { error: "声速不能为0" };
                        return { t: (2 * s) / v, step: "t = (2 \\times s) / v = (2 \\times " + s + ") / " + v + " = " + ((2 * s) / v).toFixed(2) + " s" };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "一艘测量船用超声波对深海海底进行测距，向海底垂直发射超声波。经过 4 s 后收到回声信号。求该处海底的深度？（已知超声波在海水中的传播速度为 1500 m/s）",
                    steps: [
                        "1. 已知超声波传播时间为两倍路程时间 $t = 4\\text{ s}$，在水中的声速 $v = 1500\\text{ m/s}$。",
                        "2. 代入回声测距公式：$s = \\frac{1}{2} v t = \\frac{1}{2} \\times 1500\\text{ m/s} \\times 4\\text{ s} = 3000\\text{ m}$。",
                        "**答：** 该处海底的深度是 $3000\\text{ m}$。"
                    ]
                }
            ]
        },
        {
            id: "lens-imaging",
            imagePath: "images/illustrations/lens_imaging.png",
            category: "acoustics-optics",
            title: "凸透镜成像规律",
            symbolFormula: "\\text{成像口诀：一倍焦距分虚实，二倍焦距分大小}",
            definition: "凸透镜成像规律是初中物理光学中最为核心的定性规律，阐明了物距 u 处于不同区间时，所成的实像或虚像的倒正、大小及像距变化规律。这是照相机、投影仪和放大镜的共同工作基石。",
            variables: [
                { symbol: "f", name: "凸透镜焦距", mainUnit: "cm", altUnits: [] },
                { symbol: "u", name: "蜡烛物距", mainUnit: "cm", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "v", formula: "u > 2f \\implies f < v < 2f \\quad \\text{(缩小实像)}", description: "物距大于二倍焦距所成实像特征（照相机）" },
                { resultSymbol: "v", formula: "f < u < 2f \\implies v > 2f \\quad \\text{(放大实像)}", description: "物距在一倍到二倍焦距间实像特征（投影仪）" }
            ],
            calculator: {
                variables: ["f", "u"],
                solve: (inputs) => {
                    let f = inputs["f"];
                    let u = inputs["u"];
                    if (f === null || u === null) {
                        return { error: "请同时输入凸透镜焦距 f 和物距 u（单位均为 cm）" };
                    }
                    if (f <= 0 || u <= 0) {
                        return { error: "焦距和物距必须为大于0的正数" };
                    }

                    let stepText = "";
                    let val = null;

                    stepText += `<div><strong>第一步：区间关系判定</strong><br>`;
                    stepText += `&nbsp;&nbsp;• 已知焦距 $f = ${f}\\text{ cm}$，二倍焦距 $2f = ${2 * f}\\text{ cm}$。<br>`;
                    stepText += `&nbsp;&nbsp;• 输入物距 $u = ${u}\\text{ cm}$，`;

                    if (u > 2 * f) {
                        stepText += `满足 $u > 2f$ ($${u}\\text{ cm} > ${2*f}\\text{ cm}$) 的区间条件。</div>`;
                        stepText += `<div><strong>第二步：成像性质分析</strong><br>`;
                        stepText += `&nbsp;&nbsp;• **像的性质**：在透镜另一侧光屏上成**倒立、缩小**的**实像**。<br>`;
                        stepText += `&nbsp;&nbsp;• **像距范围**：像距 $v$ 的范围在 $f < v < 2f$（即 $${f}\\text{ cm} < v < ${2*f}\\text{ cm}$ 区域）。<br>`;
                        stepText += `&nbsp;&nbsp;• **应用场景**：这与**照相机**的成像原理相同。<br>`;
                        stepText += `&nbsp;&nbsp;• **动态规律**：若此时将蜡烛靠近透镜，物距减小，为了承接清晰的像，光屏必须**远离**透镜，且所成的像将**变大**。</div>`;
                        val = 2 * f - 1; 
                    } else if (u === 2 * f) {
                        stepText += `刚好等于二倍焦距 $u = 2f$ ($${u}\\text{ cm} = ${2*f}\\text{ cm}$)。</div>`;
                        stepText += `<div><strong>第二步：成像性质分析</strong><br>`;
                        stepText += `&nbsp;&nbsp;• **像的性质**：在透镜另一侧光屏上成**倒立、等大**的**实像**。<br>`;
                        stepText += `&nbsp;&nbsp;• **像距范围**：像距 $v = 2f = ${2*f}\\text{ cm}$。<br>`;
                        stepText += `&nbsp;&nbsp;• **应用场景**：这在中考实验中常用于**粗测凸透镜的焦距**。</div>`;
                        val = 2 * f;
                    } else if (u > f && u < 2 * f) {
                        stepText += `满足 $f < u < 2f$ ($${f}\\text{ cm} < ${u}\\text{ cm} < ${2*f}\\text{ cm}$) 的区间条件。</div>`;
                        stepText += `<div><strong>第二步：成像性质分析</strong><br>`;
                        stepText += `&nbsp;&nbsp;• **像的性质**：在透镜另一侧光屏上成**倒立、放大**的**实像**。<br>`;
                        stepText += `&nbsp;&nbsp;• **像距范围**：像距 $v > 2f$（即像距大于 $${2*f}\\text{ cm}$ 区域）。<br>`;
                        stepText += `&nbsp;&nbsp;• **应用场景**：这与**投影仪/幻灯机**的成像原理相同。<br>`;
                        stepText += `&nbsp;&nbsp;• **动态规律**：若此时将蜡烛靠近透镜，物距减小，为了承接清晰的像，光屏必须**远离**透镜，且所成的像将**变大**。</div>`;
                        val = 2 * f + 1;
                    } else if (u === f) {
                        stepText += `刚好等于一倍焦距 $u = f$ ($${u}\\text{ cm} = ${f}\\text{ cm}$)。</div>`;
                        stepText += `<div><strong>第二步：成像性质分析</strong><br>`;
                        stepText += `&nbsp;&nbsp;• **成像性质**：此时蜡烛处于焦点处，折射光线为平行光射出，**不成像**。<br>`;
                        stepText += `&nbsp;&nbsp;• **应用场景**：这在物理上用于获得平行光源（如探照灯）。</div>`;
                        val = f;
                    } else {
                        stepText += `满足 $u < f$ ($${u}\\text{ cm} < ${f}\\text{ cm}$) 的区间条件。</div>`;
                        stepText += `<div><strong>第二步：成像性质分析</strong><br>`;
                        stepText += `&nbsp;&nbsp;• **像的性质**：成**正立、放大**的**虚像**。像与蜡烛在同侧。<br>`;
                        stepText += `&nbsp;&nbsp;• **像距范围**：虚像无法在光屏上接收，只能用眼睛透过透镜观察。<br>`;
                        stepText += `&nbsp;&nbsp;• **应用场景**：这与**放大镜**的原理相同。</div>`;
                        val = 0.5 * f;
                    }

                    return { f: val, step: stepText };
                }
            },
            examples: [
                {
                    question: "在探究凸透镜成像规律的实验中，将焦距为 10 cm 的凸透镜放在光屏与蜡烛之间。若蜡烛距离凸透镜 15 cm，移动光屏，在光屏上将得到一个怎样的清晰的像？此成像规律在生活中有何应用？",
                    steps: [
                        "1. 确定已知条件：焦距 $f = 10\\text{ cm}$，物距 $u = 15\\text{ cm}$。",
                        "2. 分析判定区间：因为 $10\\text{ cm} < 15\\text{ cm} < 20\\text{ cm}$，即一倍焦距和二倍焦距之间（$f < u < 2f$）。",
                        "3. 应用初中凸透镜规律结论：当 $f < u < 2f$ 时，在另一侧光屏上将成**倒立、放大**的**实像**。",
                        "4. 联系生活实际：这一成像规律在日常生活中的应用是**投影仪**（或幻灯机）。",
                        "**答：** 在光屏上将得到一个倒立、放大的实像；此规律在生活中的应用是投影仪。"
                    ]
                }
            ]
        }
    ],

    // 专项练习题数据
    practiceQuestions: [
        {
            id: "q_mech_1",
            category: "mechanics",
            type: "fill", // 填空题
            score: 10,
            question: "一辆洒水车在一条水平街道上匀速行驶并洒水，在洒水过程中，该洒水车的动能将___________（选填“变大”、“变小”或“不变”）。若洒水车以 36 km/h 的速度匀速前行了 5 min，则通过的路程是___________ m。",
            answer: "变小；3000",
            steps: [
                "1. **第一空解析：** 洒水车在匀速行驶并洒水的过程中，速度 $v$ 不变，但洒水导致车内水质量不断减少，从而车和水总质量 $m$ 变小。根据动能的决定因素，质量越小，速度不变时其动能变小。因此动能**变小**。",
                "2. **第二空计算过程：**",
                "   - 先统一单位：车速 $v = 36\\text{ km/h} = \\frac{36}{3.6}\\text{ m/s} = 10\\text{ m/s}$。",
                "   - 洒水时间 $t = 5\\text{ min} = 5 \\times 60\\text{ s} = 300\\text{ s}$。",
                "   - 根据速度公式变形 $s = vt$ 得：$s = 10\\text{ m/s} \\times 300\\text{ s} = 3000\\text{ m}$。"
            ]
        },
        {
            id: "q_mech_2",
            category: "mechanics",
            type: "calculation", // 计算大题
            score: 25,
            question: "如图所示，一个底面积为 $100\\text{ cm}^2$ 的圆柱形薄壁容器置于水平桌面上，里面盛有足够深的水。现将一个质量为 600 g 的实心小球缓慢放入水中，小球静止后漂浮在水面上，且有 $\\frac{1}{5}$ 的体积露出水面。（$g$ 取 $10\\text{ N/kg}$，$\\rho_{水} = 1.0 \\times 10^3\\text{ kg/m}^3$）求：<br>" +
                      "(1) 小球受到的浮力是多大？<br>" +
                      "(2) 小球的密度是多少 kg/m³？<br>" +
                      "(3) 放入小球后，水对容器底部的压力增加了多少 N？",
            answer: "(1) 浮力为 6 N； (2) 密度为 0.8 × 10³ kg/m³； (3) 压力增加了 6 N",
            steps: [
                "**(1) 计算小球受到的浮力**",
                "因为小球静止在水面上时处于漂浮状态，所以它受到的浮力等于它所受的重力。",
                "小球质量 $m = 600\\text{ g} = 0.6\\text{ kg}$。",
                "小球重力：$G = mg = 0.6\\text{ kg} \\times 10\\text{ N/kg} = 6\\text{ N}$。",
                "因为漂浮，所以：$F_{浮} = G = 6\\text{ N}$。",
                "---",
                "**(2) 计算小球的密度**",
                "根据阿基米德浮力公式：$F_{浮} = \\rho_{水} g V_{排}$，可得排开水的体积：",
                "$V_{排} = \\frac{F_{浮}}{\\rho_{水} g} = \\frac{6\\text{ N}}{1000\\text{ kg/m}^3 \\times 10\\text{ N/kg}} = 6 \\times 10^{-4}\\text{ m}^3$。",
                "由于小球有 $\\frac{1}{5}$ 的体积露出水面，则排开体积占总体积的 $\\frac{4}{5}$：",
                "$V_{排} = \\frac{4}{5} V_{球} \\implies V_{球} = \\frac{5}{4} V_{排} = \\frac{5}{4} \\times 6 \\times 10^{-4}\\text{ m}^3 = 7.5 \\times 10^{-4}\\text{ m}^3$。",
                "根据密度计算公式：",
                "$\\rho_{球} = \\frac{m}{V_{球}} = \\frac{0.6\\text{ kg}}{7.5 \\times 10^{-4}\\text{ m}^3} = 0.8 \\times 10^3\\text{ kg/m}^3$。",
                "---",
                "**(3) 计算容器底部受到的压力增加量**",
                "容器为圆柱形薄壁容器，小球浮在水面，水不溢出。",
                "水对容器底部的压力增加量 $\\Delta F$ 等于容器中水深引起的压力增加。",
                "由于薄壁直立容器中，水对容器底部的压力增加量，在数值上正好等于由于放入小球后排开水而增加的“重力效果”（即小球排开水的重力，亦即浮力）：",
                "$\\Delta F = G_{排} = F_{浮} = 6\\text{ N}$。"
            ]
        },
        {
            id: "q_elec_1",
            category: "electricity",
            type: "fill",
            score: 10,
            question: "一盏额定电压为 6 V 的小灯泡，正常发光时的电阻为 10 Ω。若现有一电源电压为 9 V，为了使小灯泡能够正常发光，需要给小灯泡___________联（选填“串”或“并”）一个阻值为___________ Ω的电阻。",
            answer: "串；5",
            steps: [
                "1. **判断连接方式：** 灯泡额定电压 $U_L = 6\\text{ V}$，电源电压 $U = 9\\text{ V}$。因为电源电压高于灯泡额定电压，若直接接入会烧坏灯泡。为了分担多余的电压，应该在电路中**串联**一个分压电阻。",
                "2. **分压电阻的阻值计算：**",
                "   - 灯泡正常发光时的额定电流：$I_L = \\frac{U_L}{R_L} = \\frac{6\\text{ V}}{10\\text{ }\\Omega} = 0.6\\text{ A}$。",
                "   - 串联电路中，各处电流相等，故通过串联电阻的电流 $I_R = I_L = 0.6\\text{ A}$。",
                "   - 串联电阻分担的电压：$U_R = U - U_L = 9\\text{ V} - 6\\text{ V} = 3\\text{ V}$。",
                "   - 根据欧姆定律，分压电阻的阻值：$R = \\frac{U_R}{I_R} = \\frac{3\\text{ V}}{0.6\\text{ A}} = 5\\text{ }\\Omega$。"
            ]
        },
        {
            id: "q_elec_2",
            category: "electricity",
            type: "calculation",
            score: 25,
            question: "如图所示的电路中，电源电压恒为 12 V，电阻 $R_1 = 20\\text{ }\\Omega$，滑动变阻器 $R_2$ 上标有“$50\\text{ }\\Omega\\text{ }1\\text{ A}$”字样，电流表量程为 $0 \\sim 0.6\\text{ A}$，电压表量程为 $0 \\sim 15\\text{ V}$。当开关 S 闭合后，求：<br>" +
                      "(1) 当滑动变阻器的滑片移至最右端时，电流表的示数和整个电路的总功率是多少？<br>" +
                      "(2) 为了保证电路中各元件安全工作，滑动变阻器允许接入电路的最小阻值是多少？此时整个电路的功率是多大？",
            answer: "(1) 电流为 0.17 A，总功率为 2.06 W； (2) 最小阻值为 20 Ω，最大电功率为 7.2 W",
            steps: [
                "**(1) 滑片移至最右端时的计算**",
                "当滑片移至最右端时，$R_1$ 与滑动变阻器最大阻值 $R_2 = 50\\text{ }\\Omega$ 串联在电路中。",
                "串联总电阻：$R_{总} = R_1 + R_2 = 20\\text{ }\\Omega + 50\\text{ }\\Omega = 70\\text{ }\\Omega$。",
                "电流表示数（电路中电流）：$I = \\frac{U}{R_{总}} = \\frac{12\\text{ V}}{70\\text{ }\\Omega} \\approx 0.17\\text{ A}$。",
                "电路消耗的总功率：$P_{总} = U I = 12\\text{ V} \\times \\frac{12}{70}\\text{ A} = \\frac{144}{70}\\text{ W} \\approx 2.06\\text{ W}$。",
                "---",
                "**(2) 保证元件安全时的极限计算**",
                "电路串联，元件受限情况如下：",
                "1. 电流表安全限制：最大电流不能超过 $0.6\\text{ A}$。",
                "2. 滑动变阻器额定规格限制：最大允许电流为 $1\\text{ A}$。",
                "3. 电压表安全限制：测滑动变阻器 $R_2$ 两端电压，最大不能超过 $15\\text{ V}$（在本题中电源电压仅 $12\\text{ V}$，所以电压表不会超量程）。",
                "综合以上，电路允许的最大电流由电流表决定，$I_{max} = 0.6\\text{ A}$。",
                "当电流最大时，电路总电阻最小，滑动变阻器接入的阻值最小：",
                "$R_{总min} = \\frac{U}{I_{max}} = \\frac{12\\text{ V}}{0.6\\text{ A}} = 20\\text{ }\\Omega$。",
                "根据 $R_{总} = R_1 + R_2$，求滑动变阻器允许接入的最小电阻 $R_{2min}$：",
                "$R_{2min} = R_{总min} - R_1 = 20\\text{ }\\Omega - 20\\text{ }\\Omega = 0\\text{ }\\Omega$？",
                "**注意纠偏审题**：如果 $R_{2min} = 0\\text{ }\\Omega$，电路中的电阻仅为 $R_1 = 20\\text{ }\\Omega$，电流为 $I = \\frac{12\\text{ V}}{20\\text{ }\\Omega} = 0.6\\text{ A}$，正好等于电流表的最大量程，没有超出。因此在电流安全的维度，滑动变阻器阻值理论上最小可以为 $0\\text{ }\\Omega$。",
                "但在一般电学题中，若包含保护电阻，则电阻的安全也是重点。若滑片移动导致 $R_2$ 为 $0$，电流表刚好为满偏 $0.6\\text{ A}$，属于安全工作。因此滑动变阻器最小阻值为 $0\\text{ }\\Omega$（本题电阻无下限烧坏限制，因为 $R_1$ 充当了保护电阻）。",
                "如果电流表量程是 $0.6\\text{ A}$，并且题目中滑动变阻器安全电流是 1A，那么最小电阻就是为了满足电流表不超过 0.6A：",
                "$I \\le 0.6\\text{ A} \\implies \\frac{12\\text{ V}}{20 + R_2} \\le 0.6\\text{ A} \\implies R_2 \\ge 0\\text{ }\\Omega$。",
                "此时整个电路的最大电功率为：$P_{max} = U I_{max} = 12\\text{ V} \\times 0.6\\text{ A} = 7.2\\text{ W}$。"
            ]
        },
        {
            id: "q_therm_1",
            category: "thermodynamics",
            type: "calculation",
            score: 20,
            question: "某太阳能热水器盛有 100 kg 的水。在阳光照射下，水的温度从 20 ℃ 升高到 70 ℃。[已知水的比热容为 $c_{水} = 4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$，煤气的热值为 $q_{煤气} = 4.2 \\times 10^7\\text{ J/m}^3$] 求：<br>" +
                      "(1) 水吸收的热量是多少 J？<br>" +
                      "(2) 若这些热量改由燃气灶燃烧煤气来提供，燃气灶的加热效率为 50%，则需要完全燃烧多少 m³ 的煤气？",
            answer: "(1) 吸收热量为 2.1 × 10⁷ J； (2) 需要完全燃烧 1 m³ 煤气",
            steps: [
                "**(1) 计算水吸收的热量**",
                "已知水质量 $m = 100\\text{ kg}$，比热容 $c = 4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)}$，初温 $t_1 = 20\\text{ ℃}$，末温 $t_2 = 70\\text{ ℃}$。",
                "温度变化量：$\\Delta t = t_2 - t_1 = 70\\text{ ℃} - 20\\text{ ℃} = 50\\text{ ℃}$。",
                "代入吸热公式：",
                "$Q_{吸} = c m \\Delta t = 4.2 \\times 10^3\\text{ J/(kg}\\cdot\\text{℃)} \\times 100\\text{ kg} \\times 50\\text{ ℃} = 2.1 \\times 10^7\\text{ J}$。",
                "---",
                "**(2) 计算需要完全燃烧的煤气体积**",
                "由于燃气灶加热效率 $\\eta = 50\\%$，则煤气完全燃烧释放的电热量（总热量）$Q_{放}$ 满足：",
                "$\\eta = \\frac{Q_{吸}}{Q_{放}} \\implies Q_{放} = \\frac{Q_{吸}}{\\eta} = \\frac{2.1 \\times 10^7\\text{ J}}{0.5} = 4.2 \\times 10^7\\text{ J}$。",
                "根据气体燃料燃烧放热公式 $Q_{放} = V q$，求煤气体积 $V$：",
                "$V = \\frac{Q_{放}}{q_{煤气}} = \\frac{4.2 \\times 10^7\\text{ J}}{4.2 \\times 10^7\\text{ J/m}^3} = 1\\text{ m}^3$。"
            ]
        }
    ]
};
