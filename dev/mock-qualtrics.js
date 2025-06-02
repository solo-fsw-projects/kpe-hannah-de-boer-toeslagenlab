const blocks = [
    {
        // Using a local CSV file instead of Google Sheets URL
        google_sheet_csv_url: 'test-data.csv',
        enable_previous_button: '0',
        start_saldo: '5000',
        month: 'Januari',
        toeslag_naam: 'Zorgtoeslag',
        toeslag_percentage: '100',
        question: 'Dit is de eerste vraag voor Januari. Wat is uw inkomen deze maand?'
    },
    {
        enable_previous_button: '1',
        start_saldo: '5000',
        month: 'Februari',
        toeslag_naam: 'Zorgtoeslag',
        toeslag_percentage: '100',
        question: 'Dit is de vraag voor Februari. Wat zijn uw vaste lasten deze maand?'
    },
    {
        enable_previous_button: '1',
        start_saldo: '5000',
        month: 'Maart',
        toeslag_naam: 'Zorgtoeslag',
        toeslag_percentage: '100',
        question: 'Dit is de vraag voor Maart. Wat zijn uw variabele uitgaven deze maand?'
    }
];

// Function to get the current block's variable values
function getCurrentBlockVariables() {
    // Get the current block's data
    const block = blocks[currentBlockIndex];
    
    // Map block properties to Qualtrics variables
    return {
        '${e://Field/header}': 'simulation-start',
        '${e://Field/google_sheet_csv_url}': block.google_sheet_csv_url || 'test-data.csv',
        '${e://Field/enable_previous_button}': block.enable_previous_button || '0',
        '${e://Field/start_saldo}': block.start_saldo || '0',
        '${e://Field/month}': block.month || '',
        '${e://Field/toeslag_naam}': block.toeslag_naam || '',
        '${e://Field/toeslag_percentage}': block.toeslag_percentage || '0'
    };
}

// Mock Qualtrics SurveyEngine object
window.Qualtrics = window.Qualtrics || {};
window.Qualtrics.SurveyEngine = window.Qualtrics.SurveyEngine || {};

// Store callbacks for different events
const onReadyCallbacks = [];
const onPageSubmitCallbacks = [];

// Mock Qualtrics methods
window.Qualtrics.SurveyEngine.addOnReady = function(callback) {
    onReadyCallbacks.push(callback);
};

window.Qualtrics.SurveyEngine.addOnPageSubmit = function(callback) {
    onPageSubmitCallbacks.push(callback);
};

// Current block state
let currentBlockIndex = 0;

// Function to update the UI based on current block
function updateUI() {
    injectHeader();

//    replaceQualtricsVariables();

    const block = blocks[currentBlockIndex];
    
    // Update question text
    document.getElementById('question-container').innerHTML = `
        <h2>${block.month}</h2>
        <p>${block.question}</p>
    `;
    
    // Update navigation buttons
    document.getElementById('prev-btn').disabled = currentBlockIndex === 0;
    document.getElementById('next-btn').disabled = currentBlockIndex === blocks.length - 1;
    
    // Update debug info
    document.getElementById('debug-info').innerHTML = `
        <p><strong>Current Block:</strong> ${currentBlockIndex + 1} of ${blocks.length}</p>
        <p><strong>Month:</strong> ${block.month}</p>
        <p><strong>Start Saldo:</strong> €${block.start_saldo}</p>
        <p><strong>Toeslag:</strong> ${block.toeslag_naam} (${block.toeslag_percentage}%)</p>
    `;

    onReadyCallbacks.forEach(callback => {
        try {
            callback();
        } catch (e) {
            console.error('Error in onReady callback:', e);
        }
    });

}

function injectHeader() {
    fetch('/templates/base-header.html')
    .then(res => res.text())
    .then(html => {
        html = html.replace(/src=".*?toeslagen\.png"/, 'src="/assets/toeslagen.png"')
                  .replace(/src=".*?toeslagen\.js"/, 'src="/src/toeslagen.js"');
        html = replaceQualtricsVariables(html);

        const target = document.getElementById('injected-header');
        
        target.innerHTML = html;
        
        const deadScript = target.querySelector('script#toeslagen-header');
        if (deadScript) {
            const newScript = document.createElement('script');
            newScript.id = 'toeslagen-header';
            newScript.textContent = deadScript.textContent;
            target.replaceChild(newScript, deadScript);
        } 
    })
    .catch(error => {
        console.error('Error loading header:', error);
    });
}

function replaceQualtricsVariables(html) {
    const blockVariables = getCurrentBlockVariables();
    
    Object.entries(blockVariables).forEach(([varName, value]) => {
        const escapedVarName = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        html = html.replace(new RegExp(escapedVarName, 'g'), value);
    });
    
    return html;
}

// Navigation functions
function goToNext() {
    // Execute onPageSubmit callbacks with type 'next'
    onPageSubmitCallbacks.forEach(callback => {
        try {
            callback('next');
        } catch (e) {
            console.error('Error in onPageSubmit callback:', e);
        }
    });
    
    // Move to next block if available
    if (currentBlockIndex < blocks.length - 1) {
        currentBlockIndex++;
        updateUI();
    }
}

function goToPrevious() {
    // Execute onPageSubmit callbacks with type 'prev'
    onPageSubmitCallbacks.forEach(callback => {
        try {
            callback('prev');
        } catch (e) {
            console.error('Error in onPageSubmit callback:', e);
        }
    });
    
    // Move to previous block if available
    if (currentBlockIndex > 0) {
        currentBlockIndex--;
        updateUI();
    }
}

// Initialize the test environment
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners for navigation buttons
    document.getElementById('next-btn').addEventListener('click', goToNext);
    document.getElementById('prev-btn').addEventListener('click', goToPrevious);
    
    // Load the first block
    updateUI();
    
});
