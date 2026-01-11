// فەنکشنی API بۆ ناردنی داتا بۆ سیستەمی B
// لەسەر Vercel Serverless Functions

// ئەم ئەدرێسە دەبێت بە سیستەمی B لە Vercel تێدا بنێری
// پاش هۆستکردنی سیستەمی B، ئەم ئەدرێسەیە لێرە دابنێ
const SYSTEM_B_API_URL = 'https://systam-b-r5hy.vercel.app';

export default async function handler(req, res) {
    // تەنها POST ڕێگادەپێدرێت
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'تەنها POST ڕێگادەپێدرێت' });
    }
    
    try {
        const data = req.body;
        
        // چەککردنی داتا
        if (!data.name || !data.email || !data.message) {
            return res.status(400).json({ 
                error: 'ناو، ئیمەیڵ و پەیام پێویستە' 
            });
        }
        
        // زیادکردنی نیشانەی کاتی ناردن
        data.sentAt = new Date().toISOString();
        data.receivedBySystemA = true;
        
        // ناردنی داتا بۆ سیستەمی B
        let systemBResponse;
        try {
            const response = await fetch(SYSTEM_B_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-System-A-Key': 'system-a-secret-key-12345' // کلیلی ئاسایش (دەتوانی بگۆڕی)
                },
                body: JSON.stringify(data)
            });
            
            systemBResponse = await response.json();
            
            if (!response.ok) {
                throw new Error(systemBResponse.error || `سیستەمی B وەڵامی ${response.status}ی داوە`);
            }
            
        } catch (apiError) {
            // ئەگەر پەیوەندی بە سیستەمی Bەوە سەرکەوتونەبوو
            console.error('هەڵە لە پەیوەندی بە سیستەمی Bەوە:', apiError.message);
            
            // بەڵام هەر وەڵام بە سەرکەوتوویی دەدرێتەوە بۆ کلایەنت
            // چونکە داتاکە لە سیستەمی Aەوە وەرگیراوە
            return res.status(200).json({
                success: true,
                message: 'زانیاریەکان وەرگیران، بەڵام نەتوانرا بگوازرێتەوە بۆ سیستەمی B',
                data: data,
                systemBError: apiError.message,
                note: 'سیستەمی B لەکارە یان پەیوەندیکردنی هەیە'
            });
        }
        
        // وەڵامی سەرکەوتوو
        return res.status(200).json({
            success: true,
            message: 'زانیاریەکان بە سەرکەوتووی نێردران بۆ سیستەمی B',
            data: data,
            systemBResponse: systemBResponse,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('هەڵەی گشتی:', error);
        return res.status(500).json({ 
            error: 'هەڵەی ناوەخۆیی سرڤەر', 
            details: error.message 
        });
    }
}