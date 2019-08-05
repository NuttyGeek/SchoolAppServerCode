import * as functions from 'firebase-functions';
import * as lib from './lib';
import * as modals from './modals/modals';

const cors = require("cors")({origin: true});

//import * as admin from 'firebase-admin';
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//

export const createUser = functions.https.onRequest((request, response)=>{
    cors(request, response, (req: any, res: any)=>{
        if (request.method === 'POST'){
            let body = request.body;
            console.log(body);
            let user = {
                name: body.user.name,
                email: body.user.email,
                password: body.user.password,
            }
            // creating user in auth
            lib.createUserinAuth(user).then(
                (firebaseUser)=>{
                    console.log("created user in auth:  "+JSON.stringify(firebaseUser));
                    //  if the user user is created in auth , now create in it db 
                    if (body.user.profile === 'student'){
                        console.log("profile is student");
                        // create student object
                        let user: modals.Student = {
                            uid: firebaseUser.uid,
                            name: firebaseUser.displayName,
                            email: firebaseUser.email,
                            class: body.user.class,
                            rollno: body.user.rollno
                        }
                        console.log("auth user object: "+JSON.stringify(user));
                        //save student object in db
                        lib.createStudentInDb(user).then(()=>{
                            res.status(200).send("Student Created !");
                        }).catch((err: Error)=>{
                            console.log("Catched Err in Studnet: "+err);
                            res.status(400).send("Catched Error: "+err.message);
                        });
                    } 
                    else if(body.user.profile === 'teacher'){
                        // create a teacher object
                        let user: modals.Teacher = {
                            uid: firebaseUser.uid,
                            name: firebaseUser.displayName,
                            email: firebaseUser.email,
                            designation: body.user.designation
                        }
                        console.log("prepared teacher object: "+user);
                        lib.createTeacherInDb(user).then(()=>{
                            res.status(200).send("Teacher created !");
                        }).catch((err)=>{
                            res.status(400).send("Error adding teacher to db");
                            console.log("Catched Err: "+err.message);
                        });
                    } else if (body.user.profile === 'librarian'){
                        //  create a librarian 
                        let user: modals.Librarian = {
                            uid: firebaseUser.uid,
                            name: firebaseUser.displayName,
                            email: firebaseUser.email
                        }
                        lib.createLibrarianInDb(user).then(()=>{
                            res.status(200).send("Librarian Saved !");
                        }).catch((err)=>{
                            console.log("Catched Err: "+err.message);
                            res.status(400).send("Cannot add librarian in db");
                        });
                    } else{
                        res.status(400).send("Invalid Profile :-/ ");
                    }
            }, 
            (err: Error)=>{
                console.log("error while creating user in auth: "+err);
                res.status(400).send("Error creating User in Auth");
            }).catch((err)=>{
                console.log("Catched Err: "+JSON.stringify(err));
            })
        } else{
            res.status(400);
            res.send("invalid request");
        }
    });

    
});

/**
 * this function deletes the firebase user
 */
export const deleteUser = functions.https.onRequest((request, response)=>{
    cors(request, response, (req: any, res:any)=>{
        // get the user id to delete the user
        if(request.method==='POST' && request.body.uid!==null){
            // get the uid 
            let body = request.body;
            let uid = body.uid;
            lib.deleteUserFromDb(uid).then(()=>{
                console.log("user deleted frm db: "+uid);
                // proceed further
                lib.createUserinAuth(uid).then(()=>{
                    // user removed from auth also
                    console.log("user deleted from auth: "+uid);
                    response.status(200);
                    response.send("USer deleted !: "+uid);
                }).catch((err:Error)=>{
                    response.status(400);
                    console.log("Error while removing user from auth: "+err.message);
                    response.send("Error while removing user from auth: "+err.message);
                })
            }).catch((err:Error)=>{
                console.log("error while removing user from db ");
                response.status(400);
                response.send("Error while removing user from db: "+err.message);
            })
        } else{
            response.status(400);
            response.send("Inavlid Request");
        }
    })
});





