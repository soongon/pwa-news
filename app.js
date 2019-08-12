const apiKey = '5dbbf0c9a84f409c84538550b23edb55';
const main = document.querySelector('main');
const selector = document.querySelector('#sourceSelect');
const defaultSource = 'techcrunch';

window.addEventListener('load', async ev => {
    updateNews();
    await updateSources();
    selector.value = defaultSource;

    selector.addEventListener('change', evt => {
        updateNews(evt.target.value);
    });

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
            console.log('SW registered..');
        } catch (err) {
            console.log(err);
        }
    }
});

async function updateSources() {
    const result = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
    const json = await result.json();
    console.log(json);

    selector.innerHTML = json.sources
        .map(src => `<option value="${src.id}">${src.name}</option>`)
        .join('\n');
}

async function updateNews(source = defaultSource) {
    const result = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`);
    const json = await result.json();

    main.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
    return `
        <div class="article">
            <a href="${article.url}">
                <h2>${article.title}</h2>
                <img src="${article.urlToImage}">
                <p>${article.description}</p>
            </a>
        </div>
    `;
}