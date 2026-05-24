/**
 * Cloudflare Pages Function: 大模型 API 连通性测试接口
 * 路由： /api/test-ai
 */

export async function onRequestGet(context) {
    const { env } = context;
    const startTime = Date.now();
    
    try {
        if (!env.API_KEY) {
            return new Response(JSON.stringify({ 
                status: "warning", 
                message: "未配置 API_KEY (当前工作在 Mock 兜底模式)" 
            }), { 
                status: 200, 
                headers: { "Content-Type": "application/json" } 
            });
        }

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
                    { role: "user", content: "请只回复数字 1" }
                ],
                max_tokens: 5
            })
        });

        const elapsed = Date.now() - startTime;

        if (!aiResponse.ok) {
            const errBody = await aiResponse.text();
            return new Response(JSON.stringify({ 
                status: "error", 
                message: `接口报错 HTTP ${aiResponse.status}: ${errBody}` 
            }), { 
                status: 200, // 故意给 200，让前端统一用 JSON 处理
                headers: { "Content-Type": "application/json" } 
            });
        }

        const aiData = await aiResponse.json();
        
        return new Response(JSON.stringify({
            status: "success",
            message: `模型 (${modelName}) 连通成功！延迟: ${elapsed}ms`,
            reply: aiData.choices[0].message.content
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ 
            status: "error", 
            message: `请求发起失败: ${err.message}` 
        }), { 
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
}
