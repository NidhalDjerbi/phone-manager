import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getPhones = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createPhone = async (phoneData) => {
  const res = await axios.post(API_URL, phoneData);
  return res.data;
};

export const updatePhone = async ({ id, data }) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deletePhone = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
