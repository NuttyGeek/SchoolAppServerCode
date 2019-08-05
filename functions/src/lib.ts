import * as modals from './modals/modals';

//  firebase admin init
var admin = require("firebase-admin");
var serviceAccount = require("../src/schoolapp-8f7a1-firebase-adminsdk-7mxlo-3d12f85eb8.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://schoolapp-8f7a1.firebaseio.com"
});
var db = admin.database();

/**
 * creates a firebase user in Firebase Auth
 */
export function createUserinAuth(user: modals.AuthUser): Promise<any>{
    return admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.name,
    });
}

export function createStudentInDb(student: modals.Student): Promise<any>{
    console.log("auth object got in create student fxn: "+JSON.stringify(student));
    let ref = db.ref("users").child(student.uid);
    let studentObj = {
        name: student.name,
        email: student.email,
        class: student.class,
        rollno: student.rollno,
        profile: 'student'
    };
    return ref.set(studentObj);
}

export function createTeacherInDb(teacher: modals.Teacher): Promise<any>{
    let ref = db.ref("users/"+teacher.uid);
    let teacherObj = {
        name: teacher.name,
        email: teacher.email,
        designation: teacher.designation,
        profile: 'teacher'
    };
    return ref.set(teacherObj);
}

/**
 * returnsa promise of librarian object 
 * @param librarian librarian object
 */
export function createLibrarianInDb(librarian: modals.Librarian): Promise<any>{
    let ref = db.ref("users/"+librarian.uid);
    let librarianObj = {
        name: librarian.name,
        email: librarian.email,
        profile: 'librarian'
    }
    return ref.set(librarianObj);
}

export function addTestObject(){
    console.log("inside test function");
    let ref = db.ref("abc");
    console.log("ref is made, returning promise");
    return ref.set({name: "Ankur"});
}

export function deleteUserFromAuth(uid:string): Promise<any>{
    console.log("User Id: "+uid);
    // delete user from auth and db 
    return admin.auth().auth.deleteUser(uid);
}

export function deleteUserFromDb(uid:string):Promise<any>{
    console.log("UserId: "+uid);
    return db.ref("/users/"+uid).remove();
}



