const firebaseConfig = {
  apiKey: "AIzaSyCdYcWNsB_TtpnvsM4OPz5r-E1EWYCtraY",
  authDomain: "quiz-53312.firebaseapp.com",
  projectId: "quiz-53312",
  storageBucket: "quiz-53312.appspot.com",
  messagingSenderId: "641667213444",
  appId: "1:641667213444:web:b9f26d594f363b335b3ad1"
};

  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();


function Creat_user(){
    
    let email = user_name.value+'@hotmail.com';
    let password = '123456';
    var userId;

    auth.createUserWithEmailAndPassword(email, password).then((data)=>{
        userId = data.user.uid;
        
        db.collection('scores').doc(userId).set({score:SCORE, name:user_name.value}).then((docRef)=>{
          // data posted successfully
          SCORE = 0;
          user_name.value = '';
        })
        .catch((error)=>{
          alert('Error posting user data')
        
        })
    
      })
      .catch((error)=>{

        auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
          var user = userCredential.user;
          userId = user.uid;

          if(error.code == "auth/email-already-in-use"){
            
            db.collection('scores').doc(userId).update({score:firebase.firestore.FieldValue.increment(SCORE)}).then((docRef)=>{
              // data posted successfully
              SCORE = 0;
            })
            .catch((error)=>{
              // error
            })
          }
          
        }).catch((err) => {
          var errorCode = err.code;
          var errorMessage = err.message;
        });

      })     
}

function Save_user(){
    $(game_over_section).fadeOut('fast', ()=>{
        main_section.fadeIn();
    });
}

user_name_form.addEventListener('submit', (e)=>{
  
  e.preventDefault();
  Creat_user();
  Save_user();
    
})

function Get_ranking(){
  let ranking_scores = [];

  db.collection("scores").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        ranking_scores.push({score:doc.data().score, name:doc.data().name});
    });

    Set_ranking(ranking_scores);
  })

}

function Set_ranking(scores){

  var Sort_scores = [...scores];

  Sort_scores.sort(function(a,b) {
      return b.score - a.score;
  });


  if(scores.length <= 10){
    for(var i=0; i<Sort_scores.length; i++){
      let span = document.createElement('span');
      user_scores.appendChild(span);
  
      span.innerText = Sort_scores[i].name +' - '+Sort_scores[i].score; 
      
    }
  }

  if(scores.length == 0){
    alert('There are no registered players!')
  }

}

function Reset_Score(){
  SCORE = 0;
}
