const API_URL = 'https://api.github.com/users/';
const main = document.querySelector('main');
const form = document.querySelector('#form');
const search = document.querySelector('#search');
const card = document.createElement('div');

async function getUser(username) {
    const response = await fetch(API_URL + username)
        if (response.ok) {
        const respData = await response.json()
        createUserCard(respData);
            getRepos(username);
        } else {
            const errorCard = document.createElement('div');
            errorCard.classList.add('errorCard');
            search.value = '';
            main.innerHTML = '';
            card.remove();
            errorCard.innerHTML = `
            <h2>This user does not exist</h2>
        `;

            main.appendChild(errorCard);
        }
};

async function getRepos(username) {
    const response = await fetch(API_URL + username + '/repos')
        .then(response => response.json())
        .then(respData => addReposToCard(respData))
};

function getBio(bio) {
    if (bio === null) {
        return 'no biography';
    } else {
        return bio;
    }
};

function getFollowers(value) {
    if (String(value).length > 3) {
        return `${String(value).slice(0,1)}.${String(value).slice(1,2)}K`;
    } else {
        return value;
    }
};

function getFollowing(value) {
    if (String(value).length > 3) {
        return `${String(value).slice(0,1)}.${String(value).slice(1,2)}K`
    } else {
        return value;
    }
};

function getLogin(login) {
    if (login === undefined) {
        main.innerHTML = '';
    } else {
        return login;
    }
};

function createUserCard(user) {
    card.classList.add('card');

    main.innerHTML = '';

            card.innerHTML = `
                    <div>
                        <img class="avatar" src="${user.avatar_url}" alt="${getLogin(user.login)}">
                    </div>
                    <div class="info">
                        <h2 class="check">${user.login}</h2>
                        <p><i class="fas fa-comment"></i> ${getBio(user.bio)}</p>
                        <ul class="stats">
                            <li class="followers"><i class="fas fa-user-friends"></i> followers ${getFollowers(user.followers)}</li>
                            <li><i class="fas fa-user-plus"></i> Following ${getFollowing(user.following)}</li>
                            <li><i class="fas fa-book"></i> ${user.public_repos}</li>
                        </ul>
                        <div class="repos" id="repos"></div>
                    </div>
    `;

    main.appendChild(card);
};

function addReposToCard(repos) {
    const reposEl = document.querySelector('#repos');

    repos.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)).forEach(rep => {
        const repEl = document.createElement('a');
        repEl.classList.add('repo');

        repEl.href = rep.html_url;
        repEl.target = '_blank';
        repEl.innerText = rep.name;

        reposEl.appendChild(repEl);
    })
};

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm && searchTerm.trim() != '') {
        getUser(searchTerm);
        search.value = '';
    }
});