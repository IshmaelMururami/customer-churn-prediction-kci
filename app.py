from flask import Flask, render_template, request
import joblib
import pandas as pd
import os

app = Flask(__name__)

# =========================================================
# MODEL CONFIGURATION
# =========================================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "objective2_customer_churn_random_forest.joblib"
)

model = joblib.load(MODEL_PATH)


# =========================================================
# HOME PAGE
# =========================================================

@app.route("/")
def home():
    return render_template("index.html")


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/health")
def health():
    return {
        "status": "online",
        "model": "loaded",
        "application": "Customer Churn Prediction System"
    }


# =========================================================
# PREDICTION
# =========================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        # -------------------------------------------------
        # Collect input values
        # -------------------------------------------------

        gender = request.form.get("Gender")
        age = request.form.get("Age")
        number_of_products = request.form.get("NumberOfProducts")
        active_member = request.form.get("IsActiveMember")
        complain = request.form.get("Complain")


        # -------------------------------------------------
        # Validate required fields
        # -------------------------------------------------

        if not all([
            gender,
            age,
            number_of_products,
            active_member,
            complain
        ]):
            return render_template(
                "index.html",
                error="Please complete all customer information before generating a prediction."
            )


        # -------------------------------------------------
        # Convert numerical values
        # -------------------------------------------------

        age = float(age)
        number_of_products = int(number_of_products)
        active_member = int(active_member)
        complain = int(complain)


        # -------------------------------------------------
        # Validate numerical ranges
        # -------------------------------------------------

        if age < 18 or age > 100:
            return render_template(
                "index.html",
                error="Age must be between 18 and 100."
            )

        if number_of_products < 1:
            return render_template(
                "index.html",
                error="Number of products must be at least 1."
            )


        # -------------------------------------------------
        # Prepare model input
        #
        # IMPORTANT:
        # NumOfProducts is the exact column name expected
        # by the Objective 2 trained pipeline.
        # -------------------------------------------------

        input_data = pd.DataFrame({
            "Complain": [complain],
            "Age": [age],
            "NumOfProducts": [number_of_products],
            "IsActiveMember": [active_member],
            "Gender": [gender]
        })


        # -------------------------------------------------
        # Generate prediction
        # -------------------------------------------------

        prediction = int(model.predict(input_data)[0])


        # Probability of class 1 = churn
        probability = float(
            model.predict_proba(input_data)[0][1] * 100
        )


        # -------------------------------------------------
        # Risk classification
        #
        # These bands are application-level decision
        # categories, not retrained model thresholds.
        # -------------------------------------------------

        if probability >= 70:
            risk_level = "High Risk"

        elif probability >= 40:
            risk_level = "Medium Risk"

        else:
            risk_level = "Low Risk"


        # -------------------------------------------------
        # Outcome interpretation
        # -------------------------------------------------

        if prediction == 1:

            result = "Customer predicted to churn."

            recommendation = (
                "The customer has been classified as a potential "
                "churn case. Consider prioritising this customer "
                "for appropriate retention engagement."
            )

        else:

            result = "Customer predicted to remain."

            recommendation = (
                "The customer has been classified as a lower-risk "
                "case. Continued engagement and service quality "
                "should be maintained."
            )


        # -------------------------------------------------
        # Customer profile for result page
        # -------------------------------------------------

        customer_profile = {
            "Gender": gender,
            "Age": int(age),
            "NumberOfProducts": number_of_products,
            "IsActiveMember": "Yes" if active_member == 1 else "No",
            "Complain": "Yes" if complain == 1 else "No"
        }


        # -------------------------------------------------
        # Render results
        # -------------------------------------------------

        return render_template(
            "result.html",

            prediction=prediction,

            probability=round(probability, 2),

            risk_level=risk_level,

            result=result,

            recommendation=recommendation,

            customer=customer_profile
        )


    except ValueError:

        return render_template(
            "index.html",
            error="Please enter valid customer information."
        )


    except Exception as e:

        print(f"Prediction error: {e}")

        return render_template(
            "index.html",
            error="The prediction could not be completed. Please check the entered information and try again."
        )


# =========================================================
# APPLICATION START
# =========================================================

if __name__ == "__main__":
    app.run(debug=False)