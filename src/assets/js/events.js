import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js';
import helpers from './helpers.js';

window.addEventListener( 'load', () => {

    const firebaseConfig = {
        apiKey: "AIzaSyD8Znx45accgfmJuvi_pe9SKo7OoQ7JtE0",
        authDomain: "online-meeting-73126.firebaseapp.com",
        projectId: "online-meeting-73126",
        storageBucket: "online-meeting-73126.appspot.com",
        messagingSenderId: "674919510574",
        appId: "1:674919510574:web:9c86c58ca200a726c565bf",
        measurementId: "G-QE5MSJFKTL"
      };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    const db = getFirestore();

    //When the chat icon is clicked
    document.querySelector( '#toggle-chat-pane' ).addEventListener( 'click', ( e ) => {
        let chatElem = document.querySelector( '#chat-pane' );
        let mainSecElem = document.querySelector( '#main-section' );

        if ( chatElem.classList.contains( 'chat-opened' ) ) {
            chatElem.setAttribute( 'hidden', true );
            mainSecElem.classList.remove( 'col-md-9' );
            mainSecElem.classList.add( 'col-md-12' );
            chatElem.classList.remove( 'chat-opened' );
        }

        else {
            chatElem.attributes.removeNamedItem( 'hidden' );
            mainSecElem.classList.remove( 'col-md-12' );
            mainSecElem.classList.add( 'col-md-9' );
            chatElem.classList.add( 'chat-opened' );
        }

        //remove the 'New' badge on chat icon (if any) once chat is opened.
        setTimeout( () => {
            if ( document.querySelector( '#chat-pane' ).classList.contains( 'chat-opened' ) ) {
                helpers.toggleChatNotificationBadge();
            }
        }, 300 );
    } );


    //When the video frame is clicked. This will enable picture-in-picture
    document.getElementById( 'local' ).addEventListener( 'click', () => {
        if ( !document.pictureInPictureElement ) {
            document.getElementById( 'local' ).requestPictureInPicture()
                .catch( error => {
                    // Video failed to enter Picture-in-Picture mode.
                    console.error( error );
                } );
        }
        else {
            document.exitPictureInPicture()
                .catch( error => {
                    // Video failed to leave Picture-in-Picture mode.
                    console.error( error );
                } );
        }
    } );

    //When the 'Create room" is button is clicked
    document.getElementById( 'create-room' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();
        console.log("location: " + window.location);
        let roomName = document.querySelector( '#room-name' ).value;
        let yourName = document.querySelector( '#your-name' ).value;
        let meetingPassword = document.querySelector( '#meeting-password' ).value;

        if ( roomName && yourName && meetingPassword ) {
            //remove error message, if any
            document.querySelector('#err-msg').innerText = "";

            //save the user's name in sessionStorage
            sessionStorage.setItem( 'username', yourName );

            //create room link
            let roomLink = `${ location.origin }?room=${ roomName.trim().replace( ' ', '_' ) }`;
            // let roomLink = `${ location.origin }?room=${ roomName.trim().replace( ' ', '_' ) }_${ helpers.generateRandomString() }`;

            async function addMeetingToDB() {
                var ref = doc(db, "meeting", roomName);
                const docRef = await setDoc(
                    ref, {
                        "roomname": roomName,
                        "roompassword": meetingPassword
                    }
                ).then(()=>{
                    alert("Meeting Created Succesfully")
                })
                .catch((error)=>{
                    alert("Something wrong" + error);
                });
            }

            addMeetingToDB();

            //show message with link to room
            document.querySelector( '#room-created' ).innerHTML = `Room successfully created. Click <a href='${ roomLink }'>here</a> to enter room. 
                Share the room link with your partners.`;

            //empty the values
            document.querySelector( '#room-name' ).value = '';
            document.querySelector( '#your-name' ).value = '';
            document.querySelector( '#meeting-password' ).value = '';
        }
        else {
            document.querySelector('#err-msg').innerText = "All fields are required";
        }
    } );


    //When the 'Enter room' button is clicked.
    document.getElementById( 'enter-room' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();

        let name = document.querySelector( '#username' ).value;
        let password = document.querySelector( '#password' ).value;
        
        let roomname = sessionStorage.getItem('roomnamefromdb');
        let roompassword = sessionStorage.getItem('roompasswordfromdb');
        console.log("[Name & Password ]: ", roomname, roompassword);

        if ( name && password) {

            //remove error message, if any
            document.querySelector('#err-msg-username').innerText = "";

            //save the user's name in sessionStorage
            sessionStorage.setItem( 'username', name );

            if( password == roompassword ) {
                //reload room
                location.reload();   
            }
            else {
                alert("Incorrect Password");
            }
        }
        else {
            document.querySelector('#err-msg-username').innerText = "Please input your name";
        }
    } );

} );
