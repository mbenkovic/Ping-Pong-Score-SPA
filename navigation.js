// Wrap everything in an immediately invoked function expression,
// so no global variables are introduced.
(function () {
  checkstatus();
  document.getElementById("register_btn").addEventListener("click", () => {
    document.getElementById("register").style.display = "block";
    document.getElementById("reg_error").style.display = "none";

  });
  document.getElementById("close_reg").addEventListener("click", () => {
    document.getElementById("register").style.display = "none";

  });
  document.getElementById("login_btn").addEventListener("click", () => {
    document.getElementById("login").style.display = "block";

  });
  document.getElementById("close_login").addEventListener("click", () => {
    document.getElementById("login").style.display = "none";

  });

  // Register Form
  $('#register_form').submit(function (e) {
    $.ajax({
      type: "POST",
      url: "/ppsingle/ajax/actions.php",
      data: {
        'ime': $('#rfname').val(),
        'prezime': $('#rlname').val(),
        'email': $('#remail').val(),
        'password': $('#rpsw').val(),
        'action': 'register_user'
      },
      dataType: "json",
      success: function (data) {
        if(data['type'] == "failed") {
          document.getElementById("reg_error").innerHTML = data['msg'];
          document.getElementById("reg_error").style.display = "block";
        } else if (data['type'] == "success") {
          document.getElementById("reg_error").innerHTML = data['msg'];
          document.getElementById("reg_error").style.display = "block";
        }
      }
    });
    e.preventDefault();
  });

  // Login Form
  $('#login_form').submit(function (e) {
    $.ajax({
      type: "POST",
      url: "/ppsingle/ajax/actions.php",
      data: {
        'email': $('#lemail').val(),
        'password': $('#lpsw').val(),
        'action': 'login_user'
      },
      dataType: "json",
      success: function (data) {
        if(data['type'] == "failed") {
          document.getElementById("log_error").innerHTML = data['msg'];
          document.getElementById("log_error").style.display = "block";
        } else {
          document.getElementById("log_error").style.display = "none";
          document.getElementById("logged_as").innerHTML = data['msg'];
          document.getElementById("reglog").style.display = "none";
          document.getElementById("logged_in").style.display = "flex";
          document.getElementById("content").style.display = "block";
          document.getElementById("navbar").style.display = "block";
          sessionStorage.setItem('user_email', data['user']);
          sessionStorage.setItem('token', data['token']);
          sessionStorage.setItem('user', data['user_name']);
        }
      }
    });
    e.preventDefault();
  });

  $('#logout_btn').click(function(e) {
    $.ajax({
      type: "POST",
      url: "/ppsingle/ajax/actions.php",
      data: {
        'action': 'logout_user'
      },
      dataType: "json",
      success: function () {
        document.getElementById("reglog").style.display = "flex";
        document.getElementById("logged_in").style.display = "none";
        document.getElementById("content").style.display = "none";
        document.getElementById("navbar").style.display = "none";
        document.getElementById("login").style.display = "none";
        sessionStorage.clear();
      }
    });
    e.preventDefault();
  });

  $('#status').click(function() {
    checkstatus();
  });

  function checkstatus(){
    $.ajax({
      type: "POST",
      url: "/ppsingle/ajax/actions.php",
      data: {
        'action': 'check_status'
      },
      dataType: "json",
      success: function (data) {
        if (data['type'] === 'ACTIVE') {
          document.getElementById("log_error").style.display = "none";
          document.getElementById("logged_as").innerHTML = data['msg'];
          document.getElementById("reglog").style.display = "none";
          document.getElementById("logged_in").style.display = "flex";
          document.getElementById("content").style.display = "block";
          document.getElementById("navbar").style.display = "block";
          sessionStorage.setItem('user_email', data['user']);
          sessionStorage.setItem('token', data['token']);
          sessionStorage.setItem('user', data['user_name']);
        }
        console.log(data['type']);
      }
    });
  }

  // Stores the cached partial HTML pages.
  // Keys correspond to fragment identifiers.
  // Values are the text content of each loaded partial HTML file.
  var partialsCache = {}

  // Gets the appropriate content for the given fragment identifier.
  // This function implements a simple cache.
  function getContent(fragmentId, callback) {

    // If the page has been fetched before,
    if (partialsCache[fragmentId]) {

      // pass the previously fetched content to the callback.
      callback(partialsCache[fragmentId]);

    } else {
      // If the page has not been fetched before, fetch it.
      $.get("views/" + fragmentId + ".php", function (content) {

        // Store the fetched content in the cache.
        partialsCache[fragmentId] = content;

        // Pass the newly fetched content to the callback.
        callback(content);
      });
    }
  }

  // Sets the "active" class on the active navigation link.
  function setActiveLink(fragmentId) {
    $("#navbar a").each(function (i, linkElement) {
      var link = $(linkElement),
        pageName = link.attr("href").substr(1);
      if (pageName === fragmentId) {
        link.addClass("active");
      } else {
        link.removeClass("active");
      }
    });
  }

  // Updates dynamic content based on the fragment identifier.
  function navigate() {

    // Isolate the fragment identifier using substr.
    // This gets rid of the "#" character.
    var fragmentId = location.hash.substr(1);

    // Set the "content" div innerHTML based on the fragment identifier.
    getContent(fragmentId, function (content) {
      $("#content").html(content);
    });

    // Toggle the "active" class on the link currently navigated to.
    setActiveLink(fragmentId);
  }

  // If no fragment identifier is provided,
  if (!location.hash) {

    // default to #home.
    location.hash = "#home";
  }

  // Navigate once to the initial fragment identifier.
  navigate();

  // Navigate whenever the fragment identifier value changes.
  $(window).bind('hashchange', navigate);
}());