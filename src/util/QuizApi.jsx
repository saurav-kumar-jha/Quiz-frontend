import axios from "axios";

const QuizApi = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true
})

export default QuizApi;