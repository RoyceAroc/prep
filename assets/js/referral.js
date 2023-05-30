var docData;

$(window).on('load', function () {
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
});

function generateReferral() {
    let email = $("#referralEmail").val();
    document.getElementById("generatedReferral").style.display = "block";
    document.getElementById("generatedReferral").innerHTML = `https://zebraprep.com?referral=${email}`;
}