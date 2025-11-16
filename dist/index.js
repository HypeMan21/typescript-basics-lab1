"use strict";
const userName = "Юлія";
const age = 28;
const isStudent = false;
function getUserInfo(name, age, isStudent) {
    const status = isStudent ? "студент" : "не студент";
    return `Користувач: ${name}, вік: ${age}, статус: ${status}.`;
}
const message = getUserInfo(userName, age, isStudent);
console.log(message);
