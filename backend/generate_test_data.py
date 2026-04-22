import numpy as np
import pandas as pd

np.random.seed(42)
n_samples = 1000

gender = np.random.choice(["Male", "Female"], size=n_samples)
experience = np.random.randint(1, 15, size=n_samples)
interview_score = np.random.randint(50, 100, size=n_samples)

threshold = np.where(gender == "Male", 65, 80)
hiring_decision = np.where(interview_score > threshold, 1, 0)

df = pd.DataFrame(
    {
        "Applicant_ID": range(1, n_samples + 1),
        "Gender": gender,
        "Years_Experience": experience,
        "Interview_Score": interview_score,
        "Hiring_Decision": hiring_decision,
    }
)

df.to_csv("test_hr_data.csv", index=False)
print("SUCCESS: test_hr_data.csv generated with intentional bias!")
