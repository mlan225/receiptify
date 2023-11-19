(function () {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */

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

  function downloadImg(fileName) {
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
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  function retrieveTracks(timeRangeSlug, domNumber, domPeriod) {
    $.ajax({
      url: `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRangeSlug}`,
      headers: {
        Authorization: "Bearer " + access_token,
      },
      success: function (response) {
        let data = {
          trackList: response.items,
          total: 0,
          date: today.toLocaleDateString("en-US", dateOptions).toUpperCase(),
          json: true,
        };


        //print the object for manual use
        console.log(data.trackList)

        //for manual use we will send the data object to this function manually and run the below logic

        for (var i = 0; i < data.trackList.length; i++) {
          data.trackList[i].name = data.trackList[i].name.toUpperCase() + " - ";
          data.total += data.trackList[i].duration_ms;
          data.trackList[i].id = (i + 1 < 10 ? "0" : "") + (i + 1);
          let minutes = Math.floor(data.trackList[i].duration_ms / 60000);
          let seconds = (
            (data.trackList[i].duration_ms % 60000) /
            1000
          ).toFixed(0);
          data.trackList[i].duration_ms =
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
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
        minutes = Math.floor(data.total / 60000);
        seconds = ((data.total % 60000) / 1000).toFixed(0);
        data.total = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

        userProfilePlaceholder.innerHTML = userProfileTemplate({
          tracks: data.trackList,
          total: data.total,
          time: data.date,
          num: domNumber,
          name: displayName,
          period: domPeriod,
        });

        document
          .getElementById("download")
          .addEventListener("click", () => downloadImg(timeRangeSlug));
      },
    });
  }

  //my manual retrieve function
  //use the spotify reciept handlebars file for example of the view
  function retrieveTracksManually(domNumber, domPeriod) {

    // manual data
    trackListObject = [
      {
        "album": {
            "album_type": "ALBUM",
            "artists": [
                {
                    "external_urls": {
                        "spotify": "https://open.spotify.com/artist/2n2RSaZqBuUUukhbLlpnE6"
                    },
                    "href": "https://api.spotify.com/v1/artists/2n2RSaZqBuUUukhbLlpnE6",
                    "id": "2n2RSaZqBuUUukhbLlpnE6",
                    "name": "Sleep Token",
                    "type": "artist",
                    "uri": "spotify:artist:2n2RSaZqBuUUukhbLlpnE6"
                }
            ],
            "external_urls": {
                "spotify": "https://open.spotify.com/album/1gjugH97doz3HktiEjx2vY"
            },
            "href": "https://api.spotify.com/v1/albums/1gjugH97doz3HktiEjx2vY",
            "id": "1gjugH97doz3HktiEjx2vY",
            "images": [
                {
                    "height": 640,
                    "url": "https://i.scdn.co/image/ab67616d0000b2730b73608b678f169d3c8f35f0",
                    "width": 640
                },
                {
                    "height": 300,
                    "url": "https://i.scdn.co/image/ab67616d00001e020b73608b678f169d3c8f35f0",
                    "width": 300
                },
                {
                    "height": 64,
                    "url": "https://i.scdn.co/image/ab67616d000048510b73608b678f169d3c8f35f0",
                    "width": 64
                }
            ],
            "name": "Take Me Back To Eden",
            "release_date": "2023-05-19",
            "release_date_precision": "day",
            "total_tracks": 12,
            "type": "album",
            "uri": "spotify:album:1gjugH97doz3HktiEjx2vY"
        },
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/2n2RSaZqBuUUukhbLlpnE6"
                },
                "href": "https://api.spotify.com/v1/artists/2n2RSaZqBuUUukhbLlpnE6",
                "id": "2n2RSaZqBuUUukhbLlpnE6",
                "name": "Test thing here",
                "type": "artist",
                "uri": "spotify:artist:2n2RSaZqBuUUukhbLlpnE6"
            }
        ],
        "disc_number": 1,
        "duration_ms": "6:36",
        "explicit": false,
        "external_ids": {
            "isrc": "GBUM72200352"
        },
        "external_urls": {
            "spotify": "https://open.spotify.com/track/0S38Oso3I9vpDXcTb7kYt9"
        },
        "href": "https://api.spotify.com/v1/tracks/0S38Oso3I9vpDXcTb7kYt9",
        "id": "01",
        "is_local": false,
        "name": "Test thing here ",
        "popularity": 76,
        "preview_url": "https://p.scdn.co/mp3-preview/37dae98703ecc268384d30ed33045254aa4198c9?cid=338c7a7322084e92863f1aa8135d5d0b",
        "track_number": 2,
        "type": "track",
        "uri": "spotify:track:0S38Oso3I9vpDXcTb7kYt9"
      }
    ]

    let data = {
      trackList: trackListObject,
      total: 0,
      date: today.toLocaleDateString("en-US", dateOptions).toUpperCase(),
      json: true,
    }

    console.log(data.trackList)

    for (var i = 0; i < data.trackList.length; i++) {
        data.trackList[i].name = data.trackList[i].name.toUpperCase() + " - ";
        data.total += data.trackList[i].duration_ms;
        data.trackList[i].id = (i + 1 < 10 ? "0" : "") + (i + 1);
        let minutes = Math.floor(data.trackList[i].duration_ms / 60000);
        let seconds = (
          (data.trackList[i].duration_ms % 60000) /
          1000
        ).toFixed(0);
        data.trackList[i].duration_ms =
          minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
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

      minutes = Math.floor(data.total / 60000);
      seconds = ((data.total % 60000) / 1000).toFixed(0);
      data.total = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

      userProfilePlaceholder.innerHTML = userProfileTemplate({
        tracks: data.trackList,
        total: data.total,
        time: data.date,
        num: domNumber,
        name: displayName,
        period: domPeriod,
      });

      document
        .getElementById("download")
        .addEventListener("click", () => downloadImg(timeRangeSlug));
  }

  function retrieveTracksApple(hist) {
    let data = {
      trackList: hist,
      total: 0,
      date: today.toLocaleDateString("en-US", dateOptions).toUpperCase(),
      json: true,
    };
    let albumInfoArr = [];
    for (var i = 0; i < data.trackList.length; i++) {
      const attributes = data.trackList[i].attributes;
      const isAlbum = data.trackList[i].type === "albums";
      console.log(data.trackList[i].type);
      const albumInfo = {
        id: (i + 1 < 10 ? "0" : "") + (i + 1),
        duration_ms: isAlbum ? attributes.trackCount : 1,
        name: isAlbum
          ? attributes.name.toUpperCase() + " - " + attributes.artistName
          : attributes.name.toUpperCase(),
      };
      console.log(albumInfo);
      albumInfoArr.push(albumInfo);
      data.total += albumInfo.duration_ms;
    }
    userProfilePlaceholder.innerHTML = userProfileTemplate({
      tracks: albumInfoArr,
      total: data.total,
      time: data.date,
      num: 1,
      name: displayName,
      period: "HEAVY ROTATION",
    });
    document
      .getElementById("download")
      .addEventListener("click", () => downloadImg("heavy_rotation"));
  }

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

    document.getElementById("short_term").addEventListener(
      "click",
      function () {
        retrieveTracks("short_term", 1, "LAST MONTH");
      },
      false
    );

    //manual input trigger
    document.getElementById("manual").addEventListener(
      "click",
      function () {
        retrieveTracksManually(1, "LAST MONTH");
      },
      false
    );
  }
})();
