function showSection(sectionId){
    const allSections = document.querySelectorAll('.sections');
    allSections.forEach((section) =>{
        section.style.display = 'none';
    });
    const selectedSection = document.getElementById(sectionId);
    if(selectedSection)
        selectedSection.style.display = 'block';
}

function generateHTML(selectedMovies = database){
    const tableLocation = document.getElementById('movieTable');
    tableLocation.innerHTML = ' ';
    selectedMovies.forEach((elem) =>{
        let genreString = '';
        const originalIndex = database.findIndex(m => m.name === elem.name);
        elem.genre.forEach((genre) =>{
            genreString = genreString + genre + ', ';
        });
        const newString = `
            <tr class="tableRow" onclick="openReview(${originalIndex})">
                <td>${elem.name}</td>
                <td>${genreString.slice(0,-2)}</td>
                <td>${elem.release_date}</td>
                <td>${elem.general_rating}</td>
                <td class="personalScoreTable">${elem.personal_rating}</td>
            </tr>   
        `;
        tableLocation.insertAdjacentHTML("beforeend",newString);
    });
    assignColor();
}

function assignColor(){
    const table = document.querySelectorAll('.tableRow');
    table.forEach((row) =>{
        let personalRatingRow = row.querySelector('.personalScoreTable');
        if(personalRatingRow.textContent < 7)
            row.style.background = 'blue';
    });
}

window.onload = () =>{
    generateHTML();
}

const inputText = document.getElementById('movieFind');
inputText.addEventListener('input',() =>{
    searchFunction()
});

function searchFunction(selectedTags = []){
    if(inputText.value === '' && selectedTags.length === 0)
        generateHTML();
    else
    {
        let newDatabase = [];
        database.forEach((movie) => {
            const textMatches = movie.name.toLocaleLowerCase().includes(inputText.value.toLocaleLowerCase());
            const tagsMatches = selectedTags.length === 0 || selectedTags.every(tag => movie.additional_tags.includes(tag));
            if(textMatches && tagsMatches)
                newDatabase.push(movie);
        });
        generateHTML(newDatabase)
    }
}

const additionalTags = ['Foreign','Japanese','Family','Quirky','Mystery','Danish','French','Vampires','Zombies',
    'Biography','Coming-of-Age','Aliens','One Man Army','History','Police','Korean','German','Russian','Anime'];
additionalTags.sort();
const selectedTag = document.getElementById('searchTags');
additionalTags.forEach((tag) =>{
    const string = `<option>${tag}</option>`
    selectedTag.insertAdjacentHTML("beforeend",string);
});

let currentSelectedTags  = [];

selectedTag.addEventListener('change',() =>{

    if(document.getElementById(selectedTag.value) === null)
    {
        const string = `<div class="movieSectionTag" id="${selectedTag.value}">${selectedTag.value}</div>`; //onclick="this.remove()
        tagSection.insertAdjacentHTML("beforeend",string);
        const tagEvent = document.getElementById(selectedTag.value);
        const salutari = selectedTag.value;
        currentSelectedTags.push(salutari);
        tagEvent.addEventListener('click',()=>{
            tagEvent.remove();
            currentSelectedTags.splice(currentSelectedTags.indexOf(salutari),1);
            searchFunction(currentSelectedTags);
        });
        searchFunction(currentSelectedTags);
    }
    selectedTag.value = ''; 
});

const revieWindow = document.getElementById('dialogOpen');
const dialogBox = document.getElementById('dialogOpen');
dialogBox.addEventListener('close', () =>{
    document.body.classList.remove('disableScroll');
});
    
function openReview(index){
    const movie = database[index];
    revieWindow.showModal();
    dialogBox.innerHTML = '';

    if(movie.type === 'Movie')
        {
            const string = `
                <h2>${movie.name}</h2>
                <div id="tagsBox">

                </div>
                <h3>Synopsis:</h3>
                <p>${movie.synopsis}</p>
                <h3>My thoughts:</h3>
                <div id="thoughtsBox">
                    <p>${movie.thoughts1}</p>
                    <p>${movie.thoughts2}</p>
                </div>
                <p><span>Personal Rating: </span><span>${movie.personal_rating}</span></p>
                <p>Is the General Rating fair?</p>
                <p>${movie.verdict}</p>
                <p>${movie.verdictThoughts}</p>
            `;
            dialogBox.insertAdjacentHTML("beforeend",string);
        }
    else
    {

    }

    document.body.classList.add('disableScroll');
}
