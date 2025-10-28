# Run:
#   python -m pip install flask flask-cors
#   cd /Users/annadzhavala/Desktop/project_web/backend
#   python app.py

try:
    from flask import Flask, jsonify, request
    from flask_cors import CORS
except ModuleNotFoundError as e:
    raise SystemExit(
        f"Помилка: {e}\n"
        "Встановіть залежності:\n"
        "  python -m pip install flask flask-cors\n"
        "або:\n"
        "  python -m pip install -r /Users/annadzhavala/Desktop/project_web/requirements.txt"
    )

import tasks

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  

@app.route("/")
def home():
    return jsonify({"message": "Backend працює!"})

@app.route("/task", methods=["POST"])
def run_task():
    data = request.get_json()
    n = data.get("n", 5)
    result = tasks.heavy_task(n)
    return jsonify({"result": result})

@app.route("/jacobi", methods=["POST"])
def run_jacobi():
    try:
        data = request.get_json()
        
        # Отримуємо дані з запиту
        A = data.get("matrix")
        b = data.get("vector")
        max_iterations = data.get("max_iterations", 100)
        tolerance = data.get("tolerance", 1e-10)
        
        # Валідація
        if not A or not b:
            return jsonify({"error": "Матриця та вектор обов'язкові"}), 400
        
        if len(A) != len(b):
            return jsonify({"error": "Розмірності матриці та вектора не збігаються"}), 400
        
        # Викликаємо метод Якобі
        result = tasks.jacobi_method(A, b, max_iterations, tolerance)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
