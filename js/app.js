/**
 * 初中数理提分宝典 - 前端核心交互逻辑
 * 支持：物理/数学双学科一键重组、KaTeX 动态公式渲染、单位自动换算计算器、中考数理千题机驱动、深浅色模式、PDF 打印前置打包
 */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. 全局状态与配置
    // ----------------------------------------------------
    let state = {
        currentSubject: "physics",        // 当前选中的学科 (physics, math)
        currentCategory: "all",           // 当前选中的学科分支
        currentView: "handbook",          // 当前主视图 (handbook, practice)
        printMode: "student",             // PDF 打印模式 (student, teacher)
        searchQuery: ""                   // 全局搜索词
    };

    // 题库本地会话缓存，防止频繁随机导致界面内容与打印版不一致
    let questionCache = {};

    // ----------------------------------------------------
    // 2. DOM 元素缓存
    // ----------------------------------------------------
    const DOM = {
        body: document.body,
        themeToggleBtn: document.getElementById("themeToggleBtn"),
        globalSearch: document.getElementById("globalSearch"),
        clearSearchBtn: document.getElementById("clearSearchBtn"),
        
        // 学科与 Logo 切换
        logoText: document.getElementById("logoText"),
        subjectSwitcher: document.getElementById("subjectSwitcher"),
        
        // SPA 视图切换
        btnShowHandbook: document.getElementById("btnShowHandbook"),
        btnShowPractice: document.getElementById("btnShowPractice"),
        handbookSection: document.getElementById("handbookSection"),
        practiceSection: document.getElementById("practiceSection"),
        
        // 侧边栏
        categoryList: document.getElementById("categoryList"),
        sidebarExportPdfBtn: document.getElementById("sidebarExportPdfBtn"),
        generalPrintSelector: document.getElementById("generalPrintSelector"),
        
        // 手册流与习题流
        formulasGrid: document.getElementById("formulasGrid"),
        currentCategoryTitle: document.getElementById("currentCategoryTitle"),
        visibleFormulaCount: document.getElementById("visibleFormulaCount"),
        
        // 模拟试卷
        exercisesList: document.getElementById("exercisesList"),
        examCategoryName: document.getElementById("examCategoryName"),
        printModeStudent: document.getElementById("printModeStudent"),
        printModeTeacher: document.getElementById("printModeTeacher"),
        practiceExportPdfBtn: document.getElementById("practiceExportPdfBtn"),
        
        // 浮动按钮与加载
        floatingPrintBtn: document.getElementById("floatingPrintBtn"),
        loadingOverlay: document.getElementById("loadingOverlay")
    };

    // ----------------------------------------------------
    // 3. 学科切换与数据分流辅助函数
    // ----------------------------------------------------
    function getActiveDB() {
        return state.currentSubject === "physics" ? PHYSICS_DB : MATH_DB;
    }

    function renderCategorySidebar() {
        const db = getActiveDB();
        DOM.categoryList.innerHTML = "";

        const icons = {
            // 物理
            "all": "✨",
            "mechanics": "⚙️",
            "electricity": "⚡",
            "thermodynamics": "🔥",
            "acoustics-optics": "🌈",
            // 数学
            "num-exp": "📐",
            "eq-func": "📈",
            "geom": "🔵",
            "stat-prob": "📊"
        };

        Object.keys(db.categories).forEach(cat => {
            const isActive = cat === state.currentCategory ? "active" : "";
            const li = document.createElement("li");
            li.className = `nav-item ${isActive}`;
            li.setAttribute("data-category", cat);
            li.innerHTML = `
                <span class="nav-icon">${icons[cat] || "✨"}</span>
                <span class="nav-text">${db.categories[cat]}</span>
                <span class="badge" id="badge-${cat}">0</span>
            `;
            DOM.categoryList.appendChild(li);
        });

        // 重新绑定侧边栏分类点击事件
        bindSidebarClickEvents();
    }

    // ----------------------------------------------------
    // 4. 初始化入口
    // ----------------------------------------------------
    function init() {
        initTheme();
        renderCategorySidebar();
        updateCategoryBadges();
        renderFormulas();
        renderPracticeQuestions();
        bindEvents();
    }

    // ----------------------------------------------------
    // 5. 主题设置与本地持久化
    // ----------------------------------------------------
    function initTheme() {
        const savedTheme = localStorage.getItem("physics-theme") || "theme-dark";
        DOM.body.className = savedTheme;
    }

    function toggleTheme() {
        if (DOM.body.classList.contains("theme-dark")) {
            DOM.body.className = "theme-light";
            localStorage.setItem("physics-theme", "theme-light");
        } else {
            DOM.body.className = "theme-dark";
            localStorage.setItem("physics-theme", "theme-dark");
        }
    }

    // ----------------------------------------------------
    // 6. 侧边栏数字徽标更新
    // ----------------------------------------------------
    function updateCategoryBadges() {
        const db = getActiveDB();
        const counts = { all: db.formulas.length };
        
        Object.keys(db.categories).forEach(cat => {
            counts[cat] = 0;
        });

        db.formulas.forEach(f => {
            if (counts[f.category] !== undefined) {
                counts[f.category]++;
            }
        });

        Object.keys(counts).forEach(cat => {
            const badge = document.getElementById(`badge-${cat}`);
            if (badge) badge.textContent = counts[cat];
        });
    }

    // ----------------------------------------------------
    // 6. 物理公式卡片动态构建与 KaTeX 公式渲染
    // ----------------------------------------------------
    function renderFormulas() {
        DOM.formulasGrid.innerHTML = "";
        const db = getActiveDB();
        
        // 过滤数据：同时支持侧边栏类别与全局搜索
        const filteredFormulas = db.formulas.filter(f => {
            const matchCategory = state.currentCategory === "all" || f.category === state.currentCategory;
            
            let matchSearch = true;
            if (state.searchQuery) {
                const query = state.searchQuery.toLowerCase();
                const titleMatch = f.title.toLowerCase().includes(query);
                const defMatch = f.definition.toLowerCase().includes(query);
                const varMatch = f.variables.some(v => v.name.toLowerCase().includes(query) || v.symbol.toLowerCase().includes(query));
                matchSearch = titleMatch || defMatch || varMatch;
            }
            
            return matchCategory && matchSearch;
        });

        // 更新公式计数器
        DOM.visibleFormulaCount.textContent = `共筛选出 ${filteredFormulas.length} 个公式`;

        if (filteredFormulas.length === 0) {
            DOM.formulasGrid.innerHTML = `
                <div class="no-results-card" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                    <p style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">🔍 未找到相关公式</p>
                    <p style="font-size: 12px; color: var(--text-muted);">请更换关键词或切换学科分类重新搜索</p>
                </div>
            `;
            return;
        }

        filteredFormulas.forEach(f => {
            const card = document.createElement("div");
            card.className = "formula-card";
            card.setAttribute("data-id", f.id);

            // 卡片基本 HTML
            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${f.title}</h3>
                    <span class="category-tag tag-${f.category}">${db.categories[f.category]}</span>
                </div>
                
                <div class="formula-display-box" id="display-${f.id}"></div>
                
                <div class="card-tabs-nav">
                    <button class="tab-nav-btn active" data-tab="def">定义</button>
                    <button class="tab-nav-btn" data-tab="trans">公式变形</button>
                    <button class="tab-nav-btn" data-tab="calc">换算计算</button>
                    <button class="tab-nav-btn" data-tab="example">典型例题</button>
                </div>
                
                <div class="card-tab-content">
                    <!-- Tab 1: 定义 -->
                    <div class="tab-pane active" data-tab-pane="def">
                        <p class="definition-text">${f.definition}</p>
                        <div class="variables-title">变量与解读</div>
                        <ul class="variables-list">
                            ${f.variables.map(v => `
                                <li class="variable-row">
                                    <span class="var-symbol" id="var-sym-${f.id}-${v.symbol.replace(/[^a-zA-Z0-9]/g, '')}"></span>
                                    <span class="var-name">${v.name}</span>
                                    <span class="var-unit">${v.mainUnit}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <!-- Tab 2: 变形 -->
                    <div class="tab-pane" data-tab-pane="trans">
                        <div class="transformations-list">
                            ${f.transformations.map((t, idx) => `
                                <div class="trans-item">
                                    <span class="trans-eq" id="trans-eq-${f.id}-${idx}"></span>
                                    <span class="trans-desc">${t.description}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Tab 3: 单位换算与交互计算器 -->
                    <div class="tab-pane" data-tab-pane="calc">
                        <div class="calc-inputs-container">
                            ${f.id === 'variance_formula' ? `
                                <div class="variance-calc-container">
                                    <div class="variance-input-desc">请输入一组以英文逗号隔开的样本数据（如: 2, 4, 6, 8, 10）:</div>
                                    <input type="text" class="variance-input-field calc-field" placeholder="例如: 2, 4, 6, 8, 10" data-var="list">
                                </div>
                            ` : f.variables.map(v => `
                                <div class="calc-input-row">
                                    <span class="symbol" id="calc-sym-${f.id}-${v.symbol.replace(/[^a-zA-Z0-9]/g, '')}"></span>
                                    <input type="number" placeholder="请输入数值" data-var="${v.symbol}" class="calc-field">
                                    <select data-var="${v.symbol}" class="unit-select">
                                        <option value="1" data-unit-name="${v.mainUnit}">${v.mainUnit} (标准)</option>
                                        ${(v.altUnits || []).map(au => `
                                            <option value="${au.factor}" data-unit-name="${au.unit}">${au.unit}</option>
                                        `).join('')}
                                    </select>
                                </div>
                            `).join('')}
                        </div>
                        <div class="calc-actions">
                            <button class="calc-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                智能求解 & 换算
                            </button>
                            <button class="reset-btn">清空</button>
                        </div>
                        <div class="calc-result-box">
                            <span class="result-title">名师解析代入步骤</span>
                            <span class="result-step"></span>
                        </div>
                    </div>
                    
                    <!-- Tab 4: 典型例题 -->
                    <div class="tab-pane" data-tab-pane="example">
                        <div class="example-box">
                            <div class="example-question">${f.examples[0].question}</div>
                            <button class="view-solution-btn">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                查看详细步骤解析
                            </button>
                            <div class="solution-container">
                                <ol class="solution-steps">
                                    ${f.examples[0].steps.map(step => `<li>${step}</li>`).join('')}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            DOM.formulasGrid.appendChild(card);

            // ================== KaTeX 公式即时动态渲染 ==================
            // 1. 渲染主公式
            katex.render(f.symbolFormula, document.getElementById(`display-${f.id}`), { throwOnError: false, displayMode: true });

            // 2. 渲染物理量符号
            f.variables.forEach(v => {
                const domId = `var-sym-${f.id}-${v.symbol.replace(/[^a-zA-Z0-9]/g, '')}`;
                const elem = document.getElementById(domId);
                if (elem) katex.render(v.symbol, elem, { throwOnError: false });
            });

            // 3. 渲染变形公式
            f.transformations.forEach((t, idx) => {
                const domId = `trans-eq-${f.id}-${idx}`;
                const elem = document.getElementById(domId);
                if (elem) katex.render(t.formula, elem, { throwOnError: false });
            });

            // 4. 渲染计算器公式符号
            f.variables.forEach(v => {
                const domId = `calc-sym-${f.id}-${v.symbol.replace(/[^a-zA-Z0-9]/g, '')}`;
                const elem = document.getElementById(domId);
                if (elem) katex.render(v.symbol, elem, { throwOnError: false });
            });

            // 5. 渲染例题文本及解析中的 LaTeX 元素
            renderMathInElement(card);

            // ================== 绑定卡片专属交互事件 ==================
            initCardInteractions(card, f);
        });
    }

    // ----------------------------------------------------
    // 7. 卡片局部选项卡、计算器与例题折叠控制
    // ----------------------------------------------------
    function initCardInteractions(card, formulaObj) {
        // A. Tab 切换
        const tabBtns = card.querySelectorAll(".tab-nav-btn");
        const tabPanes = card.querySelectorAll(".tab-pane");

        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTab = btn.getAttribute("data-tab");
                
                tabBtns.forEach(b => b.classList.remove("active"));
                tabPanes.forEach(p => p.classList.remove("active"));
                
                btn.classList.add("active");
                card.querySelector(`[data-tab-pane="${targetTab}"]`).classList.add("active");
            });
        });

        // B. 典型例题折叠收缩
        const viewSolutionBtn = card.querySelector(".view-solution-btn");
        const solutionContainer = card.querySelector(".solution-container");
        if (viewSolutionBtn && solutionContainer) {
            viewSolutionBtn.addEventListener("click", () => {
                solutionContainer.classList.toggle("active");
                if (solutionContainer.classList.contains("active")) {
                    viewSolutionBtn.innerHTML = `
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        收起解析步骤
                    `;
                } else {
                    viewSolutionBtn.innerHTML = `
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        查看详细步骤解析
                    `;
                }
            });
        }

        // C. 交互式单位换算计算器核心逻辑
        const calcBtn = card.querySelector(".calc-btn");
        const resetBtn = card.querySelector(".reset-btn");
        const resultBox = card.querySelector(".calc-result-box");
        const resultStep = card.querySelector(".result-step");
        const inputs = card.querySelectorAll(".calc-field");
        const unitSelects = card.querySelectorAll(".unit-select");

        // 重置按钮
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                inputs.forEach(input => input.value = "");
                resultBox.classList.remove("active");
            });
        }

        // 计算按钮
        if (calcBtn) {
            calcBtn.addEventListener("click", () => {
                // 特异性拦截：数学方差计算器一站式求解
                if (formulaObj.id === "variance_formula") {
                    const inputField = card.querySelector('.variance-input-field');
                    const val = inputField.value.trim();
                    if (!val) {
                        alert("请输入一组数据，并用半角逗号隔开。");
                        return;
                    }
                    const dataset = val.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
                    if (dataset.length < 2) {
                        alert("为了计算均值和方差，请至少输入 2 个以上的数值。");
                        return;
                    }

                    // 计算平均数
                    const n = dataset.length;
                    const sum = dataset.reduce((a,b)=>a+b, 0);
                    const mean = sum / n;
                    
                    // 计算方差
                    const diffSqs = dataset.map(x => (x - mean) * (x - mean));
                    const sqSum = diffSqs.reduce((a,b)=>a+b, 0);
                    const variance = sqSum / n;

                    // 生成代入步骤
                    const str = dataset.join("，");
                    const diffSqStr = dataset.map(x => `(${x} - ${mean.toFixed(2).replace(/\.?0+$/, '')})^2`).join(" + ");
                    const diffValStr = dataset.map(x => `(${(x - mean).toFixed(2).replace(/\.?0+$/, '')})^2`).join(" + ");
                    const sqSumValStr = diffSqs.map(x => x.toFixed(4).replace(/\.?0+$/, '')).join(" + ");

                    let stepText = `<div style='display:flex; flex-direction:column; gap:8px;'>`;
                    stepText += `<div><strong>第一步：求数据的平均数 $\\bar{x}$</strong><br>`;
                    stepText += `数据个数 $n = ${n}$；\\\\`;
                    stepText += `$\\bar{x} = \\frac{${dataset.join(" + ")}}{${n}} = \\frac{${sum.toFixed(2).replace(/\.?0+$/, '')}}{${n}} = <strong>${mean.toFixed(4).replace(/\.?0+$/, '')}</strong>`;
                    stepText += `</div>`;

                    stepText += `<div><strong>第二步：代入方差公式 $s^2 = \\frac{1}{n} \\sum (x_i - \\bar{x})^2$ 计算</strong><br>`;
                    stepText += `$s^2 = \\frac{1}{${n}} \\left[ ${diffSqStr} \\right]$\\\\`;
                    stepText += `$s^2 = \\frac{1}{${n}} \\left[ ${diffValStr} \\right]$\\\\`;
                    stepText += `$s^2 = \\frac{1}{${n}} \\left[ ${sqSumValStr} \\right]$\\\\`;
                    stepText += `$s^2 = \\frac{1}{${n}} \\times ${sqSum.toFixed(4).replace(/\.?0+$/, '')} = <strong>${variance.toFixed(6).replace(/\.?0+$/, '')}</strong>`;
                    stepText += `</div>`;
                    stepText += `</div>`;

                    resultStep.innerHTML = stepText;
                    renderMathInElement(resultStep);
                    resultBox.classList.add("active");
                    return;
                }

                // 1. 获取输入参数
                let rawValues = {};
                let chosenUnits = {};
                let siValues = {}; // 转换为标准单位后的值
                
                inputs.forEach(input => {
                    const sym = input.getAttribute("data-var");
                    const val = input.value.trim();
                    rawValues[sym] = val !== "" ? parseFloat(val) : null;
                });

                unitSelects.forEach(select => {
                    const sym = select.getAttribute("data-var");
                    const factor = parseFloat(select.value); // 目标单位到标准SI的换算倍数
                    const unitName = select.options[select.selectedIndex].getAttribute("data-unit-name");
                    chosenUnits[sym] = { factor, unitName };
                });

                // 2. 统计已知数与未知数
                let filledVars = [];
                let emptyVars = [];
                
                Object.keys(rawValues).forEach(sym => {
                    if (rawValues[sym] !== null) {
                        filledVars.push(sym);
                        // 换算为标准 SI：标准值 = 输入值 / 换算系数 (针对我们设置的 3.6 倍速等)
                        // 若是1 m/s = 3.6 km/h, 那么输入 v_kmh, v_si = v_kmh / 3.6. 正确！
                        siValues[sym] = rawValues[sym] / chosenUnits[sym].factor;
                    } else {
                        emptyVars.push(sym);
                        siValues[sym] = null;
                    }
                });

                const totalVars = formulaObj.calculator.variables.length; // 比如：v, s, t 为 3 个

                if (emptyVars.length !== 1) {
                    alert(`【提示】该物理公式共有 ${totalVars} 个物理量，请精准输入其中的 ${totalVars - 1} 个已知数，系统将自动换算单位并求解剩下的 1 个未知数。`);
                    return;
                }

                const unknownVar = emptyVars[0];

                // 3. 调用公式专门的求解器
                const result = formulaObj.calculator.solve(siValues);

                if (result && result.error) {
                    alert("计算错误: " + result.error);
                    return;
                }

                if (result) {
                    const solvedValueSI = result[unknownVar]; // 算出来的标准SI数值
                    // 换算回用户选择的当前单位：用户值 = 标准值 * 换算系数
                    const solvedValueUserUnit = solvedValueSI * chosenUnits[unknownVar].factor;
                    
                    // 4. 组装极尽奢华的单位换算推导解析步骤
                    let processHtml = "<div style='display:flex; flex-direction:column; gap:8px;'>";
                    
                    // 4.1 列出已知项及其单位换算
                    processHtml += "<div><strong>第一步：统一国际单位制（SI）</strong><br>";
                    filledVars.forEach(sym => {
                        const raw = rawValues[sym];
                        const unit = chosenUnits[sym].unitName;
                        const mainUnit = formulaObj.variables.find(v => v.symbol === sym).mainUnit;
                        
                        if (unit !== mainUnit) {
                            // 需要写出单位换算过程
                            const factorText = formulaObj.variables.find(v => v.symbol === sym).conversionText || "";
                            processHtml += `&nbsp;&nbsp;• ${sym} = ${raw} ${unit} = ${siValues[sym].toFixed(4).replace(/\.?0+$/, '')} ${mainUnit} （换算依据：${factorText}）<br>`;
                        } else {
                            processHtml += `&nbsp;&nbsp;• ${sym} = ${raw} ${mainUnit} (已是标准单位)<br>`;
                        }
                    });
                    processHtml += "</div>";

                    // 4.2 列出物理量关系及公式代入
                    processHtml += "<div><strong>第二步：公式代入计算</strong><br>";
                    // 生成 LaTeX 代入公式
                    let stepFormula = result.step;
                    processHtml += `&nbsp;&nbsp;• 求解符号 ${unknownVar} 的推导代入过程为：<span class="katex-render-inline">${stepFormula}</span><br>`;
                    processHtml += `&nbsp;&nbsp;• 计算得出标准物理量值：<strong>${unknownVar} = ${solvedValueSI.toFixed(4).replace(/\.?0+$/, '')} ${formulaObj.variables.find(v => v.symbol === unknownVar).mainUnit}</strong>`;
                    processHtml += "</div>";

                    // 4.3 若求出值的所选单位非标准单位，进行逆向换算
                    const targetUnit = chosenUnits[unknownVar].unitName;
                    const mainUnit = formulaObj.variables.find(v => v.symbol === unknownVar).mainUnit;
                    if (targetUnit !== mainUnit) {
                        processHtml += `<div><strong>第三步：还原至目标选择单位</strong><br>`;
                        processHtml += `&nbsp;&nbsp;• ${unknownVar} = ${solvedValueSI.toFixed(4).replace(/\.?0+$/, '')} ${mainUnit} = <strong>${solvedValueUserUnit.toFixed(4).replace(/\.?0+$/, '')} ${targetUnit}</strong>`;
                        processHtml += "</div>";
                    }

                    processHtml += "</div>";
                    
                    // 将生成步骤填入，并渲染 inline KaTeX
                    resultStep.innerHTML = processHtml;
                    
                    // 重新把渲染好的解析包进 KaTeX 渲染函数中
                    renderMathInElement(resultStep);

                    // 填充对应的未知数输入框以回显结果
                    const unknownInput = card.querySelector(`input[data-var="${unknownVar}"]`);
                    if (unknownInput) {
                        unknownInput.value = solvedValueUserUnit.toFixed(4).replace(/\.?0+$/, '');
                    }

                    resultBox.classList.add("active");
                }
            });
        }
    }

    // ----------------------------------------------------
// 8. 专项习题集动态渲染与交互
    // ----------------------------------------------------
    function renderPracticeQuestions() {
        DOM.exercisesList.innerHTML = "";
        const db = getActiveDB();
        const cat = state.currentCategory;
        const cacheKey = `${state.currentSubject}_${cat}`;
        
        // 动态修改试卷的主标题
        const examTitle = document.querySelector(".exam-main-title");
        if (examTitle) {
            examTitle.textContent = state.currentSubject === "physics" 
                ? "初中物理中考专项突破·模拟练习卷" 
                : "初中数学中考专项突破·模拟练习卷";
        }

        // 如果该学科的 100 道题尚未生成，则调用智能引擎即时计算并写入缓存
        if (!questionCache[cacheKey]) {
            if (state.currentSubject === "physics") {
                if (cat === "all") {
                    // 组装物理综合卷：35道力学，35道电学，20道热学，10道声光学 = 100道经典题
                    const mech = PHYSICS_ENGINE.generateQuestions("mechanics", 35);
                    const elec = PHYSICS_ENGINE.generateQuestions("electricity", 35);
                    const therm = PHYSICS_ENGINE.generateQuestions("thermodynamics", 20);
                    const acop = PHYSICS_ENGINE.generateQuestions("acoustics-optics", 10);
                    questionCache[cacheKey] = [...mech, ...elec, ...therm, ...acop];
                } else {
                    questionCache[cacheKey] = PHYSICS_ENGINE.generateQuestions(cat, 100);
                }
            } else {
                // 数学学科
                if (cat === "all") {
                    // 组装数学综合卷：35道数与式，35道方程与函数，20道几何，10道统计 = 100道经典题
                    const numExp = PHYSICS_ENGINE.generateQuestions("num-exp", 35);
                    const eqFunc = PHYSICS_ENGINE.generateQuestions("eq-func", 35);
                    const geom = PHYSICS_ENGINE.generateQuestions("geom", 20);
                    const statProb = PHYSICS_ENGINE.generateQuestions("stat-prob", 10);
                    questionCache[cacheKey] = [...numExp, ...eqFunc, ...geom, ...statProb];
                } else {
                    questionCache[cacheKey] = PHYSICS_ENGINE.generateQuestions(cat, 100);
                }
            }
        }

        const filteredQuestions = questionCache[cacheKey];
        
        // 统一更新试卷的学科名称
        DOM.examCategoryName.textContent = db.categories[cat];

        if (filteredQuestions.length === 0) {
            DOM.exercisesList.innerHTML = `
                <div style="text-align:center; padding: 40px; color:var(--text-muted);">
                    <p>📝 该分类下暂无精选习题，请切换分类查看其他题目。</p>
                </div>
            `;
            return;
        }

        filteredQuestions.forEach((q, idx) => {
            const card = document.createElement("div");
            card.className = "question-card";
            card.setAttribute("data-id", q.id);

            // 题型名称
            let typeLabel = "计算题";
            if (q.type === "choice") typeLabel = "选择题";
            else if (q.type === "fill") typeLabel = "填空题";

            // 替换题目中的填空横线
            let processedQuestionText = q.question;
            if (q.type === "fill") {
                // 将五个以上的下划线替换成可以在 PDF 中高亮画线的 span
                processedQuestionText = q.question.replace(/_{5,}/g, '<span class="print-fill-blank"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>');
            }

            card.innerHTML = `
                <div class="question-title-row">
                    <strong>第 ${idx + 1} 题【${typeLabel}】</strong> ${processedQuestionText}
                    <span class="score-badge">（${q.score}分）</span>
                </div>
                
                <!-- 学生版答题留空区域 -->
                <div class="student-space ${state.printMode === "student" ? "active" : ""}">
                    ${q.type === "calculation" ? `
                        <div class="calculation-space no-print">—— 请在纸张打印版中写出公式与计算步骤 ——</div>
                    ` : `
                        <div style="height: 10px; width: 100%;"></div>
                    `}
                </div>

                <!-- 教师版/网页刷题 解析区 -->
                <div class="exam-solution-block ${state.printMode === "teacher" ? "active" : ""}">
                    <div class="ans-title">参考答案：</div>
                    <div class="ans-text">${q.answer}</div>
                    <div class="ans-title">名师分步公式推导：</div>
                    <ol class="solution-steps">
                        ${q.steps.map(s => `<li>${s}</li>`).join('')}
                    </ol>
                </div>

                <!-- 网页端的刷题解析控制按钮 (只在屏幕上显示，不打印) -->
                <button class="view-solution-btn no-print" style="margin-top: 10px; display: ${state.printMode === "student" ? "flex" : "none"}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    网页端刷题：显示该题答案与公式解析
                </button>
            `;

            DOM.exercisesList.appendChild(card);

            // ================== KaTeX 公式排版渲染 ==================
            renderMathInElement(card);

            // ================== 绑定网页端单题解析切换 ==================
            const toggleAnsBtn = card.querySelector(".view-solution-btn");
            const solBlock = card.querySelector(".exam-solution-block");
            
            if (toggleAnsBtn && solBlock) {
                toggleAnsBtn.addEventListener("click", () => {
                    solBlock.classList.toggle("active");
                    if (solBlock.classList.contains("active")) {
                        toggleAnsBtn.innerHTML = `
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                            隐藏答案与公式解析
                        `;
                    } else {
                        toggleAnsBtn.innerHTML = `
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            网页端刷题：显示该题答案与公式解析
                        `;
                    }
                });
            }
        });
    }

    // ----------------------------------------------------
    // 9. 智能 PDF 一键导出排版系统
    // ----------------------------------------------------
    function triggerPdfExport() {
        // A. 前置处理：获取当前用户期望的 PDF 打印属性 (student / teacher)
        let mode = "student";
        
        if (state.currentView === "handbook") {
            // 公式手册一键打印：从侧边栏的 quick box 获取打印设置
            const checkedRadio = document.querySelector('input[name="quickPrintMode"]:checked');
            if (checkedRadio) mode = checkedRadio.value;
        } else {
            // 专项习题集打印：从习题主控面板获取打印设置
            mode = state.printMode;
        }

        // B. 动态赋予 body 打印标志类，由 CSS @media print 全自动控制
        if (mode === "student") {
            DOM.body.classList.remove("print-teacher-mode");
            DOM.body.classList.add("print-student-mode");
        } else {
            DOM.body.classList.remove("print-student-mode");
            DOM.body.classList.add("print-teacher-mode");
        }

        // C. 显示超炫酷的 PDF 矢量合成加载中遮罩层，提供终极奢华感
        DOM.loadingOverlay.classList.remove("hidden");
        DOM.loadingOverlay.querySelector(".loading-text").textContent = `正在优化 A4 纸张尺寸，渲染 ${mode === "student" ? "【学生作答版】" : "【教师解析版】"} 矢量 PDF...`;

        // D. 留出 800ms 让渲染就绪并显示 loading
        setTimeout(() => {
            DOM.loadingOverlay.classList.add("hidden");
            // 调用原生打印，由于我们的 CSS 对 @media print 做到了每一个维度的精确控制，直接导出即是标准的完美 A4 PDF！
            window.print();
        }, 800);
    }

    // ----------------------------------------------------
    // 10. 事件监听与绑定
    // ----------------------------------------------------
    function bindEvents() {
        // A. 切换主题
        DOM.themeToggleBtn.addEventListener("click", toggleTheme);

        // B. 全局搜索
        DOM.globalSearch.addEventListener("input", (e) => {
            state.searchQuery = e.target.value.trim();
            if (state.searchQuery) {
                DOM.clearSearchBtn.style.display = "flex";
            } else {
                DOM.clearSearchBtn.style.display = "none";
            }
            // 动态搜索（如果在公式手册则实时渲染公式，如果在习题集也可以）
            if (state.currentView === "handbook") {
                renderFormulas();
            }
        });

        DOM.clearSearchBtn.addEventListener("click", () => {
            DOM.globalSearch.value = "";
            state.searchQuery = "";
            DOM.clearSearchBtn.style.display = "none";
            if (state.currentView === "handbook") {
                renderFormulas();
            }
        });

        // C. SPA 视图标签切换
        DOM.btnShowHandbook.addEventListener("click", () => {
            switchView("handbook");
        });

        DOM.btnShowPractice.addEventListener("click", () => {
            switchView("practice");
        });

        // D. 学科双雄切换监听
        const subjectTabs = DOM.subjectSwitcher.querySelectorAll(".subject-tab");
        subjectTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const sub = tab.getAttribute("data-subject");
                if (sub === state.currentSubject) return;

                subjectTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");

                state.currentSubject = sub;
                state.currentCategory = "all"; // 重置回全部

                // 动态更新 Logo 样式及内容
                DOM.logoText.innerHTML = sub === "physics" 
                    ? `Physics<span>Hub</span>` 
                    : `Math<span>Hub</span>`;
                
                // 动态修改侧边栏及专项练习的说明文案
                const quickPrintDesc = document.querySelector(".quick-card-desc");
                if (quickPrintDesc) {
                    quickPrintDesc.textContent = sub === "physics"
                        ? "生成精美的 A4 物理学习手册，方便打印成实体笔记或复习资料。"
                        : "生成精美的 A4 数学学习手册，方便打印成实体笔记或复习资料。";
                }
                const practiceDesc = document.querySelector("#practiceSection .section-subtitle");
                if (practiceDesc) {
                    practiceDesc.textContent = sub === "physics"
                        ? "专为中国中考物理精选的填空题与计算压轴题，适合打印手写自测。"
                        : "专为中国中考数学精选的几何与代数计算题，适合打印手写自测。";
                }

                // 全面重组 UI 并渲染
                renderCategorySidebar();
                updateCategoryBadges();
                
                const db = getActiveDB();
                DOM.currentCategoryTitle.textContent = `${db.categories.all}公式与定义`;

                renderFormulas();
                renderPracticeQuestions();
            });
        });
    }

    // 动态抽离侧边栏分类点击事件绑定
    function bindSidebarClickEvents() {
        const sidebarItems = DOM.categoryList.querySelectorAll(".nav-item");
        sidebarItems.forEach(item => {
            item.addEventListener("click", () => {
                sidebarItems.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                
                state.currentCategory = item.getAttribute("data-category");
                
                const db = getActiveDB();
                DOM.currentCategoryTitle.textContent = `${db.categories[state.currentCategory]}公式与定义`;
                
                // 重新渲染
                renderFormulas();
                renderPracticeQuestions();
            });
        });

        // E. 习题打印配置面板切换
        DOM.printModeStudent.addEventListener("click", () => {
            setPracticePrintMode("student");
        });

        DOM.printModeTeacher.addEventListener("click", () => {
            setPracticePrintMode("teacher");
        });

        // F. 多端口一键打印触发
        DOM.sidebarExportPdfBtn.addEventListener("click", triggerPdfExport);
        DOM.practiceExportPdfBtn.addEventListener("click", triggerPdfExport);
        DOM.floatingPrintBtn.addEventListener("click", triggerPdfExport);
    }

    // SPA 视图切换
    function switchView(viewName) {
        state.currentView = viewName;
        if (viewName === "handbook") {
            DOM.btnShowHandbook.classList.add("active");
            DOM.btnShowPractice.classList.remove("active");
            DOM.handbookSection.classList.add("active");
            DOM.practiceSection.classList.remove("active");
        } else {
            DOM.btnShowHandbook.classList.remove("active");
            DOM.btnShowPractice.classList.add("active");
            DOM.handbookSection.classList.remove("active");
            DOM.practiceSection.classList.add("active");
        }
    }

    // 习题打印配置切换
    function setPracticePrintMode(mode) {
        state.printMode = mode;
        if (mode === "student") {
            DOM.printModeStudent.classList.add("active");
            DOM.printModeTeacher.classList.remove("active");
        } else {
            DOM.printModeStudent.classList.remove("active");
            DOM.printModeTeacher.classList.add("active");
        }
        // 重新渲染习题列表以应用最新的状态
        renderPracticeQuestions();
    }

    // Helper: 递归渲染 HTML 元素内部的所有 LaTeX 数学公式
    function renderMathInElement(container) {
        // 正则表达式匹配行内公式: $...$
        const inlineMathRegex = /\$([^\$]+)\$/g;
        
        // 深度优先遍历所有文本节点并替换为 KaTeX 容器
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        let node;
        let nodesToReplace = [];

        while (node = walker.nextNode()) {
            if (node.nodeValue.trim() !== "" && inlineMathRegex.test(node.nodeValue)) {
                nodesToReplace.push(node);
            }
            inlineMathRegex.lastIndex = 0; // 重置正则状态
        }

        nodesToReplace.forEach(textNode => {
            const parent = textNode.parentNode;
            if (!parent || parent.tagName === "SCRIPT" || parent.tagName === "STYLE" || parent.classList.contains("katex")) return;
            
            const originalValue = textNode.nodeValue;
            const span = document.createElement("span");
            
            // 复杂替换：利用正则切片把 $...$ 换成 KaTeX 占位符
            let parts = originalValue.split(inlineMathRegex);
            let matches = originalValue.match(inlineMathRegex);
            
            let htmlContent = "";
            let matchIdx = 0;
            
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    htmlContent += parts[i];
                } else {
                    const formula = parts[i];
                    const tempId = `katex-temp-${Math.random().toString(36).substr(2, 9)}`;
                    htmlContent += `<span id="${tempId}" class="katex-inline"></span>`;
                    
                    // 异步渲染保证DOM生成后挂载
                    setTimeout(() => {
                        const elem = document.getElementById(tempId);
                        if (elem) {
                            katex.render(formula, elem, { throwOnError: false, displayMode: false });
                        }
                    }, 0);
                }
            }
            
            span.innerHTML = htmlContent;
            parent.replaceChild(span, textNode);
        });
    }

    // 执行初始化
    init();
});
