// variables
const searchBox = document.getElementById("search-box");
const resultBox = document.querySelector(".result-section");
const errorBox = document.querySelector(".error");
const loader = document.querySelector('.ring-loader');

getUserData('sakshamian');
// functions
function getResultHTML(user){
    let html = `
    <section class="basic-info">
    <h2 class="container-heading">
      Basic Info
    </h2>
    <div class="profile">
        <img src="${user.avatar_url}" class="avatar" alt="avatar"/>
        <div class="text">
            <h3>${user.name}</h3>
            <h4>${user.login}</h4>
            <p>" ${user.bio} "</p>
        </div>
    </div>

    <div class="more-info">
        <h3>Github:<a href="${user.html_url}" target="_blank" rel="noopener noreferrer">${user.login}</a></h3>
        <ul class="urls">
            <li>Location:  ${user.location}</li>
            <li>Blog:<a href="${user.blog}" target="_blank">${user.blog}</a></li>
            <li>Followers:  ${user.followers}</li>
            <li>Following:  ${user.following}</li>
        </ul>
    </div>
    </section>
    <section class="repos">
            <h2 class="container-heading">Repos</h2>
            <div class="repos-list"></div>        
    </section>
    `;
    return html;
}

function getRepoHTML(repoData){
    let html = "";
    let count = 1;
    for (let repo of repoData) {
        console.log(repo.url);
        html += `<div>${count}. <a href="${repo.html_url}" target="_blank">${repo.name}</a></div>`;
        count++;
    }
    return html;
}

async function repoData(link){
    let serverData = await fetch(link); 
    let jsonData = await serverData.json();
    let allRepoData = await getRepoHTML(jsonData);
    return allRepoData;
}

function showLoader(){
    loader.style.display = 'block';
    resultBox.style.display = 'none';
}
function hideLoader(){
    loader.style.display = 'none';
    resultBox.style.display = 'flex';
}

async function getUserData(userName){
    try{
        showLoader();
        errorBox.textContent = "";
        let serverData = await fetch(`https://api.github.com/users/${userName}`);
        let jsonData = await serverData.json();
        if(!(serverData.ok)){
            errorBox.textContent = "Not Found";
        }
        else{
            resultBox.innerHTML = await getResultHTML(jsonData);
            let res = await repoData(jsonData.repos_url);
            document.querySelector('.repos-list').innerHTML = res;
        }
        hideLoader();
    }
    catch(err){
        console.log(err);
        errorBox.textContent = "Error:- " + err;
    }
}

// event listeners
searchBox.addEventListener("keyup", (e) => {
    if(e.keyCode == 13){
        let userText = searchBox.value;
        if(userText == '') return;
        else{
            getUserData(userText);
        }
    }
});