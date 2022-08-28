var main_section = $(".main-section");
var play_btn = $("#play-quiz");


var ranking_section = document.querySelector('.ranking-section');
var ranking_btn = $("#ranking-quiz");

var questions_section = $(".questions-section");
var question_of = document.querySelector('#question-of');
var progress_bar = document.querySelector('#progress');
var score_element = document.querySelector('#score-value');
var question_cont = document.querySelector(".question-container");
var alternatives = document.querySelector('.alternatives-container');

var game_over_section = document.querySelector('.game_over-section');
var total_score = document.querySelector('#total-score');
var go_home = document.querySelectorAll('.go-home');
var play_again = document.querySelector('#play-again');

var user_name_form = document.querySelector('.user_name-container');
var save_score = document.querySelector('#save-score');
var user_name = document.querySelector('#user-name');
var user_scores = document.querySelector('.users-scores');

var QUESTION_POS = 0;
var PROGRESS_PERCENT = 25;
var SCORE = 0;
var NEXT_QUESTION = true;
var questions = [
    {
        quest: 'what is the largest country in the world by land area?',
        alternatives:[{answer: 'United States'},{answer: 'China'},
                      {answer: 'Russia'},{ answer: 'Canada'}], 
        right_answer:'Russia'
    },
    {
        quest: 'what year did man walk on the moon for the first time?',
        alternatives:[{answer: '1969'},{answer: '1960'},
                      {answer: '1970'},{answer: '1945'}], 
        right_answer:'1969'
    },
    {
        quest: 'what is the name of our galaxy?',
        alternatives:[{answer: 'Andromeda'},{answer: 'Black Eye Galaxy'},
                      {answer: 'The Milky Way'},{answer: 'Triangulum'}],
        right_answer:'The Milky Way' 
    },
    {
        quest: 'when the first world war ended?',
        alternatives:[{answer: 'July 28, 1914'},{answer: 'June 18, 1938'},
                      { answer: 'March 8, 1917'},{answer: 'November 11, 1918'}],
        right_answer:'November 11, 1918' 
    },

]

$(ranking_section).hide();
$(game_over_section).hide();
questions_section.hide();


function Show_Questions_section(){ // Show questions 

    main_section.fadeOut('fast', ()=>{ // Hide main section
        Choice(); // allows the quiz to advance to the next question
        questions_section.fadeIn(); // Show questions section
    });
    
}
play_btn.click(Show_Questions_section) // start quiz 


function Show_ranking_section(){ // Show ranking section
    main_section.fadeOut('fast', ()=>{  // Hide main section
        $(ranking_section).fadeIn(); // Show ranking section
        Get_ranking(); // getting players scores
    });
}
ranking_btn.click(Show_ranking_section); // start ranking 


function Choice(){  // allows the quiz to advance to the next question
    
    setTimeout(()=>{

        if(NEXT_QUESTION == true){
    
            Next_question() // update question section

            for(var alt of alternatives.children){
                $(alt).click(Check_choice) // checks if the chosen question is the correct one
            }

        }
        
    }, 50)
    
}

function Update_Score(){ // update user score
    score_element.innerText = SCORE;
}

function Progress_bar(){ // update progress bar and progress question
    progress_bar.style.width = PROGRESS_PERCENT + '%';
    question_of.innerText = 'Question '+parseInt(QUESTION_POS+1)+ ' of 4';
}

function Update_question(){ // update question
    let question_text = document.createElement('h2');
    question_text.innerText = `${questions[QUESTION_POS].quest}`;
    question_cont.replaceChild(question_text, question_cont.children[0]);
}

function Update_alternatives(){ // update alternatives

    for(var i=0; i<questions.length; i++){
        let btn = document.createElement('button');
        btn.setAttribute('pos', i);

        let span = document.createElement('span');
        span.innerText = questions[QUESTION_POS].alternatives[i].answer;

        let icon = document.createElement('i');
        btn.appendChild(span);
        btn.appendChild(icon);

        alternatives.replaceChild(btn, alternatives.children[i]);
    } 
}
function Next_question(){ // update question section
    Update_Score();
    Update_question();
    Progress_bar();
    Update_alternatives();
}

function Check_choice(){ // checks if the chosen question is the correct one

    if(NEXT_QUESTION == true ){
        QUESTION_POS+=1; // question position
        PROGRESS_PERCENT+=25;

        var chosen_alternative = this.children[0].innerText; // chosen question
        var correct_alternative = questions[QUESTION_POS-1].right_answer; // correct alternative
        var alternative_icon = this.children[1]; // alternative icon


        if(chosen_alternative == correct_alternative){ // if the question chosen is correct
            Right_answer(this, alternative_icon) // paint the alternative green
            SCORE+=100; // 
        }
        else{ // if the question chosen is incorrect
            Wrong_answer(this, alternative_icon); // paint the alternative red
        }
       
    }
    if(QUESTION_POS > 3){ // if QUESTION_POS exceeds the value 3
        QUESTION_POS = 0;
       
        setTimeout(()=>{ 
            Game_over(); // game over after 1 second
        },1000)
    }

    if(PROGRESS_PERCENT > 100){ // if PROGRESS_PERCENT exceeds the value 100
        PROGRESS_PERCENT = 25;
    }
    
    
    NEXT_QUESTION = false;
        
    setTimeout(()=>{ // allows the user to advance to the next question 1 second after having chosen a question
        NEXT_QUESTION = true;
        
        Choice(); // allows the quiz to advance to the next question
       
    }, 1000);

}

function Right_answer(element, icon){  // paint the alternative green
    $(element).css({'background-color':'var(--light-green)'});
    $(element).css({'box-shadow': '0 0 7px 2px var(--light-green)'})
    $(element).css({'border': '1px solid var(--green)'})

    $(icon).addClass('bi bi-check-circle');
    $(element).css({'color':'var(--green)'});

}

function Wrong_answer(element, icon){  // paint the alternative red
    $(element).css({'background-color':'var(--light-red)'});
    $(element).css({'box-shadow': '0 0 7px 2px var(--light-red)'})
    $(element).css({'border': '1px solid var(--red)'});

    $(icon).addClass('bi bi-x-circle');
    $(element).css({'color':'var(--red)'});
}


function Game_over(){ // start game over 
    total_score.innerText = SCORE;
    $(questions_section).hide();
    $(game_over_section).fadeIn();
}


function Play_again(){ // play again
    $(game_over_section).fadeOut('fast', ()=>{ // hide game over section
        questions_section.fadeIn(); // show questions section
    });
    Reset_Score(); // reset score
    Update_Score(); // update score
}
$(play_again).click(Play_again); // start game over


function Go_home(){ // go main section
   
    $(this.parentElement.parentElement).fadeOut('fast', ()=>{ // hide actual section
        user_scores.innerHTML = `<div class="users-scores"></div>`; 
        main_section.fadeIn(); // show main section
    });
    Reset_Score(); // reset score
}

for(var btn of go_home){ // start main section
    $(btn).click(Go_home)
}

