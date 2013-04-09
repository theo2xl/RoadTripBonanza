var directory = "";
var passTheMicOnOff = false;

function onFileSytemSuccess(fileSystem) 
{
    // Get the data directory, creating it if it doesn't exist.
    fileSystem.root.getDirectory("",{create:true},onDirectory,onError);
    // Create the lock file, if and only if it doesn't exist.	
    fileSystem.root.getFile("blue.wav", {create: true, exclusive: false}, onFileEntry, onError);  
    fileSystem.root.getFile("green.wav", {create: true, exclusive: false}, onFileEntry, onError);  
    fileSystem.root.getFile("lightblue.wav", {create: true, exclusive: false}, onFileEntry, onError);  
    fileSystem.root.getFile("orange.wav", {create: true, exclusive: false}, onFileEntry, onError);  
    fileSystem.root.getFile("purple.wav", {create: true, exclusive: false}, onFileEntry, onError);  
    fileSystem.root.getFile("red.wav", {create: true, exclusive: false}, onFileEntry, onError);      
}

function onDirectory(d) 
{
    console.log("onDirectory()");
    directory = d;
    var reader = d.createReader();
    reader.readEntries(onDirectoryRead,onError);
}

// Helpful if you want to see if a recording exists 
function onDirectoryRead(entries) 
{
    console.log("The dir has "+entries.length+" entries.");
}

function onError(error) 
{
    console.log('onError(): '    + error.code    + '\n' + 
          'message: ' + error.message + '\n');
}   

function onFileEntry(fileEntry) 
{
    console.log("onFileEntry()");
}

function loadGames()
{
    clearLocalStorage();
    getCategoryData(); 
    getScoutData();    
    getActData();
}

//does not reset players
function playAgainReset()
{
    // Reset the winner color so it doesn't show incorrectly on the next winner
    var winner = whoWon();
    if( winner != null)
    {
        $('#color-winner').toggleClass(winner.icon);
    }
    
    //before you reset the player data you have to reset the points
    var playerData = localStorage.getItem("players");
    var parsedPlayerData = JSON.parse(playerData);
    
    for (var i = 0; i < parsedPlayerData.length; i++) 
    {
        localStorage.setItem(parsedPlayerData[i].icon+"-points",null);
    }
    
    localStorage.setItem("current-game",null);
    localStorage.setItem("currentScoutId",null);
    localStorage.setItem("currentCatId",null);    
    localStorage.setItem("currentActId",null);
    
    $.mobile.changePage( $("#categories") );
}

function resetGame()
{
    // Reset the winner color so it doesn't show incorrectly on the next winner
    var winner = whoWon();
    $('#color-winner').toggleClass(winner.icon);
    
    //before you reset the player data you have to reset the points
    var playerData = localStorage.getItem("players");
    var parsedPlayerData = JSON.parse(playerData);
    
    for (var i = 0; i < parsedPlayerData.length; i++) 
    {
        localStorage.setItem(parsedPlayerData[i].icon+"-points",null);
    }
    
    localStorage.setItem("players",null);
    localStorage.setItem("current-game",null);
    localStorage.setItem("currentScoutId",null);
    localStorage.setItem("currentCatId",null);    
    localStorage.setItem("currentActId",null);
    $('#player-sequence-number').html("Player 1");
    //$('#name-txt').val("");
    
    $('#blue').show();
    $('#green').show();
    $('#lightblue').show();
    $('#orange').show();
    $('#purple').show();
    $('#red').show();

    $.mobile.changePage( $("#home") );    
}

function clearLocalStorage()
{
    localStorage.clear();
}

function saveSelectedGame( gameName )
{
    localStorage.setItem("current-game", gameName);
}

function keepScore(color)
{
    var gameName = localStorage.getItem("current-game");
    var playerPoints = localStorage.getItem(color+ "-points");
    
    if( playerPoints == null || isNaN(playerPoints))
        playerPoints =  Number(0);
    
    if( gameName == "scout" || gameName == "act")
    {
        playerPoints =  Number(playerPoints) + 1;
    }
    else if( gameName == "cat")
        playerPoints =  Number(playerPoints) - 1;
    
    localStorage.setItem(color+"-points",playerPoints);
    var gameName = localStorage.getItem("current-game");
    if( gameName == "scout" )
    {
        $.mobile.changePage( $("#rs-pop-up") );
    }
    else 
    {
        if( gameName == "cat")
            $.mobile.changePage( $("#categories-game") );
        else if( gameName == "act")
        {
            showReveal();
            $.mobile.changePage( $("#act-the-part") );            
        }
        
        if(passTheMicOnOff)
            playRandomName();
    }
}

function setColorSelector()
{
    var htmlColor = "";
    var playerData = localStorage.getItem("players");
    var parsedPlayerData = JSON.parse(playerData);

    for (var i = 0; i < parsedPlayerData.length; i++) {
        htmlColor += '<a href="javascript:keepScore(\'' + parsedPlayerData[i].icon + '\')"><img class="flag" src="images/icons/color-small-' + parsedPlayerData[i].icon + '.png" alt="" /></a>';
    }
    $('#select-a-color').html(htmlColor);
    $('#messed-up-color').html(htmlColor);   
    $('#guessed-it-color').html(htmlColor);
}

function getGameItem()
{
    alert("getGameItem!");
    // since this starts the game set the score
    setColorSelector();
    
    var gameName = localStorage.getItem("current-game");

    if( gameName == "scout" )
    {
        var parsedGameData = JSON.parse(localStorage.getItem("scout"));
        var scoutElementList =parsedGameData.scavenge.items;
        var currentScoutId = localStorage.getItem("currentScoutId");
        
        if(currentScoutId == null || currentScoutId == "null")
            currentScoutId = "1";
        
        for (var i = 0; i < scoutElementList.length; i++) 
        {
            if( currentScoutId == scoutElementList.length+1)
            {
                var winner = whoWon();
                if( winner != null)
                {
                    //$('#winner-name-txt').html(winner.name);
                    $('#color-winner').toggleClass(winner.icon);
                    $.mobile.changePage( $("#the-end") );
                    break;
                }
                else
                {
                    // when no one wins what do I do?
                    //$('#winner-name-txt').html("Everyone!!");
                    $.mobile.changePage( $("#the-end") );
                    break;                    
                }
            }
            if( currentScoutId == scoutElementList[i].id)
            {
                if(passTheMicOnOff)
                    playRandomName();
                //set the next id for the next item to find.
                var nextItem = scoutElementList[i].id;
                nextItem = Number(nextItem) +1;
                localStorage.setItem("currentScoutId", nextItem);
                $('#scout-element').html(scoutElementList[i].value);
                $('#foundit-name').html(scoutElementList[i].value);
                $('#fun-fact').html(scoutElementList[i].fact);
                $('#scoutAudioLink').html(scoutElementList[i].audio);
                $.mobile.changePage( $("#road-scout"));
                break;
            }
        }
    }
    else if( gameName == "cat")
    {
        var parsedGameData = JSON.parse(localStorage.getItem("cat"));
        var catElementList =parsedGameData.categories.items;
        var currentCatId = localStorage.getItem("currentCatId");
        
        if(currentCatId == null || currentCatId == "null")
            currentCatId = "1";
        
        for (var i = 0; i < catElementList.length; i++) 
        {
            if( currentCatId == catElementList.length+1)
            {
                var winner = whoWon();
                if( winner != null)
                {
                    //$('#winner-name-txt').html(winner.name);
                    $('#color-winner').toggleClass(winner.icon);
                    $.mobile.changePage( $("#the-end") );
                    break;
                }
                else
                {
                    // when no one wins what do I do?
                    //$('#winner-name-txt').html("Everyone!!");
                    $.mobile.changePage( $("#the-end") );
                    break;
                }
            }
            if( currentCatId == catElementList[i].id)
            {                
                if(passTheMicOnOff)                
                    playRandomName();
                //set the next id for the next item to find.
                var nextItem = catElementList[i].id;
                nextItem = Number(nextItem) +1;
                localStorage.setItem("currentCatId", nextItem);
                $('#categories-game-txt').html(catElementList[i].value);
                $('#categories-messed-up-txt').html(catElementList[i].value);
                $.mobile.changePage( $("#categories-game") );
                break;
            }
        }
    }
    else if( gameName == "act")
    {
        var parsedGameData = JSON.parse(localStorage.getItem("act"));
        var actElementList =parsedGameData.act.items;
        var currentActId = localStorage.getItem("currentActId");
        
        if(currentActId == null || currentActId == "null")
            currentActId = "1";
        
        
        for (var i = 0; i < actElementList.length; i++) 
        {
            if( currentActId == actElementList.length+1)
            {
                var winner = whoWon();
                if( winner != null)
                {
                    //$('#winner-name-txt').html(winner.name);
                    $('#color-winner').toggleClass(winner.icon);
                    $.mobile.changePage( $("#the-end") );
                    break;
                }
                else
                {
                    // when no one wins what do I do?
                    //$('#winner-name-txt').html("Everyone!!");
                    $.mobile.changePage( $("#the-end") );
                    break;
                }
            }
            if( currentActId == actElementList[i].id)
            {
                if(passTheMicOnOff)
                    playRandomName();
                //set the next id for the next item to find.
                var nextItem = actElementList[i].id;
                nextItem = Number(nextItem) +1;
                localStorage.setItem("currentActId", nextItem);
                $('#act-the-part-txt').html(actElementList[i].value);
                $('#guessed-it-txt').html(actElementList[i].value);
                $.mobile.changePage( $("#act-the-part") );
                break;
            }
        }
        
        // showReveal
        showReveal();
    }    
}

// hideReveal
function hideReveal() {
    $("#tap-to-reveal").hide();
    $("#act-the-part-txt").show("slow");
}

// showReveal
function showReveal() {
    $("#tap-to-reveal").show();
    $("#act-the-part-txt").hide();
}

function whoWon()
{
    var playerData = localStorage.getItem("players");
    var parsedPlayerData = JSON.parse(playerData);
    var arrayToBeSorted = [];
    
    for (var i = 0; i < parsedPlayerData.length; i++) 
    {
        var point = localStorage.getItem(parsedPlayerData[i].icon + "-points");
        if( point != null)
            arrayToBeSorted.push(Number(point));
    }
    
    if( arrayToBeSorted.length > 0)
    {
        arrayToBeSorted.sort();
        arrayToBeSorted.reverse();
    
        if( arrayToBeSorted != null)
        {
            for (var i = 0; i < parsedPlayerData.length; i++) 
            {
                var point = localStorage.getItem(parsedPlayerData[i].icon + "-points");
                if(point == arrayToBeSorted[0])
                {
                    var winner = {};
                    winner.icon = parsedPlayerData[i].icon;
                    winner.name = parsedPlayerData[i].name;
                    return winner;
                }
            }
        }
    }
    else
    {
        //no points collected no winner;
        return null;
    }
}

function addPlayer()
{
    var playerData = localStorage.getItem("players");
    var parsedPlayerData = JSON.parse(playerData);
    var players = [];
    
    if( parsedPlayerData != null)
        players = parsedPlayerData;

    var playerData = {};
    //playerData.name = $('#name-txt').val();
    playerData.icon = $('#result').html();

    var htmlNameString = playerData.name;
    var htmlIconString = playerData.icon;
    
    players.push(playerData);
        
    localStorage.setItem("players", JSON.stringify(players));
        
    //$('#player-name-txt').html(htmlNameString);
    $('#color-txt').html(htmlIconString);
    $('#color-txt').toggleClass(htmlIconString);
    $('#color-block').toggleClass(htmlIconString);
    
    // Remove the color selected
    var iconListVar = htmlIconString;
    $("#" + iconListVar).toggleClass(htmlIconString);
    $(".dropdown dt a span").html("Please select your color");
    $(".dropdown dd ul").hide();
    
    // Display the current players below the select box
    var currentPlayers = $('#current-players').html();
    currentPlayers += '<img class="flag" src="images/icons/color-small-' + htmlIconString + '.png" alt="" />';
    $('#current-players').html(currentPlayers);
}

function addAnotherPlayer()
{
    var playerData = localStorage.getItem("players");
    var parsedPlayerData = JSON.parse(playerData);
    var playerCount = parsedPlayerData.length + 1;
    $('#player-sequence-number').html("Player " + playerCount);
    //$('#name-txt').val("");
    hideGo();
}

function showGo()
{
    $('#go-record').show();
    $('#start-record-message').hide();    
}

function hideGo()
{
    $('#go-record').hide();
    $('#start-record-message').show();    
}

function getCategoryData()
{
	$.getJSON('http://bdwcontent.appspot.com/cat.html', 
			  function(data) 
			  {
                  localStorage.setItem("cat", JSON.stringify(data));
			  });		
}

function getScoutData()
{
	$.getJSON('http://bdwcontent.appspot.com/sca.html', 
			  function(data) 
			  {
                  localStorage.setItem("scout", JSON.stringify(data));
			  });		
}

function getActData()
{
	$.getJSON('http://bdwcontent.appspot.com/act.html', 
			  function(data) 
			  {
                  localStorage.setItem("act", JSON.stringify(data));
			  });		
}

var mediaRec = null;
var isRecording = false;

function recordAudio() 
{
    if(isRecording)
        stopAudio();
    else
    {        
        //alert('start recording');
    
        var playerColor = $('#result').html();

        // Start recording in 3 sec
        //var recInterval = setInterval(function() {
                                  toggleRecordButton('record-enabled recording');
                                  isRecording = true;
        //                          clearInterval(recInterval);
          //                      }, 500);

        var src = directory.fullPath +"/" + playerColor + ".wav";
        mediaRec = new Media(src, onAudioSuccess, onAudioError);

        // Record audio
        PGLowLatencyAudio.play('beep');
        mediaRec.startRecord();
    }
}

function stopAudio()
{
    if(isRecording)
    {
        //alert('stop recording');
        PGLowLatencyAudio.play('boop');
        mediaRec.stopRecord();
        toggleRecordButton('record-enabled recording');
        isRecording = false;
    }
}

function onAudioSuccess() {
    console.log("recordAudio():Audio Success");
}

// onError Callback 
function onAudioError(error) {
    console.log('code: '    + error.code    + '\n' + 
          'message: ' + error.message + '\n');
}

function playAudio() 
{
    var playerColor = $('#result').html();
    
    var src = directory.fullPath + "/" + playerColor + ".wav";

    var my_media = null;

    if (my_media == null) 
    {
        // Create Media object from src
        my_media = new Media(src, onPlaybackSuccess, onPlaybackError);
    } 
    // Play audio
    my_media.play();
}

// onSuccess Callback
//
function onPlaybackSuccess() {
    console.log("playAudio():Audio Success");
}

function onPassTheMicPlaybackSuccess()
{
    var playerData = localStorage.getItem("players");
    var parsedPlayerData = JSON.parse(playerData);
    
    //get index from 0 to length of players
    var randomPlayer = Math.floor(Math.random()*parsedPlayerData.length);
    
    var src = directory.fullPath + "/" + parsedPlayerData[randomPlayer].icon + ".wav";
    
    var my_media = null;
    
    if (my_media == null) 
    {
        // Create Media object from src
        my_media = new Media(src, onPlaybackSuccess, onPlaybackError);
    } 
    
    // Play audio
    my_media.play();
    
}
// onError Callback 
//
function onPlaybackError(error) {
    console.log('code: '    + error.code    + '\n' + 
          'message: ' + error.message + '\n');
}

function playRandomName()
{   
    var passIt = "sounds/" + "passthemic.wav";
    
    var my_media_pass = null;
    
    if (my_media_pass == null) 
    {
        // Create Media object from src
        my_media_pass = new Media(passIt, onPassTheMicPlaybackSuccess, onPlaybackError);
    } 
    
    my_media_pass.play();
}

// Enable/Disable the record button
function toggleRecordButton(classNames)
{
    $('#record-btn').toggleClass(classNames);
}

function streamAudio() 
{
    var src = $('#scoutAudioLink').html();
    var my_media = null;
    
    if (my_media == null) 
    {
        // Create Media object from src
        my_media = new Media(src, onPlaybackSuccess, onPlaybackError);
    } 
    // Play audio
    my_media.play();
}