// ------------------------------
// Базові union-типи та type alias
// ------------------------------

// Дні тижня
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

// Часові слоти
type TimeSlot =
    | "8:30-10:00"
    | "10:15-11:45"
    | "12:15-13:45"
    | "14:00-15:30"
    | "15:45-17:15";

// Типи занять
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// Допоміжні константи для аналізу (кількість можливих слотів)
const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS: TimeSlot[] = [
    "8:30-10:00",
    "10:15-11:45",
    "12:15-13:45",
    "14:00-15:30",
    "15:45-17:15"
];

// ------------------------------
// Основні структури даних (type alias)
// ------------------------------

type Professor = {
    id: number;
    name: string;
    department: string;
};

type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

type Course = {
    id: number;
    name: string;
    type: CourseType;
};

// У завданні Lesson без id, тому вважаємо, що "lessonId" в функціях — це індекс у масиві schedule
type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

// Конфлікти розкладу
type ScheduleConflictType = "ProfessorConflict" | "ClassroomConflict";

type ScheduleConflict = {
    type: ScheduleConflictType;
    lessonDetails: Lesson;
};

// ------------------------------
// Масиви даних (база для прикладу)
// ------------------------------

const professors: Professor[] = [
    { id: 1, name: "Іван Іванов", department: "Інформатика" },
    { id: 2, name: "Олена Петрова", department: "Математика" },
    { id: 3, name: "Марія Коваленко", department: "Фізика" }
];

const classrooms: Classroom[] = [
    { number: "101", capacity: 30, hasProjector: true },
    { number: "102", capacity: 50, hasProjector: true },
    { number: "201", capacity: 25, hasProjector: false },
    { number: "305", capacity: 40, hasProjector: true }
];

const courses: Course[] = [
    { id: 1, name: "TypeScript для початківців", type: "Lecture" },
    { id: 2, name: "Алгоритми та структури даних", type: "Lab" },
    { id: 3, name: "Лінійна алгебра", type: "Seminar" },
    { id: 4, name: "Обʼєктно-орієнтоване програмування", type: "Practice" }
];

// Поточний розклад (масив занять)
let schedule: Lesson[] = [
    {
        courseId: 1,
        professorId: 1,
        classroomNumber: "101",
        dayOfWeek: "Monday",
        timeSlot: "8:30-10:00"
    },
    {
        courseId: 2,
        professorId: 2,
        classroomNumber: "102",
        dayOfWeek: "Monday",
        timeSlot: "10:15-11:45"
    },
    {
        courseId: 3,
        professorId: 2,
        classroomNumber: "201",
        dayOfWeek: "Wednesday",
        timeSlot: "12:15-13:45"
    }
];

// ------------------------------
// Допоміжні перевірки
// ------------------------------

// Перевірка, чи існує професор з таким id
function professorExists(professorId: number): boolean {
    return professors.some(function (professor: Professor): boolean {
        return professor.id === professorId;
    });
}

// Перевірка, чи існує курс
function courseExists(courseId: number): boolean {
    return courses.some(function (course: Course): boolean {
        return course.id === courseId;
    });
}

// Перевірка, чи існує аудиторія
function classroomExists(classroomNumber: string): boolean {
    return classrooms.some(function (classroom: Classroom): boolean {
        return classroom.number === classroomNumber;
    });
}

// ------------------------------
// Модифікація масивів: додавання
// ------------------------------

// Додавання нового професора
function addProfessor(professor: Professor): void {
    const exists: boolean = professors.some(function (p: Professor): boolean {
        return p.id === professor.id;
    });

    if (exists) {
        console.warn("Професор з таким id вже існує:", professor.id);
        return;
    }

    professors.push(professor);
}

// Перевірка конфліктів для нового заняття
function validateLesson(lesson: Lesson): ScheduleConflict | null {
    // Проходимо по всіх вже існуючих заняттях і перевіряємо перетини по часу
    for (let i = 0; i < schedule.length; i++) {
        const existing: Lesson = schedule[i];

        const sameTime: boolean =
            existing.dayOfWeek === lesson.dayOfWeek &&
            existing.timeSlot === lesson.timeSlot;

        if (!sameTime) {
            continue;
        }

        // Конфлікт по викладачу
        if (existing.professorId === lesson.professorId) {
            return {
                type: "ProfessorConflict",
                lessonDetails: existing
            };
        }

        // Конфлікт по аудиторії
        if (existing.classroomNumber === lesson.classroomNumber) {
            return {
                type: "ClassroomConflict",
                lessonDetails: existing
            };
        }
    }

    return null;
}

// Додавання заняття до розкладу, якщо немає конфлікту
function addLesson(lesson: Lesson): boolean {
    // Базова валідація посилань на професора, курс та аудиторію
    if (!professorExists(lesson.professorId)) {
        console.warn("Професора з таким id не існує:", lesson.professorId);
        return false;
    }

    if (!courseExists(lesson.courseId)) {
        console.warn("Курсу з таким id не існує:", lesson.courseId);
        return false;
    }

    if (!classroomExists(lesson.classroomNumber)) {
        console.warn("Аудиторії з таким номером не існує:", lesson.classroomNumber);
        return false;
    }

    const conflict: ScheduleConflict | null = validateLesson(lesson);

    if (conflict !== null) {
        console.warn("Конфлікт розкладу:", conflict.type, conflict.lessonDetails);
        return false;
    }

    schedule.push(lesson);
    return true;
}

// ------------------------------
// Пошук та фільтрація
// ------------------------------

// Пошук вільних аудиторій у заданий час
function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    // Знаходимо всі заняття у цей час
    const busyLessons: Lesson[] = schedule.filter(function (lesson: Lesson): boolean {
        return lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek;
    });

    // Отримуємо список зайнятих аудиторій
    const busyNumbers: string[] = busyLessons.map(function (lesson: Lesson): string {
        return lesson.classroomNumber;
    });

    // Фільтруємо аудиторії, які НЕ зайняті
    const availableClassrooms: string[] = classrooms
        .filter(function (classroom: Classroom): boolean {
            return busyNumbers.indexOf(classroom.number) === -1;
        })
        .map(function (classroom: Classroom): string {
            return classroom.number;
        });

    return availableClassrooms;
}

// Розклад конкретного викладача
function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(function (lesson: Lesson): boolean {
        return lesson.professorId === professorId;
    });
}

// ------------------------------
// Аналіз конфліктів уже реалізовано в validateLesson
// ------------------------------

// ------------------------------
// Аналіз та звіти
// ------------------------------

// Відсоток використання аудиторії
// Формула: (кількість занять в цій аудиторії / максимальна можлива кількість слотів) * 100
// Максимум = кількість днів * кількість часових слотів
function getClassroomUtilization(classroomNumber: string): number {
    const totalPossibleSlots: number = DAYS.length * TIME_SLOTS.length;

    if (totalPossibleSlots === 0) {
        return 0;
    }

    const usedCount: number = schedule.filter(function (lesson: Lesson): boolean {
        return lesson.classroomNumber === classroomNumber;
    }).length;

    const utilization: number = (usedCount / totalPossibleSlots) * 100;

    // Округлюємо до двох знаків після коми
    return Math.round(utilization * 100) / 100;
}

// Найпопулярніший тип занять
function getMostPopularCourseType(): CourseType {
    // Лічильник для кожного типу
    const counts: { Lecture: number; Seminar: number; Lab: number; Practice: number } = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };

    // Проходимо по всьому розкладу та збільшуємо лічильник за типом курсу
    for (let i = 0; i < schedule.length; i++) {
        const lesson: Lesson = schedule[i];
        const course: Course | undefined = courses.find(function (c: Course): boolean {
            return c.id === lesson.courseId;
        });

        if (!course) {
            continue;
        }

        counts[course.type] = counts[course.type] + 1;
    }

    // Визначаємо максимум "вручну", без дженериків та складних конструкцій
    const order: CourseType[] = ["Lecture", "Seminar", "Lab", "Practice"];
    let bestType: CourseType = "Lecture";
    let bestValue: number = -1;

    for (let i = 0; i < order.length; i++) {
        const type: CourseType = order[i];
        const value: number = counts[type];

        if (value > bestValue) {
            bestValue = value;
            bestType = type;
        }
    }

    return bestType;
}

// ------------------------------
// Модифікація даних: зміна та видалення
// ------------------------------

// Зміна аудиторії для заняття
// lessonId інтерпретуємо як індекс елемента в масиві schedule
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lesson: Lesson | undefined = schedule[lessonId];

    if (!lesson) {
        console.warn("Заняття з таким індексом не знайдено:", lessonId);
        return false;
    }

    if (!classroomExists(newClassroomNumber)) {
        console.warn("Нова аудиторія не існує:", newClassroomNumber);
        return false;
    }

    // Перевіряємо, чи не зайнята нова аудиторія в той самий час
    const hasConflict: boolean = schedule.some(function (
        existing: Lesson,
        index: number
    ): boolean {
        if (index === lessonId) {
            return false;
        }

        const sameTime: boolean =
            existing.dayOfWeek === lesson.dayOfWeek &&
            existing.timeSlot === lesson.timeSlot;

        return sameTime && existing.classroomNumber === newClassroomNumber;
    });

    if (hasConflict) {
        console.warn(
            "Неможливо змінити аудиторію: у цей час нова аудиторія вже зайнята."
        );
        return false;
    }

    lesson.classroomNumber = newClassroomNumber;
    return true;
}

// Скасування (видалення) заняття з розкладу
function cancelLesson(lessonId: number): void {
    if (lessonId < 0 || lessonId >= schedule.length) {
        console.warn("Невірний індекс заняття для видалення:", lessonId);
        return;
    }

    // Видаляємо одне заняття за індексом
    schedule.splice(lessonId, 1);
}

// ------------------------------
// Невелика демо-секція для перевірки (можна залишити або закоментувати)
// ------------------------------

// Додаємо нового професора
addProfessor({ id: 4, name: "Андрій Сидоренко", department: "Інформатика" });

// Пробуємо додати новий урок без конфлікту
const newLesson: Lesson = {
    courseId: 4,
    professorId: 4,
    classroomNumber: "305",
    dayOfWeek: "Thursday",
    timeSlot: "14:00-15:30"
};

const added: boolean = addLesson(newLesson);
console.log("Чи додано нове заняття:", added);

// Знаходимо вільні аудиторії
const freeRooms: string[] = findAvailableClassrooms("8:30-10:00", "Monday");
console.log("Вільні аудиторії у понеділок 8:30-10:00:", freeRooms);

// Розклад конкретного викладача
const profSchedule: Lesson[] = getProfessorSchedule(2);
console.log("Розклад викладача з id=2:", profSchedule);

// Завантаженість аудиторії
const utilization101: number = getClassroomUtilization("101");
console.log("Використання аудиторії 101 (%):", utilization101);

// Найпопулярніший тип занять
const popularType: CourseType = getMostPopularCourseType();
console.log("Найпопулярніший тип занять:", popularType);

// Перепризначення аудиторії для заняття з індексом 0
const reassigned: boolean = reassignClassroom(0, "201");
console.log("Чи вдалося змінити аудиторію для заняття 0:", reassigned);

// Скасування заняття з індексом 1
cancelLesson(1);
console.log("Розклад після видалення заняття з індексом 1:", schedule);
