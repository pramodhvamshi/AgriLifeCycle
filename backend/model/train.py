import pandas as pd
from sklearn.naive_bayes import GaussianNB
import joblib
import os

def train_model():
    # Define paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # The CSV is in the root directory
    csv_path = os.path.join(base_dir, '..', '..', 'Crop_recommendation.csv')
    model_path = os.path.join(base_dir, 'crop_nb_model.pkl')

    print(f"Loading dataset from: {csv_path}")
    
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        return

    # Load data
    df = pd.read_csv(csv_path)

    # Features and Target
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']

    # Initialize and train Naive Bayes (Gaussian NB)
    model = GaussianNB()
    model.fit(X, y)

    # Save the model
    joblib.dump(model, model_path)
    print(f"Model trained and saved to: {model_path}")

if __name__ == "__main__":
    train_model()
