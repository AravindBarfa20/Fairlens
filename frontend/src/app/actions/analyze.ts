"use server";

export async function analyzeDataset(formData: FormData) {
  try {
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return {
        data: null,
        error: `No valid file received. Got: ${typeof file}`,
      };
    }

    console.log(
      `[analyzeDataset] File: name=${file.name}, size=${file.size}, type=${file.type}`
    );

    // Read the file into a Buffer/Blob to ensure it transfers correctly
    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type || "text/csv" });

    // Reconstruct clean FormData for FastAPI
    const outbound = new FormData();
    outbound.append("file", blob, file.name || "upload.csv");

    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: outbound,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[analyzeDataset] FastAPI error:", response.status, text);
      throw new Error(`Math Engine returned status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      return { data: null, error: data.message || data.error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("[analyzeDataset] Failed:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to connect to Math Engine.",
    };
  }
}
