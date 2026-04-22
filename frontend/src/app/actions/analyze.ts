"use server";

export async function analyzeDataset(formData: FormData) {
  try {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Math Engine returned status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      return { data: null, error: data.message || data.error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("FastAPI connection failed:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to connect to Math Engine.",
    };
  }
}
