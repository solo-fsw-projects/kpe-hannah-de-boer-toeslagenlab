
import { blocks } from './blocks.js';

// Mock Qualtrics SurveyEngine object
window.Qualtrics = window.Qualtrics || {};
window.Qualtrics.SurveyEngine = window.Qualtrics.SurveyEngine || {};

// Store callbacks for different events
let onReadyCallbacks = [];
let onPageSubmitCallbacks = [];

// Mock Qualtrics methods
window.Qualtrics.SurveyEngine.addOnReady = function(callback) {
    onReadyCallbacks.push(callback);
};

window.Qualtrics.SurveyEngine.addOnPageSubmit = function(callback) {
    onPageSubmitCallbacks.push(callback);
};

// Current block state
let currentBlockIndex = 0;

let pageVariables = {};

function updatePageVariablesWithBlock(block) {
    pageVariables = {
        header: block.header !== undefined ? block.header : (pageVariables.header || ''),
        google_sheet_csv_url: block.google_sheet_csv_url !== undefined ? block.google_sheet_csv_url : (pageVariables.google_sheet_csv_url || ''),
        enable_previous_button: block.enable_previous_button !== undefined ? block.enable_previous_button : (pageVariables.enable_previous_button || ''),
        start_saldo: block.start_saldo !== undefined ? block.start_saldo : (pageVariables.start_saldo || ''),
        month: block.month !== undefined ? block.month : (pageVariables.month || ''),
        toeslag_naam: block.toeslag_naam !== undefined ? block.toeslag_naam : (pageVariables.toeslag_naam || ''),
        toeslag_percentage: block.toeslag_percentage !== undefined ? block.toeslag_percentage : (pageVariables.toeslag_percentage || '')
    };
}

// Function to get the current block's variable values
function getReplacementVariables() {
    return {
        '${e://Field/header}': pageVariables.header,
        '${e://Field/google_sheet_csv_url}': pageVariables.google_sheet_csv_url,
        '${e://Field/enable_previous_button}': pageVariables.enable_previous_button,
        '${e://Field/start_saldo}': pageVariables.start_saldo,
        '${e://Field/month}': pageVariables.month,
        '${e://Field/toeslag_naam}': pageVariables.toeslag_naam,
        '${e://Field/toeslag_percentage}': pageVariables.toeslag_percentage
    };
}

async function updateUI() {

    onReadyCallbacks = [];
    onPageSubmitCallbacks = [];
    
    const currentBlock = blocks[currentBlockIndex];
    updatePageVariablesWithBlock(currentBlock);

    await injectHeaderAndReplaceVariables();
    
    // Update question text
    document.getElementById('question-container').innerHTML = `
            <h2>${pageVariables.month}</h2>
            <p>${currentBlock.text}</p>
        `;
    
    // Update navigation buttons
    document.getElementById('PreviousButton').style.display = currentBlockIndex === 0 ? 'none' : 'block';
    document.getElementById('NextButton').style.display = currentBlockIndex === blocks.length - 1 ? 'none' : 'block';
    
    // Update debug info
    document.getElementById('debug-info').innerHTML = `
        <p><strong>Current Block:</strong> ${currentBlockIndex + 1} of ${blocks.length}</p>
        <p><strong>Month:</strong> ${pageVariables.month}</p>
        <p><strong>Start Saldo:</strong> €${pageVariables.start_saldo}</p>
        <p><strong>Toeslag:</strong> ${pageVariables.toeslag_naam} (${pageVariables.toeslag_percentage}%)</p>
    `;

    // Execute block-specific JavaScript if it exists
    if (currentBlock.javascript && typeof currentBlock.javascript === 'function') {
        try {
            currentBlock.javascript();
        } catch (e) {
            console.error('Error executing block JavaScript:', e);
        }
    }
    
    runOnReadyCallbacks();
}

async function injectHeaderAndReplaceVariables() {

    const response = await fetch('/templates/base-header.html');
    let html = await response.text();
    
    html = html.replace(/src=".*?pinpas\.png"/, 'src="/assets/pinpas.png"')
              .replace(/src=".*?toeslagen\.js"/, 'src="/src/toeslagen.js"');
    html = replaceQualtricsVariables(html, getReplacementVariables());

    const target = document.getElementById('injected-header');
    target.innerHTML = html;
    
    const deadScript = target.querySelector('script#toeslagen-header');
    if (!deadScript) {
        return;
    }

    const firstRun = window.toeslagen === undefined;

    const newScript = document.createElement('script');
    newScript.id = 'toeslagen-header';
    newScript.textContent = deadScript.textContent;
    target.replaceChild(newScript, deadScript);
    
    // at first run the runOnReadyCallbacks will be empty in updateUi because newScript is not ready yet
    if (firstRun) {
        setTimeout(() => {
            runOnReadyCallbacks();
        }, 1000);
    }
}

function runOnReadyCallbacks() {
    onReadyCallbacks.forEach(callback => {
        try {
            callback();
        } catch (e) {
            console.error('Error in onReady callback:', e);
        }
    });
}

function replaceQualtricsVariables(html, variables) {
    
    Object.entries(variables).forEach(([varName, value]) => {
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

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('NextButton').addEventListener('click', goToNext);
    document.getElementById('PreviousButton').addEventListener('click', goToPrevious);
    
    try {
        await updateUI();
    } catch (error) {
        console.error('Error initializing UI:', error);
    }
});
