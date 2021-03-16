
function onSignIn(googleUser) {

    }   
    
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
        document.cookie="usertoken="
    });
    }

function onSuccess(googleUser) {
    console.log("logining");
    var id_token = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    console.log(profile);
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    let req1 = new XMLHttpRequest()
    req1.open("POST", "http://4.tcp.ngrok.io:14630")
    
    req1.onload = function() {
        window.location.replace(req1.responseURL);
        //console.log('response: ' + req1.responseURL);
        
      }
    
    req1.send('idtoken=' + id_token);
    console.log("token sended");
    }
function onFailure(error) {
    console.log(error);
    }
function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
    }
  