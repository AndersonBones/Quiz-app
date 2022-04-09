 // Your web app's Firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyDe5vp7JUoFNdeJGSDUxVhUTKhLggQ-dpE",
    authDomain: "projeto2-aa873.firebaseapp.com",
    databaseURL: "https://projeto2-aa873-default-rtdb.firebaseio.com",
    projectId: "projeto2-aa873",
    storageBucket: "projeto2-aa873.appspot.com",
    messagingSenderId: "456917550085",
    appId: "1:456917550085:web:7d92aebebda5877994886c"
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