// ===============================
// Enum-и для університетської системи
// ===============================

/**
 * Статус студента
 */
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

/**
 * Типи курсів
 */
enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

/**
 * Семестри навчання
 */
enum Semester {
    First = "First",
    Second = "Second"
}

/**
 * Оцінки (числові значення)
 */
enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

/**
 * Факультети
 */
enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// ===============================
// Інтерфейси сутностей
// ===============================

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

/**
 * Запис про оцінку студента за курс.
 * (В умові це interface Grade; тут перейменовано на StudentGrade,
 *  щоб не конфліктувати з enum Grade.)
 */
interface StudentGrade {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

// Тип для реєстрації студента на курс
type Registration = {
    studentId: number;
    courseId: number;
};

// ===============================
// Клас системи управління університетом
// ===============================

/**
 * Клас UniversityManagementSystem інкапсулює логіку роботи
 * зі студентами, курсами, реєстраціями та оцінками.
 */
class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: StudentGrade[] = [];
    private registrations: Registration[] = [];
    private nextStudentId: number = 1;

    constructor(initialCourses: Course[] = []) {
        this.courses = initialCourses;
    }

    /**
     * Реєстрація (зарахування) нового студента.
     * id генерується автоматично.
     */
    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = {
            ...student,
            id: this.nextStudentId++
        };

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
    registerForCourse(studentId: number, courseId: number): void {
        const student: Student | undefined = this.students.find(
            (s: Student): boolean => s.id === studentId
        );
        const course: Course | undefined = this.courses.find(
            (c: Course): boolean => c.id === courseId
        );

        if (!student) {
            console.error("Студента з таким id не знайдено:", studentId);
            return;
        }

        if (!course) {
            console.error("Курс з таким id не знайдено:", courseId);
            return;
        }

        if (student.status !== StudentStatus.Active) {
            console.error(
                "Студент повинен мати статус Active для реєстрації на курс.",
                { studentId, status: student.status }
            );
            return;
        }

        if (student.faculty !== course.faculty) {
            console.error(
                "Студент може реєструватися лише на курси свого факультету.",
                { studentFaculty: student.faculty, courseFaculty: course.faculty }
            );
            return;
        }

        const currentCount: number = this.registrations.filter(
            (r: Registration): boolean => r.courseId === courseId
        ).length;

        if (currentCount >= course.maxStudents) {
            console.error("Курс вже заповнений, неможливо зареєструватися.", {
                courseId,
                maxStudents: course.maxStudents
            });
            return;
        }

        const alreadyRegistered: boolean = this.registrations.some(
            (r: Registration): boolean =>
                r.courseId === courseId && r.studentId === studentId
        );

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
    setGrade(studentId: number, courseId: number, grade: Grade): void {
        const registrationExists: boolean = this.registrations.some(
            (r: Registration): boolean =>
                r.studentId === studentId && r.courseId === courseId
        );

        if (!registrationExists) {
            console.error(
                "Неможливо виставити оцінку: студент не зареєстрований на цей курс.",
                { studentId, courseId }
            );
            return;
        }

        const course: Course | undefined = this.courses.find(
            (c: Course): boolean => c.id === courseId
        );

        if (!course) {
            console.error("Курс з таким id не знайдено:", courseId);
            return;
        }

        const record: StudentGrade = {
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
    updateStudentStatus(
        studentId: number,
        newStatus: StudentStatus
    ): void {
        const student: Student | undefined = this.students.find(
            (s: Student): boolean => s.id === studentId
        );

        if (!student) {
            console.error("Студента з таким id не знайдено:", studentId);
            return;
        }

        // Простий приклад валідації переходів
        if (
            (student.status === StudentStatus.Expelled ||
                student.status === StudentStatus.Graduated) &&
            newStatus === StudentStatus.Active
        ) {
            console.error(
                "Неможливо повернути студента до статусу Active після Expelled або Graduated."
            );
            return;
        }

        student.status = newStatus;
    }

    /**
     * Отримати всіх студентів певного факультету.
     */
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(
            (s: Student): boolean => s.faculty === faculty
        );
    }

    /**
     * Отримати всі оцінки конкретного студента.
     */
    getStudentGrades(studentId: number): StudentGrade[] {
        return this.grades.filter(
            (g: StudentGrade): boolean => g.studentId === studentId
        );
    }

    /**
     * Отримати доступні (ще не заповнені) курси певного факультету і семестру.
     */
    getAvailableCourses(
        faculty: Faculty,
        semester: Semester
    ): Course[] {
        return this.courses.filter((course: Course): boolean => {
            if (course.faculty !== faculty || course.semester !== semester) {
                return false;
            }

            const currentCount: number = this.registrations.filter(
                (r: Registration): boolean => r.courseId === course.id
            ).length;

            return currentCount < course.maxStudents;
        });
    }

    /**
     * Обчислення середнього балу студента.
     * Якщо оцінок немає, повертає 0.
     */
    calculateAverageGrade(studentId: number): number {
        const studentGrades: StudentGrade[] = this.getStudentGrades(studentId);

        if (studentGrades.length === 0) {
            return 0;
        }

        const total: number = studentGrades.reduce(
            (sum: number, g: StudentGrade): number => sum + g.grade,
            0
        );

        const average: number = total / studentGrades.length;
        // Округлення до двох знаків після коми
        return Math.round(average * 100) / 100;
    }

    /**
     * Отримати список "відмінників" по факультету.
     * Логіка: студент має хоча б одну оцінку,
     * а його середній бал >= 4.5
     */
    getHonoursStudentsByFaculty(faculty: Faculty): Student[] {
        const studentsOfFaculty: Student[] = this.getStudentsByFaculty(faculty);

        return studentsOfFaculty.filter((student: Student): boolean => {
            const avg: number = this.calculateAverageGrade(student.id);
            return avg >= 4.5 && avg > 0;
        });
    }
}

// ===============================
// Приклад використання (демо)
// Можеш залишити це, щоб викладач бачив, як все працює
// ===============================

// Початковий список курсів
const initialCourses: Course[] = [
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
const student1: Student = ums.enrollStudent({
    fullName: "Іван Іванов",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-11"
});

const student2: Student = ums.enrollStudent({
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
const avg1: number = ums.calculateAverageGrade(student1.id);
const avg2: number = ums.calculateAverageGrade(student2.id);

console.log("Середній бал студента 1:", avg1);
console.log("Середній бал студента 2:", avg2);

// Відмінники по факультету Computer_Science
const honours: Student[] = ums.getHonoursStudentsByFaculty(
    Faculty.Computer_Science
);
console.log("Відмінники факультету Computer_Science:", honours);
