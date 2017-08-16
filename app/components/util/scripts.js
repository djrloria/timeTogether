import validator from 'validator';
import config from './keys/firebase';
import dbScripts from './dbScripts';

firebase.initializeApp(config);

let Scripts = {
    signUpAccount: (user, callback) => {
        if (validator.isEmail(user.email)) {
            if (validator.equals(user.password, user.confirm_password)) {
                firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                    .then(function () {   
                        dbScripts.saveUser(user).then( () => {
                            dbScripts.setSession(user)
                                .then(function(res) {
                                    console.log(res);
                                    callback({bool: true, msg: 'Sign Up Successful', user: res.data}); 
                                });                                               
                        })
                        
                    }).catch(function (error) {
                        callback({bool: false, msg: error.message});                        
                });               
            }
            else callback({bool: false, msg: 'Password does not match'});
        }
        else callback ({bool: false, msg: 'Email is no good'});
    },

    signInAccount: (user, callback) => {
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(function () {
                dbScripts.setSession(user)
                    .then(function(res) {
                        callback({bool: true, msg: 'Successful', user: res.data});
                    });                
            }).catch(function (error) {
                callback({bool: true, msg: error.message});
        });
    },

    signOut: (callback) => {
        firebase.auth().signOut()
            .then( () => {
                callback();
            });
    },

    saveAlbum: (thumbURL, photoArray, updatePosts) => {
        dbScripts.savePhotos(photoArray).then(function(res) {
            console.log(res.data._id);
            let album = {
                thumb: thumbURL,
                location: document.getElementById('album-city-input').value,
                month: document.getElementById('album-month-input').value,
                year: document.getElementById('album-year-input').value,
                description: document.getElementById('album-desc-input').value,
                album_id: res.data._id
            }
            dbScripts.saveAlbum(album).then(function(res) {
                console.log(res.data);
                updatePosts();
            });        
        });        
    },

    getPosts: (callback) => {
        dbScripts.getPosts().then(function(res) {
            console.log(res.data);
            callback(res.data);
        });
    },

    deletePost: (id, callback) => {
        dbScripts.deletePost(id).then(function(res) {
            console.log('Deleted');
            callback();
        });
    }
}

export default Scripts;