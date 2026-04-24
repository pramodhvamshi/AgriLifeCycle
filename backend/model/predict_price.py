import sys
import pandas as pd
import numpy as np
import json
import warnings
import os

from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor

warnings.filterwarnings("ignore")

# ✅ Crop Mapping
CROP_MAPPING = {
    "blackgram": "black gram",
    "muskmelon": "musk",
    "pigeonpeas": "peas(dry)",
    "kidneybeans": "beans",
    "mungbean": "beans",
    "mothbeans": "beans"
}

# Convert Week → Numeric Time
def convert_week(w):
    month_map = {"feb": 1, "mar": 2, "apr": 3}
    parts = w.lower().split("_")
    month = month_map[parts[0]]
    week = int(parts[1].replace("week", ""))
    return month * 4 + week


def predict_price(crop_name):
    try:
        # ---------------------------
        # LOAD DATASET
        # ---------------------------
        dataset_path = 'final_dataset.csv'
        if not os.path.exists(dataset_path):
            dataset_path = os.path.join('..', 'final_dataset.csv')

        df = pd.read_csv(dataset_path)

        # Normalize crop names
        df["Crop"] = df["Crop"].str.strip().str.lower()

        df["Crop"] = df["Crop"].replace({
            "black gram": "black gram",
            "musk melon": "musk",
            "water melon": "watermelon",
            "mung beans": "beans",
            "moth beans": "beans",
            "kidney beans": "beans"
        })

        crop_name = crop_name.strip().lower()

        if crop_name in CROP_MAPPING:
            crop_name = CROP_MAPPING[crop_name]

        crop_df = df[df["Crop"] == crop_name]

        if crop_df.empty:
            return {"error": f"No data found for crop: {crop_name}"}

        # ---------------------------
        # FEATURE ENGINEERING
        # ---------------------------
        crop_df["Time"] = crop_df["Week"].apply(convert_week)
        crop_df = crop_df.sort_values("Time")

        if len(crop_df) < 5:
            return {"error": "Not enough data for prediction"}

        # ---------------------------
        # TRAIN / TEST SPLIT
        # ---------------------------
        train = crop_df.iloc[:-1]
        test = crop_df.iloc[-1:]

        X_train = train[["Time"]]
        y_train = train["Price"]

        X_test = test[["Time"]]
        y_test = test["Price"]

        # ---------------------------
        # MULTI-MODEL TRAINING
        # ---------------------------
        models = {
            "RandomForest": RandomForestRegressor(n_estimators=100, random_state=42),
            "LinearRegression": LinearRegression(),
            "DecisionTree": DecisionTreeRegressor()
        }

        model_errors = {}

        for name, model in models.items():
            model.fit(X_train, y_train)
            pred = model.predict(X_test)[0]
            error = abs(y_test.values[0] - pred)
            model_errors[name] = error

        # ---------------------------
        # SELECT BEST MODEL
        # ---------------------------
        best_model_name = min(model_errors, key=model_errors.get)
        best_model = models[best_model_name]

        # Train on full data
        X_full = crop_df[["Time"]]
        y_full = crop_df["Price"]

        best_model.fit(X_full, y_full)

        # ---------------------------
        # PREDICTION
        # ---------------------------
        current_price = float(crop_df["Price"].iloc[-1])
        last_time = crop_df["Time"].max()

        future_times = np.array(range(last_time + 1, last_time + 8)).reshape(-1, 1)
        next_prices = best_model.predict(future_times)
        next_prices = [round(float(p), 2) for p in next_prices]

        # ---------------------------
        # OUTPUT
        # ---------------------------
        return {
            "current_price": current_price,
            "next_7_days": next_prices,
            "predicted_next_week": next_prices[-1],
            "mae": round(float(model_errors[best_model_name]), 2),
            "model_used": best_model_name,   # ⭐ IMPORTANT
            "crop": crop_name
        }

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No crop name provided"}))
        sys.exit(1)

    crop = sys.argv[1]
    result = predict_price(crop)
    print(json.dumps(result))