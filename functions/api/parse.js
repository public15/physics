/**
 * Cloudflare Pages Function: 接收前端剥离出的纯文本，调用大模型进行题干与公式的结构化提纯
 * 路由： /api/parse
 */

export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const body = await request.json();
        const rawText = body.text;
        const images = body.images; // 包含 base64 字符串的数组

        if (!rawText && (!images || images.length === 0)) {
            return new Response(JSON.stringify({ error: "请求内容为空，既没有文本也没有图片！" }), { status: 400 });
        }

        // 大模型系统提示词
        const systemPrompt = `
你是一个极度严谨的、无情的 OCR 数据结构化转换 API，绝对不是一个聊天机器人或家庭教师。
用户的意图仅仅是让你**把零散的文本格式化为 JSON**，而不是让你去解答题目！
你绝对不要去算答案！绝对不要问用户需要什么帮助！
你的唯一任务是：提取出里面所有的物理/数学试题，并将公式全部规范化为标准的 LaTeX 语法。
然后，将提取的题目严格组装成一个 JSON 数组格式并输出。

**极其关键的纪律：**
1. **绝对禁止**使用任何 Python 代码解释器 (Code Interpreter) 或调用外部 OCR 工具 (如 pytesseract)！你必须使用你的原生多模态视觉能力 (Vision API) 直接观察图片。
2. 绝对不要寒暄！绝对不要说“这是一份试卷”、“你要我解答吗”等任何废话！
3. 为了保证数据完美解析，你**必须**输出一个 JSON 对象 (JSON Object)，并且这个对象**必须包含一个名为 \`questions\` 的键**，它的值是一个包含了所有题目的 JSON 数组。
4. 在 JSON 字符串中，所有 LaTeX 的反斜杠必须使用双斜杠进行转义（例如 "\\\\frac{1}{2}"）。
5. **极其关键（自动目标检测抠图）：** 如果某道题目配有独立的示意图、几何图或电路图，为了能在前端精准地将该图“抠”出来显示，请你估算该【几何配图本身】在整页原图上的四个边缘的百分比坐标。在返回的该题 JSON 中，必须包含 \`image_x_start\`, \`image_x_end\`, \`image_y_start\`, \`image_y_end\` 四个字段，取值为 0 到 100 的整数（例如左边界是10%，右边界是40%，上边界20%，下边界30%，则为：\`"image_x_start": 10, "image_x_end": 40, "image_y_start": 20, "image_y_end": 30\`）。**警告：只准框选配图本身的边缘！绝对不要把你已经提取为文本的题干文字或选项框选进去！** 如果该题没有配图，这四个字段可以省略。

请严格遵循以下 JSON 对象格式输出：

{
  "questions": [
    {
      "id": "q1",
      "type": "choice", // choice (选择题) 或 fill (填空题) 或 calculation (计算题)
      "question": "题干的纯净文本...",
      "options": ["A. 选项1", "B. 选项2"], // 如果不是选择题则不填
      "answer": "如果是已知答案则填入，否则留空",
      "solution": "解析内容"
    }
  ]
}
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

        // 根据前端传来的负载类型，构造多模态或纯文本的 user message
        let userMessageContent;
        if (images && images.length > 0) {
            userMessageContent = [
                { 
                    type: "text", 
                    text: "请将附带的这些高清试卷截图中的物理/数学题目全部严格提取为 JSON 数组。注意图片中包含的特殊标志、几何图形和电路图，请用纯文本的形式将它们描述在题干或选项里。记住你的角色是无情的数据格式化器，不要解答试题！不要问候！只要 JSON！" 
                }
            ];
            images.forEach(imgBase64 => {
                userMessageContent.push({
                    type: "image_url",
                    image_url: { url: imgBase64 } // 接收完整的 data:image/jpeg;base64,...
                });
            });
        } else {
            userMessageContent = `请将以下位于 <<< 和 >>> 之间的试卷文本严格提取为 JSON 数组。记住你的角色是无情的数据格式化器，不要解答试题！不要问候！只要 JSON！\n\n<<<\n${rawText}\n>>>`;
        }

        const aiResponse = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.API_KEY}`
            },
            body: JSON.stringify({
                model: modelName, 
                response_format: { type: "json_object" }, // 强制大模型底层输出合法 JSON 对象
                stream: true, // 开启流式响应，强迫中转站在几秒内立刻返回 Headers，彻底打破 Cloudflare 100s 524 TTFB 超时魔咒
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessageContent }
                ],
                temperature: 0.01 // 极其逼近 0 的温度，消除任何创造性聊天的冲动
            })
        });

        if (!aiResponse.ok) {
            const errBody = await aiResponse.text();
            throw new Error(`大模型服务接口响应异常: ${aiResponse.status} - ${errBody}`);
        }

        // 读取并拼接流式 SSE 数据
        let fullContent = "";
        try {
            const reader = aiResponse.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    // 处理流结束时可能残留在 buffer 中的最后一行数据
                    if (buffer) {
                        const lines = buffer.split('\n');
                        for (let line of lines) {
                            line = line.trim();
                            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                try {
                                    const dataObj = JSON.parse(line.substring(6));
                                    if (dataObj.choices && dataObj.choices.length > 0 && dataObj.choices[0].delta && dataObj.choices[0].delta.content) {
                                        fullContent += dataObj.choices[0].delta.content;
                                    }
                                } catch(e) {}
                            }
                        }
                    }
                    break;
                }
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                
                // 最核心的修补：将最后一行（往往是不完整的残余片段）弹出，留到下一次 chunk 到来时拼接
                buffer = lines.pop();
                
                for (let line of lines) {
                    line = line.trim();
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const dataObj = JSON.parse(line.substring(6));
                            if (dataObj.choices && dataObj.choices.length > 0 && dataObj.choices[0].delta && dataObj.choices[0].delta.content) {
                                fullContent += dataObj.choices[0].delta.content;
                            }
                        } catch(e) {
                            // 忽略单个 chunk 的解析异常，容错处理
                        }
                    }
                }
            }
        } catch(e) {
            throw new Error(`流式接收过程中发生异常: ${e.message}`);
        }

        let cleanContent = fullContent;
        
        // 终极防御：针对智能体(Agent)套壳中转站——大模型甚至会自己写代码跑 OCR 并在输出里包含多个 ```python 和 ```shell 代码块！
        // 绝对不能用 split("```") 否则会截错代码块。
        // 我们利用最核心的特征锚点 `{"questions":` 来作为 JSON 起始点寻找
        let startIdx = -1;
        const match = cleanContent.match(/\{\s*"questions"\s*:/);
        if (match) {
            startIdx = match.index;
        } else {
            // 兜底策略：找最后一个出现的 ```json 中的 {，或者直接找第一个 {
            const lastJsonCodeBlock = cleanContent.lastIndexOf('```json');
            if (lastJsonCodeBlock !== -1) {
                startIdx = cleanContent.indexOf('{', lastJsonCodeBlock);
            } else {
                startIdx = cleanContent.indexOf('{');
            }
        }
        
        const endIdx = cleanContent.lastIndexOf('}');

        if (startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx) {
            cleanContent = cleanContent.substring(startIdx, endIdx + 1);
        } else {
             throw new Error(`大模型被彻底干扰或未返回JSON结构！原始输出: ${fullContent}`);
        }
        
        let parsedData;
        try {
            parsedData = JSON.parse(cleanContent);
        } catch(e) {
            throw new Error(`无法解析模型返回的 JSON (${e.message})。返回的原始内容片段: ${fullContent.substring(0, 100)}...`);
        }

        // 获取 questions 数组，如果模型没按照规范叫 questions，我们尝试获取任意第一个数组类型的值
        let questionsArray = parsedData.questions;
        if (!questionsArray || !Array.isArray(questionsArray)) {
            // 兜底找任意的 Array
            for (let key in parsedData) {
                if (Array.isArray(parsedData[key])) {
                    questionsArray = parsedData[key];
                    break;
                }
            }
        }
        
        if (!questionsArray) {
             throw new Error("大模型返回的数据中未找到任何题目数组结构。");
        }

        return new Response(JSON.stringify({
            success: true,
            data: questionsArray
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
