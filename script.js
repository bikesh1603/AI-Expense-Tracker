// =====================
// STORAGE
// =====================

let expenses =
  JSON.parse(
    localStorage.getItem("expenses")
  ) || [];

let budget =
  Number(
    localStorage.getItem("budget")
  ) || 0;

// =====================
// ELEMENTS
// =====================

const expenseList =
  document.getElementById("expense-list");

const totalElement =
  document.getElementById("total");

const searchInput =
  document.getElementById("search");

const filterMonth =
  document.getElementById("filter-month");

const themeToggle =
  document.getElementById("theme-toggle");

const budgetAmount =
  document.getElementById("budget-amount");

const remainingElement =
  document.getElementById("remaining");

const progressBar =
  document.getElementById("progress-bar");

const alertElement =
  document.getElementById("alert");

const insightsElement =
  document.getElementById("insights");

const healthScoreElement =
  document.getElementById("health-score");

const healthMessage =
  document.getElementById("health-message");

const languageSelect =
  document.getElementById("language-select");

let chart;
let barChart;

// =====================
// LANGUAGE SUPPORT
// =====================

const translations = {

  en: {

    title:
      "AI Expense Tracker 🤖",

    subtitle:
      "Smart Financial Dashboard",

    addExpense:
      "Add Expense",

    search:
      "Search Expenses...",

    insights:
      "AI Spending Insights 🤖",

    expenses:
      "Recent Expenses",

    exportCSV:
      "Export CSV",

    exportPDF:
      "Export PDF"
  },

  hi: {

    title:
      "एआई खर्च ट्रैकर 🤖",

    subtitle:
      "स्मार्ट वित्तीय डैशबोर्ड",

    addExpense:
      "खर्च जोड़ें",

    search:
      "खर्च खोजें...",

    insights:
      "एआई खर्च विश्लेषण 🤖",

    expenses:
      "हाल के खर्च",

    exportCSV:
      "CSV डाउनलोड",

    exportPDF:
      "PDF डाउनलोड"
  }
};

// CHANGE LANGUAGE

function changeLanguage(lang) {

  localStorage.setItem(
    "language",
    lang
  );

  document.querySelector(
    ".top-bar h1"
  ).innerText =
    translations[lang].title;

  document.querySelector(
    ".subtitle"
  ).innerText =
    translations[lang].subtitle;

  searchInput.placeholder =
    translations[lang].search;

  document.querySelector(
    ".form-container button"
  ).innerText =
    translations[lang].addExpense;

  document.querySelectorAll("h2")[5]
    .innerText =
    translations[lang].insights;

  document.querySelector(
    ".expense-header h2"
  ).innerText =
    translations[lang].expenses;

  document.querySelectorAll(
    ".buttons button"
  )[0].innerText =
    translations[lang].exportCSV;

  document.querySelectorAll(
    ".buttons button"
  )[1].innerText =
    translations[lang].exportPDF;
}

// LOAD SAVED LANGUAGE

const savedLanguage =
  localStorage.getItem("language") || "en";

languageSelect.value =
  savedLanguage;

changeLanguage(savedLanguage);

// LANGUAGE EVENT

languageSelect.addEventListener(
  "change",
  (e) => {

    changeLanguage(e.target.value);
  }
);

// =====================
// DARK MODE
// =====================

const savedTheme =
  localStorage.getItem("theme");

if (savedTheme === "dark") {

  document.body.classList.add("dark");

  themeToggle.innerText =
    "Light Mode";
}

themeToggle.addEventListener(
  "click",
  () => {

    document.body.classList.toggle("dark");

    if (
      document.body.classList.contains("dark")
    ) {

      localStorage.setItem(
        "theme",
        "dark"
      );

      themeToggle.innerText =
        "Light Mode";

    } else {

      localStorage.setItem(
        "theme",
        "light"
      );

      themeToggle.innerText =
        "Dark Mode";
    }
  }
);

// =====================
// ADD EXPENSE
// =====================

function addExpense() {

  const title =
    document.getElementById("title").value;

  const amount =
    document.getElementById("amount").value;

  const category =
    document.getElementById("category").value;

  const wallet =
    document.getElementById("wallet").value;

  const month =
    document.getElementById("month").value;

  if (!title || !amount || !month) {

    alert("Fill all fields");

    return;
  }

  const expense = {

    id: Date.now(),

    title,

    amount: Number(amount),

    category,

    wallet,

    month
  };

  expenses.push(expense);

  saveExpenses();

  populateMonthFilter();

  renderExpenses();

  document.getElementById("title").value = "";

  document.getElementById("amount").value = "";
}

// =====================
// SAVE EXPENSES
// =====================

function saveExpenses() {

  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );
}

// =====================
// SAVE BUDGET
// =====================

function saveBudget() {

  budget =
    Number(
      document.getElementById("budget").value
    );

  localStorage.setItem(
    "budget",
    budget
  );

  updateBudgetUI();
}

// =====================
// BUDGET UI
// =====================

function updateBudgetUI() {

  let totalSpent = 0;

  expenses.forEach(expense => {

    totalSpent += expense.amount;
  });

  budgetAmount.innerText = budget;

  remainingElement.innerText =
    budget - totalSpent;

  const percent =
    budget > 0
      ? (totalSpent / budget) * 100
      : 0;

  progressBar.style.width =
    `${percent}%`;

  if (percent < 70) {

    progressBar.style.background =
      "lime";

  } else if (percent < 100) {

    progressBar.style.background =
      "orange";

  } else {

    progressBar.style.background =
      "red";

    alertElement.innerText =
      "⚠ Budget Exceeded!";
  }

  if (percent < 100) {

    alertElement.innerText = "";
  }
}

// =====================
// AI INSIGHTS
// =====================

function generateInsights() {

  insightsElement.innerHTML = "";

  if (expenses.length === 0) {

    return;
  }

  let totalSpent = 0;

  const categoryTotals = {};

  expenses.forEach(expense => {

    totalSpent += expense.amount;

    if (categoryTotals[expense.category]) {

      categoryTotals[expense.category] +=
        expense.amount;

    } else {

      categoryTotals[expense.category] =
        expense.amount;
    }
  });

  let highestCategory = "";
  let highestAmount = 0;

  for (let category in categoryTotals) {

    if (
      categoryTotals[category] >
      highestAmount
    ) {

      highestAmount =
        categoryTotals[category];

      highestCategory = category;
    }
  }

  addInsight(
    `⚠ Highest spending:
     ${highestCategory}
     ₹${highestAmount}`
  );

  if (totalSpent > budget) {

    addInsight(
      "🚨 You exceeded your budget."
    );

  } else {

    addInsight(
      "✅ Budget is under control."
    );
  }
}

function addInsight(message) {

  const div =
    document.createElement("div");

  div.classList.add("insight-item");

  div.innerText = message;

  insightsElement.appendChild(div);
}

// =====================
// HEALTH SCORE
// =====================

function calculateHealthScore() {

  if (
    budget <= 0 ||
    expenses.length === 0
  ) {

    healthScoreElement.innerText = "0";

    healthMessage.innerText =
      "Add expenses and budget.";

    return;
  }

  let totalSpent = 0;

  expenses.forEach(expense => {

    totalSpent += expense.amount;
  });

  let score = 100;

  const budgetPercent =
    (totalSpent / budget) * 100;

  if (budgetPercent > 100) {

    score -= 40;

  } else if (budgetPercent > 80) {

    score -= 20;
  }

  if (score < 0) {

    score = 0;
  }

  animateScore(score);

  if (score >= 80) {

    healthMessage.innerText =
      "✅ Excellent Financial Health";

  } else if (score >= 60) {

    healthMessage.innerText =
      "👍 Good Financial Health";

  } else {

    healthMessage.innerText =
      "🚨 Poor Financial Health";
  }
}

// SCORE ANIMATION

function animateScore(targetScore) {

  let current = 0;

  const interval = setInterval(() => {

    current++;

    healthScoreElement.innerText =
      current;

    if (current >= targetScore) {

      clearInterval(interval);
    }

  }, 15);
}

// =====================
// RENDER EXPENSES
// =====================

function renderExpenses() {

  expenseList.innerHTML = "";

  let total = 0;

  let filteredExpenses = [...expenses];

  const searchText =
    searchInput.value.toLowerCase();

  filteredExpenses =
    filteredExpenses.filter(expense =>
      expense.title
        .toLowerCase()
        .includes(searchText)
    );

  const selectedMonth =
    filterMonth.value;

  if (selectedMonth !== "all") {

    filteredExpenses =
      filteredExpenses.filter(
        expense =>
          expense.month === selectedMonth
      );
  }

  filteredExpenses.forEach(expense => {

    total += expense.amount;

    const div =
      document.createElement("div");

    div.classList.add("expense-item");

    div.innerHTML = `
      <div>
        <strong>${expense.title}</strong><br>

        ${expense.category}<br>

        💳 ${expense.wallet}<br>

        ${expense.month}
      </div>

      <div>

        ₹${expense.amount}

        <button onclick="editExpense(${expense.id})">
          Edit
        </button>

        <button onclick="deleteExpense(${expense.id})">
          X
        </button>

      </div>
    `;

    expenseList.appendChild(div);
  });

  totalElement.innerText = total;

  updateChart(filteredExpenses);

  updateBudgetUI();

  generateInsights();

  calculateHealthScore();
}

// =====================
// DELETE
// =====================

function deleteExpense(id) {

  expenses =
    expenses.filter(
      expense => expense.id !== id
    );

  saveExpenses();

  renderExpenses();
}

// =====================
// EDIT
// =====================

function editExpense(id) {

  const expense =
    expenses.find(
      expense => expense.id === id
    );

  document.getElementById("title").value =
    expense.title;

  document.getElementById("amount").value =
    expense.amount;

  document.getElementById("category").value =
    expense.category;

  document.getElementById("wallet").value =
    expense.wallet;

  document.getElementById("month").value =
    expense.month;

  deleteExpense(id);
}

// =====================
// CHARTS
// =====================

function updateChart(filteredExpenses) {

  const categories = {};

  filteredExpenses.forEach(expense => {

    if (categories[expense.category]) {

      categories[expense.category] +=
        expense.amount;

    } else {

      categories[expense.category] =
        expense.amount;
    }
  });

  const ctxPie =
    document.getElementById("expenseChart");

  if (chart) chart.destroy();

  chart = new Chart(ctxPie, {

    type: "pie",

    data: {

      labels: Object.keys(categories),

      datasets: [{
        data: Object.values(categories)
      }]
    }
  });

  const ctxBar =
    document.getElementById("barChart");

  if (barChart) barChart.destroy();

  barChart = new Chart(ctxBar, {

    type: "bar",

    data: {

      labels: Object.keys(categories),

      datasets: [{
        label: "Category Spending",
        data: Object.values(categories)
      }]
    }
  });
}

// =====================
// MONTH FILTER
// =====================

function populateMonthFilter() {

  const months =
    [...new Set(
      expenses.map(expense => expense.month)
    )];

  filterMonth.innerHTML =
    `<option value="all">
      All Months
    </option>`;

  months.forEach(month => {

    const option =
      document.createElement("option");

    option.value = month;

    option.innerText = month;

    filterMonth.appendChild(option);
  });
}

// =====================
// CSV EXPORT
// =====================

function downloadCSV() {

  let csv =
    "Title,Amount,Category,Wallet,Month\n";

  expenses.forEach(expense => {

    csv +=
      `${expense.title},
       ${expense.amount},
       ${expense.category},
       ${expense.wallet},
       ${expense.month}\n`;
  });

  const blob =
    new Blob([csv], { type: "text/csv" });

  const url =
    window.URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = "expenses.csv";

  a.click();
}

// =====================
// PDF EXPORT
// =====================

function downloadPDF() {

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.text(
    "Expense Report",
    20,
    20
  );

  let y = 40;

  expenses.forEach(expense => {

    doc.text(
      `${expense.title}
       ₹${expense.amount}
       ${expense.category}
       ${expense.wallet}
       ${expense.month}`,
      20,
      y
    );

    y += 10;
  });

  doc.save("expenses.pdf");
}

// =====================
// EVENTS
// =====================

searchInput.addEventListener(
  "input",
  renderExpenses
);

filterMonth.addEventListener(
  "change",
  renderExpenses
);

// =====================
// INITIAL LOAD
// =====================

populateMonthFilter();

renderExpenses();

updateBudgetUI();

generateInsights();

calculateHealthScore();

// =====================
// SERVICE WORKER
// =====================

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("service-worker.js")

        .then(() => {

          console.log(
            "Service Worker Registered"
          );
        })

        .catch((error) => {

          console.log(
            "Service Worker Failed",
            error
          );
        });
    }
  );
}