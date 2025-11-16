"use strict";
// ===============================
// Enum-и для університетської системи
// ===============================
/**
 * Статус студента
 */
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
/**
 * Типи курсів
 */
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
/**
 * Семестри навчання
 */
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
/**
 * Оцінки (числові значення)
 */
var Grade;
(function (Grade) {
    Grade[Grade["Excellent"] = 5] = "Excellent";
    Grade[Grade["Good"] = 4] = "Good";
    Grade[Grade["Satisfactory"] = 3] = "Satisfactory";
    Grade[Grade["Unsatisfactory"] = 2] = "Unsatisfactory";
})(Grade || (Grade = {}));
/**
 * Факультети
 */
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
// ===============================
// Клас системи управління університетом
// ===============================
/**
 * Клас UniversityManagementSystem інкапсулює логіку роботи
 * зі студентами, курсами, реєстраціями та оцінками.
 */
class UniversityManagementSystem {
    constructor(initialCourses = []) {
        this.students = [];
        this.courses = [];
        this.grades = [];
        this.registrations = [];
        this.nextStudentId = 1;
        this.courses = initialCourses;
    }
    /**
     * Реєстрація (зарахування) нового студента.
     * id генерується автоматично.
     */
    enrollStudent(student) {
        const newStudent = Object.assign(Object.assign({}, student), { id: this.nextStudentId++ });
        this.students.push(newStudent);
        return newStudent;
    }
    /**
     * Реєстрація студента на курс.
     * Перевіряються:
     * - чи існують студент та курс
     * - чи студент активний
     * - чи співпадають факультети
     * - чи не перевищена кількість студентів на курсі
     * - чи студент ще не зареєстрований на цей курс
     */
    registerForCourse(studentId, courseId) {
        const student = this.students.find((s) => s.id === studentId);
        const course = this.courses.find((c) => c.id === courseId);
        if (!student) {
            console.error("Студента з таким id не знайдено:", studentId);
            return;
        }
        if (!course) {
            console.error("Курс з таким id не знайдено:", courseId);
            return;
        }
        if (student.status !== StudentStatus.Active) {
            console.error("Студент повинен мати статус Active для реєстрації на курс.", { studentId, status: student.status });
            return;
        }
        if (student.faculty !== course.faculty) {
            console.error("Студент може реєструватися лише на курси свого факультету.", { studentFaculty: student.faculty, courseFaculty: course.faculty });
            return;
        }
        const currentCount = this.registrations.filter((r) => r.courseId === courseId).length;
        if (currentCount >= course.maxStudents) {
            console.error("Курс вже заповнений, неможливо зареєструватися.", {
                courseId,
                maxStudents: course.maxStudents
            });
            return;
        }
        const alreadyRegistered = this.registrations.some((r) => r.courseId === courseId && r.studentId === studentId);
        if (alreadyRegistered) {
            console.warn("Студент вже зареєстрований на цей курс.", {
                studentId,
                courseId
            });
            return;
        }
        this.registrations.push({ studentId, courseId });
    }
    /**
     * Виставлення оцінки студенту за курс.
     * Перевіряється, чи зареєстрований студент на цей курс.
     */
    setGrade(studentId, courseId, grade) {
        const registrationExists = this.registrations.some((r) => r.studentId === studentId && r.courseId === courseId);
        if (!registrationExists) {
            console.error("Неможливо виставити оцінку: студент не зареєстрований на цей курс.", { studentId, courseId });
            return;
        }
        const course = this.courses.find((c) => c.id === courseId);
        if (!course) {
            console.error("Курс з таким id не знайдено:", courseId);
            return;
        }
        const record = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };
        this.grades.push(record);
    }
    /**
     * Оновлення статусу студента з базовою валідацією переходів.
     * Наприклад:
     * - Expelled / Graduated не можна зробити Active.
     */
    updateStudentStatus(studentId, newStatus) {
        const student = this.students.find((s) => s.id === studentId);
        if (!student) {
            console.error("Студента з таким id не знайдено:", studentId);
            return;
        }
        // Простий приклад валідації переходів
        if ((student.status === StudentStatus.Expelled ||
            student.status === StudentStatus.Graduated) &&
            newStatus === StudentStatus.Active) {
            console.error("Неможливо повернути студента до статусу Active після Expelled або Graduated.");
            return;
        }
        student.status = newStatus;
    }
    /**
     * Отримати всіх студентів певного факультету.
     */
    getStudentsByFaculty(faculty) {
        return this.students.filter((s) => s.faculty === faculty);
    }
    /**
     * Отримати всі оцінки конкретного студента.
     */
    getStudentGrades(studentId) {
        return this.grades.filter((g) => g.studentId === studentId);
    }
    /**
     * Отримати доступні (ще не заповнені) курси певного факультету і семестру.
     */
    getAvailableCourses(faculty, semester) {
        return this.courses.filter((course) => {
            if (course.faculty !== faculty || course.semester !== semester) {
                return false;
            }
            const currentCount = this.registrations.filter((r) => r.courseId === course.id).length;
            return currentCount < course.maxStudents;
        });
    }
    /**
     * Обчислення середнього балу студента.
     * Якщо оцінок немає, повертає 0.
     */
    calculateAverageGrade(studentId) {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) {
            return 0;
        }
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        const average = total / studentGrades.length;
        // Округлення до двох знаків після коми
        return Math.round(average * 100) / 100;
    }
    /**
     * Отримати список "відмінників" по факультету.
     * Логіка: студент має хоча б одну оцінку,
     * а його середній бал >= 4.5
     */
    getHonoursStudentsByFaculty(faculty) {
        const studentsOfFaculty = this.getStudentsByFaculty(faculty);
        return studentsOfFaculty.filter((student) => {
            const avg = this.calculateAverageGrade(student.id);
            return avg >= 4.5 && avg > 0;
        });
    }
}
// ===============================
// Приклад використання (демо)
// Можеш залишити це, щоб викладач бачив, як все працює
// ===============================
// Початковий список курсів
const initialCourses = [
    {
        id: 1,
        name: "Вступ до програмування",
        type: CourseType.Mandatory,
        credits: 5,
        semester: Semester.First,
        faculty: Faculty.Computer_Science,
        maxStudents: 2
    },
    {
        id: 2,
        name: "Алгоритми та структури даних",
        type: CourseType.Mandatory,
        credits: 6,
        semester: Semester.Second,
        faculty: Faculty.Computer_Science,
        maxStudents: 3
    },
    {
        id: 3,
        name: "Мікроекономіка",
        type: CourseType.Mandatory,
        credits: 4,
        semester: Semester.First,
        faculty: Faculty.Economics,
        maxStudents: 2
    }
];
const ums = new UniversityManagementSystem(initialCourses);
// Створюємо студентів
const student1 = ums.enrollStudent({
    fullName: "Іван Іванов",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-11"
});
const student2 = ums.enrollStudent({
    fullName: "Олена Петрова",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-11"
});
// Реєстрація на курс
ums.registerForCourse(student1.id, 1);
ums.registerForCourse(student2.id, 1);
// Виставляємо оцінки
ums.setGrade(student1.id, 1, Grade.Excellent);
ums.setGrade(student2.id, 1, Grade.Good);
// Середній бал
const avg1 = ums.calculateAverageGrade(student1.id);
const avg2 = ums.calculateAverageGrade(student2.id);
console.log("Середній бал студента 1:", avg1);
console.log("Середній бал студента 2:", avg2);
// Відмінники по факультету Computer_Science
const honours = ums.getHonoursStudentsByFaculty(Faculty.Computer_Science);
console.log("Відмінники факультету Computer_Science:", honours);
