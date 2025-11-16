const userName: string = "Юлія";
const age: number = 28;
const isStudent: boolean = false;

function getUserInfo(name: string, age: number, isStudent: boolean): string {
    const status: string = isStudent ? "студент" : "не студент";
    return `Користувач: ${name}, вік: ${age}, статус: ${status}.`;
}

const message: string = getUserInfo(userName, age, isStudent);

console.log(message);
