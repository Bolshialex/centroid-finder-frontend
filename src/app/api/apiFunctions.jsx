import axios from "axios";
const API_URL = "http://localhost:3000";

export async function getVideos() {
  try {
    const res = await axios.get(`${API_URL}/api/videos`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching Videos:", error);
    throw error;
  }
}

export async function getThumbnail(video) {
  try {
    const res = await axios.get(`${API_URL}/thumbnail/${video}`, {
      responseType: "blob",
    });

    return URL.createObjectURL(res.data);
  } catch (error) {
    console.error("Error fetching Thumbnail:", error);
    throw error;
  }
}

export async function startProcess(params) {}

export async function getStatus(id) {
  try {
    const res = await axios.get(`${API_URL}/process/${id}/status`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching Status:", error);
    throw error;
  }
}
