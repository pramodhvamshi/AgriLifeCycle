# 🌾 Agri LifeCycle  
### Intelligent Crop Planning and Post-Harvest Decision Support System  

---

## 📌 Overview  
**Agri LifeCycle** is a smart agriculture decision-support system designed to assist farmers across the entire crop lifecycle:

- 🌱 **Pre-Harvest** – Crop Recommendation & Planning  
- 🌾 **Harvest** – Quality Assessment  
- 📦 **Post-Harvest** – Market Analysis & Decision Support  

The system integrates **Machine Learning + Expert Validation** to provide reliable, real-world agricultural recommendations.

---

## 🎯 Key Features  

### 👨‍🌾 Farmer Features  
- Enter soil and environmental data  
- Get ML-based crop recommendations  
- Submit harvest details  
- View quality grading  
- View market trends  
- Receive post-harvest advice  

### 🤖 Machine Learning Features  
- Crop recommendation using **Random Forest**  
- Market trend analysis using **Regression / Rule-based logic**  
- Data-driven decision support  

### 👨‍🔬 Expert Validation (Core Feature ⭐)  
At every stage:  
- Expert reviews system output  
- Approves or modifies results  
- Adds recommendations  

Displayed as:  
- ✅ Verified by Expert  
- 📌 Expert Notes  
- 🔘 View Expert Recommendation  

---

## 🌾 Modules  

### 1️⃣ Pre-Harvest Module  
- Soil data input  
- Crop recommendation (ML)  
- Expert validation  
- Crop planning suggestions  

### 2️⃣ Quality Assessment Module  
- Rule-based grading (**A / B / C**)  
- Based on moisture, damage, maturity  
- Expert validation  

### 3️⃣ Market Intelligence Module  
- Price trend analysis  
- Future price prediction (basic ML)  

### 4️⃣ Post-Harvest Decision Module  
Suggests:  
- Sell  
- Store  
- Process  

Based on:  
- Quality grade  
- Market trends  
- Expert validation  

---

## 📊 Visualization & Reports  
- Market price graphs  
- Recommendation results  
- Downloadable reports  

---

## 🔄 System Workflow  
Farmer Login
↓
Enter Soil Data
↓
ML Crop Recommendation
↓
Expert Validation
↓
Final Recommendation
↓
Enter Harvest Details
↓
Quality Assessment
↓
Expert Validation
↓
Market Prediction
↓
Post-Harvest Decision
↓
Expert Validation
↓
Final Advice to Farmer


---

## 🧠 Technology Stack  

### 💻 Frontend  
- React.js  
- HTML, CSS, JavaScript  
- Tailwind / Bootstrap  

### ⚙️ Backend  
- Node.js  
- Express.js  

### 🤖 Machine Learning  
- Python  
- Scikit-learn  
- Pandas  
- NumPy  

### 🗄️ Database  
- MongoDB  

### 🔗 Integration  
- Node.js executes Python scripts for ML predictions  
- Model stored using **pickle**  

---

## 📂 Datasets Used  

### 1️⃣ Crop Recommendation Dataset  
**Features:**  
- N, P, K  
- Temperature  
- Humidity  
- pH  
- Rainfall  

**Output:**  
- Crop label  

### 2️⃣ Market Price Dataset  
- Crop name  
- Market location  
- Date  
- Price  

---

## ⚙️ System Architecture  

The system follows a **3-layer architecture**:

- **Presentation Layer** → User Interface (React)  
- **Application Layer** → Business Logic + ML Integration  
- **Data Layer** → Database + Datasets  

---

## 🔗 API Endpoints  

### 🔐 Authentication  
- `POST /login`  
- `POST /register`  

### 🌱 Core Features  
- `POST /predict-crop`  
- `POST /submit-harvest`  
- `GET  /market-trend`  
- `POST /post-harvest-decision`  

### 👨‍🔬 Expert APIs  
- `GET  /expert/recommendations`  
- `POST /expert/approve-crop`  
- `POST /expert/validate-quality`  
- `POST /expert/post-harvest-review`  

---

## ⭐ Unique Features  
- End-to-end lifecycle support  
- Integration of **ML + Expert Knowledge**  
- Real-time decision support  
- Practical and scalable system design  

---

## 🎓 Use Case  

This system helps farmers to:  
- Choose the right crop  
- Assess crop quality  
- Decide when to sell or store  
- Improve profit and reduce loss  

---

## 🚀 Future Enhancements  
- 📷 Image-based crop quality detection  
- 🌦️ Real-time weather API integration  
- 📱 Mobile application support  
- 🧠 Advanced ML models (Deep Learning)  

---

## 👨‍💻 Contributors  
- **B. Pramodh Vamshi**  


---
