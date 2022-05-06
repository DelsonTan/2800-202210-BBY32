function init() {
    console.info("Client script loaded.")

    function slideIn() {
      var elem = document.getElementById("box1");
      elem.style.transition = "top 0.5s ease-in 0s"
      elem.style.top = "0";
    }

    function DelayRedirect() {
      setTimeout(function () {
        dvCountDown.style.display = "none";
        window.location.replace("/");
      }, 1000);
    }

    function ajaxPOST(url, callback, data) {
        const params = typeof data == "string" ? data : Object
        .keys(data)
        .map({
            function (key) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
            }
        })
        .join('&');
        console.info("ajaxPOST params: ", params);

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (!this.readyState == XMLHttpRequest.DONE || this.status != 200) {
                console.warn(this.status);
            }
            callback(this.responseText, this.status);
        }
        xhr.open("POST", url);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    }

    // Event listener to make login request to server.
    document.querySelector("#login-submit").addEventListener("click", function(event) {
        event.preventDefault();
        const email = document.getElementById("login-email");
        const password = document.getElementById("login-password");
        const queryString = "email=" + email.value + "&password=" + password.value;

        ajaxPOST("/login", function (data, status) {
            console.log(data);
            if (data) {
                const responseJSON = JSON.parse(data);
                
                if (status != 200) {
                    document.getElementById("login-error-message").innerHTML = responseJSON.message;
                } else {
                    sessionStorage.setItem("userId", responseJSON.user.ID)
                    slideIn();
                    DelayRedirect();
                }
            }
        }, queryString);
    })
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        console.info("Document fully loaded.");
        init();
    }
}
