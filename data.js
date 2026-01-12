// فەنکشنی API بۆ ناردنی داتا بۆ سیستەمی B
// لەسەر Vercel Serverless Functions

// ئەم ئەدرێسە دەبێت بە سیستەمی B لە Vercel تێدا بنێری
const SYSTEM_B_API_URL = 'https://ai-gateway.vercel.sh/v1'
)

export default async function handler(req, res) {
    // زیادکردنی CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-System-A-Key');
    
    // چارەسەری CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
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
        data.systemAUrl = 'https://systam-a.vercel.app';
        
        console.log('ناردنی داتا بۆ سیستەمی B:', SYSTEM_B_API_URL);
        console.log('داتای ناردن:', { name: data.name, email: data.email });
        
        // ناردنی داتا بۆ سیستەمی B
        let systemBResponse;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            
            const response = await fetch(SYSTEM_B_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-System-A-Key': 'system-a-secret-key-12345'
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log('وەڵامی سیستەمی B:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('هەڵەی سیستەمی B:', errorText);
                throw new Error(`سیستەمی B وەڵامی ${response.status}ی داوە`);
            }
            
            systemBResponse = await response.json();
            console.log('وەڵامی سەرکەوتوو لە سیستەمی B:', systemBResponse);
            
        } catch (apiError) {
            // ئەگەر پەیوەندی بە سیستەمی Bەوە سەرکەوتونەبوو
            console.error('هەڵە لە پەیوەندی بە سیستەمی Bەوە:', apiError.message);
            
            // بەڵام هەر وەڵام بە سەرکەوتوویی دەدرێتەوە بۆ کلایەنت
            return res.status(200).json({
                success: true,
                message: 'زانیاریەکان وەرگیران، بەڵام نەتوانرا بگوازرێتەوە بۆ سیستەمی B',
                data: data,
                systemBError: apiError.message,
                systemBUrl: SYSTEM_B_API_URL,
                note: 'سیستەمی B لەکارە یان پەیوەندیکردنی هەیە',
                timestamp: new Date().toISOString()
            });
        }
        
        // وەڵامی سەرکەوتوو
        return res.status(200).json({
            success: true,
            message: 'زانیاریەکان بە سەرکەوتووی نێردران بۆ سیستەمی B',
            data: data,
            systemBResponse: systemBResponse,
            systemBUrl: SYSTEM_B_API_URL,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('هەڵەی گشتی:', error);
        return res.status(500).json({ 
            error: 'هەڵەی ناوەخۆیی سرڤەر', 
            details: error.message,
            systemBUrl: SYSTEM_B_API_URL
        });
    }
}