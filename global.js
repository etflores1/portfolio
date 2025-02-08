console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/etflores1', title: 'GitHub Profile' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = window.location.hostname === 'etflores1.github.io' ? '/portfolio/' : '/';

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !url.startsWith('http') ? BASE_PATH + url : url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
    );
    
    if (a.host !== location.host) {
        a.target = '_blank';
    }
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select id="theme-switch">
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
      </label>`
);

let select = document.querySelector('#theme-switch');

const savedScheme = localStorage.colorScheme || 'light dark';
document.documentElement.style.setProperty('color-scheme', savedScheme);
select.value = savedScheme;

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
});


export async function fetchJSON(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        console.log(response);

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!containerElement || !(containerElement instanceof HTMLElement)) {
        console.error('Invalid container element.');
        return;
    }

    containerElement.innerHTML = '';
    
    for (let project of projects) {
        const article = document.createElement('article');

        const contentDiv = document.createElement('div');
        contentDiv.style.display = 'flex';
        contentDiv.style.flexDirection = 'column';
        contentDiv.style.gap = '10px';

        article.innerHTML = `
            <${headingLevel}>${project.title || 'Untitled Project'}</${headingLevel}>
            <img src="${project.image || ''}" alt="${project.title || 'Project Image'}">
        `;

        const descriptionElement = document.createElement('p');
        descriptionElement.innerText = project.description || 'No description available.';
        contentDiv.appendChild(descriptionElement);

        const yearElement = document.createElement('p');
        yearElement.innerHTML = `<strong>Year:</strong> ${project.year || 'N/A'}`;
        yearElement.style.fontStyle = 'italic';
        contentDiv.appendChild(yearElement);

        article.appendChild(contentDiv);
        containerElement.appendChild(article);
    }
}


export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}




