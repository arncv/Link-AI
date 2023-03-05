const form = document.getElementById('generate-form');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const prompt = document.getElementById('prompt').value;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        const result = await response.json();

        if (result.success) {
            resultDiv.innerHTML = `<img src="${result.data}" alt="Generated Image">`;
        } else {
            resultDiv.innerHTML = result.error;
        }
    } catch (error) {
        resultDiv.innerHTML = 'Error generating image';
    }
});
