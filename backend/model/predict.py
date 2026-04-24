import sys
import os
import joblib
import pandas as pd

# ===== VALIDATION (UPDATED - IMPROVED) =====
VALID_RANGES = {
    "N": (0, 140),
    "P": (0, 145),
    "K": (0, 205),
    "temperature": (0, 50),
    "humidity": (0, 100),
    "ph": (3.5, 9.5),
    "rainfall": (0, 500)
}

def validate_input(values):
    keys = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    errors = []

    for i, key in enumerate(keys):
        value = values[i]
        min_val, max_val = VALID_RANGES[key]

        # ✅ TOO LOW
        if value < min_val:
            errors.append(f"{key} is too low ({value}). Minimum allowed is {min_val}")
        
        # ✅ TOO HIGH
        elif value > max_val:
            errors.append(f"{key} is too high ({value}). Maximum allowed is {max_val}")

    # ✅ SHOW ALL ERRORS TOGETHER
    if errors:
        print("Error:\n" + "\n".join(errors))
        sys.exit(1)

# ===== EXISTING CODE (UNCHANGED BELOW) =====

def make_prediction(n, p, k, temp, hum, ph, rain):
    # Get current script path
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'crop_nb_model.pkl')
    
    # Check if model exists
    if not os.path.exists(model_path):
        print(f"Error: Model file {model_path} not found. Please run train.py first.")
        sys.exit(1)
    
    # Load model
    model = joblib.load(model_path)
    
    # Prepare input for prediction
    # Feature order MUST match the training script: N, P, K, temperature, humidity, ph, rainfall
    features = [[n, p, k, temp, hum, ph, rain]]
    
    # Make prediction
    prediction = model.predict(features)
    return prediction[0]

if __name__ == "__main__":
    if len(sys.argv) < 8:
        print("Error: Not enough arguments provided. Expected 7 soil parameters.")
        sys.exit(1)
    
    try:
        # Get arguments (handle as floats)
        args = [float(arg) for arg in sys.argv[1:8]]

        # ===== VALIDATION CALL (ADDED) =====
        validate_input(args)

        result = make_prediction(*args)
        print(result)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)