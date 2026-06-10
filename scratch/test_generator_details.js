const fs = require('fs');
const path = require('path');

global.katex = {
    renderToString(str) { return str; }
};

const code = fs.readFileSync(path.join(__dirname, 'temp_question_engine.js'), 'utf8') + '\nglobal.PHYSICS_ENGINE = PHYSICS_ENGINE;';
eval(code);

const categories = [
    "mechanics",
    "electricity",
    "thermodynamics",
    "acoustics-optics",
    "num-exp",
    "eq-func",
    "geom",
    "stat-prob"
];

console.log("各小类生成 100 道题的深度分析：");
for (const cat of categories) {
    const matchedTemplates = PHYSICS_ENGINE.templates.filter(t => t.category === cat);
    console.log(`\n======================= [${cat}] (模板数: ${matchedTemplates.length}) =======================`);
    
    // 我们修改一下 PHYSICS_ENGINE.generateQuestions，用来收集统计信息
    let results = [];
    let generatedSignatures = new Set();
    let iterations = 0;
    const count = 100;
    const maxIterations = count * 15;
    
    // 统计各模板生成的数量
    let templateCounts = {};
    matchedTemplates.forEach(t => templateCounts[t.id] = 0);

    while (results.length < count && iterations < maxIterations) {
        iterations++;
        const template = PHYSICS_ENGINE.randomPick(matchedTemplates);
        const q = template.generator();
        const signature = `${template.id}_${q.answer}`;
        
        if (!generatedSignatures.has(signature)) {
            generatedSignatures.add(signature);
            results.push({ id: template.id });
            templateCounts[template.id]++;
        }
    }
    
    console.log(`- 请求生成数量: ${count}`);
    console.log(`- 实际生成数量: ${results.length}`);
    console.log(`- 总碰撞循环次数: ${iterations} (最大允许: ${maxIterations})`);
    console.log(`- 各模板生成题目数量分布:`);
    for (const [tid, num] of Object.entries(templateCounts)) {
        console.log(`  * ${tid}: ${num} 道`);
    }
}
