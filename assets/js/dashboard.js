var docData;
var paymentCheck;

$(window).on('load', function () {
    const email = getCookie("Email");
    if(email == undefined) {
        window.location.href = "/?error=login";
    } else {
        const param = new URLSearchParams(window.location.search);
        const payment = param.get("payment") || null;
        const month = param.get("month") || null;
        if(payment == "complete" && month == "june") {
            paymentCheck = true;
            db.collection("students").doc(email).set({
                payment: "june-complete"
            }, { merge: true })
            .then(() => {})
            .catch((error) => {});
        } 

        db.collection("students").doc(email).get().then((doc) => {
            docData = doc.data();
            let currentSection = docData.currentSection;
            $("#class-title").html(`SAT Math - Section ${currentSection}`);
            if(currentSection == 1) {
                $("#class-body").html(sectionOneInfo);
            } else if (currentSection == 2) {
                $("#class-body").html(sectionTwoInfo);
            } else if(currentSection == 3) {
                $("#class-body").html(sectionThreeInfo);
            }
        }).then(() => {
            try {
                let a = docData.payment;
                if(a == "june-complete" || paymentCheck == true) {
                    $("#payment").html(`<a class="btn" style="background-color: lightgreen; color:black;">Payment Complete</a>`);
                } else {
                    if(paymentCheck == true) {
                        $("#payment").html(`<a class="btn" style="background-color: lightgreen; color:black;">Payment Complete</a>`);
                    } else {
                        $("#payment").html(`<a id="payment-button" class="btn" style="background-color: tomato; color: white;">Payment Pending</a>`);
                    }
                }
            } catch(e) {
                $("#payment").html(`<a id="payment-button" class="btn" style="background-color: tomato; color: white;">Payment Pending</a>`);
            }

            $('#payment-button').click(function(e) {
                e.preventDefault(); 
                setModal("Payment Options",
                `
                <div style="text-align:center;">
                    <h3> Venmo</h5>
                    <p style="text-align: left;"><b>Payment status is updated manually within a day </b>after payment is complete</p> 
                    <a href="https://venmo.com/?txn=pay&audience=friends&recipients=Royce-Arockiasamy&amount=80" target="_blank" class="btn" style="background-color: lightgreen;margin-top:-12px;">Pay Using Venmo</a>
                    <hr>
                    <h3> PayPal </h5>
                    <p style="text-align: left;">Send $80 and select 'Friends and Family' (NOT 'Goods and Services'). <b>Payment status is updated manually within a day </b>after payment is complete</p>
                    <a href="https://paypal.me/roycebraden" target="_blank" class="btn" style="background-color: orange;margin-top:-12px;">Pay Using PayPal</a>
                </div>
                `);
            });
        }).catch((error) => {});

        $('#class-page').click(function(e) {
            e.preventDefault(); 
            setModal("Class Page", "Link to the Class Dashboard, Calendar, and Meeting Link will open up two days prior to class start.");
        });
    }

    $('#navbar-login').click(function(e) {
        e.preventDefault(); 
        eraseCookie("Email");
        window.location.href = "/";
    });

});