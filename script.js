const subjectTable = document.getElementById("subjectTable");
const addSubjectBtn = document.getElementById("addSubjectBtn");
const calculateBtn = document.getElementById("calculateBtn");

const resultSection = document.getElementById("resultSection");

const studentNameInput = document.getElementById("studentName");
const studentIdInput = document.getElementById("studentId");

const resultStudentName = document.getElementById("resultStudentName");
const resultStudentId = document.getElementById("resultStudentId");

const totalMarks = document.getElementById("totalMarks");
const averageMarks = document.getElementById("averageMarks");
const gpaElement = document.getElementById("gpa");
const subjectCount = document.getElementById("subjectCount");

const statusBadge = document.getElementById("statusBadge");
const performanceMessage = document.getElementById("performanceMessage");
const performancePercentage = document.getElementById("performancePercentage");
const progressFill = document.getElementById("progressFill");

const resultBreakdown = document.getElementById("resultBreakdown");

const resetBtn = document.getElementById("resetBtn");
const printBtn = document.getElementById("printBtn");


// Grade calculation

function getGrade(mark) {

    if (mark >= 90) {
        return {
            grade: "A+",
            point: 4.0
        };
    }

    if (mark >= 80) {
        return {
            grade: "A",
            point: 4.0
        };
    }

    if (mark >= 70) {
        return {
            grade: "B",
            point: 3.0
        };
    }

    if (mark >= 60) {
        return {
            grade: "C",
            point: 2.0
        };
    }

    if (mark >= 50) {
        return {
            grade: "D",
            point: 1.0
        };
    }

    return {
        grade: "F",
        point: 0.0
    };
}


// Add subject

addSubjectBtn.addEventListener("click", function () {

    const row = document.createElement("tr");

    row.className = "subject-row";

    row.innerHTML = `
        <td class="number"></td>

        <td>
            <input
                type="text"
                class="subject-name"
                placeholder="Subject name"
            >
        </td>

        <td>
            <input
                type="number"
                class="marks"
                placeholder="0"
                min="0"
                max="100"
            >
        </td>

        <td>
            <span class="grade">-</span>
        </td>

        <td>
            <span class="grade-point">-</span>
        </td>

        <td>
            <button
                class="delete-btn"
                type="button"
                title="Delete subject"
            >
                🗑️
            </button>
        </td>
    `;

    subjectTable.appendChild(row);

    updateRowNumbers();

    attachRowEvents(row);
});


// Update row numbers

function updateRowNumbers() {

    const rows = document.querySelectorAll(".subject-row");

    rows.forEach(function (row, index) {

        const number = row.querySelector(".number");

        number.textContent = index + 1;

    });
}


// Attach events to a row

function attachRowEvents(row) {

    const marksInput = row.querySelector(".marks");
    const deleteButton = row.querySelector(".delete-btn");

    marksInput.addEventListener("input", function () {

        let mark = Number(marksInput.value);

        if (mark < 0) {
            mark = 0;
            marksInput.value = 0;
        }

        if (mark > 100) {
            mark = 100;
            marksInput.value = 100;
        }

        if (marksInput.value === "") {

            row.querySelector(".grade").textContent = "-";
            row.querySelector(".grade-point").textContent = "-";

            return;
        }

        const result = getGrade(mark);

        row.querySelector(".grade").textContent = result.grade;
        row.querySelector(".grade-point").textContent =
            result.point.toFixed(1);

    });


    deleteButton.addEventListener("click", function () {

        const rows = document.querySelectorAll(".subject-row");

        if (rows.length <= 1) {

            alert("You must keep at least one subject.");

            return;
        }

        row.remove();

        updateRowNumbers();
    });
}


// Attach events to existing rows

document.querySelectorAll(".subject-row").forEach(function (row) {

    attachRowEvents(row);

});


// Calculate result

calculateBtn.addEventListener("click", function () {

    const name = studentNameInput.value.trim();
    const id = studentIdInput.value.trim();

    if (name === "") {

        alert("Please enter the student name.");

        studentNameInput.focus();

        return;
    }

    if (id === "") {

        alert("Please enter the student ID.");

        studentIdInput.focus();

        return;
    }


    const rows = document.querySelectorAll(".subject-row");

    let subjects = [];

    rows.forEach(function (row) {

        const subjectName =
            row.querySelector(".subject-name").value.trim();

        const marksValue =
            row.querySelector(".marks").value;

        if (subjectName !== "" && marksValue !== "") {

            let mark = Number(marksValue);

            if (mark < 0) {
                mark = 0;
            }

            if (mark > 100) {
                mark = 100;
            }

            const result = getGrade(mark);

            subjects.push({
                name: subjectName,
                marks: mark,
                grade: result.grade,
                point: result.point
            });
        }

    });


    if (subjects.length === 0) {

        alert("Please enter at least one subject and mark.");

        return;
    }


    // Calculate total

    let total = 0;

    let totalPoints = 0;

    subjects.forEach(function (subject) {

        total += subject.marks;

        totalPoints += subject.point;

    });


    const average = total / subjects.length;

    const gpa = totalPoints / subjects.length;


    // Pass / fail

    const failedSubjects =
        subjects.filter(subject => subject.grade === "F");


    const passed =
        failedSubjects.length === 0;


    // Student information

    resultStudentName.textContent = name;

    resultStudentId.textContent =
        "Student ID: " + id;


    // Statistics

    totalMarks.textContent =
        total + " / " + (subjects.length * 100);

    averageMarks.textContent =
        average.toFixed(2) + "%";

    gpaElement.textContent =
        gpa.toFixed(2);

    subjectCount.textContent =
        subjects.length;


    // Status

    if (passed) {

        statusBadge.textContent = "✓ PASS";

        statusBadge.style.background = "#dcfce7";
        statusBadge.style.color = "#16a34a";

    } else {

        statusBadge.textContent = "✕ FAIL";

        statusBadge.style.background = "#fee2e2";
        statusBadge.style.color = "#dc2626";
    }


    // Performance message

    if (average >= 90) {

        performanceMessage.textContent =
            "Outstanding performance! Keep up the excellent work.";

    } else if (average >= 80) {

        performanceMessage.textContent =
            "Excellent performance! You are doing very well.";

    } else if (average >= 70) {

        performanceMessage.textContent =
            "Very good performance. Keep improving.";

    } else if (average >= 60) {

        performanceMessage.textContent =
            "Good performance. There is still room to improve.";

    } else if (average >= 50) {

        performanceMessage.textContent =
            "You passed, but consider working harder on weak subjects.";

    } else {

        performanceMessage.textContent =
            "Some improvement is needed. Focus on your weak subjects.";
    }


    // Progress bar

    performancePercentage.textContent =
        average.toFixed(0) + "%";

    progressFill.style.width =
        Math.min(average, 100) + "%";


    // Breakdown

    resultBreakdown.innerHTML = "";

    subjects.forEach(function (subject) {

        const item = document.createElement("div");

        item.className = "breakdown-item";

        item.innerHTML = `
            <span class="breakdown-subject">
                ${escapeHTML(subject.name)}
            </span>

            <span class="breakdown-mark">
                ${subject.marks} / 100
            </span>

            <span class="breakdown-grade">
                ${subject.grade}
            </span>

            <span>
                ${subject.point.toFixed(1)}
            </span>
        `;

        resultBreakdown.appendChild(item);

    });


    // Show result

    resultSection.classList.remove("hidden");

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


// Prevent HTML injection in subject names

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// Reset

resetBtn.addEventListener("click", function () {

    const confirmReset =
        confirm("Are you sure you want to start again?");

    if (!confirmReset) {
        return;
    }

    studentNameInput.value = "";
    studentIdInput.value = "";

    subjectTable.innerHTML = `
        <tr class="subject-row">

            <td class="number">1</td>

            <td>
                <input
                    type="text"
                    class="subject-name"
                    placeholder="Subject name"
                >
            </td>

            <td>
                <input
                    type="number"
                    class="marks"
                    placeholder="0"
                    min="0"
                    max="100"
                >
            </td>

            <td>
                <span class="grade">-</span>
            </td>

            <td>
                <span class="grade-point">-</span>
            </td>

            <td>
                <button
                    class="delete-btn"
                    type="button"
                    title="Delete subject"
                >
                    🗑️
                </button>
            </td>

        </tr>

        <tr class="subject-row">

            <td class="number">2</td>

            <td>
                <input
                    type="text"
                    class="subject-name"
                    placeholder="Subject name"
                >
            </td>

            <td>
                <input
                    type="number"
                    class="marks"
                    placeholder="0"
                    min="0"
                    max="100"
                >
            </td>

            <td>
                <span class="grade">-</span>
            </td>

            <td>
                <span class="grade-point">-</span>
            </td>

            <td>
                <button
                    class="delete-btn"
                    type="button"
                    title="Delete subject"
                >
                    🗑️
                </button>
            </td>

        </tr>

        <tr class="subject-row">

            <td class="number">3</td>

            <td>
                <input
                    type="text"
                    class="subject-name"
                    placeholder="Subject name"
                >
            </td>

            <td>
                <input
                    type="number"
                    class="marks"
                    placeholder="0"
                    min="0"
                    max="100"
                >
            </td>

            <td>
                <span class="grade">-</span>
            </td>

            <td>
                <span class="grade-point">-</span>
            </td>

            <td>
                <button
                    class="delete-btn"
                    type="button"
                    title="Delete subject"
                >
                    🗑️
                </button>
            </td>

        </tr>
    `;


    document.querySelectorAll(".subject-row").forEach(function (row) {

        attachRowEvents(row);

    });


    resultSection.classList.add("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// Print

printBtn.addEventListener("click", function () {

    window.print();

});
