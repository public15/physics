/**
 * Cloudflare Pages Function: 接收前端试卷上传并无缝写入 R2 存储桶
 * 路由： /api/upload
 */

export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        // 确保 SHIJUAN_BUCKET 已经被正确绑定在 Cloudflare Pages 后台中
        if (!env.SHIJUAN_BUCKET) {
            return new Response(JSON.stringify({ 
                error: "服务器端配置错误: 尚未绑定 SHIJUAN_BUCKET" 
            }), { 
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 解析传入的 FormData
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ 
                error: "未检测到有效的文件或文件类型不合法" 
            }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 构造云端唯一文件名 (时间戳 + 原文件名)
        const timestamp = Date.now();
        // 简单处理中文文件名或特殊字符，确保云端路径合法
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const objectKey = `papers/${timestamp}_${safeName}`;

        // 将流直接透传给 R2 存储桶，避免将大文件载入 Worker 内存，实现极限性能
        await env.SHIJUAN_BUCKET.put(objectKey, file.stream(), {
            httpMetadata: {
                contentType: file.type || "application/octet-stream",
            }
        });

        return new Response(JSON.stringify({
            success: true,
            message: "试卷已成功上传至大模型解析中枢",
            fileName: file.name,
            objectKey: objectKey
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (err) {
        return new Response(JSON.stringify({ 
            error: "上传处理过程中发生异常: " + err.message 
        }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
