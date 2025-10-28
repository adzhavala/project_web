import time
import numpy as np

def heavy_task(n: int):
    total = 0
    for i in range(1, n+1):
        total += i
        time.sleep(0.2)  # імітуємо повільну роботу
    return total

def jacobi_method(A, b, max_iterations=100, tolerance=1e-10):
    """
    Метод Якобі для розв'язання системи лінійних рівнянь Ax = b
    
    Parameters:
    A - матриця коефіцієнтів (list of lists або numpy array)
    b - вектор вільних членів (list або numpy array)
    max_iterations - максимальна кількість ітерацій
    tolerance - точність (критерій зупинки)
    
    Returns:
    dict з результатами: розв'язок, кількість ітерацій, історія ітерацій
    """
    # Конвертуємо в numpy arrays
    A = np.array(A, dtype=float)
    b = np.array(b, dtype=float)
    n = len(b)
    
    # Перевірка на діагональне домінування
    for i in range(n):
        diagonal = abs(A[i][i])
        sum_others = sum(abs(A[i][j]) for j in range(n) if j != i)
        if diagonal <= sum_others:
            return {
                "error": f"Матриця не має діагонального домінування на рядку {i+1}. Метод може не зійтися.",
                "warning": True
            }
    
    # Початкове наближення (нульовий вектор)
    x = np.zeros(n)
    iterations_history = []

    for iteration in range(max_iterations):
        x_new = np.zeros(n)
        for i in range(n):
            s = sum(A[i][j] * x[j] for j in range(n) if j != i)
            x_new[i] = (b[i] - s) / A[i][i]

        error = np.linalg.norm(x_new - x, ord=np.inf)
        iterations_history.append({
            "iteration": iteration + 1,
            "x": x_new.tolist(),
            "error": float(error)
        })

        if error < tolerance:
            return {
                "success": True,
                "solution": x_new.tolist(),
                "iterations": iteration + 1,
                "error": float(error),
                "history": iterations_history,
                "converged": True
            }
        x = x_new.copy()

    # Якщо не зійшлося за максимальну кількість ітерацій
    return {
        "success": False,
        "solution": x.tolist(),
        "iterations": max_iterations,
        "error": float(np.linalg.norm(x_new - x, ord=np.inf)),
        "history": iterations_history,
        "converged": False,
        "message": "Метод не зійшовся за задану кількість ітерацій"
    }
