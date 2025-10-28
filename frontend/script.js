"use strict";

// Генерація матриці введення
function generateMatrix() {
  const size = parseInt(document.getElementById("size").value);
  const container = document.getElementById("matrixContainer");
  container.innerHTML = "";

  const table = document.createElement("table");
  table.className = "matrix-table";

  // Заголовок
  const headerRow = document.createElement("tr");
  for (let j = 0; j < size; j++) {
    const th = document.createElement("th");
    th.textContent = `x${j + 1}`;
    headerRow.appendChild(th);
  }
  const thB = document.createElement("th");
  thB.textContent = "b";
  thB.className = "vector-col";
  headerRow.appendChild(thB);
  table.appendChild(headerRow);

  // Рядки матриці
  for (let i = 0; i < size; i++) {
    const row = document.createElement("tr");

    // Елементи матриці A
    for (let j = 0; j < size; j++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.step = "0.01";
      input.id = `a${i}${j}`;
      input.value = i === j ? "1" : "0";
      td.appendChild(input);
      row.appendChild(td);
    }

    // Вектор b
    const tdB = document.createElement("td");
    tdB.className = "vector-col";
    const inputB = document.createElement("input");
    inputB.type = "number";
    inputB.step = "0.01";
    inputB.id = `b${i}`;
    inputB.value = "0";
    tdB.appendChild(inputB);
    row.appendChild(tdB);

    table.appendChild(row);
  }

  container.appendChild(table);
}

// Приклад матриці з діагональним домінуванням
function fillExample() {
  document.getElementById("size").value = "3";
  generateMatrix();

  // Приклад:
  // 4x1 - x2 + x3 = 7
  // x1 + 5x2 - 2x3 = -2
  // 2x1 + x2 + 4x3 = 3

  document.getElementById("a00").value = "4";
  document.getElementById("a01").value = "-1";
  document.getElementById("a02").value = "1";
  document.getElementById("b0").value = "7";

  document.getElementById("a10").value = "1";
  document.getElementById("a11").value = "5";
  document.getElementById("a12").value = "-2";
  document.getElementById("b1").value = "-2";

  document.getElementById("a20").value = "2";
  document.getElementById("a21").value = "1";
  document.getElementById("a22").value = "4";
  document.getElementById("b2").value = "3";
}

// Розв'язання методом Якобі
async function solveJacobi() {
  const size = parseInt(document.getElementById("size").value);
  const maxIterations = parseInt(
    document.getElementById("maxIterations").value
  );
  const tolerance = parseFloat(document.getElementById("tolerance").value);

  // Зібрати матрицю A
  const A = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const value = parseFloat(document.getElementById(`a${i}${j}`).value);
      row.push(value);
    }
    A.push(row);
  }

  // Зібрати вектор b
  const b = [];
  for (let i = 0; i < size; i++) {
    const value = parseFloat(document.getElementById(`b${i}`).value);
    b.push(value);
  }

  // Показати індикатор завантаження
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = '<p class="loading">Обчислення...</p>';

  try {
    const response = await fetch("http://127.0.0.1:5000/jacobi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        matrix: A,
        vector: b,
        max_iterations: maxIterations,
        tolerance: tolerance,
      }),
    });

    const data = await response.json();

    if (data.converged) {
      // Відображення результатів (успіх)
      let html = '<div class="success">';
      html += "<h3>✅ Розв'язок знайдено!</h3>";
      html += `<p><strong>Кількість ітерацій:</strong> ${data.iterations}</p>`;
      html += `<p><strong>Похибка:</strong> ${data.error.toExponential(4)}</p>`;
      html += "<h4>Розв'язок (x):</h4><ul>";
      data.solution.forEach((val, idx) => {
        html += `<li>x<sub>${idx + 1}</sub> = ${val.toFixed(6)}</li>`;
      });
      html += "</ul></div>";
      resultDiv.innerHTML = html;
      return;
    }
    // Якщо не зійшлося або є справжня помилка
    if (data.error) {
      resultDiv.innerHTML = `<div class="error">❌ Помилка: ${data.error}</div>`;
      if (data.warning) {
        resultDiv.innerHTML += `<p class="warning">⚠️ Попередження: Метод може не збігатися. Спробуйте змінити матрицю.</p>`;
      }
      return;
    }
    // Відображення результатів (метод не зійшовся)
    let html = '<div class="error">';
    html += "<h3>⚠️ Метод не зійшовся</h3>";
    html += `<p class="warning">${data.message || ""}</p>`;
    html += `<p><strong>Кількість ітерацій:</strong> ${data.iterations}</p>`;
    html += `<p><strong>Похибка:</strong> ${
      data.error ? data.error.toExponential(4) : ""
    }</p>`;
    html += "<h4>Розв'язок (x):</h4><ul>";
    if (data.solution) {
      data.solution.forEach((val, idx) => {
        html += `<li>x<sub>${idx + 1}</sub> = ${val.toFixed(6)}</li>`;
      });
    }
    html += "</ul></div>";
    resultDiv.innerHTML = html;
  } catch (error) {
    resultDiv.innerHTML = `<div class="error">❌ Помилка з'єднання: ${error.message}</div>`;
  }
}

// Ініціалізація при завантаженні сторінки
window.onload = function () {
  generateMatrix();
};
