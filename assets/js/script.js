function setCookie(name, value, days) {
    var expires = "";

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0;i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

var firebaseConfig = {
    apiKey: "AIzaSyAmkQ9vEUl39bsokaxCefNte4gxIFdNoN0",
    authDomain: "roydero-32a7b.firebaseapp.com",
    projectId: "roydero-32a7b",
    storageBucket: "roydero-32a7b.appspot.com",
    messagingSenderId: "666785329357",
    appId: "1:666785329357:web:1f00d88c83fe6fdfb7b984",
    measurementId: "G-88MKEJDB55"
};

firebase.initializeApp(firebaseConfig);
var provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();

const paymentInfo = 
`
Billed monthly (June and July) with 8 classes per month. Payments are completed online through the dashboard. Payment options available: PayPal and Venmo (Stripe coming soon). 
`;

const sectionOneInfo = `
    <b>Term:</b> Summer <br>
    <b>Schedule:</b> Twice a week (Monday and Thursday at 5 PM) <br>
    <b>Registration:</b> Open <br>
    <b>Cost:</b> $10/class/hr <br>
    <b>Start Date: </b> June 5th, 2023 <br>
    <b>Payments: </b> ${paymentInfo}
`;

const sectionTwoInfo = `
    <b>Term:</b> Summer <br>
    <b>Schedule:</b> Twice a week (Tuesday and Friday at 5 PM) <br>
    <b>Registration:</b> Open <br>
    <b>Cost:</b> $10/class/hr <br>
    <b>Start Date: </b> June 6th, 2023 <br>
    <b>Payments: </b> ${paymentInfo}
`;

const sectionThreeInfo = `
    <b>Term:</b> Summer <br>
    <b>Schedule:</b> Twice a week (Saturday and Sunday at 5 PM) <br>
    <b>Registration:</b> Closed <br>
    <b>Cost:</b> $10/class/hr <br>
    <b>Start Date: </b> June 3rd, 2023 <br>
    <b>Payments: </b> ${paymentInfo}
`;

function setModal(title, body) {
    $('#modal-title').text(title);
    $('#modal-body').html(body);
    $('#setModal').modal('show');
}

function hideAlertModal() {
    $('#setModal').modal('hide');
    $('#modal-title').text('');
    $('#modal-body').text('');
    document.getElementById("modal-footer").innerHTML = '';
}


function webLogin() {
    const loginModalBody = `
    <div class="col-12">
    <div style="text-align: center;">
            <button class="btn btn-lg px-4 me-sm-3" onclick="loginGoogleAuth()" style="background-color:lightblue">Log In With Google</button><br>
            <h3 style="font-family: Luckiest Guy, cursive; color: black; font-size: 35px; margin-top:3px;margin-bottom:-4px;">OR</h3>
        </div>
        <div class="mb-3">
            <label class="form-label lead">Login Email</label>
            <input id="loginEmail" type="email" class="form-control" placeholder="Email Address">
        </div>
        <div class="mb-3">
            <label class="form-label lead">Login Password</label>
            <input id="loginPassword" type="password" class="form-control" placeholder="Password">
        </div>
        <div style="text-align: center;">
            <button onclick="login()" class="btn btn-lg px-4 me-sm-3" style="background-color:lightpink">Sign In</button>
        </div>
    </div>  
    `;
    setModal("Login", loginModalBody);
}

function loginGoogleAuth() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        
        db.collection("students").doc(user.email).get().then((doc) => {
            if(doc.data() != undefined) {
                setCookie("Email", user.email, 365);
                window.location.href = "dashboard.html";
            } else {
                if(document.getElementById("learn-more") != null) {
                    $('html, body').animate({
                        scrollTop: $("#learn-more").offset().top
                    }, 2000);
                    setModal("Error: New Student", "Please register for a class prior to logging into the dashboard");
                } else {
                    window.location.href = "https://www.zebraprep.com#learn-more";
                }
            }
        }).catch((error) => {});
    }).catch(function(error) {});  
}

function login() {
    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();
    if((email == "" || password == "")) {
        setModal("Error: Missing Field", "Please Complete the Missing Field");
    } else {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            db.collection("students").doc(email).get().then((doc) => {
                if(doc.data() != undefined) {
                    setCookie("Email", email, 365);
                    window.location.href = "dashboard.html";
                } else {
                    if(document.getElementById("learn-more") != null) {
                        $('html, body').animate({
                            scrollTop: $("#learn-more").offset().top
                        }, 2000);
                        setModal("Error: New Student", "Please register for a class prior to logging into the dashboard");
                    } else {
                        window.location.href = "https://www.zebraprep.com#learn-more";
                    }
                }
            }).catch((error) => {});
        })
        .catch((error) => {setModal("Error", "Email or Password is Invalid")});
    }
}