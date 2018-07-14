$(()=>{

const num = $("#num");
const userKey = "c61eb3e89ac035974c4dbebfa783422e";
const contentType = "application/json";

let numOfGames = 0;
let data = null;
let userList = [];

      $.ajax({
          url: "https://cors-anywhere.herokuapp.com/https://api-endpoint.igdb.com/games/?fields=id,name,summary,cover.url,platforms,first_release_date,popularity&order=popularity:desc&limit=50",
          method: "GET",
          headers: {
            "user-key": userKey,
            Accept: contentType,
          },
          async: true,
          crossDomain: true,
      })
      .done((response)=>{
        data=response;

              /*---Append JSON result to the Searchbar/Dropdown---*/
              $.each(response, function(indexNum, object){
                $("#games-list").append( `<option value="${object.name}" id="${object.id}">${object.name}</option>` );
              });
        })
      .fail((err)=>alert("Unable to contact IGDB. Be sure to paste your API user key in the userKey variable at the top of the JS."));

  

  /*---On click give details for the selected item from the searchbar/dropdown---*/
    $("#searchButton").click(()=>{
      let name = $("#games-input").val();
      let object = data.filter(o => o.name===name)[0];
      printObject(object);
    });


function printObject(obj) {
      
      const id = obj.id;
      const title = obj.name;
      const year = obj.first_release_date == null?"Unknown": new Date(obj.first_release_date).getFullYear();
      const sum = obj.summary == null?"Summary is currently not available": obj.summary;
      const platforms = obj.platforms == null?"Platform information is currently not available": obj.platforms;

      const createImgEl = $(`<img src="${obj.cover.url}" alt="${title} cover">`);

      /*---Assemble the game item---*/
      const p = $(`<p><strong><h2>${title}</h2></strong><br>
        <strong>Year:</strong> ${year}<br>
        <strong>Platforms:</strong> ${platforms}<br>
        <strong>Summary:</strong> ${sum} </p>`);

      const newGame = $("<div class='details'><div class='img'></div><div class='info'></div><div class='close'><i class='fas fa-trash-alt'></i></div></div>");

      /*---Append the item to the DOM---*/
      $("#content").append(newGame);
      $(".info").last().append(p);
      $(".img").last().append(createImgEl);

      userList.push(id);

      /*---Increase and update cart number---*/
      ++numOfGames; 
      num.html(numOfGames);

      /*---Empty the Searchbar---*/
      $("#games-input").val("");
   
      /*---On click remove game from user list---*/
      $(".close").last().click(function(e){
           $(this).parent(".details").remove();
           numOfGames--;
           num.html(numOfGames);
      });


      //On click show and hide additional details
      $(".details").last().click(function(e) {
           $(this).toggleClass("full-height");
      });

}/*----END of function printObject()----*/

});