(function() {
  "use strict";

  // Cached DOM
  var container = document.querySelector(".gallery"),
    imgs = document.querySelectorAll("img"),
    textWrapper = document.querySelector(".highlight"),
    content = document.querySelector(".content"),
    defaultTitle = "Select your Ghostbuster!";

  // Methods
  function updateText(content) {
    textWrapper.innerHTML = content;
  }
  function requestContent(endpoint) {
    // $(".content").load(file + " .content");

    fetch("https://jsonplaceholder.typicode.com/comments/" + endpoint)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      })
      .then(function(data) {
        console.log(data);
        content.innerHTML = data.body;
      })
      .catch(function(error) {
        console.log("Error! Failed to fetch: ", error);
        content.innerHTML = error;
      });
  }
  function removeCurrentClass() {
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].classList.remove("current");
    }
  }
  function addCurrentClass(elem) {
    removeCurrentClass();
    var element = document.querySelector("." + elem);
    element.classList.add("current");
  }

  // Event Listeners
  container.addEventListener(
    "click",
    function(e) {
      if (e.target != e.currentTarget) {
        console.log(e.target); // <img src="..." class="peter" data-name="peter" />
        console.log(e.currentTarget); // <div class="gallery"></div>
        e.preventDefault();
        // e.target is the image inside the link we just clicked.

        var data = e.target.getAttribute("data-name"); // e.g. "peter"
        var url = data + ".php";
        addCurrentClass(data);

        history.pushState(data, null, url);
        updateText(data);

        var endpoint = e.target.getAttribute("data-fetch"); // e.g. "1"
        requestContent(endpoint);
        document.title = "Ghostbuster | " + data;
      }
      e.stopPropagation();
    },
    false
  );

  window.addEventListener("popstate", function(e) {
    var character = e.state;
    if (character == null) {
      removeCurrentClass();
      textWrapper.innerHTML = " ";
      content.innerHTML = " ";
      document.title = defaultTitle;
    } else {
      updateText(character);
      requestContent(character + ".php");
      addCurrentClass(character);
      document.title = "Ghostbuster | " + character;
    }
  });
})();
