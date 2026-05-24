/**
 * Cloudflare Pages Function: 接收前端剥离出的纯文本，调用大模型进行题干与公式的结构化提纯
 * 路由： /api/parse
 */

export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const body = await request.json();
        const rawText = body.text;

        if (!rawText || rawText.trim() === '') {
            return new Response(JSON.stringify({ error: "文本内容为空" }), { status: 400 });
        }

        // 大模型系统提示词
        const systemPrompt = `
你是一个极度严谨的、无情的 OCR 数据结构化转换 API，绝对不是一个聊天机器人或家庭教师。
用户的意图仅仅是让你**把零散的文本格式化为 JSON**，而不是让你去解答题目！
你绝对不要去算答案！绝对不要问用户需要什么帮助！
你的唯一任务是：提取出里面所有的物理/数学试题，并将公式全部规范化为标准的 LaTeX 语法。
然后，将提取的题目严格组装成一个 JSON 数组格式并输出。

**极其关键的纪律：**
1. 绝对不要寒暄！绝对不要说“这是一份试卷”、“你要我解答吗”等任何废话！
2. 你的整个输出必须是一个以 \`[\` 开头，以 \`]\` 结尾的 JSON 数组！
3. 在 JSON 字符串中，所有 LaTeX 的反斜杠必须使用双斜杠进行转义（例如 "\\\\frac{1}{2}"）。

请遵循以下数据结构输出：

[
  {
    "id": "q1",
    "type": "choice", // choice (选择题) 或 fill (填空题) 或 calculation (计算题)
    "question": "题干的纯净文本...",
    "options": ["A. 选项1", "B. 选项2"], // 如果不是选择题则不填
    "answer": "如果是已知答案则填入，否则留空",
    "solution": "解析内容"
  }
]
`;

        // 如果没有配置真实 API KEY，为了不影响前台开发体验，直接返回一条极其逼真的 Mock 数据
        if (!env.API_KEY) {
            console.warn("未检测到 API_KEY，使用 Mock 大模型数据进行后置排版链路测试");
            const mockJSON = [
                {
                    "id": "ai_mock_1",
                    "type": "choice",
                    "question": "一辆智能汽车以 $v = 25m/s$ 的速度在平直公路上匀速行驶，司机突然发现前方 $d=50m$ 处有障碍物并紧急刹车，刹车时的加速度大小为 $a=5m/s^2$。若司机的反应时间为 $t=0.5s$，则下列说法正确的是：",
                    "options": [
                        "A. 汽车在反应时间内行驶的距离为 $12.5m$",
                        "B. 汽车刹车过程的位移为 $50m$",
                        "C. 汽车最终会撞上障碍物",
                        "D. 汽车距离障碍物最近时还有 $5m$"
                    ],
                    "answer": "A",
                    "solution": "反应时间内的位移 $x_1 = v \\times t = 25 \\times 0.5 = 12.5m$。制动位移 $x_2 = \\frac{v^2}{2a} = \\frac{625}{10} = 62.5m$。总位移 $x = 12.5 + 62.5 = 75m > 50m$，必定撞上。故选 A。但等等... 这个排版是不是很帅？"
                },
                {
                    "id": "ai_mock_2",
                    "type": "calculation",
                    "question": "如图所示的电路中，电源电压保持不变，电阻 $R_1=10\\Omega$。当开关 $S$ 闭合时，电流表的示数为 $0.6A$；若将开关 $S$ 断开，电流表的示数变为 $0.2A$。求：\n(1) 电源电压 $U$ 的大小；\n(2) 电阻 $R_2$ 的阻值。",
                    "answer": "",
                    "solution": "由开关断开、闭合可知串并联结构，欧姆定律即得。"
                }
            ];

            // 模拟大模型推理的延迟时间
            await new Promise(resolve => setTimeout(resolve, 2000));

            return new Response(JSON.stringify({
                success: true,
                message: "【系统提示】这是通过 Mock 数据返回的结果（因云端未配置 API_KEY）",
                data: mockJSON
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 真实的大模型请求，支持官方与第三方中转站自适应
        const baseUrl = env.AI_BASE_URL || "https://api.deepseek.com/chat/completions";
        const modelName = env.AI_MODEL_NAME || "deepseek-chat";

        const aiResponse = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.API_KEY}`
            },
            body: JSON.stringify({
                model: modelName, 
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `请将以下位于 <<< 和 >>> 之间的试卷文本严格提取为 JSON 数组。记住你的角色是无情的数据格式化器，不要解答试题！不要问候！只要 JSON！\n\n<<<\n${rawText}\n>>>` }
                ],
                temperature: 0.01 // 极其逼近 0 的温度，消除任何创造性聊天的冲动
            })
        });

        if (!aiResponse.ok) {
            const errBody = await aiResponse.text();
            throw new Error(`大模型服务接口响应异常: ${aiResponse.status} - ${errBody}`);
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices[0].message.content;
        
        // 尝试从 markdown 代码块中提取 JSON
        let jsonStr = content;
        if (content.includes("```json")) {
            jsonStr = content.split("```json")[1].split("```")[0].trim();
        } else if (content.includes("```")) {
            jsonStr = content.split("```")[1].split("```")[0].trim();
        } else {
            // 暴力截取：寻找第一个 [ 和最后一个 ]
            const firstBracket = content.indexOf('[');
            const lastBracket = content.lastIndexOf(']');
            if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
                jsonStr = content.substring(firstBracket, lastBracket + 1);
            } else {
                throw new Error("大模型拒绝输出 JSON，甚至连数组括号都没有，可能把任务当成了普通的闲聊。");
            }
        }
        
        let parsedData;
        try {
            // 如果模型确实忘了转义，做一次兜底的暴力替换（把单斜杠换成双斜杠，但不影响已经转义的换行等）
            // 这是处理大模型 LaTex 最经典的黑科技补丁
            let sanitizedStr = jsonStr.replace(/\\(?!["\\/bfnrt])/g, "\\\\");
            parsedData = JSON.parse(sanitizedStr);
        } catch(e) {
            throw new Error(`无法解析模型返回的 JSON (${e.message})。返回的原始内容片段: ${jsonStr.substring(0, 100)}...`);
        }

        return new Response(JSON.stringify({
            success: true,
            message: "大模型深度推演并切片完成！",
            data: parsedData
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ 
            error: "解析过程发生异常: " + err.message 
        }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
