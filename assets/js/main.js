$(window).on('load', function () {
    const param = new URLSearchParams(window.location.search);
    const error = param.get("error") || null;
    const referral = param.get("referral") || null;

    if(error != null) {
        webLogin();
    }

    if(referral != null) {
        setCookie("Referral", referral, 365);
    }

    const email = getCookie("Email");
    if(email == undefined) {
        $('#navbar-login').click(function(e) {
            e.preventDefault(); 
            webLogin();
        });
    } else {
        $('#navbar-login').click(function(e) {
            e.preventDefault(); 
            window.location.href = "dashboard.html";
        });
    }

    $('#section-1-info').click(function(e) {
        e.preventDefault(); 
        setModal("SAT Math (Section 1)", sectionOneInfo);
    });

    $('#section-2-info').click(function(e) {
        e.preventDefault(); 
        setModal("SAT Math (Section 2)", sectionTwoInfo);
    });

    $('#section-3-info').click(function(e) {
        e.preventDefault(); 
        setModal("SAT Math (Section 3)", sectionThreeInfo);
    });

    $('#section-1-registration').click(function(e) {
        e.preventDefault(); 
        register(1);
    });

    $('#section-2-registration').click(function(e) {
        e.preventDefault(); 
        register(2);
    });
});

function register(section) {
    const registrationModalBody = `
    <div class="col-12">
    <div style="text-align: center;">
            <button class="btn btn-lg px-4 me-sm-3" onclick="googleAuth(${section})" style="background-color:lightblue">Sign Up With Google</button><br>
            <h3 style="font-family: Luckiest Guy, cursive; color: black; font-size: 35px; margin-top:3px;margin-bottom:-4px;">OR</h3>
        </div>
        <div class="mb-3">
            <label class="form-label lead">First Name</label>
            <input id="registerFirstName" type="text" class="form-control" placeholder="First Name">
        </div>
        <div class="mb-3">
            <label class="form-label lead">Last Name</label>
            <input id="registerLastName" type="text" class="form-control" placeholder="Last Name">
        </div>
        <div class="mb-3">
            <label class="form-label lead">Login Email</label>
            <input id="registerEmail" type="email" class="form-control" placeholder="Email Address">
        </div>
        <div class="mb-3">
            <label class="form-label lead">Login Password</label>
            <input id="registerPassword" type="password" class="form-control" placeholder="Password">
        </div>
        <div style="text-align: center;">
            <button onclick="registerEmailPwd(${section})" class="btn btn-lg px-4 me-sm-3" style="background-color:lightpink">Sign Up</button>
        </div>
    </div>  
    `;
    setModal("Registration (New Student)", registrationModalBody);
}

function googleAuth(section) {
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        let referral = "none";
        if(getCookie("Referral") != null) {
            referral = getCookie("Referral");
        }
        db.collection("students").doc(user.email).get().then((doc) => {
            if(doc.data() == undefined) {
                db.collection("students").doc(user.email).set({
                    currentSection: section,
                    name: user.displayName,
                    referral: referral
                })  .then((docRef) => {
                    setCookie("Email", user.email, 365);
                    window.location.href = "dashboard.html";
                }) .catch((error) => {});
            } else {
                setModal("Error: Student already exists", "Please Login to the Dashboard");
            }
        }).catch((error) => {});
    }).catch(function(error) {});  
}

function registerEmailPwd(section) {
    const firstName = $("#registerFirstName").val();
    const lastName = $("#registerLastName").val();
    const email = $("#registerEmail").val();
    const password = $("#registerPassword").val();
    if((firstName == "" || lastName == "") || (email == "" || password == "")) {
        setModal("Error: Missing Field", "Please Complete the Missing Field");
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            db.collection("students").doc(email).get().then((doc) => {
                if(doc.data() == undefined) {
                    let referral = "none";
                    if(getCookie("Referral") != null) {
                        referral = getCookie("Referral");
                    }

                    db.collection("students").doc(email).set({
                        currentSection: section,
                        name: firstName + " " + lastName,
                        referral: referral
                    })  .then((docRef) => {
                        setCookie("Email", email, 365);
                        window.location.href = "dashboard.html";
                    }) .catch((error) => {});
                } else {
                    setModal("Error: Student already exists", "Please Login to the Dashboard")
                }
            }).catch((error) => {console.log(error)});
        })
        .catch((error) => {
            if(error.code == "auth/email-already-in-use") {
                setModal("Error: Student already exists", "Please Login to the Dashboard");
            } else if(error.code == "auth/weak-password") {
                setModal("Error: Weak Password", "Enter a password of atleast 6 characters");
            }
        });
    }
}
