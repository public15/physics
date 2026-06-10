const fs = require('fs');
const path = require('path');

// 模拟浏览器环境或所需全局函数
global.katex = {
    renderToString(str) { return str; }
};

// 读取并运行 question_engine.js
const code = fs.readFileSync(path.join(__dirname, '../js/question_engine.js'), 'utf8') + '\nglobal.PHYSICS_ENGINE = PHYSICS_ENGINE;';
eval(code);

// 测试物理和数学的所有小类
const categories = [
    // 物理
    "mechanics",
    "electricity",
    "thermodynamics",
    "acoustics-optics",
    // 数学
    "num-exp",
    "eq-func",
    "geom",
    "stat-prob"
];

console.log("各小类当前能生成的题目数量：");
for (const cat of categories) {
    const questions = PHYSICS_ENGINE.generateQuestions(cat, 100);
    console.log(`- ${cat}: 生成了 ${questions.length} 道题`);
}
