var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        {title: 'Blue', duration: '4:26' },
        {title: 'Green', duration: '3:14' },
        {title: 'Red', duration: '5:01'},
        {title: 'Pink', duration: '3:21'},
        {title: 'Magenta', duration: '2:15'}
    ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        {title: 'Hello, Operator?', duration: '1:01' },
        {title: 'Ring, ring, ring', duration: '5:01' },
        {title: 'Fits in your pocket', duration: '3:21'},
        {title: 'Can you hear me now?', duration: '3:14'},
        {title: 'Wrong phone number', duration: '2:15'}
    ]
};

var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
    +   ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +   ' <td class="song-item-title">' + songName + '</td>'
    +   ' <td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>'
    ;
    
    return $(template);
};

var setCurrentAlbum = function(album) {
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
// Pause button templates
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    
    songListContainer.addEventListener('mouseover', function(event) {
        // Only target individual song rows during event delegation
        if (event.target.parentElement.className === 'album-view-song-item') {
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
            var songItem = getSongItem(event.target);

            // conditional statement changing the innerHTML of table cell when element does not belong to the currently playing song
            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
        }
    };
    })
    
    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
            // #1
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            
            // #2
            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
         });
        
        songRows[i].addEventListener('click', function(event) {
            clickHandler(event.target);
        });
    }
};

var findParentByClassName = function(element, parentClass) {
    //if element is present, then we'll do something. otherwise, we don't need to do anything at all.
    if (element) {
        var currentParent = element.parentElement
        
    while(currentParent.className !== parentClass && currentParent.className !== null){
        currentParent = currentParent.parentElement
    }
        return currentParent;
    }
    
}

var getSongItem = function (element) {
    switch (element.className){
        case "ion-pause":
        case "album-song-button":
        case "ion-play":
            return findParentByClassName(element, "song-item-number");
// returns the findParentByClassName function taking in the element and class name of song-item-number
        case "song-item-number":
            return element;
//if the item is the song item number, return the element itself because it is already what we are looking for.
        case "album-view-song-item":
            return element.querySelector('.song-item-number');
//for album view song item, use querySelector to search the entire element to find the song item number
        case "song-item-title":
        case "song-item-duration":
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
//use the findParentByClassName function to find the parent element then search the element with querySelector to find the song item number
        default:
            return;
//will return nothing and exit the function if none of the values match the element value in the parameter of the function
    }  
};

var clickHandler = function(targetElement) {
    
    var songItem = getSongItem(targetElement);
    
    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
    
};
