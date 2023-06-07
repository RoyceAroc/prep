$(window).on('load', function () {
    const email = getCookie("Email");
    if(email == undefined) {
        window.location.href = "/?error=login";
    } else {
        db.collection("feedback").doc(email).get().then((doc) => {
            docData = doc.data();
            if(docData == undefined) {
                $("#homework_feedback").html(`<p style="color: red;">Feedback will appear here once homework has been graded. You have not submitted any homework yet.</p>`);
            } else {
                const map = new Map(Object.entries(docData.feedback));
                let feedback = "";
                for (const [key, value] of map.entries()) {
                    feedback += `
                    <b>Homework ${key}</b>: ${value} <br><br>
                    `;
                    console.log(key, value);
                }
                $("#homework_feedback").html(feedback);
            }
        }).catch((error) => {});
    }

    $('#navbar-login').click(function(e) {
        e.preventDefault(); 
        eraseCookie("Email");
        window.location.href = "/";
    });

});