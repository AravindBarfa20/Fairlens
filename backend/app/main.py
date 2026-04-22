import io
import math

import pandas as pd
from aif360.datasets import StandardDataset
from aif360.metrics import BinaryLabelDatasetMetric
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sklearn.preprocessing import LabelEncoder

app = FastAPI(title="FairLens API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _read_csv_with_fallbacks(contents: bytes) -> pd.DataFrame:
    encodings = ("utf-8", "utf-8-sig", "latin-1", "cp1252")
    last_error = None

    for encoding in encodings:
        try:
            return pd.read_csv(io.BytesIO(contents), encoding=encoding)
        except UnicodeDecodeError as exc:
            last_error = exc

    raise ValueError("Unable to decode CSV with supported encodings.") from last_error


def _coerce_binary_column(df: pd.DataFrame, column: str) -> tuple[pd.DataFrame, dict[str, int]]:
    encoded = df.copy()
    series = encoded[column].fillna("missing").astype(str).str.strip()
    encoder = LabelEncoder()
    encoded[column] = encoder.fit_transform(series)
    mapping = {label: int(index) for index, label in enumerate(encoder.classes_)}
    return encoded, mapping


def _encode_all_categoricals(df: pd.DataFrame) -> pd.DataFrame:
    """Label-encode every remaining object/category column so AIF360 gets a fully numeric DataFrame."""
    encoded = df.copy()
    for col in encoded.select_dtypes(include=["object", "category", "bool"]).columns:
        series = encoded[col].fillna("missing").astype(str).str.strip()
        le = LabelEncoder()
        encoded[col] = le.fit_transform(series)
    # Fill any remaining NaN values
    encoded = encoded.fillna(0)
    return encoded


def _to_float(value: float) -> float:
    if value is None or not math.isfinite(value):
        return 0.0
    return float(value)


@app.get("/")
def read_root():
    return {"status": "FairLens Math Engine is Online"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "model": "AIF360"}


@app.post("/analyze")
async def analyze_csv(
    file: UploadFile = File(...),
    target_col: str = Form(None),
    protected_col: str = Form(None),
):
    try:
        contents = await file.read()
        
        # Guardrails: file size and format
        if len(contents) > 50 * 1024 * 1024:
            raise ValueError("File too large. Maximum allowed size is 50MB.")
        if not file.filename.endswith('.csv'):
            raise ValueError("File must be a CSV format.")

        df = _read_csv_with_fallbacks(contents)

        if df.empty or len(df.columns) < 2:
            raise ValueError("CSV must contain at least 2 columns and 1 row of data.")

        # Drop columns that are purely identifiers (unique per row)
        id_cols = [c for c in df.columns if df[c].nunique() == len(df) and df[c].dtype == "object"]
        df = df.drop(columns=id_cols, errors="ignore")

        if not target_col or target_col not in df.columns:
            target_col = df.columns[-1]

        if not protected_col or protected_col not in df.columns:
            categorical_columns = [
                column
                for column in df.select_dtypes(include=["object", "category"]).columns
                if column != target_col
            ]
            protected_col = (
                categorical_columns[0]
                if categorical_columns
                else next((column for column in df.columns if column != target_col), df.columns[0])
            )

        if target_col == protected_col:
            raise ValueError("Target and protected columns must be different.")

        # Encode target + protected first (so we can capture their mappings)
        encoded_df, target_mapping = _coerce_binary_column(df, target_col)
        encoded_df, protected_mapping = _coerce_binary_column(encoded_df, protected_col)

        # Encode ALL remaining categorical columns
        encoded_df = _encode_all_categoricals(encoded_df)

        favorable_label = 1 if encoded_df[target_col].nunique() > 1 else 0
        privileged_val = 1 if encoded_df[protected_col].nunique() > 1 else 0
        unprivileged_val = 0

        dataset = StandardDataset(
            df=encoded_df,
            label_name=target_col,
            favorable_classes=[favorable_label],
            protected_attribute_names=[protected_col],
            privileged_classes=[[privileged_val]],
        )

        metric = BinaryLabelDatasetMetric(
            dataset,
            unprivileged_groups=[{protected_col: unprivileged_val}],
            privileged_groups=[{protected_col: privileged_val}],
        )

        disparate_impact = _to_float(metric.disparate_impact())
        demographic_parity_difference = _to_float(metric.mean_difference())
        is_biased = disparate_impact < 0.80 or disparate_impact > 1.25

        return {
            "targetColumn": target_col,
            "protectedAttribute": protected_col,
            "disparateImpact": disparate_impact,
            "demographicParityDifference": demographic_parity_difference,
            "isBiased": is_biased,
            "flaggedFeatures": [protected_col],
            "encoding": {
                "target": target_mapping,
                "protected": protected_mapping,
            },
        }
    except Exception as exc:
        import traceback
        traceback.print_exc()
        return {"error": str(exc), "message": "Failed to parse dataset."}
