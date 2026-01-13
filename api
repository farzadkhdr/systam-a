// فەنکشنی API بۆ ناردنی داتا بۆ سیستەمی B

// ئەدرێسی ڕاستی سیستەمی B
const SYSTEM_B_API_URL = 'https://systam-b.vercel.app/api/receive-data';

export default async function handler(req, res) {
    // زیادکردنی CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // چارەسەری CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // تەنها POST ڕێگادەپێدرێت
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            error: 'تەنها POST ڕێگادەپێدرێت' 
        });
    }
    
    try {
        const data = req.body;
        
        // چەککردنی داتا
        if (!data.name || !data.email || !data.message) {
            return res.status(400).json({ 
                success: false,
                error: 'ناو، ئیمەیڵ و پەیام پێویستە' 
            });
        }
        
        // زیادکردنی نیشانەی کاتی ناردن
        data.sentAt = new Date().toISOString();
        data.receivedBySystemA = true;
        data.id = Date.now();
        
        console.log('ناردنی داتا بۆ سیستەمی B:', SYSTEM_B_API_URL);
        
        // ناردنی داتا بۆ سیستەمی B
        let systemBResponse;
        try {
            const response = await fetch(SYSTEM_B_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-System-A-Key': 'system-a-secret-key-12345'
                },
                body: JSON.stringify(data)
            });
            
            // وەرگرتنی وەڵام بە JSON
            const responseText = await response.text();
            console.log('وەڵامی سیستەمی B:', responseText);
            
            try {
                systemBResponse = JSON.parse(responseText);
            } catch (parseError) {
                console.error('هەڵە لە Parse کردنی JSON:', parseError);
                throw new Error(`سیستەمی B وەڵامی JSON ڕاستی نەداوە: ${responseText}`);
            }
            
            if (!response.ok) {
                throw new Error(systemBResponse.error || `سیستەمی B وەڵامی ${response.status}ی داوە`);
            }
            
        } catch (apiError) {
            console.error('هەڵە لە پەیوەندی بە سیستەمی Bەوە:', apiError.message);
            
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
            success: false,
            error: 'هەڵەی ناوەخۆیی سرڤەر', 
            details: error.message 
        });
    }
}
