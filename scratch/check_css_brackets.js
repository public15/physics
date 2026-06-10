const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../css/styles.css');
const cssLines = fs.readFileSync(cssPath, 'utf8').split('\n');

// 打印样式范围：从 1206 行开始（在数组中是 1205 索引）到 1793 行（索引 1792）
const startLine = 1206;
const endLine = 1793;

let depth = 1; // @media print 开启为 1
console.log(`在第 ${startLine} 行: @media print { (开始 depth = 1)`);

for (let i = startLine; i < endLine; i++) {
    const lineNum = i + 1;
    const line = cssLines[i];
    
    // 统计这一行的 { 和 }
    for (let char of line) {
        if (char === '{') {
            depth++;
        } else if (char === '}') {
            depth--;
            if (depth < 0) {
                console.log(`警告：在第 ${lineNum} 行括号深层降到 0 以下！内容是: ${line.trim()}`);
            }
        }
    }
    
    // 如果在该行结束时 depth = 1，说明一个子规则关闭了
    // 如果在该行结束时 depth = 0，说明最外层的 @media print 被提前关闭了！
    if (depth === 0) {
        console.log(`!!! 发现最外层大括号在第 ${lineNum} 行被提前关闭了！ 这一行内容为: ${line.trim()}`);
        break;
    }
}

console.log(`遍历结束，最终深度为: ${depth}`);
