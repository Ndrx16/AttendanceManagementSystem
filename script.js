let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

// Navigation
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  updateDashboard();
}

// Add Student
document.getElementById("studentForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = studentName.value.trim();
  const roll = studentId.value.trim();
  if (!name || !roll) return alert("Enter valid details!");
  students.push({ name, roll });
  localStorage.setItem("students", JSON.stringify(students));
  displayStudents();
  updateDashboard();
  this.reset();
});

function displayStudents() {
  const list = document.getElementById("studentList");
  list.innerHTML = "";
  students.forEach(s => {
    list.innerHTML += `<li class="list-group-item bg-dark text-light border-secondary">${s.roll} - ${s.name}</li>`;
  });
}
displayStudents();

// Attendance
attendanceDate.addEventListener("change", generateAttendanceTable);

function generateAttendanceTable() {
  const container = document.getElementById("attendanceTableContainer");
  container.innerHTML = "";
  if (students.length === 0) return container.innerHTML = "<p class='text-light'>No students found.</p>";
  let html = `<table class='table table-dark table-striped'><thead><tr><th>Roll No</th><th>Name</th><th>Status</th></tr></thead><tbody>`;
  students.forEach(s => {
    html += `<tr class="attendance-row" data-roll="${s.roll}">
      <td>${s.roll}</td>
      <td>${s.name}</td>
      <td>
        <select class="form-select bg-dark text-light border-secondary">
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </td>
    </tr>`;
  });
  html += "</tbody></table>";
  container.innerHTML = html;
}

attendanceForm.addEventListener("submit", e => {
  e.preventDefault();
  const date = attendanceDate.value;
  if (!date) return alert("Select a date!");
  const rows = document.querySelectorAll(".attendance-row");
  attendance[date] = [];
  rows.forEach(r => {
    const roll = r.dataset.roll;
    const status = r.querySelector("select").value;
    attendance[date].push({ roll, status });
  });
  localStorage.setItem("attendance", JSON.stringify(attendance));
  alert("Attendance saved!");
  updateDashboard();
  generateReport();
});

// Reports
function generateReport() {
  const tbody = document.getElementById("reportBody");
  tbody.innerHTML = "";
  students.forEach(s => {
    let total = 0, present = 0;
    for (let d in attendance) {
      total++;
      const rec = attendance[d].find(a => a.roll === s.roll);
      if (rec && rec.status === "Present") present++;
    }
    const percent = total ? ((present / total) * 100).toFixed(1) : 0;
    tbody.innerHTML += `<tr><td>${s.roll}</td><td>${s.name}</td><td>${total}</td><td>${present}</td><td>${percent}%</td></tr>`;
  });
}
generateReport();

function generateDateWiseReport() {
  const date = dateSelect.value;
  const tbody = document.getElementById("datewiseBody");
  tbody.innerHTML = "";
  if (!attendance[date]) return;
  attendance[date].forEach(a => {
    const stu = students.find(s => s.roll === a.roll);
    tbody.innerHTML += `<tr><td>${a.roll}</td><td>${stu?.name || "-"}</td><td>${a.status}</td></tr>`;
  });
}

// Dashboard stats
function updateDashboard() {
  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("totalRecords").textContent = Object.keys(attendance).length;
  let totalDays = 0, totalPresent = 0;
  for (let d in attendance) {
    attendance[d].forEach(a => {
      totalDays++;
      if (a.status === "Present") totalPresent++;
    });
  }
  const avg = totalDays ? ((totalPresent / totalDays) * 100).toFixed(1) : 0;
  document.getElementById("avgAttendance").textContent = `${avg}%`;
}
updateDashboard();

// Reset
function resetData() {
  if (confirm("Are you sure to delete all data?")) {
    localStorage.clear();
    students = [];
    attendance = {};
    displayStudents();
    generateReport();
    updateDashboard();
  }
}
