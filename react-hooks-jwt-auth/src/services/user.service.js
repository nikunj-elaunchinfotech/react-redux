import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const postEmployee = (employee) => {
  return axios.post(API_URL + "employee/add", employee , { headers: authHeader() });
};

const getEmployeeList = (params) => {
  return axios.get(API_URL + "employee/list", {
    params: {
      page: params.page,
      size: params.size,
      title: params.title,
    },
    headers: authHeader(),
  });
};

const getEmployee = (id) => {
  return axios.get(API_URL + "employee/findOne/" + id, {
    headers: authHeader(),
  });
};

// EmployeeUpdate
const EmployeeUpdate = (id, employee) => {
  return axios.put(API_URL + "employee/update/" + id, employee, {
    headers: authHeader(),
  });
};

// EmployeeDelete
const EmployeeDelete = (id) => {
  return axios.delete(API_URL + "employee/delete/" + id, {
    headers: authHeader(),
  });
};

const CountriesData = (title, id) => {
  return axios.get(API_URL + "countries", {
    params: {
      offset: 0,
      title: title,
      country_id: id,
    },
    headers: authHeader(),
  });
};

const StatesData = (country_code, title, state_id) => {
  return axios.get(API_URL + "states", {
    params: {
      offset: 0,
      title: title,
      country_code: country_code,
      state_id: state_id || "",
    },
    headers: authHeader(),
  });
};

const CityData = (country_code,state_code, title, city_id) => {
  return axios.get(API_URL + "cities", {
    params: {
      offset: 0,
      title: title,
      country_code: country_code,
      state_code: state_code,
      city_id: city_id || "",
    },
    headers: authHeader(),
  });
};


export default {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  postEmployee,
  getEmployeeList,
  getEmployee,
  EmployeeUpdate,
  EmployeeDelete,
  CountriesData,
  StatesData,
  CityData
};
