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
    assignTableColor();
}

function assignTableColor(){
    const table = document.querySelectorAll('.tableRow');
    table.forEach((row) =>{
        let personalRatingRow = row.querySelector('.personalScoreTable');
        if(personalRatingRow.textContent < 7)
            row.style.background = 'blue';
    });
}

function assignVerdictColor(verdict){
    if (verdict === 'YES')
        return '#006400';
    else if (verdict === 'KINDA')
        return '#707e07';
    else return '#8B0000';
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
    let string;
    let tagsHTML ='';
    let additionalTagsHTML = '';
    movie.genre.forEach((tag) =>{
        tagsHTML += `<span class="movieTag">${tag}</span>`;
    })
    if(movie.additional_tags != '')
    {
        movie.additional_tags.forEach((additionalTag) =>{
            tagsHTML += `<span class="movieTag evilMovieTag">${additionalTag}</span>`;
        });
    }
    if(movie.type === 'Movie')
        {
            string = `
                <h2>${movie.name}</h2>
                <div id="tagContainer">
                    ${tagsHTML}
                </div>
                <span style="color: #FBBF24;" class="bolded">${movie.general_rating}</span>
                <h3>Synopsis:</h3>
                <p>${movie.synopsis}</p>
                <h3>My thoughts:</h3>
                <div id="thoughtsBox">
                    <p>${movie.thoughts1}</p>
                    <p>${movie.thoughts2}</p>
                </div>
                <p><span class="bolded">Personal Rating: </span><span style="color: #FBBF24;" class="bolded">${movie.personal_rating}</span></p>
                <p class="bolded">Is the General Rating fair?</p>
                <p class="bolded" style="color: ${assignVerdictColor(movie.verdict)}">${movie.verdict}</p>
                <p>${movie.verdictThoughts}</p>
            `;
            dialogBox.insertAdjacentHTML("beforeend",string);
        }
    else
        {
            let optionsHTML = '';
            let episodeRatingsHTML = '';
            for(let i = 1; i <= movie.nr_seasons; i++)
                {
                    optionsHTML+= `<option>Season-${i}</option>`;
                    const currentRatings = movie.ratings[i-1].split(' ');
                    currentRatings.forEach((rating)=>{
                        if(i == 1)
                            episodeRatingsHTML+= `<div class="Season-${i} seasonBox"><span>${rating}</span></div>`
                        else
                            episodeRatingsHTML+= `<div class="Season-${i} seasonBox" style="display: none;"><span>${rating}</span></div>`
                    });
                }

            string = `
                <h2>${movie.name}</h2>  
                ${tagsHTML}
                <p>${movie.synopsis}</p>
                <select id="seasonSelector">
                    ${optionsHTML}
                </select>
                <div id="ratingContainer">
                    ${episodeRatingsHTML}
                </div>
            `;
            dialogBox.insertAdjacentHTML("beforeend",string);
            const eventSeason = document.getElementById('seasonSelector');
            eventSeason.addEventListener('change',() =>{
                const children = document.getElementById('ratingContainer').children;
                for(let child of children)
                    child.style.display = 'none';
                const visibleScore = document.querySelectorAll(`.${eventSeason.value}`);
                visibleScore.forEach((score) =>{
                    score.style.display = '';
                })
            });
        }
    
    document.body.classList.add('disableScroll');
}
