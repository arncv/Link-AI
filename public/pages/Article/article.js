const form = document.querySelector('form');
const output = document.querySelector('#output');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const topic = document.querySelector('#topic').value;
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Api-Key': 'ddaf11b6-6b34-4008-aafc-2ed98415663c'
    },
    body: JSON.stringify({ topic })
  };
  try {
    const response = await fetch('https://api.writesonic.com/v2/business/content/blog-ideas?num_copies=1', options);
const data = await response.json();
output.innerHTML = `<p>${data[0].text}</p>`;

} catch (err) {
console.error(err);
}



});