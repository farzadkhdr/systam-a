// فایلی JavaScript بۆ سیستەمی A

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('dataForm');
    const statusMessage = document.getElementById('statusMessage');
    const responseContainer = document.getElementById('responseContainer');
    const responseData = document.getElementById('responseData');
    const apiUrlElement = document.getElementById('apiUrl');
    
    // نمایشکردنی ئەدرێسی API لەسەر پەڕەکە
    const currentUrl = window.location.origin;
    apiUrlElement.textContent = `${currentUrl}/api/send-data`;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // کۆکردنەوەی زانیاریەکان لە فۆرمەکە
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString(),
            system: 'System A'
        };
        
        // پێش ناردن، نمایشکردنی بار
        showStatus('ناردنی زانیاریەکان...', 'loading');
        
        try {
            // ناردنی POST request بۆ API
            const response = await fetch('/api/send-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // سەرکەوتووبوون
                showStatus('زانیاریەکان بە سەرکەوتووی نێردران بۆ سیستەمی B!', 'success');
                showResponse(result);
                
                // پاککردنەوەی فۆرمەکە
                form.reset();
            } else {
                // هەڵە
                showStatus(`هەڵە: ${result.error || 'کێشەیەک هەیە'}` , 'error');
                showResponse(result);
            }
        } catch (error) {
            // هەڵەی پەیوەندیکردن
            showStatus(`هەڵەی پەیوەندیکردن: ${error.message}`, 'error');
            console.error('هەڵە:', error);
        }
    });
    
    // فەنکشنی نمایشکردنی بارودۆخ
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status';
        
        if (type === 'success') {
            statusMessage.classList.add('success');
        } else if (type === 'error') {
            statusMessage.classList.add('error');
        }
        
        statusMessage.style.display = 'block';
    }
    
    // فەنکشنی نمایشکردنی وەڵام
    function showResponse(data) {
        responseData.textContent = JSON.stringify(data, null, 2);
        responseContainer.style.display = 'block';
    }
});