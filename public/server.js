(function () {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */

  var currentRowIndex = 1;

  var displayName = "RECEIPTIFY";
  var dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var today = new Date();
  function getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  function hiddenClone(element) {
    // Create clone of element
    var clone = element.cloneNode(true);

    // Position element relatively within the
    // body but still out of the viewport
    var style = clone.style;
    style.position = "relative";
    style.top = window.innerHeight + "px";
    style.left = 0;
    // Append clone to body and return the clone
    document.body.appendChild(clone);
    return clone;
  }
  var userProfileSource = document.getElementById(
      "user-profile-template"
    ).innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById("receipt");

  function downloadImg() {
    var offScreen = document.querySelector(".receiptContainer");
    window.scrollTo(0, 0);
    var clone = hiddenClone(offScreen);
    // Use clone with htm2canvas and delete clone
    html2canvas(clone, { scrollY: -window.scrollY }).then((canvas) => {
      var dataURL = canvas.toDataURL("image/png", 1.0);
      document.body.removeChild(clone);
      var link = document.createElement("a");
      console.log(dataURL);
      link.href = dataURL;
      link.download = `reciept.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // function retrieveTracks(timeRangeSlug, domNumber, domPeriod) {
  //   $.ajax({
  //     url: `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRangeSlug}`,
  //     headers: {
  //       Authorization: "Bearer " + access_token,
  //     },
  //     success: function (response) {
  //       let data = {
  //         trackList: response.items,
  //         total: 0,
  //         date: today.toLocaleDateString("en-US", dateOptions).toUpperCase(),
  //         json: true,
  //       };


  //       //print the object for manual use
  //       console.log(data.trackList)

  //       //for manual use we will send the data object to this function manually and run the below logic

  //       for (var i = 0; i < data.trackList.length; i++) {
  //         data.trackList[i].name = data.trackList[i].name.toUpperCase() + " - ";
  //         data.total += data.trackList[i].duration_ms;
  //         data.trackList[i].id = (i + 1 < 10 ? "0" : "") + (i + 1);
  //         let minutes = Math.floor(data.trackList[i].duration_ms / 60000);
  //         let seconds = (
  //           (data.trackList[i].duration_ms % 60000) /
  //           1000
  //         ).toFixed(0);
  //         data.trackList[i].duration_ms =
  //           minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  //         for (var j = 0; j < data.trackList[i].artists.length; j++) {
  //           data.trackList[i].artists[j].name =
  //             data.trackList[i].artists[j].name.trim();
  //           data.trackList[i].artists[j].name =
  //             data.trackList[i].artists[j].name.toUpperCase();
  //           if (j != data.trackList[i].artists.length - 1) {
  //             data.trackList[i].artists[j].name =
  //               data.trackList[i].artists[j].name + ", ";
  //           }
  //         }
  //       }
  //       minutes = Math.floor(data.total / 60000);
  //       seconds = ((data.total % 60000) / 1000).toFixed(0);
  //       data.total = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

  //       userProfilePlaceholder.innerHTML = userProfileTemplate({
  //         tracks: data.trackList,
  //         total: data.total,
  //         time: data.date,
  //         num: domNumber,
  //         name: displayName,
  //         period: domPeriod,
  //       });

  //       document
  //         .getElementById("download")
  //         .addEventListener("click", () => downloadImg(timeRangeSlug));
  //     },
  //   });
  // }

  //my manual retrieve function
  //use the spotify reciept handlebars file for example of the view
  function retrieveTracksManually(domNumber, domPeriod, manualInputData) {

    let data = {
      trackList: manualInputData,
      total: 0,
      date: today.toLocaleDateString("en-US", dateOptions).toUpperCase(),
      json: true,
      count: 0
    }

    console.log(data.trackList)

    for (var i = 0; i < data.trackList.length; i++) {
        data.count += 1;
        data.trackList[i].name = data.trackList[i].name.toUpperCase() + " - ";
        data.total += Number(data.trackList[i].duration_ms);
        data.trackList[i].id = (i + 1 < 10 ? "0" : "") + (i + 1);
        if(data.trackList[i].duration_ms < 10)
        {
          data.trackList[i].duration_ms = "0" + data.trackList[i].duration_ms + ":00";
        } else {
          data.trackList[i].duration_ms = data.trackList[i].duration_ms + ":00";
        }
        for (var j = 0; j < data.trackList[i].artists.length; j++) {
          data.trackList[i].artists[j].name =
            data.trackList[i].artists[j].name.trim();
          data.trackList[i].artists[j].name =
            data.trackList[i].artists[j].name.toUpperCase();
          if (j != data.trackList[i].artists.length - 1) {
            data.trackList[i].artists[j].name =
              data.trackList[i].artists[j].name + ", ";
          }
        }
      }
      
      
      if(data.total < 10)
      {
        data.total = "0" + data.total + ":00";
      } else {
        data.total = data.total + ":00";
      }

      if(data.count < 10)
      {
        data.count = "0" + data.count;
      }

      userProfilePlaceholder.innerHTML = userProfileTemplate({
        tracks: data.trackList,
        total: data.total,
        time: data.date,
        num: domNumber,
        name: displayName,
        period: domPeriod,
        count: data.count
      });

      document
        .getElementById("download")
        .addEventListener("click", () => downloadImg());
  }

  // function retrieveTracksApple(hist) {
  //   let data = {
  //     trackList: hist,
  //     total: 0,
  //     date: today.toLocaleDateString("en-US", dateOptions).toUpperCase(),
  //     json: true,
  //   };
  //   let albumInfoArr = [];
  //   for (var i = 0; i < data.trackList.length; i++) {
  //     const attributes = data.trackList[i].attributes;
  //     const isAlbum = data.trackList[i].type === "albums";
  //     console.log(data.trackList[i].type);
  //     const albumInfo = {
  //       id: (i + 1 < 10 ? "0" : "") + (i + 1),
  //       duration_ms: isAlbum ? attributes.trackCount : 1,
  //       name: isAlbum
  //         ? attributes.name.toUpperCase() + " - " + attributes.artistName
  //         : attributes.name.toUpperCase(),
  //     };
  //     console.log(albumInfo);
  //     albumInfoArr.push(albumInfo);
  //     data.total += albumInfo.duration_ms;
  //   }
  //   userProfilePlaceholder.innerHTML = userProfileTemplate({
  //     tracks: albumInfoArr,
  //     total: data.total,
  //     time: data.date,
  //     num: 1,
  //     name: displayName,
  //     period: "HEAVY ROTATION",
  //   });
  //   document
  //     .getElementById("download")
  //     .addEventListener("click", () => downloadImg("heavy_rotation"));
  // }

  let params = getHashParams();

  let access_token = params.access_token,
    dev_token = params.dev_token,
    client = params.client,
    error = params.error;

  if (error) {
    alert("There was an error during the authentication");
  } else {
    if (client === "spotify" && access_token) {
      $.ajax({
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: "Bearer " + access_token,
        },
        success: function (response) {
          displayName = response.display_name.toUpperCase();
          $("#login").hide();
          $("#loggedin").show();
        },
      });
    } else if (client === "applemusic" && dev_token) {
      // console.log("token", dev_token);

      const setupMusicKit = new Promise((resolve) => {
        document.addEventListener("musickitloaded", () => {
          const musicKitInstance = window.MusicKit.configure({
            developerToken: dev_token,
            app: {
              name: "receiptify",
              build: "1.0.0",
            },
          });
          delete window.MusicKit; // clear global scope
          resolve(musicKitInstance);
        });
      });
      $("#loggedin").hide();
      setupMusicKit.then(async (musicKit) => {
        try {
          await musicKit.authorize().then(async (token) => {
            try {
              const hist = musicKit.api.recentPlayed().then((hist) => {
                $("#options").hide();
                $("#login").hide();
                $("#loggedin").show();
                retrieveTracksApple(hist);
                console.log(hist);
              });
            } catch (error) {
              alert(
                "Your listening history isn't sufficient enough to generate your top tracks. Please try again."
              );
            }
          });
        } catch (error) {
          alert("Authorization Failed");
        }
      });
    } else {
      // render initial screen
      $("#login").show();
      $("#loggedin").hide();
    }

    // document.getElementById("short_term").addEventListener(
    //   "click",
    //   function () {
    //     retrieveTracks("short_term", 1, "LAST MONTH");
    //   },
    //   false
    // );

    document.getElementById("manual-input-button").addEventListener(
      "click",
      function() {
        currentRowIndex += 1;
        $("#manual-input-rows").append(`<div class='row manual-input-row' id='manualRow${currentRowIndex}' + manualRowId><div class='col-lg-4'><input class='form-control manual-input-artist' type='text'/></div><div class='col-lg-4'><input class='form-control manual-input-duration' type='number'/></div><div class='col-lg-4'><input class='form-control manual-input-name' type='text'/></div></div>`);
      },
      false
    )

    document.getElementById("remove-input-button").addEventListener(
      "click",
      () => {
        let manualInputRows = document.getElementsByClassName("manual-input-row");
        let lastElement = manualInputRows[manualInputRows.length - 1];
        lastElement.remove()
      },
      false
    )

    //manual input trigger
    document.getElementById("manual").addEventListener(
      "click",
      function () {

        // manual data, create this from the inputs rows/fields. Read these fields and create object 
        // let manualInputData = [
        //   {
        //     "artists": [
        //         {
        //             "name": "artist name",
        //         }
        //     ],
        //     "duration_ms": 3,
        //     "name": "name",
        //   },
        // ]

        let manualInputData = []

        let manualInputRows = document.getElementsByClassName("manual-input-row");
        
        for(var i = 0; i < manualInputRows.length; i++)
        {
          var rowArtist = manualInputRows[i].getElementsByClassName("manual-input-artist")[0].value;
          var rowDuration = manualInputRows[i].getElementsByClassName("manual-input-duration")[0].value;
          var rowName = manualInputRows[i].getElementsByClassName("manual-input-name")[0].value;
          

          let trackObj = {
            artists: [
              {
                name: rowArtist
              }
            ],
            duration_ms: rowDuration,
            name: rowName
          }

          manualInputData.push(trackObj)
        }

        retrieveTracksManually(1, "LAST MONTH", manualInputData);
      },
      false
    );
  }
})();
