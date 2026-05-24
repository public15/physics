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
        btnShowConversions: document.getElementById("btnShowConversions"),
        btnUploadSection: document.getElementById("btnUploadSection"),
        handbookSection: document.getElementById("handbookSection"),
        practiceSection: document.getElementById("practiceSection"),
        conversionsSection: document.getElementById("conversionsSection"),
        uploadSection: document.getElementById("uploadSection"),
        
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

    // ====================================================
    // FunctionGrapher: 一次和二次函数 Canvas 极速矢量渲染引擎
    // ====================================================
    class FunctionGrapher {
        constructor(canvasId, type) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext("2d");
            this.type = type; // "linear" 或 "quadratic"
            
            // 设定参数默认值
            this.k = 1.0;
            this.b = 0.0;
            
            this.a = 1.0;
            this.qb = 0.0;
            this.qc = 0.0;
            
            // 网格比例
            this.scale = 22; // 1个数学单位 = 22像素，刚好能在一屏内显示完整
            
            // 高清屏支持
            this.setupRetina();
            this.draw();
        }

        setupRetina() {
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.ctx.scale(dpr, dpr);
            this.width = rect.width;
            this.height = rect.height;
            this.centerX = this.width / 2;
            this.centerY = this.height / 2;
        }

        toPixelX(x) {
            return this.centerX + x * this.scale;
        }

        toPixelY(y) {
            return this.centerY - y * this.scale;
        }

        toMathX(pixelX) {
            return (pixelX - this.centerX) / this.scale;
        }

        toMathY(pixelY) {
            return (this.centerY - pixelY) / this.scale;
        }

        draw() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.width, this.height);
            
            const isDark = document.body.classList.contains("theme-dark");
            
            // 定义和谐颜色
            const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)";
            const axisColor = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)";
            const axisLabelColor = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)";
            const primaryCurveColor = this.type === 'linear' ? '#60a5fa' : '#a855f7';
            
            // 1. 绘制网格
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 4]);
            
            const maxUnitsX = Math.ceil(this.centerX / this.scale);
            const maxUnitsY = Math.ceil(this.centerY / this.scale);
            
            // 垂直网格
            for (let i = -maxUnitsX; i <= maxUnitsX; i++) {
                const px = this.toPixelX(i);
                ctx.beginPath();
                ctx.moveTo(px, 0);
                ctx.lineTo(px, this.height);
                ctx.stroke();
            }
            
            // 水平网格
            for (let i = -maxUnitsY; i <= maxUnitsY; i++) {
                const py = this.toPixelY(i);
                ctx.beginPath();
                ctx.moveTo(0, py);
                ctx.lineTo(this.width, py);
                ctx.stroke();
            }
            
            // 2. 轴实线
            ctx.strokeStyle = axisColor;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([]);
            
            ctx.beginPath();
            ctx.moveTo(0, this.centerY);
            ctx.lineTo(this.width, this.centerY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.centerX, 0);
            ctx.lineTo(this.centerX, this.height);
            ctx.stroke();
            
            // X轴箭头
            ctx.fillStyle = axisColor;
            ctx.beginPath();
            ctx.moveTo(this.width - 8, this.centerY - 4);
            ctx.lineTo(this.width, this.centerY);
            ctx.lineTo(this.width - 8, this.centerY + 4);
            ctx.fill();
            
            // Y轴箭头
            ctx.beginPath();
            ctx.moveTo(this.centerX - 4, 8);
            ctx.lineTo(this.centerX, 0);
            ctx.lineTo(this.centerX + 4, 8);
            ctx.fill();
            
            // 标注 O, x, y
            ctx.fillStyle = axisLabelColor;
            ctx.font = "italic 11px Outfit, var(--font-primary)";
            ctx.fillText("x", this.width - 12, this.centerY + 14);
            ctx.fillText("y", this.centerX - 14, 12);
            ctx.fillText("O", this.centerX + 5, this.centerY + 14);
            
            // 绘制坐标轴上的刻度数值 (排除原点 0)
            ctx.font = "9px Outfit, var(--font-primary)";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            
            for (let i = -maxUnitsX; i <= maxUnitsX; i++) {
                if (i === 0) continue;
                const px = this.toPixelX(i);
                ctx.fillText(i.toString(), px, this.centerY + 4);
                // 小刻度线
                ctx.beginPath();
                ctx.moveTo(px, this.centerY - 2);
                ctx.lineTo(px, this.centerY + 2);
                ctx.strokeStyle = axisColor;
                ctx.stroke();
            }
            
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            for (let i = -maxUnitsY; i <= maxUnitsY; i++) {
                if (i === 0) continue;
                const py = this.toPixelY(i);
                ctx.fillText(i.toString(), this.centerX - 4, py);
                // 小刻度线
                ctx.beginPath();
                ctx.moveTo(this.centerX - 2, py);
                ctx.lineTo(this.centerX + 2, py);
                ctx.strokeStyle = axisColor;
                ctx.stroke();
            }

            // 4. 绘制函数图像
            if (this.type === "linear") {
                // y = kx + b
                ctx.strokeStyle = primaryCurveColor;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                
                const startX = this.toMathX(0);
                const endX = this.toMathX(this.width);
                const startY = this.k * startX + this.b;
                const endY = this.k * endX + this.b;
                
                ctx.moveTo(this.toPixelX(startX), this.toPixelY(startY));
                ctx.lineTo(this.toPixelX(endX), this.toPixelY(endY));
                ctx.stroke();
                
                // 绘制 Y轴截距点 (0, b)
                const ptX = this.toPixelX(0);
                const ptY = this.toPixelY(this.b);
                
                // 呼吸发光层
                ctx.fillStyle = isDark ? "rgba(96, 165, 250, 0.25)" : "rgba(96, 165, 250, 0.15)";
                ctx.beginPath();
                ctx.arc(ptX, ptY, 7, 0, Math.PI * 2);
                ctx.fill();
                
                // 实心点
                ctx.fillStyle = "#60a5fa";
                ctx.beginPath();
                ctx.arc(ptX, ptY, 3.5, 0, Math.PI * 2);
                ctx.fill();
                
                // 标注文字
                ctx.fillStyle = isDark ? "#fff" : "#333";
                ctx.font = "bold 9px Outfit, var(--font-primary)";
                ctx.textAlign = "left";
                ctx.fillText(`(0, ${this.b.toFixed(1).replace(/\.0$/, '')})`, ptX + 8, ptY);
                
            } else if (this.type === "quadratic") {
                // y = ax^2 + bx + c
                if (this.a !== 0) {
                    const symX = -this.qb / (2 * this.a);
                    const symPx = this.toPixelX(symX);
                    
                    // 对称轴黄色虚线
                    ctx.strokeStyle = isDark ? "rgba(234, 179, 8, 0.4)" : "rgba(234, 179, 8, 0.6)";
                    ctx.lineWidth = 1.2;
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath();
                    ctx.moveTo(symPx, 0);
                    ctx.lineTo(symPx, this.height);
                    ctx.stroke();
                    ctx.setLineDash([]); // 恢复
                    
                    ctx.fillStyle = isDark ? "rgba(234, 179, 8, 0.8)" : "rgba(202, 138, 4, 0.9)";
                    ctx.font = "italic 9px Noto Sans SC, var(--font-primary)";
                    ctx.textAlign = "left";
                    ctx.fillText(`对称轴 x = ${symX.toFixed(2).replace(/\.?0+$/, '')}`, symPx + 6, 16);
                }
                
                // 抛物线
                ctx.strokeStyle = primaryCurveColor;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                
                let first = true;
                for (let px = 0; px <= this.width; px += 2) {
                    const mx = this.toMathX(px);
                    const my = this.a * mx * mx + this.qb * mx + this.qc;
                    const py = this.toPixelY(my);
                    
                    if (py >= -50 && py <= this.height + 50) {
                        if (first) {
                            ctx.moveTo(px, py);
                            first = false;
                        } else {
                            ctx.lineTo(px, py);
                        }
                    }
                }
                ctx.stroke();
                
                // 绘制顶点
                if (this.a !== 0) {
                    const vx = -this.qb / (2 * this.a);
                    const vy = (4 * this.a * this.qc - this.qb * this.qb) / (4 * this.a);
                    const vPx = this.toPixelX(vx);
                    const vPy = this.toPixelY(vy);
                    
                    if (vPx >= 0 && vPx <= this.width && vPy >= 0 && vPy <= this.height) {
                        ctx.fillStyle = isDark ? "rgba(168, 85, 247, 0.35)" : "rgba(168, 85, 247, 0.2)";
                        ctx.beginPath();
                        ctx.arc(vPx, vPy, 8, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.fillStyle = "#c084fc";
                        ctx.beginPath();
                        ctx.arc(vPx, vPy, 3.5, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.fillStyle = isDark ? "#fff" : "#333";
                        ctx.font = "bold 9px Outfit, var(--font-primary)";
                        ctx.textAlign = vx >= 0 ? "left" : "right";
                        const offset = vx >= 0 ? 8 : -8;
                        ctx.fillText(`顶点 (${vx.toFixed(1).replace(/\.0$/, '')}, ${vy.toFixed(1).replace(/\.0$/, '')})`, vPx + offset, vPy - 3);
                    }
                }
            }
        }
    }

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
        renderConversions();
        bindEvents();
        initLightbox();
        FormulaAnimator.init();
    }

    // ----------------------------------------------------
    // 5. 主题设置与自动化
    // ----------------------------------------------------
    function initTheme() {
        const savedTheme = localStorage.getItem("physics-theme");
        if (savedTheme) {
            DOM.body.className = savedTheme;
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            DOM.body.className = prefersDark ? "theme-dark" : "theme-light";
        }

        // 监听操作系统级别的深浅模式切换
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                // 如果用户没有手动设定过主题，就自动跟随系统切换
                if (!localStorage.getItem("physics-theme")) {
                    DOM.body.className = e.matches ? "theme-dark" : "theme-light";
                }
            });
        }
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

    // 监听打印事件，强制在打印时应用白天模式（防止黑白打印机导出时受夜间模式 CSS 变量污染）
    window.addEventListener("beforeprint", () => {
        state.wasDarkBeforePrint = DOM.body.classList.contains("theme-dark");
        if (state.wasDarkBeforePrint) {
            DOM.body.className = "theme-light";
        }
    });

    window.addEventListener("afterprint", () => {
        if (state.wasDarkBeforePrint) {
            DOM.body.className = "theme-dark";
        }
    });

    // ----------------------------------------------------
    // 6. 侧边栏数字徽标更新
    // ----------------------------------------------------
    function updateCategoryBadges() {
        const db = getActiveDB();
        const counts = {};
        
        // 先将所有分类（包括 all）初始化为 0
        Object.keys(db.categories).forEach(cat => {
            counts[cat] = 0;
        });

        // 统计各子类公式数量
        db.formulas.forEach(f => {
            if (counts[f.category] !== undefined) {
                counts[f.category]++;
            }
        });

        // all = 所有子类之和
        counts["all"] = Object.keys(counts)
            .filter(cat => cat !== "all")
            .reduce((sum, cat) => sum + counts[cat], 0);

        // 更新 DOM
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
                        ${f.imagePath ? `
                            <div class="formula-illustration-container">
                                <div class="skeleton-glow"></div>
                                <img src="${f.imagePath}" alt="${f.title}原理图解" class="formula-illustration-img" data-title="${f.title}原理图解" onload="this.previousElementSibling.remove()">
                            </div>
                        ` : ''}
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
                        ${['speed', 'ohms-law', 'specific-heat', 'pythagorean_theorem', 'lens-imaging', 'triangle_congruence', 'triangle_similarity', 'polygon_angles'].includes(f.id) ? `
                            <button class="anim-trigger-btn" data-anim-type="trans" data-formula-id="${f.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                🎬 启动公式变形推导动画
                            </button>
                        ` : ''}
                    </div>
                    
                    <!-- Tab 3: 单位换算与交互计算器 -->
                    <div class="tab-pane" data-tab-pane="calc">
                        ${f.id === 'linear_function' || f.id === 'quadratic_function' ? `
                            <div class="function-graph-split">
                                <div class="function-calc-side">
                                    <div class="side-sub-title">待定系数/公式法计算器</div>
                                    <div class="calc-inputs-container">
                                        ${f.variables.map(v => `
                                            <div class="calc-input-row">
                                                <span class="symbol" id="calc-sym-${f.id}-${v.symbol.replace(/[^a-zA-Z0-9]/g, '')}"></span>
                                                <input type="number" placeholder="请输入数值" data-var="${v.symbol}" class="calc-field">
                                                <select data-var="${v.symbol}" class="unit-select">
                                                    <option value="1" data-unit-name="${v.mainUnit}">${v.mainUnit} (标准)</option>
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
                                <div class="function-graph-side">
                                    <div class="side-sub-title">中考图形极速矢量演示实验室</div>
                                    <div class="function-graph-lab">
                                        <div class="graph-canvas-wrapper">
                                            <canvas class="function-graph-canvas" id="canvas-${f.id}" width="280" height="280"></canvas>
                                        </div>
                                        <div class="graph-controls">
                                            ${f.id === 'linear_function' ? `
                                                <div class="control-row">
                                                    <div class="slider-label-area">
                                                        <span class="param-title">斜率 k =</span>
                                                        <span class="param-val" id="val-linear-k">1.0</span>
                                                    </div>
                                                    <input type="range" class="graph-slider" id="slider-linear-k" min="-5" max="5" step="0.1" value="1">
                                                </div>
                                                <div class="control-row">
                                                    <div class="slider-label-area">
                                                        <span class="param-title">截距 b =</span>
                                                        <span class="param-val" id="val-linear-b">0.0</span>
                                                    </div>
                                                    <input type="range" class="graph-slider" id="slider-linear-b" min="-5" max="5" step="0.1" value="0">
                                                </div>
                                                <div class="graph-formula-show" id="formula-linear-show">y = 1.0x</div>
                                                <div class="graph-tips-box" id="tips-linear-show">
                                                    <div class="tips-title">中考必背口诀</div>
                                                    <div class="tips-content" id="tips-linear-content">k > 0: 图像经过一、三象限，y 随 x 的增大而增大</div>
                                                </div>
                                                <button class="anim-trigger-btn anim-graph-btn" id="btn-anim-linear" data-anim-type="trans" data-formula-id="linear" data-func="linear" style="margin-top: 10px; width: 100%;">
                                                    🎬 播放直线旋转与平移口诀动画
                                                </button>
                                            ` : `
                                                <div class="control-row">
                                                    <div class="slider-label-area">
                                                        <span class="param-title">二次项 a =</span>
                                                        <span class="param-val" id="val-quadratic-a">1.0</span>
                                                    </div>
                                                    <input type="range" class="graph-slider" id="slider-quadratic-a" min="-4" max="4" step="0.1" value="1">
                                                </div>
                                                <div class="control-row">
                                                    <div class="slider-label-area">
                                                        <span class="param-title">一次项 b =</span>
                                                        <span class="param-val" id="val-quadratic-b">0.0</span>
                                                    </div>
                                                    <input type="range" class="graph-slider" id="slider-quadratic-b" min="-4" max="4" step="0.1" value="0">
                                                </div>
                                                <div class="control-row">
                                                    <div class="slider-label-area">
                                                        <span class="param-title">常数项 c =</span>
                                                        <span class="param-val" id="val-quadratic-c">0.0</span>
                                                    </div>
                                                    <input type="range" class="graph-slider" id="slider-quadratic-c" min="-4" max="4" step="0.1" value="0">
                                                </div>
                                                <div class="graph-formula-show" id="formula-quadratic-show">y = 1.0x^2</div>
                                                <div class="graph-tips-box" id="tips-quadratic-show">
                                                    <div class="tips-title">对称轴与顶点分析</div>
                                                    <div class="tips-content" id="tips-quadratic-content">开口向上，顶点 (0, 0)，对称轴 x = 0</div>
                                                </div>
                                                <button class="anim-trigger-btn anim-graph-btn" id="btn-anim-quadratic" data-anim-type="trans" data-formula-id="quadratic" data-func="quadratic" style="margin-top: 10px; width: 100%;">
                                                    🎬 播放“左同右异”与开口变化动画
                                                </button>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : `
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
                            ${['speed', 'density'].includes(f.id) ? `
                                <button class="anim-trigger-btn" data-anim-type="unit" data-formula-id="${f.id}">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    🎬 启动单位换算推导动画
                                </button>
                            ` : ''}
                        `}
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

        // D. 绑定公式变形与单位换算动画触发器
        const animTriggerBtns = card.querySelectorAll(".anim-trigger-btn");
        animTriggerBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const animType = btn.getAttribute("data-anim-type");
                const formulaId = btn.getAttribute("data-formula-id");
                if (!animType || !formulaId) return; // 拦截没有声明完整动画属性的特殊按钮
                FormulaAnimator.start(animType, formulaId);
            });
        });

        // E. 数学图形仿真实验室特异性绑定
        if (formulaObj.id === 'linear_function') {
            setTimeout(() => {
                const grapher = new FunctionGrapher("canvas-linear_function", "linear");
                
                const sliderK = card.querySelector("#slider-linear-k");
                const sliderB = card.querySelector("#slider-linear-b");
                
                const valK = card.querySelector("#val-linear-k");
                const valB = card.querySelector("#val-linear-b");
                
                const formulaShow = card.querySelector("#formula-linear-show");
                const tipsContent = card.querySelector("#tips-linear-content");
                
                const updateGraph = () => {
                    if (!sliderK || !sliderB) return;
                    const k = parseFloat(sliderK.value);
                    const b = parseFloat(sliderB.value);
                    
                    grapher.k = k;
                    grapher.b = b;
                    grapher.draw();
                    
                    if (valK) valK.textContent = k.toFixed(1);
                    if (valB) valB.textContent = b.toFixed(1);
                    
                    let bText = b >= 0 ? `+ ${b.toFixed(1)}` : `- ${Math.abs(b).toFixed(1)}`;
                    if (b === 0) bText = "";
                    if (formulaShow) formulaShow.innerHTML = `y = ${k.toFixed(1)}x ${bText}`;
                    
                    let tip = "";
                    if (k > 0) {
                        tip += "k > 0: 图像经过一、三象限，y 随 x 的增大而增大；";
                        if (b > 0) tip += " 经过一、二、三象限。";
                        else if (b < 0) tip += " 经过一、三、四象限。";
                        else tip += " 经过一、三象限及原点。";
                    } else if (k < 0) {
                        tip += "k < 0: 图像经过二、四象限，y 随 x 的增大而减小；";
                        if (b > 0) tip += " 经过一、二、四象限。";
                        else if (b < 0) tip += " 经过二、三、四象限。";
                        else tip += " 经过二、四象限及原点。";
                    } else {
                        tip += "k = 0: 图像退化为水平直线 y = b，不属于一次函数。";
                    }
                    if (tipsContent) tipsContent.textContent = tip;
                };
                
                if (sliderK && sliderB) {
                    sliderK.addEventListener("input", updateGraph);
                    sliderB.addEventListener("input", updateGraph);
                    updateGraph();
                }

                // 绑定特异性动画按钮
                const btnAnimLinear = card.querySelector("#btn-anim-linear");
                if (btnAnimLinear) {
                    btnAnimLinear.addEventListener("click", (e) => {
                        e.stopPropagation();
                        FormulaAnimator.start("trans", "linear");
                    });
                }
            }, 100);
        }

        if (formulaObj.id === 'quadratic_function') {
            setTimeout(() => {
                const grapher = new FunctionGrapher("canvas-quadratic_function", "quadratic");
                
                const sliderA = card.querySelector("#slider-quadratic-a");
                const sliderB = card.querySelector("#slider-quadratic-b");
                const sliderC = card.querySelector("#slider-quadratic-c");
                
                const valA = card.querySelector("#val-quadratic-a");
                const valB = card.querySelector("#val-quadratic-b");
                const valC = card.querySelector("#val-quadratic-c");
                
                const formulaShow = card.querySelector("#formula-quadratic-show");
                const tipsContent = card.querySelector("#tips-quadratic-content");
                
                const updateGraph = () => {
                    if (!sliderA || !sliderB || !sliderC) return;
                    let a = parseFloat(sliderA.value);
                    if (a === 0) {
                        a = 0.1;
                        sliderA.value = 0.1;
                    }
                    const b = parseFloat(sliderB.value);
                    const c = parseFloat(sliderC.value);
                    
                    grapher.a = a;
                    grapher.qb = b;
                    grapher.qc = c;
                    grapher.draw();
                    
                    if (valA) valA.textContent = a.toFixed(1);
                    if (valB) valB.textContent = b.toFixed(1);
                    if (valC) valC.textContent = c.toFixed(1);
                    
                    let bText = b >= 0 ? `+ ${b.toFixed(1)}x` : `- ${Math.abs(b).toFixed(1)}x`;
                    if (b === 0) bText = "";
                    let cText = c >= 0 ? `+ ${c.toFixed(1)}` : `- ${Math.abs(c).toFixed(1)}`;
                    if (c === 0) cText = "";
                    if (formulaShow) formulaShow.innerHTML = `y = ${a.toFixed(1)}x² ${bText} ${cText}`;
                    
                    const symX = -b / (2 * a);
                    const vy = (4 * a * c - b * b) / (4 * a);
                    let tip = `开口${a > 0 ? "向上" : "向下"}。对称轴 x = ${symX.toFixed(2)}。顶点坐标 (${symX.toFixed(1)}, ${vy.toFixed(1)})。`;
                    
                    if (b !== 0) {
                        const sameSign = (a > 0 && b > 0) || (a < 0 && b < 0);
                        tip += sameSign ? "【左同】ab同号，对称轴在y轴左侧；" : "【右异】ab异号，对称轴在y轴右侧；";
                    } else {
                        tip += "b = 0，对称轴为y轴；";
                    }
                    tip += ` 与y轴交于 (0, ${c.toFixed(1)})。`;
                    if (tipsContent) tipsContent.textContent = tip;
                };
                
                if (sliderA && sliderB && sliderC) {
                    sliderA.addEventListener("input", updateGraph);
                    sliderB.addEventListener("input", updateGraph);
                    sliderC.addEventListener("input", updateGraph);
                    updateGraph();
                }

                // 绑定特异性动画按钮
                const btnAnimQuadratic = card.querySelector("#btn-anim-quadratic");
                if (btnAnimQuadratic) {
                    btnAnimQuadratic.addEventListener("click", (e) => {
                        e.stopPropagation();
                        FormulaAnimator.start("trans", "quadratic");
                    });
                }
            }, 100);
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
                <label class="print-select-toggle no-print" title="取消勾选后，导出 PDF 时将不包含此题">
                    <input type="checkbox" class="print-cb" checked>
                    <span>打印此题</span>
                </label>
                <div class="question-title-row">
                    <strong>第 ${idx + 1} 题【${typeLabel}】</strong> ${processedQuestionText}
                    <span class="score-badge">（${q.score}分）</span>
                </div>
                
                <!-- 学生版答题留空区域 -->
                <div class="student-space ${state.printMode === "student" ? "active" : ""}">
                    ${q.type === "calculation" ? `
                        <div class="calculation-space">—— 请在纸张打印版中写出公式与计算步骤 ——</div>
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
        const cards = document.querySelectorAll('#exercisesList .question-card');
        cards.forEach(card => {
            const cb = card.querySelector('.print-cb');
            if (cb && !cb.checked) {
                card.classList.add('exclude-from-print');
            } else {
                card.classList.remove('exclude-from-print');
            }
        });
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
    // 10a. 图片灯箱放大查看
    // ----------------------------------------------------
    function initLightbox() {
        const lightbox     = document.getElementById("imgLightbox");
        const lightboxImg  = document.getElementById("lightboxImg");
        const lightboxCap  = document.getElementById("lightboxCaption");
        const closeBtn     = document.getElementById("lightboxCloseBtn");
        const backdrop     = document.getElementById("lightboxBackdrop");

        function openLightbox(src, title) {
            lightboxImg.src = src;
            lightboxImg.alt = title;
            lightboxCap.textContent = title;
            lightbox.classList.remove("hidden");
            document.body.style.overflow = "hidden";
        }

        function closeLightbox() {
            lightbox.classList.add("hidden");
            document.body.style.overflow = "";
            // 清空 src 避免残留
            setTimeout(() => { lightboxImg.src = ""; }, 300);
        }

        // 事件委托：监听公式区域中所有插图图片
        document.getElementById("formulasGrid").addEventListener("click", (e) => {
            const img = e.target.closest(".formula-illustration-img");
            if (!img) return;
            openLightbox(img.src, img.dataset.title || img.alt);
        });

        // 关闭按钮 & 点击遮罩
        closeBtn.addEventListener("click", closeLightbox);
        backdrop.addEventListener("click", closeLightbox);

        // ESC 键关闭
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !lightbox.classList.contains("hidden")) {
                closeLightbox();
            }
        });
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

        DOM.btnShowConversions.addEventListener("click", () => {
            switchView("conversions");
        });

        if (DOM.btnUploadSection) {
            DOM.btnUploadSection.addEventListener("click", () => {
                switchView("uploadSection");
            });
        }

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
        const allBtns = [DOM.btnShowHandbook, DOM.btnShowPractice, DOM.btnShowConversions, DOM.btnUploadSection].filter(Boolean);
        const allSections = [DOM.handbookSection, DOM.practiceSection, DOM.conversionsSection, DOM.uploadSection].filter(Boolean);
        allBtns.forEach(b => b.classList.remove("active"));
        allSections.forEach(s => s.classList.remove("active"));
        
        if (viewName === "handbook") {
            DOM.btnShowHandbook && DOM.btnShowHandbook.classList.add("active");
            DOM.handbookSection && DOM.handbookSection.classList.add("active");
        } else if (viewName === "practice") {
            DOM.btnShowPractice && DOM.btnShowPractice.classList.add("active");
            DOM.practiceSection && DOM.practiceSection.classList.add("active");
        } else if (viewName === "conversions") {
            DOM.btnShowConversions && DOM.btnShowConversions.classList.add("active");
            DOM.conversionsSection && DOM.conversionsSection.classList.add("active");
        } else if (viewName === "uploadSection") {
            DOM.btnUploadSection && DOM.btnUploadSection.classList.add("active");
            DOM.uploadSection && DOM.uploadSection.classList.add("active");
        }
    }

    // ----------------------------------------------------
    // 单位换算速查：数据 & 渲染
    // ----------------------------------------------------
    const UNIT_CONVERSIONS_DATA = [
        {
            id: "speed", icon: "🚀", title: "速度", color: "#60a5fa",
            items: [
                { from: "1 m/s", to: "3.6 km/h", star: true },
                { from: "1 km/h", to: "5/18 m/s ≈ 0.278 m/s", star: true },
                { from: "声速（空气 15℃）", to: "≈ 340 m/s", star: true },
                { from: "声速（水中）", to: "≈ 1500 m/s", star: false },
                { from: "声速（铁中）", to: "≈ 5200 m/s", star: false },
                { from: "光速 c（真空）", to: "3×10⁸ m/s", star: true },
            ]
        },
        {
            id: "length", icon: "📏", title: "长度", color: "#34d399",
            items: [
                { from: "1 km", to: "1000 m = 10³ m", star: true },
                { from: "1 m", to: "100 cm = 1000 mm", star: true },
                { from: "1 cm", to: "10 mm = 10⁻² m", star: true },
                { from: "1 mm", to: "1000 μm = 10⁻³ m", star: false },
                { from: "1 μm（微米）", to: "1000 nm = 10⁻⁶ m", star: false },
                { from: "1 nm（纳米）", to: "10⁻⁹ m", star: false },
                { from: "1 光年", to: "≈ 9.46×10¹⁵ m", star: false },
                { from: "地球半径", to: "≈ 6.4×10⁶ m", star: false },
            ]
        },
        {
            id: "time", icon: "⏱️", title: "时间", color: "#a78bfa",
            items: [
                { from: "1 h（小时）", to: "60 min = 3600 s", star: true },
                { from: "1 min（分钟）", to: "60 s", star: true },
                { from: "1 d（天）", to: "24 h = 1440 min = 86400 s", star: false },
                { from: "1 ms（毫秒）", to: "10⁻³ s", star: false },
                { from: "1 μs（微秒）", to: "10⁻⁶ s", star: false },
            ]
        },
        {
            id: "mass", icon: "⚖️", title: "质量", color: "#f59e0b",
            items: [
                { from: "1 t（吨）", to: "1000 kg = 10³ kg", star: true },
                { from: "1 kg（千克）", to: "1000 g", star: true },
                { from: "1 g（克）", to: "1000 mg = 10⁻³ kg", star: true },
                { from: "1 mg（毫克）", to: "10⁻⁶ kg = 10⁻³ g", star: false },
            ]
        },
        {
            id: "force", icon: "💪", title: "力", color: "#f87171",
            items: [
                { from: "1 N（牛顿）", to: "1 kg·m/s²", star: true },
                { from: "1 kN（千牛）", to: "1000 N = 10³ N", star: true },
                { from: "1 MN（兆牛）", to: "10⁶ N", star: false },
                { from: "1 N", to: "≈ 0.102 kgf（千克力）", star: false },
                { from: "1 kgf（千克力）", to: "≈ 9.8 N", star: false },
            ]
        },
        {
            id: "pressure", icon: "🌬️", title: "压强", color: "#fb923c",
            items: [
                { from: "1 Pa（帕斯卡）", to: "1 N/m²", star: true },
                { from: "1 kPa（千帕）", to: "1000 Pa = 10³ Pa", star: true },
                { from: "1 MPa（兆帕）", to: "10⁶ Pa", star: false },
                { from: "1 标准大气压 atm", to: "101325 Pa ≈ 1.013×10⁵ Pa", star: true },
                { from: "1 atm", to: "760 mmHg（毫米汞柱）", star: false },
                { from: "中考近似大气压", to: "≈ 1.0×10⁵ Pa", star: true },
            ]
        },
        {
            id: "energy", icon: "⚡", title: "功与能量", color: "#fbbf24",
            items: [
                { from: "1 J（焦耳）", to: "1 N·m = 1 kg·m²/s²", star: true },
                { from: "1 kJ（千焦）", to: "1000 J = 10³ J", star: true },
                { from: "1 MJ（兆焦）", to: "10⁶ J", star: false },
                { from: "1 kW·h（度电）", to: "3.6×10⁶ J = 3600 kJ", star: true },
                { from: "1 cal（卡路里）", to: "≈ 4.2 J", star: true },
                { from: "1 kcal（千卡/大卡）", to: "4200 J = 4.2 kJ", star: true },
                { from: "1 eV（电子伏特）", to: "1.6×10⁻¹⁹ J", star: false },
            ]
        },
        {
            id: "power", icon: "🔋", title: "功率", color: "#4ade80",
            items: [
                { from: "1 W（瓦特）", to: "1 J/s = 1 kg·m²/s³", star: true },
                { from: "1 kW（千瓦）", to: "1000 W = 10³ W", star: true },
                { from: "1 MW（兆瓦）", to: "10⁶ W", star: false },
                { from: "1 马力（hp）", to: "≈ 735.5 W ≈ 0.736 kW", star: false },
            ]
        },
        {
            id: "voltage", icon: "🔌", title: "电压", color: "#38bdf8",
            items: [
                { from: "1 kV（千伏）", to: "1000 V = 10³ V", star: true },
                { from: "1 mV（毫伏）", to: "10⁻³ V = 0.001 V", star: false },
                { from: "1 μV（微伏）", to: "10⁻⁶ V", star: false },
                { from: "家庭电路电压", to: "220 V（中国标准）", star: true },
                { from: "安全电压上限", to: "≤ 36 V", star: true },
            ]
        },
        {
            id: "current", icon: "〜", title: "电流", color: "#818cf8",
            items: [
                { from: "1 A（安培）", to: "1000 mA", star: true },
                { from: "1 mA（毫安）", to: "1000 μA = 10⁻³ A", star: true },
                { from: "1 μA（微安）", to: "10⁻⁶ A", star: false },
            ]
        },
        {
            id: "resistance", icon: "🔧", title: "电阻", color: "#c084fc",
            items: [
                { from: "1 kΩ（千欧）", to: "1000 Ω = 10³ Ω", star: true },
                { from: "1 MΩ（兆欧）", to: "10⁶ Ω = 1000 kΩ", star: true },
            ]
        },
        {
            id: "temperature", icon: "🌡️", title: "温度", color: "#f472b6",
            items: [
                { from: "T（开尔文 K）", to: "= t℃ + 273.15", star: true },
                { from: "0℃", to: "= 273.15 K", star: true },
                { from: "100℃（水沸点）", to: "= 373.15 K", star: false },
                { from: "绝对零度", to: "0 K = −273.15℃", star: true },
                { from: "人体正常体温", to: "≈ 37℃ = 310.15 K", star: false },
            ]
        },
        {
            id: "volume", icon: "🧪", title: "体积", color: "#2dd4bf",
            items: [
                { from: "1 m³", to: "1000 L = 10³ dm³ = 10⁶ cm³", star: true },
                { from: "1 L（升）", to: "1 dm³ = 1000 cm³ = 1000 mL", star: true },
                { from: "1 cm³", to: "1 mL = 10⁻⁶ m³", star: true },
            ]
        },
        {
            id: "area", icon: "▭", title: "面积", color: "#94a3b8",
            items: [
                { from: "1 km²", to: "10⁶ m² = 100 公顷", star: false },
                { from: "1 m²", to: "10⁴ cm² = 10⁶ mm²", star: true },
                { from: "1 cm²", to: "100 mm² = 10⁻⁴ m²", star: true },
                { from: "1 公顷（ha）", to: "10⁴ m² = 0.01 km²", star: false },
            ]
        },
        {
            id: "density", icon: "🧱", title: "密度", color: "#fb7185",
            items: [
                { from: "1 g/cm³", to: "1000 kg/m³ = 10³ kg/m³", star: true },
                { from: "1 kg/m³", to: "0.001 g/cm³ = 10⁻³ g/cm³", star: false },
                { from: "水 ρ_水", to: "1.0×10³ kg/m³ = 1 g/cm³", star: true },
                { from: "水银 ρ_汞", to: "13.6×10³ kg/m³ = 13.6 g/cm³", star: true },
                { from: "冰 ρ_冰", to: "0.9×10³ kg/m³ = 0.9 g/cm³", star: false },
                { from: "空气（常温）", to: "≈ 1.29 kg/m³", star: false },
                { from: "铁", to: "7.9×10³ kg/m³ = 7.9 g/cm³", star: false },
                { from: "铝", to: "2.7×10³ kg/m³ = 2.7 g/cm³", star: false },
                { from: "铜", to: "8.9×10³ kg/m³ = 8.9 g/cm³", star: false },
            ]
        },
        {
            id: "heat", icon: "🔥", title: "热学常数", color: "#ff7849",
            items: [
                { from: "水的比热容 c_水", to: "4.2×10³ J/(kg·℃)", star: true },
                { from: "冰的比热容 c_冰", to: "2.1×10³ J/(kg·℃)", star: false },
                { from: "铁的比热容 c_铁", to: "0.46×10³ J/(kg·℃)", star: false },
                { from: "铝的比热容 c_铝", to: "0.88×10³ J/(kg·℃)", star: false },
                { from: "水的蒸发热", to: "≈ 2.26×10⁶ J/kg", star: false },
                { from: "冰的熔化热", to: "≈ 3.36×10⁵ J/kg", star: false },
                { from: "1 cal（卡路里）", to: "≈ 4.187 J", star: true },
                { from: "1 kcal（大卡）", to: "≈ 4187 J ≈ 4.2 kJ", star: true },
            ]
        },
        {
            id: "constants", icon: "📐", title: "重要物理常数", color: "#e879f9",
            items: [
                { from: "重力加速度 g", to: "≈ 9.8 N/kg（中考取 10 N/kg）", star: true },
                { from: "光速 c（真空）", to: "≈ 3×10⁸ m/s", star: true },
                { from: "声速（空气 15℃）", to: "≈ 340 m/s", star: true },
                { from: "标准大气压 p₀", to: "≈ 1.013×10⁵ Pa（中考取 1.0×10⁵ Pa）", star: true },
                { from: "水的密度 ρ_水", to: "1.0×10³ kg/m³", star: true },
                { from: "电子电荷量 e", to: "1.6×10⁻¹⁹ C", star: false },
                { from: "质子质量", to: "≈ 1.67×10⁻²⁷ kg", star: false },
                { from: "阿伏加德罗常数 Nₐ", to: "≈ 6.02×10²³ mol⁻¹", star: false },
            ]
        },
    ];

    function renderConversions() {
        const grid = document.getElementById("conversionsGrid");
        if (!grid) return;
        grid.innerHTML = UNIT_CONVERSIONS_DATA.map(cat => `
            <div class="conv-card" style="--cat-color: ${cat.color}">
                <div class="conv-card-header">
                    <span class="conv-card-icon">${cat.icon}</span>
                    <h3 class="conv-card-title">${cat.title}</h3>
                </div>
                <ul class="conv-list">
                    ${cat.items.map(item => `
                        <li class="conv-item${item.star ? ' conv-star' : ''}">
                            <span class="conv-from">${item.from}</span>
                            <span class="conv-arrow">→</span>
                            <span class="conv-to">${item.to}</span>
                            ${item.star ? '<span class="conv-star-dot" title="中考常考">⭐</span>' : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
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

    // ====================================================
    // 7.4 新增：数理动画推导实验室（Formula & Unit Animator）
    // ====================================================
    const FormulaAnimator = {
        currentType: null,      // "trans" 或 "unit"
        currentFormulaId: null,
        currentStepIndex: 0,
        isPlaying: false,
        playInterval: null,
        currentSteps: [],
        renderTimeout: null,    // 渲染防抖定时器，保障高频连击绝对连贯
        DOM: {},
        
        // 5个经典公式和单位换算的步骤配置
        animations: {
            // 1. 速度变形动画
            "speed_trans": [
                {
                    formula: "v = \\frac{s}{t}",
                    desc: "1. 起始状态：这是速度的定义计算公式，表示路程与时间之比。"
                },
                {
                    formula: "v \\times t = \\frac{s}{t} \\times t",
                    desc: "2. 移项准备：根据等式的基本性质，等式两边同时乘以时间 $t$，等式依然成立。"
                },
                {
                    formula: "v \\times t = s \\cdot \\frac{t}{t}",
                    desc: "3. 约分化简：等式右侧分子和分母均有 $t$，我们可以将其写为相乘约简结构。"
                },
                {
                    formula: "v \\times t = s \\quad \\text{(约去 } t \\text{)}",
                    desc: "4. 约分消去：等式右侧的 $t$ 与分母上的 $t$ 互相消去，右侧化简为只剩路程 $s$（斜红线约去）。"
                },
                {
                    formula: "s = vt",
                    desc: "5. 最终公式：左右互换，即得到计算路程的最终变形公式：$s = vt$。"
                }
            ],
            // 2. 速度单位换算动画
            "speed_unit": [
                {
                    formula: "1\\text{ m/s}",
                    desc: "1. 初始值：以 $1\\text{ m/s}$ 为例，我们要将其换算为以 $\\text{km/h}$ 为单位的值。"
                },
                {
                    formula: "= \\frac{1\\text{ m}}{1\\text{ s}}",
                    desc: "2. 拆解：将单位符号拆解为分子 $1\\text{ m}$ 和分母 $1\\text{ s}$，其物理意义为物体在 1 秒内通过了 1 米。"
                },
                {
                    formula: "= \\frac{\\frac{1}{1000}\\text{ km}}{\\frac{1}{3600}\\text{ h}}",
                    desc: "3. 单位变换：将分子的米换算为千米（$1\\text{ m} = \\frac{1}{1000}\\text{ km}$），分母的秒换算为小时（$1\\text{ s} = \\frac{1}{3600}\\text{ h}$）。"
                },
                {
                    formula: "= \\frac{1}{1000} \\times 3600\\text{ km/h}",
                    desc: "4. 繁分数约简：应用分数的除法运算法则，分母相除等同于乘以其倒数 $3600$。"
                },
                {
                    formula: "= 3.6\\text{ km/h}",
                    desc: "5. 最终换算：计算得出 $\\frac{3600}{1000} = 3.6$。因此，$1\\text{ m/s} = 3.6\\text{ km/h}$。换算进率为 $3.6$。"
                }
            ],
            // 3. 密度单位换算动画
            "density_unit": [
                {
                    formula: "1\\text{ g/cm}^3",
                    desc: "1. 初始值：以 $1\\text{ g/cm}^3$ 为例，我们要将其换算为国际标准单位 $\\text{kg/m}^3$。"
                },
                {
                    formula: "= \\frac{1\\text{ g}}{1\\text{ cm}^3}",
                    desc: "2. 拆解：将其写成繁分数分子分母形式，表示 1 立方厘米某种物质的质量为 1 克。"
                },
                {
                    formula: "= \\frac{10^{-3}\\text{ kg}}{10^{-6}\\text{ m}^3}",
                    desc: "3. 单位变换：将分子克换算为千克（$1\\text{ g} = 10^{-3}\\text{ kg}$），分母立方厘米换算为立方米（$1\\text{ cm}^3 = 10^{-6}\\text{ m}^3$）。"
                },
                {
                    formula: "= 10^{-3} \\times 10^6\\text{ kg/m}^3",
                    desc: "4. 幂运算化简：依据底数相同幂相除的运算法则，$10^{-3} / 10^{-6} = 10^{-3 - (-6)} = 10^3$。"
                },
                {
                    formula: "= 1000\\text{ kg/m}^3",
                    desc: "5. 最终值：计算出 $10^3 = 1000$。因此，$1\\text{ g/cm}^3 = 1000\\text{ kg/m}^3$，进率为 $1000$。"
                }
            ],
            // 4. 欧姆定律变形
            "ohms-law_trans": [
                {
                    formula: "I = \\frac{U}{R}",
                    desc: "1. 起始状态：这是部分电路欧姆定律基本公式，通过导体的电流与两端电压成正比，与电阻成反比。"
                },
                {
                    formula: "I \\times R = \\frac{U}{R} \\times R",
                    desc: "2. 变形要求电压：等式两边同时乘以电阻 $R$，等式平衡依然成立。"
                },
                {
                    formula: "I \\times R = U \\cdot \\frac{R}{R}",
                    desc: "3. 约分准备：等式右侧的 $R$ 与分母上的 $R$ 准备进行分子分母约简。"
                },
                {
                    formula: "I \\times R = U",
                    desc: "4. 电压公式：右侧 $R$ 约去。调换左右位置即得到求电压的变形公式：$U = IR$。"
                },
                {
                    formula: "\\frac{U}{I} = \\frac{I R}{I}",
                    desc: "5. 变形要求电阻：在 $U = IR$ 的两边同除以电流 $I$，以解出电阻 $R$。"
                },
                {
                    formula: "R = \\frac{U}{I}",
                    desc: "6. 电阻公式：右侧的电流 $I$ 约去，整理得出求电阻的最终变形公式：$R = \\frac{U}{I}$。"
                }
            ],
            // 5. 比热容变形
            "specific-heat_trans": [
                {
                    formula: "Q = c m \\Delta t",
                    desc: "1. 初始状态：这是物体温度升高或降低时吸收（或放出）的热量通用计算公式。"
                },
                {
                    formula: "\\frac{Q}{m \\Delta t} = \\frac{c m \\Delta t}{m \\Delta t}",
                    desc: "2. 求比热容变形：我们在等式左右两边同时除以 $(m\\Delta t)$。"
                },
                {
                    formula: "\\frac{Q}{m \\Delta t} = c \\cdot \\frac{m \\Delta t}{m \\Delta t}",
                    desc: "3. 约分消元：等式右侧的分子 $m\\Delta t$ 与分母 $m\\Delta t$ 准备划线约去。"
                },
                {
                    formula: "c = \\frac{Q}{m \\Delta t}",
                    desc: "4. 最终比热容公式：右侧全部约去，对调位置得到求解比热容的变形公式：$c = \\frac{Q}{m\\Delta t}$。"
                },
                {
                    formula: "\\Delta t = \\frac{Q}{c m}",
                    desc: "5. 求温变变形：同理，若要求温度升高量 $\\Delta t$，两边除以 $(cm)$，即可得 $\\Delta t = \\frac{Q}{cm}$。"
                }
            ],
            // 6. 数学勾股定理直角边变形
            "pythagorean_theorem_trans": [
                {
                    formula: "a^2 + b^2 = c^2",
                    desc: "1. 起始状态：在直角三角形中，已知两条直角边的平方和等于斜边的平方（勾股定理）。"
                },
                {
                    formula: "a^2 = c^2 - b^2",
                    desc: "2. 移项：若要求直角边 $a$，将 $b^2$ 移项到等式右边，正号（+）改变为负号（-）。"
                },
                {
                    formula: "\\sqrt{a^2} = \\sqrt{c^2 - b^2}",
                    desc: "3. 开方：等式两边同时开二次平方根，以消去左边的二次方。"
                },
                {
                    formula: "a = \\sqrt{c^2 - b^2}",
                    desc: "4. 最终直角边公式：左侧开方与平方互相抵消，最终得出计算直角边 $a$ 的变形公式。"
                }
            ],
            // 7. 凸透镜成像定性规律口诀演变
            "lens-imaging_trans": [
                {
                    formula: "\\text{成像口诀：一倍焦距分虚实，二倍焦距分大小}",
                    desc: "1. 黄金口诀：这是初中物理光学凸透镜成像最为核心的定性口诀。一倍焦距是成实像与虚像的分界点，二倍焦距是成放大像与缩小像的分界点。"
                },
                {
                    formula: "u > 2f \\implies f < v < 2f \\quad \\text{（倒立缩小实像）}",
                    desc: "2. 照相机状态：当物距大于二倍焦距时，在透镜另一侧一倍到二倍焦距之间成倒立、缩小的实像。像距离透镜比较近。应用于照相机。"
                },
                {
                    formula: "f < u < 2f \\implies v > 2f \\quad \\text{（倒立放大实像）}",
                    desc: "3. 投影仪状态：当物距在一倍到二倍焦距之间时，在透镜另一侧二倍焦距以外成倒立、放大的实像。像距离透镜非常远。应用于投影仪。"
                },
                {
                    formula: "u \\downarrow \\implies v \\uparrow \\quad \\text{（物近像远）}",
                    desc: "4. 动态规律 · 物近像远：当蜡烛逐渐靠近透镜时（物距减小，但保持在焦点外），折射光线的会聚点会向后延伸退后。为了在光屏上接收到清晰的实像，光屏必须向远离凸透镜的方向移动（像距变大）。"
                },
                {
                    formula: "\\text{像的尺寸 } \\uparrow \\quad \\text{（像变大）}",
                    desc: "5. 动态规律 · 像变大：随着光屏不断向后倒退（像距变大），光折射后的会聚光束发散角变大，导致在光屏上接收到的实像尺寸也随之拉伸变大。这就是中考核心口诀：“物近像远像变大”的科学原理。"
                }
            ],
            // 8. 一次函数口诀动画
            "linear_trans": [
                {
                    formula: "y = kx \\quad (k > 0)",
                    desc: "1. **k 定方向 (正比例)**：当斜率 $k > 0$ 时，直线从 left 下向 right 上倾斜，经过第一、三象限。此时 $y$ 随 $x$ 的增大而增大。"
                },
                {
                    formula: "y = kx \\quad (k < 0)",
                    desc: "2. **k 定方向 (反向倾斜)**：当斜率 $k < 0$ 时，直线从 left 上向 right 下倾斜，经过第二、四象限。此时 $y$ 随 $x$ 的增大而减小。"
                },
                {
                    formula: "y = kx + b \\quad (b > 0)",
                    desc: "3. **b 定截距 (向上平移)**：常数项 $b$ 是直线与 y 轴交点的纵坐标（即截距）。当 $b > 0$ 时，直线相当于 $y = kx$ 向上平移 $b$ 个单位，交 y 轴于正半轴。"
                },
                {
                    formula: "y = kx + b \\quad (b < 0)",
                    desc: "4. **b 定截距 (向下平移)**：当 $b < 0$ 时，直线相当于 $y = kx$ 向下平移 $|b|$ 个单位，交 y 轴于负半轴。中考必背：**上加下减**！"
                }
            ],
            // 9. 二次函数“左同右异”开口变化动画
            "quadratic_trans": [
                {
                    formula: "y = ax^2 \\quad (a > 0)",
                    desc: "1. **开口方向**：二次项系数 $a$ 决定开口。当 $a > 0$ 时，抛物线开口向上，函数有最小值。且 $|a|$ 越大，抛物线开口越窄。"
                },
                {
                    formula: "y = ax^2 \\quad (a < 0)",
                    desc: "2. **开口向下**：当 $a < 0$ 时，抛物线开口向下，函数有最大值。$|a|$ 越小，抛物线越开阔平缓。"
                },
                {
                    formula: "x = -\\frac{b}{2a} \\quad (ab > 0 \\implies \\text{对称轴在 y 轴左侧})",
                    desc: "3. **左同（ab同号）**：当 $a$ 与 $b$ 同号（即 $ab > 0$）时，对称轴 $x = -\\frac{b}{2a} < 0$，因此抛物线的对称轴位于 y 轴的**左侧**。"
                },
                {
                    formula: "x = -\\frac{b}{2a} \\quad (ab < 0 \\implies \\text{对称轴在 y 轴右侧})",
                    desc: "4. **右异（ab异号）**：当 $a$ 与 $b$ 异号（即 $ab < 0$）时，对称轴 $x = -\\frac{b}{2a} > 0$，因此抛物线的对称轴位于 y 轴的**右侧**。"
                },
                {
                    formula: "y = ax^2 + bx + c \\quad (c \\text{ 决定与 y 轴交点})",
                    desc: "5. **c 定截距**：常数项 $c$ 决定了抛物线与 y 轴的交点坐标为 $(0, c)$。顶点坐标公式为 $(-\\frac{b}{2a}, \\frac{4ac-b^2}{4a})$。"
                }
            ],
            // 10. 三角形全等判定动画
            "triangle_congruence_trans": [
                {
                    formula: "\\triangle ABC \\cong \\triangle A'B'C' \\quad \\text{(判定：SSS, SAS, ASA, AAS, HL)}",
                    desc: "1. **全等判定条件扫盲**：全等三角形是指能够完全重合的两个三角形。我们有 5 个经典的判定法则，分别是边边边(SSS)、边角边(SAS)、角边角(ASA)、角角边(AAS)以及直角三角形的斜边直角边定理(HL)。"
                },
                {
                    formula: "\\text{大雷区：SSA (边边角) } \\color{#ef4444}{\\mathbf{\\times}}",
                    desc: "2. **SSA (边边角) 为什么不能全等**：如果已知两个边和其中一个边的对角相等。由于角不是两边的夹角，这无法唯一确定三角形的形状。在实际几何作图中，你可以画出一个**锐角三角形**和一个**钝角三角形**同时满足这组 SSA 条件，两者显然不全等！中考极高频雷区，千万别用！"
                },
                {
                    formula: "\\text{大雷区：AAA (角角角) } \\color{#ef4444}{\\mathbf{\\times}}",
                    desc: "3. **AAA (角角角) 为什么不能全等**：三个角对应相等只能说明两个三角形形状一模一样，但它们的大小不一定相等（比如一个是手绘小三角形，一个是等比例放大后的宏观三角形）。AAA 只能判定**相似**，无法判定全等！"
                },
                {
                    formula: "\\text{性质：全等三角形对应边相等，对应角相等}",
                    desc: "4. **全等性质结论**：一旦两个三角形全等，它们的所有对应线段（对应边、对应高、对应中线、对应角平分线）全部相等，这是转化线段与角度逻辑推导的核心源泉。"
                }
            ],
            // 11. 三角形相似比与面积比动画
            "triangle_similarity_trans": [
                {
                    formula: "\\triangle ABC \\sim \\triangle A'B'C' \\implies \\text{相似比为 } k",
                    desc: "1. **相似三角形本质**：相似三角形的三个角对应相等，三条边对应成比例。相似比 $k$ 就是对应边长（线段）的比值。"
                },
                {
                    formula: "\\frac{\\text{周长 } C}{\\text{周长 } C'} = k \\quad \\text{(中线比、高比、角平分线比 } = k\\text{)}",
                    desc: "2. **一维线性尺度比**：因为周长是由各边长一维相加得到的，所以周长之比等于相似比 $k$。同理，对应高之比、对应中线比也全部恒等于相似比 $k$。"
                },
                {
                    formula: "\\frac{\\text{面积 } S}{\\text{面积 } S'} = k^2",
                    desc: "3. **二维面积尺度比**：面积是由长 $\\times$ 宽两个维度计算出的。根据相似三角形面积比定理，面积之比等于相似比的**平方** $k^2$！"
                },
                {
                    formula: "k = 2 \\implies \\text{面积比 } k^2 = 4 \\quad \\text{(2x2 晶格拉伸)}",
                    desc: "4. **几何形象理解**：设大三角形的边长是小三角形的 2 倍（相似比 $k = 2$）。直观上，我们可以用 4 个小三角形完美拼接成一个大的相似三角形。所以相似比为 2 时，面积变为原来的 $2^2 = 4$ 倍！"
                }
            ],
            // 12. 多边形内外角和口诀动画
            "polygon_angles_trans": [
                {
                    formula: "S_{内} = (n - 2) \\times 180^\\circ \\quad (n \\ge 3)",
                    desc: "1. **内角和公式推导**：任意凸 $n$ 边形可以通过连接不相邻的顶点，将其分割为 $(n - 2)$ 个不重叠的三角形。因为每个三角形内角和为 $180^\\circ$，所以多边形内角和公式为 $(n - 2) \\times 180^\\circ$。"
                },
                {
                    formula: "S_{外} = 360^\\circ \\quad \\text{(恒定不变，与边数 } n \\text{ 无关)}",
                    desc: "2. **外角和定理（中考必背）**：任意凸多边形的外角和恒等于 $360^\\circ$！无论边数 $n$ 是 3 条、100 条还是 1000 条，外角和绝不随边数增加而改变，永远是 $360^\\circ$。"
                },
                {
                    formula: "\\text{动画拆解：顶点平移缩减拼接法}",
                    desc: "3. **外角和为什么恒定 360°**：想象一个人沿着多边形的边界绕行一周，在每个顶点处他转过的角度就是该处的外角。当他绕完多边形回到原点时，他刚好转了完整的一整圈！"
                },
                {
                    formula: "\\lim_{n \\to \\infty} \\text{顶点平移} \\implies \\text{外角完美拼成圆周角 (360}^\\circ\\text{)}",
                    desc: "4. **几何拼接口诀**：如果我们把多边形的每条边都平移，让所有顶点收缩汇聚于一个中心点。此时所有的外角拼在一起，刚好无缝围成一个完美的圆周角 $360^\\circ$！名师口诀：“**多边形边数无限加，外角和恒为三百六！**”"
                }
            ]
        },
        
        // 初始化 DOM 监听
        init() {
            this.DOM = {
                modal: document.getElementById("animationModal"),
                closeBtn: document.getElementById("closeAnimModalBtn"),
                title: document.getElementById("animModalTitle"),
                formulaBox: document.getElementById("animFormulaBox"),
                desc: document.getElementById("animStepDesc"),
                progressBar: document.getElementById("animProgressBar"),
                stepIndicator: document.getElementById("animStepIndicator"),
                prevBtn: document.getElementById("animPrevBtn"),
                playBtn: document.getElementById("animPlayBtn"),
                nextBtn: document.getElementById("animNextBtn"),
                resetBtn: document.getElementById("animResetBtn")
            };
            
            if (!this.DOM.modal) return;
            
            // 绑定播放控制事件
            this.DOM.closeBtn.addEventListener("click", () => this.close());
            this.DOM.prevBtn.addEventListener("click", () => this.prev());
            this.DOM.nextBtn.addEventListener("click", () => this.next());
            this.DOM.playBtn.addEventListener("click", () => this.togglePlay());
            this.DOM.resetBtn.addEventListener("click", () => this.reset());
            
            // 点击阴影处关闭
            this.DOM.modal.addEventListener("click", (e) => {
                if (e.target === this.DOM.modal) this.close();
            });
        },
        
        // 启动动画
        start(type, formulaId) {
            const key = `${formulaId}_${type}`;
            this.currentSteps = this.animations[key];
            
            if (!this.currentSteps) {
                alert("该公式尚未录入此类型的动画步骤，敬请期待！");
                return;
            }
            
            this.currentType = type;
            this.currentFormulaId = formulaId;
            this.currentStepIndex = 0;
            
            // 更新标题
            const names = {
                "speed": "速度公式",
                "density": "密度公式",
                "ohms-law": "欧姆定律",
                "specific-heat": "比热容热量公式",
                "pythagorean_theorem": "直角三角形勾股定理",
                "lens-imaging": "凸透镜成像规律",
                "linear": "一次函数",
                "quadratic": "二次函数",
                "triangle_congruence": "三角形全等判定",
                "triangle_similarity": "相似三角形周长面积比",
                "polygon_angles": "多边形内外角和定理"
            };
            const typeNames = {
                "trans": "变形推导动画",
                "unit": "单位换算动画"
            };
            this.DOM.title.textContent = `${names[formulaId] || "数理核心公式"} · ${typeNames[type]}`;
            
            // 显示 Modal 并锁死背景滚动
            this.DOM.modal.classList.remove("hidden");
            document.body.style.overflow = "hidden";
            
            this.renderStep();
            this.resetPlaybackState();
        },
        
        // 渲染当前步骤
        renderStep() {
            const step = this.currentSteps[this.currentStepIndex];
            if (!step) return;
            
            const box = this.DOM.formulaBox;
            box.classList.add("anim-changing");
            
            // 【核心重构：防抖锁】如果存在上一次尚未执行的渲染延时，立即予以取消！
            // 这能彻底消除高频点击导致的渲染回调积压和乱序覆盖，保障播放极其流畅连贯。
            if (this.renderTimeout) {
                clearTimeout(this.renderTimeout);
            }
            
            this.renderTimeout = setTimeout(() => {
                // KaTeX 渲染
                // 动态构建约分线条的 HTML 包裹（这里我们可以把特定需要画线的字母外面包一层类）
                let renderedFormula = step.formula;
                
                // 对速度 \frac{t}{t} 这一项进行替换以挂载斜红线
                if (this.currentStepIndex === 2 && this.currentFormulaId === "speed") {
                    renderedFormula = "v \\times t = s \\cdot \\frac{\\cancel{t}}{\\cancel{t}}";
                }
                if (this.currentStepIndex === 2 && this.currentFormulaId === "ohms-law") {
                    renderedFormula = "I \\times R = U \\cdot \\frac{\\cancel{R}}{\\cancel{R}}";
                }
                if (this.currentStepIndex === 5 && this.currentFormulaId === "ohms-law") {
                    renderedFormula = "R = \\frac{U}{\\cancel{I}} \\cdot \\cancel{I}";
                }
                if (this.currentStepIndex === 2 && this.currentFormulaId === "specific-heat") {
                    renderedFormula = "\\frac{Q}{m \\Delta t} = c \\cdot \\frac{\\cancel{m} \\cancel{\\Delta t}}{\\cancel{m} \\cancel{\\Delta t}}";
                }
                
                // KaTeX 本身若不支持 \cancel 宏，我们可以用普通的替代：在 steps 数组中，我们用普通的 cancel-line 代替
                // KaTeX 其实支持 \cancel（通过引入 cHTML 结构），但为了防止报错，我们采用标准的带下划线/删除线的 KaTeX 代码，
                // 或者在这里由 CSS 对特定的元素执行斜划线。我们用 \cancel 渲染非常普遍而且 KaTeX 支持得很好
                katex.render(renderedFormula.replace(/\\cancel{([^}]+)}/g, "\\color{#ef4444}{\\rlap{\\slash}/}$1"), box, { throwOnError: false, displayMode: true });
                
                // 文字解说渲染与渐出
                this.DOM.desc.textContent = step.desc;
                this.DOM.desc.style.animation = "none";
                // 强制重绘触发动效
                this.DOM.desc.offsetHeight;
                this.DOM.desc.style.animation = "fadeInText 0.4s ease forwards";
                
                box.classList.remove("anim-changing");
                this.renderTimeout = null; // 清除引用
            }, 150);
            
            // 更新步骤数字与进度条
            const total = this.currentSteps.length;
            this.DOM.stepIndicator.textContent = `步骤 ${this.currentStepIndex + 1} / ${total}`;
            const pct = ((this.currentStepIndex + 1) / total) * 100;
            this.DOM.progressBar.style.width = `${pct}%`;
            
            // 控制前/后按钮失效态
            this.DOM.prevBtn.disabled = this.currentStepIndex === 0;
            this.DOM.nextBtn.disabled = this.currentStepIndex === total - 1;
        },
        
        // 播放/暂停
        togglePlay() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },
        
        play() {
            this.isPlaying = true;
            this.DOM.playBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                暂停播放
            `;
            
            this.playInterval = setInterval(() => {
                if (this.currentStepIndex < this.currentSteps.length - 1) {
                    this.currentStepIndex++;
                    this.renderStep();
                } else {
                    // 循环播放
                    this.currentStepIndex = 0;
                    this.renderStep();
                }
            }, 4000); // 4秒一步，体验极度舒适
        },
        
        pause() {
            this.isPlaying = false;
            clearInterval(this.playInterval);
            this.DOM.playBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="play-icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                自动播放
            `;
        },
        
        prev() {
            this.pause();
            if (this.currentStepIndex > 0) {
                this.currentStepIndex--;
                this.renderStep();
            }
        },
        
        next() {
            this.pause();
            if (this.currentStepIndex < this.currentSteps.length - 1) {
                this.currentStepIndex++;
                this.renderStep();
            }
        },
        
        reset() {
            this.pause();
            this.currentStepIndex = 0;
            this.renderStep();
        },
        
        resetPlaybackState() {
            this.pause();
        },
        
        close() {
            this.pause();
            this.DOM.modal.classList.add("hidden");
            document.body.style.overflow = "";
        }
    };

    // ----------------------------------------------------
    // 12. 智能上传交互系统 (PoC)
    // ----------------------------------------------------
    function initUploadSystem() {
        const dropzone = document.getElementById("uploadDropzone");
        if(!dropzone) return;

        const browseBtn = document.getElementById("browseFileBtn");
        const fileInput = document.getElementById("hiddenFileInput");
        
        const contentArea = dropzone.querySelector(".dropzone-content");
        const progressArea = document.getElementById("uploadProgressContainer");
        const progressBar = document.getElementById("uploadProgressBar");
        const progressPercent = document.getElementById("uploadProgressPercent");
        const statusText = document.getElementById("uploadStatusText");
        
        // 拖拽高亮
        dropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropzone.classList.add("dragover");
        });
        dropzone.addEventListener("dragleave", () => {
            dropzone.classList.remove("dragover");
        });
        dropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropzone.classList.remove("dragover");
            if (e.dataTransfer.files.length > 0) {
                simulateUpload(e.dataTransfer.files[0]);
            }
        });

        // 按钮点击
        browseBtn.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                simulateUpload(e.target.files[0]);
            }
        });

        // 连通性测试逻辑
        const testBtn = document.getElementById("testAiBtn");
        const testRes = document.getElementById("testAiResult");
        if (testBtn && testRes) {
            testBtn.addEventListener("click", async () => {
                testBtn.disabled = true;
                testBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 测试中...`;
                testRes.textContent = "";
                
                try {
                    const resp = await fetch("/api/test-ai");
                    const data = await resp.json();
                    
                    if (data.status === "success") {
                        testRes.innerHTML = `<span style="color: #10b981;">🟢 ${data.message} (回应: ${data.reply})</span>`;
                    } else if (data.status === "warning") {
                        testRes.innerHTML = `<span style="color: #f59e0b;">🟠 ${data.message}</span>`;
                    } else {
                        testRes.innerHTML = `<span style="color: #ef4444;">🔴 ${data.message}</span>`;
                    }
                } catch (e) {
                    testRes.innerHTML = `<span style="color: #ef4444;">🔴 内部网络连接失败</span>`;
                }
                
                testBtn.disabled = false;
                testBtn.innerHTML = `<i class="fas fa-bolt"></i> 测试云端 AI 连通性`;
            });
        }

        // 真实 R2 极速流式直传架构及 AI 切片联动
        async function simulateUpload(file) {
            contentArea.classList.add("hidden");
            progressArea.classList.remove("hidden");
            
            progressBar.style.width = "0%";
            progressPercent.textContent = "0%";
            statusText.textContent = `准备极速传输文件: ${file.name} ...`;
            statusText.style.color = "var(--text-primary)";

            // 1. 同步进行文件直传 R2（保持原有的 FormData 上传至 /api/upload，以留档备份）
            const formData = new FormData();
            formData.append("file", file);
            fetch("/api/upload", { method: "POST", body: formData }).catch(e => console.error("R2 原文件留档失败:", e));

            // 2. 利用浏览器算力，通过 Mammoth.js 无损提纯 Word 文本
            let rawText = "";
            progressBar.style.width = `20%`;
            progressPercent.textContent = `20%`;
            statusText.textContent = `正在启动前端引擎提取文档纯文本...`;

            try {
                if (file.name.toLowerCase().endsWith(".docx")) {
                    const arrayBuffer = await file.arrayBuffer();
                    // 这里依赖在 index.html 引入的 mammoth.js
                    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
                    rawText = result.value;
                } else if (file.name.toLowerCase().endsWith(".pdf")) {
                    // PDF 留作后续功能
                    rawText = "【模拟一段物理试题文本，由于未装载 pdf.js，使用降级策略...】\n1. 一辆智能汽车以 v=25m/s 的速度在公路上行驶...";
                    statusText.textContent = "注意：暂未内置 PDF 前端提取，正使用兼容模式发往大模型...";
                    await new Promise(r => setTimeout(r, 1000));
                } else {
                    throw new Error("当前系统为了保证无损提纯，仅支持 .docx 文件！");
                }
            } catch(e) {
                statusText.textContent = `文件提纯失败: ${e.message}`;
                statusText.style.color = "#ef4444";
                setTimeout(() => resetUploadUI(), 3000);
                return;
            }

            // 3. 将提纯后的文本发往 /api/parse
            progressBar.style.width = `50%`;
            progressPercent.textContent = `50%`;
            statusText.textContent = `文本提纯完毕！正在跨网络唤醒 R1 大模型进行语义切片...`;

            try {
                const parseResp = await fetch("/api/parse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: rawText })
                });
                
                if (!parseResp.ok) {
                    throw new Error(`AI 分析接口响应错误 (${parseResp.status})`);
                }
                
                const parseData = await parseResp.json();
                
                progressBar.style.width = `100%`;
                progressPercent.textContent = `100%`;
                statusText.textContent = "大模型推演完成！正在接管并重组试卷排版引擎...";
                
                // 4. 重组排版，插入习题卡片
                setTimeout(() => {
                    injectAIQuestions(parseData.data, parseData.message);
                }, 800);

            } catch(e) {
                statusText.textContent = `AI 唤醒失败: ${e.message}`;
                statusText.style.color = "#ef4444";
                setTimeout(() => resetUploadUI(), 3000);
            }
        }

        // 恢复上传 UI
        function resetUploadUI() {
            progressArea.classList.add("hidden");
            contentArea.classList.remove("hidden");
            statusText.style.color = "var(--text-primary)";
            fileInput.value = "";
            progressBar.style.width = "0%";
            progressPercent.textContent = "0%";
        }

        // 把大模型返回的 JSON 注入到现有页面的习题流中
        function injectAIQuestions(aiDataArray, serverMsg) {
            if (!aiDataArray || !Array.isArray(aiDataArray)) {
                alert("大模型返回的数据格式异常，无法重组！");
                resetUploadUI();
                return;
            }

            // 提示系统消息
            if (serverMsg) alert(serverMsg);

            // 强制跳转到习题视角
            switchView("practice");
            const list = document.getElementById("exercisesList");
            if (!list) return;

            let htmlStr = "";
            aiDataArray.forEach((q, i) => {
                const uniqueId = `ai_q_${Date.now()}_${i}`;
                // 根据排版引擎复用 question-card
                htmlStr += `
                <div class="question-card" id="q-${uniqueId}">
                    <div class="question-title-row">
                        <span class="score-badge">[AI 极速切片 ${i+1}]</span>
                        <span class="q-content">${q.question}</span>
                    </div>
                    ${(q.options && q.options.length > 0) ? `
                        <ul class="q-options-list" style="list-style:none; padding:0; margin:10px 0;">
                            ${q.options.map(opt => `<li style="margin-bottom:6px;">${opt}</li>`).join('')}
                        </ul>
                    ` : ''}
                    <div class="student-space ${state.printMode === 'student' ? 'active' : ''}">
                        <div class="calculation-space">
                            ${q.type === 'calculation' ? '大模型识别为计算大题：请在此书写公式及代入步骤' : '【作答区】'}
                        </div>
                    </div>
                    <div class="exam-solution-block ${state.printMode === 'teacher' ? 'active' : ''}">
                        <div class="ans-title">R1 深度解析推演</div>
                        <div class="ans-text">【标准答案】 ${q.answer || '大模型未提供明确答案'}</div>
                        <div class="ans-text">【解题推演】 ${q.solution || '无'}</div>
                    </div>
                    <div class="no-print" style="margin-top:10px; text-align:right;">
                        <label class="print-select-toggle" style="font-size:12px; cursor:pointer;">
                            <input type="checkbox" checked onchange="document.getElementById('q-${uniqueId}').style.display = this.checked ? 'block' : 'none'">
                            打印此题
                        </label>
                    </div>
                </div>`;
            });

            // 以一个醒目的 Banner 作为开头，插入到原来的题目列表最上方
            const aiBanner = `
                <div class="no-print" style="padding:15px; background:rgba(139, 92, 246, 0.1); border-left:4px solid #8b5cf6; border-radius:4px; margin-bottom:20px; font-weight:600; color:#8b5cf6; display:flex; align-items:center; gap:10px;">
                    <span style="font-size:20px;">🤖</span> 
                    以下是由大模型引擎从您刚刚上传的文档中精准提取并切分的全新习题，已无缝接入排版引擎：
                </div>
            `;
            
            list.innerHTML = aiBanner + htmlStr + list.innerHTML;
            
            // 重要：让 KaTeX 重新渲染新插入 DOM 中的公式！
            if (typeof renderMathInElement === 'function') {
                renderMathInElement(list);
            } else if (window.katex) {
                // 回退机制
                list.querySelectorAll(".q-content, .q-options-list, .ans-text").forEach(el => {
                    renderMathInElement(el); // 这个需要 data.js 里的封装
                });
            }
            
            // 最后恢复上传 UI 状态，以便下次还能传
            resetUploadUI();
        }
    }

    // 执行初始化
    init();
    setTimeout(initUploadSystem, 500);
});
