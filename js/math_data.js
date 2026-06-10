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
            imagePath: "images/illustrations/square_diff.png",
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
        {
            id: "factorization",
            category: "num-exp",
            title: "因式分解与十字相乘",
            symbolFormula: "ax^2 + bx + c = (a_1x + c_1)(a_2x + c_2)",
            definition: "因式分解是把一个多项式化为几个整式的积的形式。对于二次三项式 $ax^2 + bx + c$，若能在有理数范围内使用十字相乘法找到 $a_1 a_2 = a, c_1 c_2 = c$，且满足交叉相乘相加 $a_1c_2 + a_2c_1 = b$，则该式可因式分解为 $(a_1x + c_1)(a_2x + c_2)$。",
            variables: [
                { symbol: "a", name: "二次项系数", mainUnit: "常数", altUnits: [] },
                { symbol: "b", name: "一次项系数", mainUnit: "常数", altUnits: [] },
                { symbol: "c", name: "常数项", mainUnit: "常数", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "提公因式", formula: "ma + mb + mc = m(a + b + c)", description: "多项式因式分解的基本方法之一" },
                { resultSymbol: "平方差", formula: "a^2 - b^2 = (a+b)(a-b)", description: "利用平方差公式进行因式分解" },
                { resultSymbol: "完全平方", formula: "a^2 \\pm 2ab + b^2 = (a \\pm b)^2", description: "利用完全平方公式进行因式分解" }
            ],
            calculator: {
                variables: ["a", "b", "c"],
                solve: (inputs) => {
                    let a = inputs["a"];
                    let b = inputs["b"];
                    let c = inputs["c"];
                    
                    if (a === null || a === 0) {
                        return { error: "二次项系数 a 不能为 0。" };
                    }
                    if (b === null) b = 0;
                    if (c === null) c = 0;
                    
                    // 辅助函数：求最大公约数
                    const gcd = (x, y) => {
                        x = Math.abs(x);
                        y = Math.abs(y);
                        while (y) {
                            let temp = y;
                            y = x % y;
                            x = temp;
                        }
                        return x;
                    };
                    
                    // 辅助函数：格式化单项式 cx + d
                    const formatBinomial = (c, d) => {
                        let cText = "";
                        if (c === 1) cText = "x";
                        else if (c === -1) cText = "-x";
                        else cText = c + "x";
                        
                        let dText = "";
                        if (d > 0) dText = " + " + d;
                        else if (d < 0) dText = " - " + Math.abs(d);
                        
                        if (c === 0) return d === 0 ? "0" : d.toString();
                        return cText + dText;
                    };
                    
                    // 1. 判断判别式
                    const delta = b * b - 4 * a * c;
                    if (delta < 0) {
                        return {
                            error: `判别式 \\Delta = b^2 - 4ac = (${b})^2 - 4 \\times ${a} \\times ${c} = ${delta} < 0。在实数范围内无法进行因式分解。`
                        };
                    }
                    
                    const sqrtDelta = Math.sqrt(delta);
                    const isPerfectSquare = Number.isInteger(sqrtDelta);
                    
                    if (!isPerfectSquare) {
                        // 在有理数范围内无法使用十字相乘法，但是可以在实数范围内用公式法因式分解
                        let deltaLaTeX = simplifyLaTeXSqrt(delta);
                        
                        // 根的值
                        let x1_val = (-b + sqrtDelta) / (2 * a);
                        let x2_val = (-b - sqrtDelta) / (2 * a);
                        
                        let stepText = `1. **计算判别式**：<br>`;
                        stepText += `$\\Delta = b^2 - 4ac = (${b})^2 - 4 \\times ${a} \\times ${c} = ${delta}$<br>`;
                        stepText += `由于 $\\Delta = ${delta}$ 不是完全平方数，因此**无法在有理数范围内进行整系数因式分解（如十字相乘法）**。<br>`;
                        stepText += `2. **采用配方法与求根公式法在实数范围内分解**：<br>`;
                        stepText += `原多项式对应的方程有两个实数根：<br>`;
                        
                        let x1_latex = `\\frac{-${b} + \\sqrt{${delta}}}{${2*a}}`;
                        let x2_latex = `\\frac{-${b} - \\sqrt{${delta}}}{${2*a}}`;
                        
                        stepText += `$x_1 = ${x1_latex}$，\\quad $x_2 = ${x2_latex}$<br>`;
                        stepText += `3. **根据公式 $ax^2+bx+c = a(x-x_1)(x-x_2)$ 进行分解**：<br>`;
                        
                        let factorA = a === 1 ? "" : (a === -1 ? "-" : a.toString());
                        stepText += `原式 = $${factorA}\\left(x - ${x1_latex}\\right)\\left(x - ${x2_latex}\\right)$`;
                        
                        return {
                            a: x1_val,
                            step: stepText
                        };
                    }
                    
                    // 2. 有理数范围内的因式分解
                    // 如果 c = 0，直接提取公因式 x
                    if (c === 0) {
                        let g = gcd(a, b);
                        let outCoef = a < 0 ? -g : g;
                        let a_rem = a / outCoef;
                        let b_rem = b / outCoef;
                        
                        let outCoefText = outCoef === 1 ? "" : (outCoef === -1 ? "-" : outCoef.toString());
                        let inside = formatBinomial(a_rem, b_rem);
                        
                        let stepText = `1. **提取公因式法**：<br>`;
                        stepText += `原式中各项含有公因式，提取公因式为：$${outCoefText === "-" ? "-1" : (outCoefText || "1")}x$<br>`;
                        stepText += `2. **提取后得到**：<br>`;
                        stepText += `原式 = $${outCoefText}x\\left(${inside}\\right)$`;
                        
                        return {
                            a: a / b,
                            step: stepText
                        };
                    }
                    
                    // 进行十字相乘搜索
                    let a1 = 1, a2 = a, c1 = 0, c2 = 0;
                    let found = false;
                    
                    // 先求 gcd 提取公因数
                    let g = gcd(gcd(a, b), c);
                    let sign = a < 0 ? -1 : 1;
                    let outCoef = sign * g;
                    let A = a / outCoef; // A > 0
                    let B = b / outCoef;
                    let C = c / outCoef;
                    
                    // 对 A x^2 + B x + C 进行因式分解 (A > 0)
                    for (let A1 = 1; A1 <= Math.sqrt(A); A1++) {
                        if (A % A1 === 0) {
                            let A2 = A / A1;
                            
                            let absC = Math.abs(C);
                            for (let C1 = -absC; C1 <= absC; C1++) {
                                if (C1 !== 0 && C % C1 === 0) {
                                    let C2 = C / C1;
                                    if (A1 * C2 + A2 * C1 === B) {
                                        a1 = A1;
                                        a2 = A2;
                                        c1 = C1;
                                        c2 = C2;
                                        found = true;
                                        break;
                                    }
                                }
                            }
                            if (found) break;
                        }
                    }
                    
                    if (!found) {
                        return { error: "无法在有理数范围内因式分解。" };
                    }
                    
                    let stepText = `1. **提取公因数**：<br>`;
                    if (outCoef !== 1) {
                        let outText = outCoef === -1 ? "-" : outCoef.toString();
                        stepText += `原多项式系数存在公因数，提取系数后得：<br>`;
                        stepText += `原式 = $${outText}\\left( ${A}x^2 ${B >= 0 ? '+' : ''}${B}x ${C >= 0 ? '+' : ''}${C} \\right)$<br>`;
                    } else {
                        stepText += `多项式系数无公因数，直接尝试十字相乘。<br>`;
                    }
                    
                    stepText += `2. **十字相乘法分析**：<br>`;
                    stepText += `我们将二次三项式 $${A}x^2 ${B >= 0 ? '+' : ''}${B}x ${C >= 0 ? '+' : ''}${C}$ 的系数进行拆解：<br>`;
                    stepText += `二次项系数 $${A} = ${a1} \\times ${a2}$，常数项 $${C >= 0 ? '' : '-'}${Math.abs(C)} = (${c1}) \\times (${c2})$。<br>`;
                    stepText += `交叉相乘并相加验证一次项系数：<br>`;
                    stepText += `$${a1} \\times (${c2}) + ${a2} \\times (${c1}) = ${a1*c2} + ${a2*c1} = ${B}$ (验证成功)<br>`;
                    
                    stepText += `<br>十字相乘示意图：<br>`;
                    stepText += `<div style="text-align:center; margin:10px 0;">$\\begin{array}{ccc}`;
                    stepText += `${a1} & & ${c1} \\\\`;
                    stepText += `& \\times & \\\\`;
                    stepText += `${a2} & & ${c2}`;
                    stepText += `\\end{array}$</div>`;
                    
                    let part1 = formatBinomial(a1, c1);
                    let part2 = formatBinomial(a2, c2);
                    
                    let outPart = outCoef === 1 ? "" : (outCoef === -1 ? "-" : outCoef.toString());
                    stepText += `<br>3. **因式分解结果**：<br>`;
                    stepText += `原式 = <strong>$${outPart}(${part1})(${part2})$</strong>`;
                    
                    return {
                        a: (-b + sqrtDelta) / (2 * a),
                        step: stepText
                    };
                }
            },
            examples: [
                {
                    question: "将多项式 $2x^2 - 5x - 3$ 进行因式分解。",
                    steps: [
                        "1. **观察各项系数**：二次项系数 $2$，一次项系数 $-5$，常数项 $-3$。无公因式，尝试十字相乘法。",
                        "2. **拆分系数**：二次项系数 $2 = 1 \\times 2$，常数项 $-3 = (-3) \\times 1$。",
                        "3. **交叉相乘验证**：对角相乘并相加，验证是否等于一次项系数：$1 \\times 1 + 2 \\times (-3) = 1 - 6 = -5$，等于一次项系数。十字相乘示意为：",
                        "   <div style=\"text-align:center; margin:10px 0;\">$\\begin{array}{ccc} 1 & & -3 \\\\ & \\times & \\\\ 2 & & 1 \\end{array}$</div>",
                        "4. **写出因式分解结果**：$(x - 3)(2x + 1)$。",
                        "**答：** $2x^2 - 5x - 3 = (x - 3)(2x + 1)$。"
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
            imagePath: "images/illustrations/linear_function.png",
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
            imagePath: "images/illustrations/quadratic_function.png",
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
        {
            id: "linear_inequalities",
            category: "eq-func",
            title: "一元一次不等式组",
            symbolFormula: "\\begin{cases} x > a \\\\ x \\le b \\end{cases}",
            definition: "解一元一次不等式组时，先求出其中每个不等式的解集，再求出它们的公共部分（交集）。确定解集的口诀为：同大取大，同小取小，大小小大中间找，大大小小解不了。",
            variables: [
                { symbol: "a", name: "第一个解边界 a", mainUnit: "数值", altUnits: [] },
                { symbol: "b", name: "第二个解边界 b", mainUnit: "数值", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "\\text{解集}", formula: "a < x \\le b", description: "两解边界求交集解集" }
            ],
            calculator: {
                variables: ["a", "b"],
                solve: (inputs) => {
                    let a = inputs["a"];
                    let b = inputs["b"];
                    if (a === null || b === null) return { error: "请输入完整的边界值 a 和 b。" };
                    let step = "";
                    if (a < b) {
                        step = `第一个不等式解集为：$x > ${a}$，第二个不等式解集为：$x \\le ${b}$。\\\\` +
                               `求公共解集（大小小大中间找）：<strong>${a} < x \\le ${b}</strong>`;
                        return { "\\text{解集}": b - a, step: step };
                    } else {
                        step = `第一个不等式解集为：$x > ${a}$，第二个不等式解集为：$x \\le ${b}$。\\\\` +
                               `求公共解集（大大小小无处找）：<strong>无解（解集为空）</strong>`;
                        return { "\\text{解集}": 0, step: step };
                    }
                }
            },
            examples: [
                {
                    question: "解不等式组：$\\begin{cases} 2x - 1 > 3 \\quad \\text{①} \\\\ 3x - 5 \\le 7 \\quad \\text{②} \\end{cases}$",
                    steps: [
                        "1. 解不等式 ①：移项得 $2x > 4$，系数化为 1 得 $x > 2$。",
                        "2. 解不等式 ②：移项得 $3x \\le 12$，系数化为 1 得 $x \\le 4$。",
                        "3. 将两个不等式的解集求交集得：$2 < x \\le 4$。",
                        "**答：** 该不等式组的解集为 $2 < x \\le 4$。"
                    ]
                }
            ]
        },

        // ================= 三、几何与图形 =================
        {
            id: "pythagorean_theorem",
            imagePath: "images/illustrations/pythagorean.png",
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
        {
            id: "triangle_congruence",
            imagePath: "images/illustrations/triangle_congruence.png",
            category: "geom",
            title: "三角形全等的判定与性质",
            symbolFormula: "\\triangle ABC \\cong \\triangle A'B'C' \\quad (SSS, SAS, ASA, AAS, HL)",
            definition: "能够完全重合的两个三角形叫做全等三角形。全等三角形的对应边相等，对应角相等。判定三角形全等是初中几何逻辑证明的核心基石。",
            variables: [
                { symbol: "判定定理", name: "选择已知的相等条件", mainUnit: "定理", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "对应边角", formula: "AB = A'B', \\angle A = \\angle A'", description: "全等三角形的对应边相等，对应角相等" }
            ],
            calculator: {
                variables: ["判定定理"],
                solve: (inputs) => {
                    let method = inputs["判定定理"];
                    if (method === null) return { error: "请选择一个全等判定条件组合进行判定。" };
                    
                    method = method.toString().toUpperCase().trim();
                    
                    const validMethods = ["SSS", "SAS", "ASA", "AAS", "HL"];
                    if (validMethods.includes(method)) {
                        let explain = "";
                        if (method === "SSS") explain = "三边对应相等的两个三角形全等。";
                        else if (method === "SAS") explain = "两边及其夹角对应相等的两个三角形全等。";
                        else if (method === "ASA") explain = "两角及其夹边对应相等的两个三角形全等。";
                        else if (method === "AAS") explain = "两角及其中一个角的对边对应相等的两个三角形全等。";
                        else if (method === "HL") explain = "斜边与一直角边对应相等的两个直角三角形全等。";
                        
                        return {
                            "判定定理": 1,
                            step: `1. **判定结论**：选择条件组 **${method}**，<strong>可以判定全等</strong>！\\\\` +
                                  `2. **判定定理说明**：${explain}\\\\` +
                                  `3. **中考规范几何书写示范**：\\\\` +
                                  `在 $\\triangle ABC$ 和 $\\triangle A'B'C'$ 中，\\\\` +
                                  `\\begin{cases} \\text{条件 } 1 \\\\ \\text{条件 } 2 \\\\ \\text{条件 } 3 \\end{cases}\\\\` +
                                  `\\implies \\triangle ABC \\cong \\triangle A'B'C' \\quad (\\text{${method}})\\\\` +
                                  `\\implies \\text{性质推广：对应边相等，对应角相等。}`
                        };
                    } else if (method === "SSA") {
                        return {
                            error: "【警惕中考失分点】“边边角”不能判定全等！",
                            step: `1. **判定结论**：选择条件组 **SSA (边边角)**，<strong>不能判定三角形全等</strong>！\\\\` +
                                  `2. **反例解剖（防雷区）**：已知两边和其中一边的对角相等，由于该角不是夹角，无法唯一确定三角形的形状。在实际作图中，可以画出**一个锐角三角形和一个钝角三角形**同时满足这组 SSA 条件，两者显然不重合。\\\\` +
                                  `3. **名师叮嘱**：中考几何大题中，请千万警惕写出 SSA，这是极高频的经典扣分雷区！`
                        };
                    } else if (method === "AAA") {
                        return {
                            error: "“角角角”不能判定全等！",
                            step: `1. **判定结论**：选择条件组 **AAA (角角角)**，<strong>不能判定全等</strong>！\\\\` +
                                  `2. **原理解析**：三个角对应相等的两个三角形，形状虽然相同，但大小不一定相等（可以等比例放大或缩小）。\\\\` +
                                  `3. **性质关系**：AAA 只能判定两三角形**相似**（相似三角形），而非全等。`
                        };
                    }
                    
                    return { error: "未知的判定条件，请选择 SSS, SAS, ASA, AAS, HL, SSA 或 AAA。" };
                }
            },
            examples: [
                {
                    question: "已知 $\\triangle ABC$ 和 $\\triangle A'B'C'$ 中，$AB = A'B'$，$\\angle B = \\angle B'$，$BC = B'C'$。求证：$\\triangle ABC \\cong \\triangle A'B'C'$。",
                    steps: [
                        "1. 梳理已知条件：已知两组对应边 $AB = A'B'$， $BC = B'C'$，以及两边的夹角 $\\angle B = \\angle B'$。",
                        "2. 匹配判定定理：符合“两边及其夹角对应相等”条件，即 **SAS (边角边)** 定理。",
                        "3. 规范书写几何证明：",
                        "   在 $\\triangle ABC$ 和 $\\triangle A'B'C'$ 中，",
                        "   $\\begin{cases} AB = A'B' \\\\ \\angle B = \\angle B' \\\\ BC = B'C' \\end{cases}$，",
                        "   $\\implies \\triangle ABC \\cong \\triangle A'B'C' \\quad (\\text{SAS})$。",
                        "**答：** 两个三角形依据 SAS 定理全等。"
                    ]
                }
            ]
        },
        {
            id: "triangle_similarity",
            imagePath: "images/illustrations/similarity.png",
            category: "geom",
            title: "相似三角形周长与面积比",
            symbolFormula: "\\triangle ABC \\sim \\triangle A'B'C' \\implies \\frac{C}{C'} = k, \\quad \\frac{S}{S'} = k^2",
            definition: "如果两个三角形相似，那么它们的周长比等于相似比 $k$（对应边长之比），面积比等于相似比的平方 $k^2$。这是中考计算几何大题中的核心数量转换法。",
            variables: [
                { symbol: "k", name: "相似比 k (边长比)", mainUnit: "比值", altUnits: [] },
                { symbol: "C_ratio", name: "周长比 (C/C')", mainUnit: "比值", altUnits: [] },
                { symbol: "S_ratio", name: "面积比 (S/S')", mainUnit: "比值", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "S_{比}", formula: "S_{比} = k^2", description: "相似三角形面积比等于相似比的平方" },
                { resultSymbol: "k", formula: "k = \\sqrt{S_{比}}", description: "相似比等于面积比的算术平方根" }
            ],
            calculator: {
                variables: ["k", "C_ratio", "S_ratio"],
                solve: (inputs) => {
                    let k = inputs["k"];
                    let C = inputs["C_ratio"];
                    let S = inputs["S_ratio"];
                    
                    let filledCount = 0;
                    if (k !== null) filledCount++;
                    if (C !== null) filledCount++;
                    if (S !== null) filledCount++;
                    
                    if (filledCount === 0) return { error: "请至少输入 1 项已知数以推导其余项。" };
                    
                    if (k !== null) {
                        if (k <= 0) return { error: "相似比 k 必须大于 0！" };
                        const cAns = k;
                        const sAns = k * k;
                        return {
                            "C_ratio": cAns,
                            "S_ratio": sAns,
                            step: `1. **周长比推导**：根据性质，相似三角形周长比等于相似比：\\\\` +
                                  `\\frac{C}{C'} = k = <strong>${k.toFixed(2).replace(/\.?0+$/, '')}</strong>；\\\\` +
                                  `2. **面积比推导**：相似三角形面积比等于相似比的平方：\\\\` +
                                  `\\frac{S}{S'} = k^2 = ${k.toFixed(2).replace(/\.?0+$/, '')}^2 = <strong>${sAns.toFixed(4).replace(/\.?0+$/, '')}</strong>。`
                        };
                    }
                    
                    if (C !== null) {
                        if (C <= 0) return { error: "周长比必须大于 0！" };
                        const kAns = C;
                        const sAns = C * C;
                        return {
                            "k": kAns,
                            "S_ratio": sAns,
                            step: `1. **相似比推导**：根据周长比等于相似比：\\\\` +
                                  `k = \\frac{C}{C'} = <strong>${C.toFixed(2).replace(/\.?0+$/, '')}</strong>；\\\\` +
                                  `2. **面积比推导**：面积比等于相似比的平方（即周长比的平方）：\\\\` +
                                  `\\frac{S}{S'} = k^2 = ${C.toFixed(2).replace(/\.?0+$/, '')}^2 = <strong>${sAns.toFixed(4).replace(/\.?0+$/, '')}</strong>。`
                        };
                    }
                    
                    if (S !== null) {
                        if (S <= 0) return { error: "面积比必须大于 0！" };
                        const kAns = Math.sqrt(S);
                        const cAns = kAns;
                        return {
                            "k": kAns,
                            "C_ratio": cAns,
                            step: `1. **相似比推导**：相似三角形的相似比等于面积比的算术平方根：\\\\` +
                                  `k = \\sqrt{\\frac{S}{S'}} = \\sqrt{${S.toFixed(4).replace(/\.?0+$/, '')}} = <strong>${kAns.toFixed(4).replace(/\.?0+$/, '')}</strong>；\\\\` +
                                  `2. **周长比推导**：周长比等于相似比：\\\\` +
                                  `\\frac{C}{C'} = k = <strong>${cAns.toFixed(4).replace(/\.?0+$/, '')}</strong>。`
                        };
                    }
                    
                    return null;
                }
            },
            examples: [
                {
                    question: "若 $\\triangle ABC \\sim \\triangle A'B'C'$，已知对应中线比为 $2:3$，$\\triangle ABC$ 的面积为 $16\\text{ cm}^2$。求 $\\triangle A'B'C'$ 的面积。",
                    steps: [
                        "1. 明确对应线段比即相似比：相似比 $k = \\frac{2}{3}$。",
                        "2. 应用相似三角形面积比定理：面积比 $\\frac{S}{S'} = k^2 = (\\frac{2}{3})^2 = \\frac{4}{9}$。",
                        "3. 代入已知面积求解方程：$\\frac{16}{S'} = \\frac{4}{9} \\implies 4S' = 144 \\implies S' = 36$。",
                        "**答：** $\\triangle A'B'C'$ 的面积是 $36\\text{ cm}^2$。"
                    ]
                }
            ]
        },
        {
            id: "polygon_angles",
            imagePath: "images/illustrations/polygon_angles.png",
            category: "geom",
            title: "多边形内角和与外角和定理",
            symbolFormula: "S_{内} = (n - 2) \\times 180^\\circ, \\quad S_{外} = 360^\\circ",
            definition: "任意凸 $n$ 边形的内角和等于 $(n-2) \\times 180^\\circ$。任意多边形的外角和恒等于 $360^\\circ$ (与边数无关)。正多边形每个内角与外角平分所有角。",
            variables: [
                { symbol: "n", name: "多边形边数 n", mainUnit: "条", altUnits: [] },
                { symbol: "sum_in", name: "内角和 (S_内)", mainUnit: "度", altUnits: [] },
                { symbol: "angle_in", name: "正多边形单内角", mainUnit: "度", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "n", formula: "n = \\frac{S_{内}}{180} + 2", description: "已知内角和求边数" },
                { resultSymbol: "angle_{外}", formula: "angle_{外} = \\frac{360^\\circ}{n}", description: "正多边形单个外角度数" }
            ],
            calculator: {
                variables: ["n", "sum_in", "angle_in"],
                solve: (inputs) => {
                    let n = inputs["n"];
                    let sumIn = inputs["sum_in"];
                    let angleIn = inputs["angle_in"];
                    
                    let filledCount = 0;
                    if (n !== null) filledCount++;
                    if (sumIn !== null) filledCount++;
                    if (angleIn !== null) filledCount++;
                    
                    if (filledCount === 0) return { error: "请输入边数、内角和或单个内角以进行求解。" };
                    
                    if (n !== null) {
                        if (n < 3) return { error: "多边形边数 n 必须大于等于 3！" };
                        if (!Number.isInteger(n)) return { error: "边数 n 必须为整数！" };
                        
                        const sIn = (n - 2) * 180;
                        const aIn = sIn / n;
                        const aOut = 360 / n;
                        
                        return {
                            "sum_in": sIn,
                            "angle_in": aIn,
                            step: `1. **内角和计算**：代入内角和公式：\\\\` +
                                  `S_{内} = (n - 2) \\times 180^\\circ = (${n} - 2) \\times 180^\\circ = <strong>${sIn}^\\circ</strong>；\\\\` +
                                  `2. **外角和结论**：凸多边形的外角和恒等于 **$360^\\circ$**；\\\\` +
                                  `3. **正多边形单角**（如为正多边形）：\\\\` +
                                  `单个内角：$A_{内} = \\frac{S_{内}}{n} = \\frac{${sIn}^\\circ}{${n}} = <strong>${aIn.toFixed(2).replace(/\.?0+$/, '')}^\\circ</strong>；\\\\` +
                                  `单个外角：$A_{外} = \\frac{360^\\circ}{n} = \\frac{360^\\circ}{${n}} = <strong>${aOut.toFixed(2).replace(/\.?0+$/, '')}^\\circ</strong>。`
                        };
                    }
                    
                    if (sumIn !== null) {
                        if (sumIn <= 0 || sumIn % 180 !== 0) return { error: "内角和必须是 180° 的正整数倍！" };
                        const nAns = sumIn / 180 + 2;
                        const aIn = sumIn / nAns;
                        return {
                            "n": nAns,
                            "angle_in": aIn,
                            step: `1. **多边形边数逆求**：根据内角和公式 $(n-2) \\times 180^\\circ = S_{内}$ 列方程：\\\\` +
                                  `(n - 2) \\times 180^\\circ = ${sumIn}^\\circ \\\\` +
                                  `n - 2 = \\frac{${sumIn}}{180} = ${sumIn / 180} \\\\` +
                                  `n = ${sumIn / 180} + 2 = <strong>${nAns}</strong>（其为 **${nAns}边形**）；\\\\` +
                                  `2. **正多边形单角**（若为正多边形）：\\\\` +
                                  `单个内角：$A_{内} = \\frac{${sumIn}^\\circ}{${nAns}} = <strong>${aIn.toFixed(2).replace(/\.?0+$/, '')}^\\circ</strong>。`
                        };
                    }
                    
                    if (angleIn !== null) {
                        if (angleIn <= 0 || angleIn >= 180) return { error: "单个内角必须在 0° 到 180° 之间！" };
                        const angleOut = 180 - angleIn;
                        const nAns = 360 / angleOut;
                        
                        if (!Number.isInteger(nAns)) {
                            return { error: `单个内角为 ${angleIn}° 时无法构成正多边形（边数必须为正整数，算得边数约为 ${nAns.toFixed(2)}）` };
                        }
                        
                        const sIn = (nAns - 2) * 180;
                        return {
                            "n": nAns,
                            "sum_in": sIn,
                            step: `1. **外角换算**：单个外角为：\\\\` +
                                  `A_{外} = 180^\\circ - A_{内} = 180^\\circ - ${angleIn}^\\circ = <strong>${angleOut}^\\circ</strong>；\\\\` +
                                  `2. **多边形边数逆求**：利用外角和恒为 $360^\\circ$ 的定理求边数 $n$：\\\\` +
                                  `n = \\frac{360^\\circ}{A_{外}} = \\frac{360^\\circ}{${angleOut}^\\circ} = <strong>${nAns}</strong>（即为 **正 ${nAns} 边形**）；\\\\` +
                                  `3. **内角和计算**：\\\\` +
                                  `S_{内} = (${nAns} - 2) \\times 180^\\circ = <strong>${sIn}^\\circ</strong>。`
                        };
                    }
                    
                    return null;
                }
            },
            examples: [
                {
                    question: "若一个正多边形的每个内角都等于 $135^\\circ$。求这个多边形的边数 $n$。",
                    steps: [
                        "1. 计算对应的单个外角：$A_{外} = 180^\\circ - A_{内} = 180^\\circ - 135^\\circ = 45^\\circ$。",
                        "2. 利用多边形外角和恒为 $360^\\circ$ 计算边数：$n = \\frac{360^\\circ}{A_{外}} = \\frac{360^\\circ}{45^\\circ} = 8$。",
                        "**答：** 这个多边形的边数 $n$ 是 $8$（即正八边形）。"
                    ]
                }
            ]
        },
        {
            id: "rhombus_properties",
            category: "geom",
            title: "菱形面积与周长公式",
            symbolFormula: "S = \\frac{1}{2} d_1 d_2, \\quad C = 4 a",
            definition: "菱形的两条对角线互相垂直且平分。因此，其面积等于对角线乘积的一半；且可通过对角线的一半，利用勾股定理 $a = \\sqrt{(\\frac{d_1}{2})^2 + (\\frac{d_2}{2})^2}$ 求出边长 $a$，进而计算周长 $C = 4a$。",
            variables: [
                { symbol: "d_1", name: "对角线长 d_1", mainUnit: "长度", altUnits: [] },
                { symbol: "d_2", name: "对角线长 d_2", mainUnit: "长度", altUnits: [] }
            ],
            transformations: [
                { resultSymbol: "S", formula: "S = \\frac{1}{2} d_1 d_2", description: "已知对角线求菱形面积" },
                { resultSymbol: "a", formula: "a = \\sqrt{(\\frac{d_1}{2})^2 + (\\frac{d_2}{2})^2}", description: "已知对角线求菱形边长" }
            ],
            calculator: {
                variables: ["d_1", "d_2"],
                solve: (inputs) => {
                    let d1 = inputs["d_1"];
                    let d2 = inputs["d_2"];
                    if (d1 === null || d2 === null) return { error: "菱形计算需要同时输入对角线 d1 和 d2。" };
                    if (d1 <= 0 || d2 <= 0) return { error: "对角线长度必须大于0！" };
                    
                    const area = 0.5 * d1 * d2;
                    const half1 = d1 / 2;
                    const half2 = d2 / 2;
                    const side = Math.sqrt(half1 * half1 + half2 * half2);
                    const circum = 4 * side;
                    
                    let step = `1. **计算菱形面积**：\\\\` +
                               `$S = \\frac{1}{2} d_1 d_2 = \\frac{1}{2} \\times ${d1} \\times ${d2} = <strong>${area.toFixed(2).replace(/\.?0+$/, '')}</strong>$；\\\\` +
                               `2. **根据对角线垂直平分，勾股定理计算边长 $a$**：\\\\` +
                               `对角线一半分别为 $\\frac{d_1}{2} = ${half1}$，$\\frac{d_2}{2} = ${half2}$；\\\\` +
                               `边长 $a = \\sqrt{${half1}^2 + ${half2}^2} = \\sqrt{${half1*half1} + ${half2*half2}} = \\sqrt{${half1*half1 + half2*half2}} = <strong>${side.toFixed(2).replace(/\.?0+$/, '')}</strong>$；\\\\` +
                               `3. **计算周长**：\\\\` +
                               `$C = 4a = 4 \\times ${side.toFixed(2).replace(/\.?0+$/, '')} = <strong>${circum.toFixed(2).replace(/\.?0+$/, '')}</strong>$。`;
                    
                    return { "S": area, step: step };
                }
            },
            examples: [
                {
                    question: "已知一个菱形的两条对角线分别为 6 cm 和 8 cm，求该菱形的面积 and 周长。",
                    steps: [
                        "1. 计算面积：$S = \\frac{1}{2} d_1 d_2 = \\frac{1}{2} \\times 6\\text{ cm} \\times 8\\text{ cm} = 24\\text{ cm}^2$。",
                        "2. 计算两条对角线的一半：对角线的一半为 3 cm 和 4 cm。",
                        "3. 根据勾股定理计算菱形边长：$a = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5\\text{ cm}$。",
                        "4. 计算周长：$C = 4a = 4 \\times 5\\text{ cm} = 20\\text{ cm}$。",
                        "**答：** 菱形的面积是 $24\\text{ cm}^2$，周长是 $20\\text{ cm}$。"
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
