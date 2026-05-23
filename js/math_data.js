/**
 * 初中数学公式与定义手册 - 数学核心数据仓库
 * 包含数与式、方程与函数、几何图形、概率统计的核心公式、定义及交互式求解计算器
 */

// 辅助函数：化简二次根式（例如把 \sqrt{20} 化简为 2\sqrt{5}）
function simplifyLaTeXSqrt(n) {
    if (n < 0) return "无实数根";
    if (n === 0) return "0";
    let out = 1;
    let inside = n;
    // 寻找最大平方数因子
    for (let i = Math.floor(Math.sqrt(n)); i >= 2; i--) {
        if (inside % (i * i) === 0) {
            out *= i;
            inside /= (i * i);
        }
    }
    if (inside === 1) return `${out}`;
    if (out === 1) return `\\sqrt{${inside}}`;
    return `${out}\\sqrt{${inside}}`;
}

const MATH_DB = {
    // 数学分支名称映射
    categories: {
        "all": "全部板块",
        "num-exp": "数与式",
        "eq-func": "方程与函数",
        "geom": "几何与图形",
        "stat-prob": "概率与统计"
    },

    // 公式手册数据
    formulas: [
        // ================= 一、数与式 =================
        {
            id: "square_difference",
            category: "num-exp",
            title: "平方差公式",
            symbolFormula: "(a + b)(a - b) = a^2 - b^2",
            definition: "两个数的和与这两个数的差的积，等于这两个数的平方差。这在因式分解、分母有理化与代数简便计算中起着极其关键的作用。",
            variables: [
                { symbol: "a+b", name: "两数之和", mainUnit: "数值", altUnits: [] },
                { symbol: "a-b", name: "两数之差", mainUnit: "数值", altUnits: [] },
                { symbol: "a^2-b^2", name: "两数平方差", mainUnit: "数值", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "a^2-b^2", formula: "a^2 - b^2 = (a+b)(a-b)", description: "平方差公式逆向用作因式分解" },
                { resultSymbol: "a^2", formula: "a^2 = b^2 + (a+b)(a-b)", description: "平方差公式的移项变形" }
            ],
            calculator: {
                variables: ["a+b", "a-b", "a^2-b^2"],
                solve: (inputs) => {
                    let sum = inputs["a+b"];
                    let diff = inputs["a-b"];
                    let sqDiff = inputs["a^2-b^2"];

                    if (sqDiff === null && sum !== null && diff !== null) {
                        const ans = sum * diff;
                        return {
                            "a^2-b^2": ans,
                            step: "a^2 - b^2 = (a+b)(a-b) = (" + sum + ") \\times (" + diff + ") = " + ans
                        };
                    } else if (sum === null && sqDiff !== null && diff !== null) {
                        if (diff === 0) return { error: "两数之差不能为0" };
                        const ans = sqDiff / diff;
                        return {
                            "a+b": ans,
                            step: "a+b = \\frac{a^2-b^2}{a-b} = \\frac{" + sqDiff + "}{" + diff + "} = " + ans.toFixed(2).replace(/\.?0+$/, '')
                        };
                    } else if (diff === null && sqDiff !== null && sum !== null) {
                        if (sum === 0) return { error: "两数之和不能为0" };
                        const ans = sqDiff / sum;
                        return {
                            "a-b": ans,
                            step: "a-b = \\frac{a^2-b^2}{a+b} = \\frac{" + sqDiff + "}{" + sum + "} = " + ans.toFixed(2).replace(/\.?0+$/, '')
                        };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "已知两数之和 $x+y = 6$，两数之差 $x-y = 2$。求这组数对应的平方差 $x^2-y^2$ 的值是多少？",
                    steps: [
                        "1. 根据平方差乘法公式：$x^2-y^2 = (x+y)(x-y)$。",
                        "2. 代入已知量：$x+y = 6$，$x-y = 2$。",
                        "3. 计算代入乘积：$x^2-y^2 = 6 \\times 2 = 12$。",
                        "**答：** $x^2-y^2$ 的值是 $12$。"
                    ]
                }
            ]
        },
        {
            id: "perfect_square",
            category: "num-exp",
            title: "完全平方公式",
            symbolFormula: "(a \\pm b)^2 = a^2 \\pm 2ab + b^2",
            definition: "两数和（或差）的平方，等于它们的平方和，加上（或减去）它们积的2倍。这是代数式乘法与因式分解的核心基础。",
            variables: [
                { symbol: "a+b", name: "两数之和", mainUnit: "数值", altUnits: [] },
                { symbol: "ab", name: "两数之积", mainUnit: "数值", altUnits: [] },
                { symbol: "a^2+b^2", name: "两数平方和", mainUnit: "数值", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "a^2+b^2", formula: "a^2 + b^2 = (a+b)^2 - 2ab", description: "已知和与积，求两数平方和（极经典考点）" },
                { resultSymbol: "(a-b)^2", formula: "(a-b)^2 = (a+b)^2 - 4ab", description: "已知和与积，求两数差的平方" }
            ],
            calculator: {
                variables: ["a+b", "ab", "a^2+b^2"],
                solve: (inputs) => {
                    let sum = inputs["a+b"];
                    let prod = inputs["ab"];
                    let sqSum = inputs["a^2+b^2"];

                    if (sqSum === null && sum !== null && prod !== null) {
                        const ans = sum * sum - 2 * prod;
                        return {
                            "a^2+b^2": ans,
                            step: "a^2 + b^2 = (a+b)^2 - 2ab = (" + sum + ")^2 - 2 \\times (" + prod + ") = " + (sum * sum) + " - " + (2 * prod) + " = " + ans
                        };
                    } else if (sum === null && sqSum !== null && prod !== null) {
                        const sumSq = sqSum + 2 * prod;
                        if (sumSq < 0) return { error: "无实数解（(a+b)² 不能为负数）" };
                        const ans1 = Math.sqrt(sumSq);
                        const ans2 = -ans1;
                        return {
                            "a+b": ans1,
                            step: "(a+b)^2 = a^2 + b^2 + 2ab = " + sqSum + " + 2 \\times (" + prod + ") = " + sumSq + " \\implies a+b = \\pm " + simplifyLaTeXSqrt(sumSq)
                        };
                    } else if (prod === null && sum !== null && sqSum !== null) {
                        const ans = (sum * sum - sqSum) / 2;
                        return {
                            "ab": ans,
                            step: "2ab = (a+b)^2 - (a^2+b^2) = (" + sum + ")^2 - " + sqSum + " = " + (sum * sum - sqSum) + " \\implies ab = " + ans.toFixed(2)
                        };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "已知 $a+b = 5$，$ab = 6$。求 $a^2+b^2$ 的值是多少？",
                    steps: [
                        "1. 根据完全平方公式变形：$a^2+b^2 = (a+b)^2 - 2ab$。",
                        "2. 代入已知量：$a+b = 5$，$ab = 6$。",
                        "3. 计算代入过程：$a^2+b^2 = 5^2 - 2 \\times 6 = 25 - 12 = 13$。",
                        "**答：** $a^2+b^2$ 的值是 $13$。"
                    ]
                }
            ]
        },

        // ================= 二、方程与函数 =================
        {
            id: "quadratic_equation",
            category: "eq-func",
            title: "一元二次方程求根公式",
            symbolFormula: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a} \\quad (b^2-4ac \\ge 0)",
            definition: "对于一元二次方程一般式 $ax^2 + bx + c = 0\\ (a \\ne 0)$，其根的性质由判别式 $\\Delta = b^2 - 4ac$ 决定。当 $\\Delta \\ge 0$ 时，方程有两个实数根。",
            variables: [
                { symbol: "a", name: "二次项系数", mainUnit: "常数", altUnits: [] },
                { symbol: "b", name: "一次项系数", mainUnit: "常数", altUnits: [] },
                { symbol: "c", name: "常数项", mainUnit: "常数", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "\\Delta", formula: "\\Delta = b^2 - 4ac", description: "根的判别式（判别根的个数）" }
            ],
            calculator: {
                variables: ["a", "b", "c"],
                solve: (inputs) => {
                    let a = inputs["a"];
                    let b = inputs["b"];
                    let c = inputs["c"];
                    if (a === null || b === null || c === null) {
                        return { error: "一元二次方程求根计算器需要同时输入系数 a, b 和 c。" };
                    }
                    if (a === 0) return { error: "二次项系数 a 不能为 0（否则为一元一次方程）" };

                    const delta = b * b - 4 * a * c;
                    if (delta < 0) {
                        return {
                            error: `判别式 \\Delta = b^2 - 4ac = (${b})^2 - 4 \\times ${a} \\times ${c} = ${delta} < 0。方程无实数根。`
                        };
                    } else if (delta === 0) {
                        const x = -b / (2 * a);
                        return {
                            a: x, // 虚拟绑定回显
                            step: "\\Delta = b^2 - 4ac = 0。方程有两个相等的实数根：x_1 = x_2 = -\\frac{b}{2a} = -\\frac{" + b + "}{2 \\times " + a + "} = " + x.toFixed(2)
                        };
                    } else {
                        const sqrtD = Math.sqrt(delta);
                        const x1 = (-b + sqrtD) / (2 * a);
                        const x2 = (-b - sqrtD) / (2 * a);
                        
                        let deltaLaTeX = simplifyLaTeXSqrt(delta);
                        let stepText = `\\Delta = b^2 - 4ac = (${b})^2 - 4 \\times ${a} \\times ${c} = ${delta} > 0。\\\\`;
                        stepText += `方程有两个不相等的实数根：x = \\frac{-(${b}) \\pm \\sqrt{${delta}}}{2 \\times ${a}} = \\frac{-${b} \\pm ${deltaLaTeX}}{${2*a}}\\\\`;
                        stepText += `解得：x_1 = ${x1.toFixed(2).replace(/\.?0+$/, '')}，x_2 = ${x2.toFixed(2).replace(/\.?0+$/, '')}`;
                        return {
                            a: x1, // 回显 x1 占位
                            step: stepText
                        };
                    }
                }
            },
            examples: [
                {
                    question: "解一元二次方程：$x^2 - 4x + 3 = 0$。",
                    steps: [
                        "1. 确定系数：$a = 1$，$b = -4$，$c = 3$。",
                        "2. 计算判别式：$\\Delta = b^2 - 4ac = (-4)^2 - 4 \\times 1 \\times 3 = 16 - 12 = 4 > 0$，方程有两个不相等的实数根。",
                        "3. 代入求根公式：$x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{-(-4) \\pm \\sqrt{4}}{2 \\times 1} = \\frac{4 \\pm 2}{2}$。",
                        "4. 求解分支：$x_1 = \\frac{4+2}{2} = 3$；$x_2 = \\frac{4-2}{2} = 1$。",
                        "**答：** 方程的根为 $x_1 = 3$，$x_2 = 1$。"
                    ]
                }
            ]
        },
        {
            id: "linear_function",
            category: "eq-func",
            title: "一次函数解析式求法 (待定系数法)",
            symbolFormula: "y = kx + b \\quad (k \\ne 0)",
            definition: "一次函数图象是一条直线。已知直线上两点坐标 $A(x_1, y_1)$ 和 $B(x_2, y_2)$，代入一般式列方程组可求比例系数 $k$ 和常数项 $b$。",
            variables: [
                { symbol: "x_1", name: "A点横坐标", mainUnit: "数值", altUnits: [] },
                { symbol: "y_1", name: "A点纵坐标", mainUnit: "数值", altUnits: [] },
                { symbol: "x_2", name: "B点横坐标", mainUnit: "数值", altUnits: [] },
                { symbol: "y_2", name: "B点纵坐标", mainUnit: "数值", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "k", formula: "k = \\frac{y_2 - y_1}{x_2 - x_1}", description: "求一次函数斜率（比例系数k）" }
            ],
            calculator: {
                variables: ["x_1", "y_1", "x_2", "y_2"],
                solve: (inputs) => {
                    let x1 = inputs["x_1"];
                    let y1 = inputs["y_1"];
                    let x2 = inputs["x_2"];
                    let y2 = inputs["y_2"];

                    if (x1 === null || y1 === null || x2 === null || y2 === null) {
                        return { error: "请输入完整的两个坐标点 A(x₁, y₁) 和 B(x₂, y₂)。" };
                    }
                    if (x1 === x2) {
                        return { error: "两点横坐标不能相等（否则直线垂直于x轴，不属于一次函数函数关系）" };
                    }

                    const k = (y2 - y1) / (x2 - x1);
                    const b = y1 - k * x1;
                    
                    let bText = b >= 0 ? `+ ${b.toFixed(2).replace(/\.?0+$/, '')}` : `- ${Math.abs(b).toFixed(2).replace(/\.?0+$/, '')}`;
                    if (b === 0) bText = "";

                    return {
                        x_1: k, // 临时绑定占位
                        step: `1. 代入待定系数法，列出联立方程组：\\\\` + 
                              `\\begin{cases} ${y1} = ${x1}k + b \\\\ ${y2} = ${x2}k + b \\end{cases}\\\\` + 
                              `2. 两式相减消去 b，解得斜率 $k$：\\\\` + 
                              `k = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = ${k.toFixed(4).replace(/\.?0+$/, '')}\\\\` + 
                              `3. 将 $k$ 代入第一个方程求解 $b$：\\\\` + 
                              `b = y_1 - k x_1 = ${y1} - (${k.toFixed(2).replace(/\.?0+$/, '')}) \\times (${x1}) = ${b.toFixed(4).replace(/\.?0+$/, '')}\\\\` + 
                              `4. 最终确定一次函数解析式为：<strong>y = ${k.toFixed(2).replace(/\.?0+$/, '')}x ${bText}</strong>`
                    };
                }
            },
            examples: [
                {
                    question: "已知一次函数的图象经过点 $A(1, 3)$ 和 $B(2, 5)$。求该一次函数的解析式。",
                    steps: [
                        "1. 设一次函数一般解析式为 $y = kx + b$ ($k \\ne 0$)。",
                        "2. 将点 $A(1, 3)$ 和 $B(2, 5)$ 代入解析式列出方程组：",
                        "   $\\begin{cases} 3 = 1k + b \\quad \\text{①} \\\\ 5 = 2k + b \\quad \\text{②} \\end{cases}$。",
                        "3. 方程 ② 减去 方程 ① 得：$2 = k$，即 $k = 2$。",
                        "4. 将 $k = 2$ 代入 ① 中得：$3 = 2 \\times 1 + b \\implies b = 1$。",
                        "**答：** 该一次函数的解析式为 $y = 2x + 1$。"
                    ]
                }
            ]
        },
        {
            id: "quadratic_function",
            category: "eq-func",
            title: "二次函数顶点坐标与性质",
            symbolFormula: "y = ax^2 + bx + c \\quad (a \\ne 0)",
            definition: "二次函数图象是一条抛物线。其对称轴方程为 $x = -\\frac{b}{2a}$，顶点坐标为 $(-\\frac{b}{2a}, \\frac{4ac-b^2}{4a})$。这决定了函数的最值与开口特征。",
            variables: [
                { symbol: "a", name: "二次项系数 a", mainUnit: "常数", altUnits: [] },
                { symbol: "b", name: "一次项系数 b", mainUnit: "常数", altUnits: [] },
                { symbol: "c", name: "常数项系数 c", mainUnit: "常数", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "x_{对称轴}", formula: "x = -\\frac{b}{2a}", description: "求抛物线对称轴" }
            ],
            calculator: {
                variables: ["a", "b", "c"],
                solve: (inputs) => {
                    let a = inputs["a"];
                    let b = inputs["b"];
                    let c = inputs["c"];
                    if (a === null || b === null || c === null) {
                        return { error: "二次函数顶点计算器需要输入全部系数 a, b 和 c。" };
                    }
                    if (a === 0) return { error: "a 不能为 0，否则为一次函数！" };

                    const axis = -b / (2 * a);
                    const vertexY = (4 * a * c - b * b) / (4 * a);
                    const dir = a > 0 ? "向上" : "向下";
                    const peak = a > 0 ? "最低点（最小值）" : "最高点（最大值）";

                    return {
                        a: axis, // 占位回显
                        step: `1. **开口方向**：二次项系数 $a = ${a}$ ${a > 0 ? '> 0' : '< 0'}，故抛物线开口**${dir}**。\\\\` + 
                              `2. **对称轴方程**：\\\\` + 
                              `x = -\\frac{b}{2a} = -\\frac{${b}}{2 \\times ${a}} = <strong>${axis.toFixed(2).replace(/\.?0+$/, '')}</strong>\\\\` + 
                              `3. **顶点坐标**：\\\\` + 
                              `横坐标为 $x = ${axis.toFixed(2).replace(/\.?0+$/, '')}$；\\\\` + 
                              `纵坐标为 $y = \\frac{4ac - b^2}{4a} = \\frac{4 \\times ${a} \\times ${c} - (${b})^2}{4 \\times ${a}} = ${vertexY.toFixed(2).replace(/\.?0+$/, '')}$。\\\\` + 
                              `顶点坐标为：<strong>(${axis.toFixed(2).replace(/\.?0+$/, '')}, ${vertexY.toFixed(2).replace(/\.?0+$/, '')})</strong>。\\\\` + 
                              `当 $x = ${axis.toFixed(2).replace(/\.?0+$/, '')}$ 时，函数取得${peak}为 $${vertexY.toFixed(2).replace(/\.?0+$/, '')}$。`
                    };
                }
            },
            examples: [
                {
                    question: "求抛物线 $y = x^2 - 4x + 5$ 的开口方向、对称轴以及顶点坐标。",
                    steps: [
                        "1. 确定系数：$a = 1$，$b = -4$，$c = 5$。",
                        "2. 判断开口：因为 $a = 1 > 0$，所以抛物线开口**向上**。",
                        "3. 计算对称轴：$x = -\\frac{b}{2a} = -\\frac{-4}{2 \\times 1} = 2$。对称轴方程为 $x = 2$。",
                        "4. 计算顶点纵坐标：$y = \\frac{4ac - b^2}{4a} = \\frac{4 \\times 1 \\times 5 - (-4)^2}{4 \\times 1} = \\frac{20 - 16}{4} = 1$。",
                        "**答：** 抛物线开口向上，对称轴为直线 $x = 2$，顶点坐标为 $(2, 1)$。"
                    ]
                }
            ]
        },

        // ================= 三、几何与图形 =================
        {
            id: "pythagorean_theorem",
            category: "geom",
            title: "直角三角形勾股定理",
            symbolFormula: "a^2 + b^2 = c^2",
            definition: "在直角三角形中，两直角边（直角边 a, b）的平方和等于斜边（斜边 c）的平方。这是平面几何中最为基础与核心的定量定理。",
            variables: [
                { symbol: "a", name: "直角边 a", mainUnit: "长度", altUnits: [] },
                { symbol: "b", name: "直角边 b", mainUnit: "长度", altUnits: [] },
                { symbol: "c", name: "斜边 c", mainUnit: "长度", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "c", formula: "c = \\sqrt{a^2 + b^2}", description: "已知两直角边求斜边" },
                { resultSymbol: "a", formula: "a = \\sqrt{c^2 - b^2}", description: "已知斜边和一直角边求另一直角边" }
            ],
            calculator: {
                variables: ["a", "b", "c"],
                solve: (inputs) => {
                    let a = inputs["a"];
                    let b = inputs["b"];
                    let c = inputs["c"];

                    if (a === null && b !== null && c !== null) {
                        if (c <= b) return { error: "斜边 c 必须大于直角边 b！" };
                        const sq = c * c - b * b;
                        const ans = Math.sqrt(sq);
                        return {
                            a: ans,
                            step: "a = \\sqrt{c^2 - b^2} = \\sqrt{" + c + "^2 - " + b + "^2} = \\sqrt{" + (c*c) + " - " + (b*b) + "} = \\sqrt{" + sq + "} = " + simplifyLaTeXSqrt(sq)
                        };
                    } else if (b === null && a !== null && c !== null) {
                        if (c <= a) return { error: "斜边 c 必须大于直角边 a！" };
                        const sq = c * c - a * a;
                        const ans = Math.sqrt(sq);
                        return {
                            b: ans,
                            step: "b = \\sqrt{c^2 - a^2} = \\sqrt{" + c + "^2 - " + a + "^2} = \\sqrt{" + (c*c) + " - " + (a*a) + "} = \\sqrt{" + sq + "} = " + simplifyLaTeXSqrt(sq)
                        };
                    } else if (c === null && a !== null && b !== null) {
                        const sq = a * a + b * b;
                        const ans = Math.sqrt(sq);
                        return {
                            c: ans,
                            step: "c = \\sqrt{a^2 + b^2} = \\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + (a*a) + " + " + (b*b) + "} = \\sqrt{" + sq + "} = " + simplifyLaTeXSqrt(sq)
                        };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "在直角三角形 $ABC$ 中，$\\angle C = 90^\\circ$。已知直角边 $a = 6$，直角边 $b = 8$。求斜边 $c$ 的长度。",
                    steps: [
                        "1. 根据直角三角形勾股定理：$a^2 + b^2 = c^2$。",
                        "2. 代入已知直角边：$a = 6$，$b = 8$。",
                        "3. 求解斜边：$c = \\sqrt{a^2 + b^2} = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$。",
                        "**答：** 斜边 $c$ 的长度是 $10$。"
                    ]
                }
            ]
        },
        {
            id: "sector_area",
            category: "geom",
            title: "扇形面积与弧长公式",
            symbolFormula: "S = \\frac{n \\pi R^2}{360} = \\frac{1}{2} l R",
            definition: "扇形是圆的一部分。圆心角为 $n^\\circ$、半径为 $R$ 的扇形，其面积 $S$ 占圆面积的 $n/360$。弧长 $l$ 等于圆周长的 $n/360$。",
            variables: [
                { symbol: "S", name: "扇形面积", mainUnit: "面积", altUnits: [] },
                { symbol: "n", name: "圆心角度数", mainUnit: "度", altUnits: [] },
                { symbol: "R", name: "扇形半径", mainUnit: "长度", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "l", formula: "l = \\frac{n \\pi R}{180}", description: "求扇形的弧长" }
            ],
            calculator: {
                variables: ["S", "n", "R"],
                solve: (inputs) => {
                    let S = inputs["S"];
                    let n = inputs["n"];
                    let R = inputs["R"];

                    if (S === null && n !== null && R !== null) {
                        const ans = (n * Math.PI * R * R) / 360;
                        const piCoef = (n * R * R) / 360;
                        return {
                            S: ans,
                            step: "S = \\frac{n \\pi R^2}{360} = \\frac{" + n + " \\times \\pi \\times " + R + "^2}{360} = \\frac{" + (n*R*R) + "\\pi}{360} = <strong>" + piCoef.toFixed(2).replace(/\.?0+$/, '') + "\\pi</strong> \\approx " + ans.toFixed(2)
                        };
                    } else if (n === null && S !== null && R !== null) {
                        if (R === 0) return { error: "半径不能为0" };
                        const ans = (S * 360) / (Math.PI * R * R);
                        return {
                            n: ans,
                            step: "n = \\frac{360 S}{\\pi R^2} = \\frac{360 \\times " + S + "}{\\pi \\times " + R + "^2} = \\frac{" + (360*S) + "}{" + (R*R) + "\\pi} \\approx <strong>" + ans.toFixed(1) + "^\\circ</strong>"
                        };
                    } else if (R === null && S !== null && n !== null) {
                        if (n === 0) return { error: "圆心角不能为0" };
                        const sq = (S * 360) / (n * Math.PI);
                        const ans = Math.sqrt(sq);
                        return {
                            R: ans,
                            step: "R^2 = \\frac{360 S}{n \\pi} = \\frac{360 \\times " + S + "}{" + n + " \\times \\pi} \\approx " + sq.toFixed(4) + " \\implies R \\approx <strong>" + ans.toFixed(2) + "</strong>"
                        };
                    }
                    return null;
                }
            },
            examples: [
                {
                    question: "已知扇形的圆心角为 $120^\\circ$，半径为 $6\\text{ cm}$。求这个扇形的面积是多少 $\\text{cm}^2$？（结果保留 $\\pi$）",
                    steps: [
                        "1. 已知圆心角 $n = 120^\\circ$，半径 $R = 6\\text{ cm}$。",
                        "2. 代入扇形面积基本公式：$S = \\frac{n \\pi R^2}{360}$。",
                        "3. 计算：$S = \\frac{120 \\times \\pi \\times 6^2}{360} = \\frac{120 \\times 36 \\times \\pi}{360} = \\frac{4320 \\pi}{360} = 12\\pi$。",
                        "**答：** 扇形面积是 $12\\pi\\text{ cm}^2$。"
                    ]
                }
            ]
        },

        // ================= 四、概率与统计 =================
        {
            id: "variance_formula",
            category: "stat-prob",
            title: "统计样本方差公式",
            symbolFormula: "s^2 = \\frac{1}{n} \\left[ (x_1 - \\bar{x})^2 + (x_2 - \\bar{x})^2 + \\dots + (x_n - \\bar{x})^2 \\right]",
            definition: "方差是衡量一组数据波动程度的物理/数学指标。方差越大，说明数据偏离平均数波动越剧烈；方差越小，数据越稳定。",
            variables: [
                { symbol: "n", name: "数据样本个数", mainUnit: "个", altUnits: [] },
                { symbol: "\\bar{x}", name: "样本平均数", mainUnit: "数值", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "s", formula: "s = \\sqrt{s^2}", description: "方差的算术平方根叫做标准差" }
            ],
            calculator: {
                // 用于求任意数字列表的方差，让用户在一个输入框里输入逗号分隔数据
                variables: ["n", "\\bar{x}"], // 虚拟，我们将使用完全自定义的一站式面板
                solve: (inputs) => {
                    // 由于我们需要传入一整组数，此公式在 app.js 中会被特异性识别并替换为专门的数据列表计算界面！
                    return null;
                }
            },
            examples: [
                {
                    question: "已知一组数据为：$2$，$4$，$6$，$8$，$10$。求这组数据的平均数和方差。",
                    steps: [
                        "1. 计算个数：样本大小 $n = 5$。",
                        "2. 计算平均数：$\\bar{x} = \\frac{2+4+6+8+10}{5} = \\frac{30}{5} = 6$。",
                        "3. 代入方差公式：$s^2 = \\frac{1}{5} \\left[ (2-6)^2 + (4-6)^2 + (6-6)^2 + (8-6)^2 + (10-6)^2 \\right]$。",
                        "4. 逐步计算离均差的平方和：",
                        "   $s^2 = \\frac{1}{5} \\left[ (-4)^2 + (-2)^2 + 0^2 + 2^2 + 4^2 \\right] = \\frac{1}{5} [16 + 4 + 0 + 4 + 16] = \\frac{40}{5} = 8$。",
                        "**答：** 平均数为 $6$，方差为 $8$。"
                    ]
                }
            ]
        }
    ]
};
