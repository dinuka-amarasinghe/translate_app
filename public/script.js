const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector('#playButton');
const textInput = document.querySelector('textarea');
const languageSelect = document.querySelector('#languageSelect');

// Array of supported languages with their ISO codes
const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
];

// Populate language select dropdown
languages.forEach(({ code, name }) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    languageSelect.appendChild(option);
});

// Load Available Voices
let voices = [];
function loadVoices() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = voices
        .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
        .join('');
};

// Trigger voice selection when they become available
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();


//Translate text with serverless function
async function translateText(text, targetLang) {
    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, target: targetLang }),
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text}`);
        }
        const data = await response.json();
        return data.data.translations[0].translatedText;
    }
    catch (error) {
        console.error('Translation Error: ', error);
        alert('Failed to translate text.');
        return text;
    }
};


// Play TTS
playButton.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(textInput.value);
    const selectedVoice = voices[voiceSelect.value];
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    speechSynthesis.speak(utterance);
});
