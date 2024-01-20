let loader = document.querySelector(".loader");
let body = document.querySelector("body");
let avatarImg = document.querySelector("header figure img");
let ownerName = document.querySelector("#name");
let address = document.querySelector("address p");
let biog = document.querySelector("article p");
let twitterg = document.querySelector("article p a");
let link = document.querySelector("figcaption p a");
let container = document.querySelector("main");
let input = document.querySelector("#repoSearch");
let button = document.getElementById("button");
let pageNo = 1;
let perPage = 10;
let pagination = document.querySelector(".pagination");
const select = document.querySelector("select");

window.addEventListener("beforeunload", () => {
  loader.style.display = "block";
});

function fetchApi(username) {
  let url = `https://api.github.com/users/${username}`;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let { avatar_url, html_url, name, location, bio, twitter_username } =
        data;
      setImage(avatar_url);
      setEverything(name, location, bio, twitter_username, html_url);
    });
}

function fetchRepos(page, perPage, username) {
  let url = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`;

  loader.style.display = "block";
  pagination.style.display = "none";
  container.innerHTML = "";
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      displayRepo(data);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loader.style.display = "none";
      pagination.style.display = "flex";
    });
}

function displayRepo(repos) {
  repos.map((repo) => {
    let { name, full_name, description, language, topics } = repo;

    let div = document.createElement("div");
    div.classList.add("container");

    div.innerHTML = `
 <h1>${name}</h1>
<h2>${full_name}</h2>
Description:<p style='font-size:1.5rem' >${
      description !== null && description !== undefined
        ? description
        : "No description found"
    }</p>
Language: <div style='font-size:1.3rem' > ${
      language !== null && language !== undefined
        ? language
        : "No language found"
    }</div>
Topics: <span style='font-size:1.3rem' class="topics">${
      topics.length > 0 ? topics.join(", ") : "No topics"
    }</span>


`;
    container.appendChild(div);
  });
}

// to fetch the api after clicking button
button.addEventListener("click", () => {
  let { value } = input;
  fetchApi(value);

  fetchRepos(pageNo, perPage, value);
});

function showPagination() {
  let div = document.createElement("div");
  div.classList.add("pagi");

  div.innerHTML = `
 
  <button id="prev">&laquo; Prev</button>

  <button id="currentPage" >1</button>
  <button id="next">Next &raquo</button>

  `;
  pagination.append(div);

  let prevButton = document.querySelector("#prev");
  let nextButton = document.querySelector("#next");
  let currentPage = document.querySelector("#currentPage");

  previousPage(prevButton, currentPage);
  nextPage(nextButton, currentPage);
}
showPagination();

function updateCurrentPage(cp) {
  cp.innerText = pageNo;
}

function previousPage(prev, cp) {
  prev.addEventListener("click", () => {
    pageNo--;

    updateCurrentPage(cp);
    fetchRepos(pageNo, perPage, input.value);
  });
}
function nextPage(next, cp) {
  next.addEventListener("click", () => {
    pageNo++;

    updateCurrentPage(cp);
    container.innerHTML = "";
    console.log(pageNo, perPage, input.value);

    fetchRepos(pageNo, perPage, input.value);
  });
}

function displayRepos(repos) {
  const repoList = document.getElementById("repoList");
  repoList.innerHTML = "";

  repos.forEach((repo) => {
    const li = document.createElement("li");
    li.textContent = repo.full_name;
    repoList.appendChild(li);
  });
}

select.addEventListener("change", (e) => {
  let optionValue = e.target.value;
  perPage = optionValue;
  container.innerHTML = "";
  console.log(perPage);
  if (input.value == "") {
    console.warn("Enter the name of the github user");
    alert("Enter the name of the github user");
  } else {
    fetchRepos(pageNo, perPage, input.value);
  }
});

function setImage(img) {
  avatarImg.setAttribute("src", `${img}`);
}
function setEverything(name, location, bio, twitter, url) {
  if ((name || location || bio || twitter || url) == null) {
    address.textContent = "No location found";
    biog.textContent = "No bio found";
    twitterg.textContent = "No twitter found";
  } else {
    link.setAttribute("href", url);
    link.innerText = `${url}`;
    ownerName.innerText = `${name}`;
    address.textContent = `${location}`;
    biog.textContent = `${bio}`;
    twitterg.setAttribute("href", `${twitter}`);
    twitterg.innerText = `${twitter}`;
  }
}
