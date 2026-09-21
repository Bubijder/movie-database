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
        if(personalRatingRow.textContent > 8)
            row.style.background = '#6A9955';
        else if(personalRatingRow.textContent > 6)
            row.style.background = '#C5A23E';
        else row.style.background = '#C75341';
    });
}

function assignVerdictColor(verdict){
    if (verdict === 'YES')
        return '#006400';
    else if (verdict === 'KINDA')
        return '#707e07';
    else return '#8B0000';
}

function assignEpisodeColor(rating){
    if(8<= rating)
        return '#2a9812';
    else if(6<=rating)
        return '#cfd22c';
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
            const tagsMatches = selectedTags.length === 0 || selectedTags.every(tag => movie.additional_tags.includes(tag) || movie.genre.includes(tag));
            if(textMatches && tagsMatches)
                newDatabase.push(movie);
        });
        generateHTML(newDatabase)
    }
}

let additionalTags = ['Foreign','Japanese','Family','Quirky','Mystery','Danish','French','Vampires','Zombies',
    'Biography','Coming-of-Age','Aliens','One Man Army','History','Police','Korean','German','Russian','Anime','Chinese'];
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
        }
    else
        {
            let seasonButtonsHTML = '';
            let episoadeRatingsHTML = '';
            for(let i=1; i<=movie.nr_seasons; i++){
                seasonButtonsHTML += `<button class="seasonButton ${i==1 ? 'active' : ''}" onclick="showSeason('Season-${i}',this)">Season ${i}</button>`;
                const currentRatings = movie.ratings[i-1].split(' ');
                currentRatings.forEach((rating)=>{
                        episoadeRatingsHTML+= `<div class="Season-${i} seasonBox" style="${i != 1 ? 'display:none;' : ''} background-color:${assignEpisodeColor(rating)};"><span>${rating}</span></div>`
                });
            }
            string = `
                <h2>${movie.name}</h2>
                ${tagsHTML}
                <p style="color: #FBBF24;" class="bolded">${movie.general_rating}</p>
                <h3>Synopsis:</h3>
                <p>${movie.synopsis}</p>
                ${seasonButtonsHTML}
                <div id="ratingContainer">
                    ${episoadeRatingsHTML}
                </div>
                <p><span class="bolded">Personal Rating: </span><span style="color: #FBBF24;">${movie.personal_rating}</span></p>
                <p><span class="bolded">Calculated episode average: </span><span style="color: #FBBF24;">9.4</span></p>
                <p class="bolded">Thoughts:</p>
                <p>${movie.thoughts1}</p>
                <p>${movie.thoughts2}</p>
            `
        }
    dialogBox.insertAdjacentHTML("beforeend",string);
    document.body.classList.add('disableScroll');
}

function showSeason(id,button){
    const allElements = document.getElementById('ratingContainer').children;
    for(let child of allElements)
        child.style.display = 'none';
    document.querySelectorAll(`.${id}`).forEach((element) =>{
        element.style.display = '';
    });
    document.querySelector('.active').classList.remove('active');
    button.classList.add('active');
}

let sortState = 'normal';
let currentProperty = null;

function sortProperty(property){
    if(currentProperty !== property){
        sortState = 'normal';
        currentProperty = property;
    }
    const nextState = {
        normal: 'asc',
        asc: 'desc',
        desc: 'normal'
    };
    sortState = nextState[sortState];
    if(sortState == 'normal')
        generateHTML();
    else{
        const array = [...database];
        array.sort((a,b) =>{
            if(a[property] < b[property]) return sortState === 'asc' ? 1 : -1;
            if(a[property] > b[property]) return sortState === 'asc' ? -1 : 1;
            return 0;
        });
        generateHTML(array);
    }
}
