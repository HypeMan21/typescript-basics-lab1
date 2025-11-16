"use strict";
// ------------------------------
// Базові union-типи та type alias
// ------------------------------
// Допоміжні константи для аналізу (кількість можливих слотів)
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
    "8:30-10:00",
    "10:15-11:45",
    "12:15-13:45",
    "14:00-15:30",
    "15:45-17:15"
];
// ------------------------------
// Масиви даних (база для прикладу)
// ------------------------------
const professors = [
    { id: 1, name: "Іван Іванов", department: "Інформатика" },
    { id: 2, name: "Олена Петрова", department: "Математика" },
    { id: 3, name: "Марія Коваленко", department: "Фізика" }
];
const classrooms = [
    { number: "101", capacity: 30, hasProjector: true },
    { number: "102", capacity: 50, hasProjector: true },
    { number: "201", capacity: 25, hasProjector: false },
    { number: "305", capacity: 40, hasProjector: true }
];
const courses = [
    { id: 1, name: "TypeScript для початківців", type: "Lecture" },
    { id: 2, name: "Алгоритми та структури даних", type: "Lab" },
    { id: 3, name: "Лінійна алгебра", type: "Seminar" },
    { id: 4, name: "Обʼєктно-орієнтоване програмування", type: "Practice" }
];
// Поточний розклад (масив занять)
let schedule = [
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
function professorExists(professorId) {
    return professors.some(function (professor) {
        return professor.id === professorId;
    });
}
// Перевірка, чи існує курс
function courseExists(courseId) {
    return courses.some(function (course) {
        return course.id === courseId;
    });
}
// Перевірка, чи існує аудиторія
function classroomExists(classroomNumber) {
    return classrooms.some(function (classroom) {
        return classroom.number === classroomNumber;
    });
}
// ------------------------------
// Модифікація масивів: додавання
// ------------------------------
// Додавання нового професора
function addProfessor(professor) {
    const exists = professors.some(function (p) {
        return p.id === professor.id;
    });
    if (exists) {
        console.warn("Професор з таким id вже існує:", professor.id);
        return;
    }
    professors.push(professor);
}
// Перевірка конфліктів для нового заняття
function validateLesson(lesson) {
    // Проходимо по всіх вже існуючих заняттях і перевіряємо перетини по часу
    for (let i = 0; i < schedule.length; i++) {
        const existing = schedule[i];
        const sameTime = existing.dayOfWeek === lesson.dayOfWeek &&
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
function addLesson(lesson) {
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
    const conflict = validateLesson(lesson);
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
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    // Знаходимо всі заняття у цей час
    const busyLessons = schedule.filter(function (lesson) {
        return lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek;
    });
    // Отримуємо список зайнятих аудиторій
    const busyNumbers = busyLessons.map(function (lesson) {
        return lesson.classroomNumber;
    });
    // Фільтруємо аудиторії, які НЕ зайняті
    const availableClassrooms = classrooms
        .filter(function (classroom) {
        return busyNumbers.indexOf(classroom.number) === -1;
    })
        .map(function (classroom) {
        return classroom.number;
    });
    return availableClassrooms;
}
// Розклад конкретного викладача
function getProfessorSchedule(professorId) {
    return schedule.filter(function (lesson) {
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
function getClassroomUtilization(classroomNumber) {
    const totalPossibleSlots = DAYS.length * TIME_SLOTS.length;
    if (totalPossibleSlots === 0) {
        return 0;
    }
    const usedCount = schedule.filter(function (lesson) {
        return lesson.classroomNumber === classroomNumber;
    }).length;
    const utilization = (usedCount / totalPossibleSlots) * 100;
    // Округлюємо до двох знаків після коми
    return Math.round(utilization * 100) / 100;
}
// Найпопулярніший тип занять
function getMostPopularCourseType() {
    // Лічильник для кожного типу
    const counts = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };
    // Проходимо по всьому розкладу та збільшуємо лічильник за типом курсу
    for (let i = 0; i < schedule.length; i++) {
        const lesson = schedule[i];
        const course = courses.find(function (c) {
            return c.id === lesson.courseId;
        });
        if (!course) {
            continue;
        }
        counts[course.type] = counts[course.type] + 1;
    }
    // Визначаємо максимум "вручну", без дженериків та складних конструкцій
    const order = ["Lecture", "Seminar", "Lab", "Practice"];
    let bestType = "Lecture";
    let bestValue = -1;
    for (let i = 0; i < order.length; i++) {
        const type = order[i];
        const value = counts[type];
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
function reassignClassroom(lessonId, newClassroomNumber) {
    const lesson = schedule[lessonId];
    if (!lesson) {
        console.warn("Заняття з таким індексом не знайдено:", lessonId);
        return false;
    }
    if (!classroomExists(newClassroomNumber)) {
        console.warn("Нова аудиторія не існує:", newClassroomNumber);
        return false;
    }
    // Перевіряємо, чи не зайнята нова аудиторія в той самий час
    const hasConflict = schedule.some(function (existing, index) {
        if (index === lessonId) {
            return false;
        }
        const sameTime = existing.dayOfWeek === lesson.dayOfWeek &&
            existing.timeSlot === lesson.timeSlot;
        return sameTime && existing.classroomNumber === newClassroomNumber;
    });
    if (hasConflict) {
        console.warn("Неможливо змінити аудиторію: у цей час нова аудиторія вже зайнята.");
        return false;
    }
    lesson.classroomNumber = newClassroomNumber;
    return true;
}
// Скасування (видалення) заняття з розкладу
function cancelLesson(lessonId) {
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
const newLesson = {
    courseId: 4,
    professorId: 4,
    classroomNumber: "305",
    dayOfWeek: "Thursday",
    timeSlot: "14:00-15:30"
};
const added = addLesson(newLesson);
console.log("Чи додано нове заняття:", added);
// Знаходимо вільні аудиторії
const freeRooms = findAvailableClassrooms("8:30-10:00", "Monday");
console.log("Вільні аудиторії у понеділок 8:30-10:00:", freeRooms);
// Розклад конкретного викладача
const profSchedule = getProfessorSchedule(2);
console.log("Розклад викладача з id=2:", profSchedule);
// Завантаженість аудиторії
const utilization101 = getClassroomUtilization("101");
console.log("Використання аудиторії 101 (%):", utilization101);
// Найпопулярніший тип занять
const popularType = getMostPopularCourseType();
console.log("Найпопулярніший тип занять:", popularType);
// Перепризначення аудиторії для заняття з індексом 0
const reassigned = reassignClassroom(0, "201");
console.log("Чи вдалося змінити аудиторію для заняття 0:", reassigned);
// Скасування заняття з індексом 1
cancelLesson(1);
console.log("Розклад після видалення заняття з індексом 1:", schedule);
