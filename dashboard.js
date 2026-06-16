document.addEventListener("DOMContentLoaded", () => {
    const totalCountElement = document.getElementById("total-count");

    // 🌟 PASTE YOUR SAME GOOGLE WEB APP URL HERE:
    const googleWebAppUrl = "https://script.google.com/macros/s/AKfycbzu9AJlazyYBxT3cnnOLcO4965v6RHrwZncCUsac9WsS_Hb8LV65UKp_wbRfTSWdzFASw/exec";

    // Fetch the data from our Google Sheet API endpoint
    fetch(googleWebAppUrl)
        .then(response => response.json())
        .then(students => {
            // 1. Update the total registration counter card
            totalCountElement.textContent = students.length;
            // Dynamic Milestone Progress Calculation
const targetMilestone = 150;
const calculationPercentage = Math.min(((students.length / targetMilestone) * 100), 100).toFixed(1);
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");

// Delayed initialization for an elegant loading animation bar sweep
setTimeout(() => {
    if (progressFill && progressText) {
        progressFill.style.width = `${calculationPercentage}%`;
        progressText.textContent = `${calculationPercentage}% of Target Reached`;
    }
}, 400);

            // 2. Tally up the department counts automatically
            const deptCounts = {};
            students.forEach(student => {
                const dept = student.department || "General";
                deptCounts[dept] = (deptCounts[dept] || 0) + 1;
            });

            // 3. Separate tallied keys and values for Chart.js inputs
            const labels = Object.keys(deptCounts);
            const dataValues = Object.values(deptCounts);

            // 4. Render the beautiful, responsive Pie Chart
            const ctx = document.getElementById('departmentChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: dataValues,
                        backgroundColor: [
                            '#45f3ff', // Cyber Blue
                            '#dfa638', // E-Cell Yellow
                            '#ff4a4a', // Neon Red
                            '#a64aff', // Electric Purple
                            '#4aff4a'  // Lime Green
                        ],
                        borderWidth: 1,
                        borderColor: '#1f2833'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#c5c6c7' }
                        }
                    }
                }
            });
        })
        .catch(error => console.error("Error updating analytics engine dashboards:", error));
});