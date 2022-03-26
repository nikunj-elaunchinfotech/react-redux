import React, { useState, useRef, useEffect } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import Select from "react-select";
import UserService from "../services/user.service";
import { useLocation } from "react-router-dom";
import AsyncSelect from "react-select/async";
import useDocumentTitle from "@rehooks/document-title";


const required = (value) => {
  if (!value) {
    return (
      <label className="text-danger" role="alert">This field is required!</label>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <label className="text-danger" role="alert">This is not a valid email.</label>
    );
  }
};

const vfirstname = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <label className="text-danger" role="alert">The First name must be between 3 and 20 characters.</label>
    );
  }
};

const vlastname = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <label className="text-danger" role="alert">The Last name must be between 3 and 20 characters.</label>
    );
  }
};

const Employee = (props) => {
  const form = useRef();
  const checkBtn = useRef();
  const location = useLocation();

  const [employeeId, setEmployeeId] = useState(null);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [addressId, setAddressId] = useState("");
  const [temporaryAddress, setTemporaryAddress] = useState({
    street: "",
    city: {},
    state: {},
    country: {},
  });
  const [permanentAddress, setPermanentAddress] = useState({
    street: "",
    city: {},
    state: {},
    country: {},
  });
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const [inputValue, setValue] = useState('');
  const [stateInputValue, setStateInputValue] = useState('');
  const [cityInputValue, setCityInputValue] = useState("");
  useDocumentTitle(employeeId ? "Update Employee" : "Create Employee");

  const options = [
    { value: "1", label: "Developer" },
    { value: "2", label: "Tester" },
    { value: "3", label: "Project Manager" },
    { value: "4", label: "HR" },
    { value: "5", label: "Admin" },
    { value: "6", label: "Other" },
  ];
  useEffect(() => {
    if (location.pathname.includes("/employe/edit")) {
      const employeeId = location.pathname.split("/employe/edit/")[1];

      UserService.getEmployee(employeeId)
        .then((response) => {
          const { firstname, lastname, email, designation, addressId } =
            response.data;
          setEmployeeId(employeeId);
          setFirstname(firstname);
          setLastname(lastname);
          setEmail(email);
          setDesignation(designation);
          setAddressId(addressId._id);
          setTemporaryAddress({
            street: addressId.temporary.street,
            city: addressId.temporary.city,
            state: addressId.temporary.state,
            country: addressId.temporary.country,
          });
          setPermanentAddress({
            street: addressId.permanent.street,
            city: addressId.permanent.city,
            state: addressId.permanent.state,
            country: addressId.permanent.country,
          });
        })        
        .catch((e) => {
          setMessage("There was an error while retrieving the employee.");
          setSuccessful(false);
        });
    } else {
      setEmployeeId(null);
    }
  }, [location]);

  let displayBlock = { display: "none" };
    
  const fetchCountryData = (inputVal, country_id_) => {
    return UserService.CountriesData(inputVal, country_id_)
      .then((response) => {
        const res = response.data.countries;
        return res;
      })
      .catch((e) => {
        setMessage("There was an error while retrieving the countries.");
        setSuccessful(false);
      });          
  };

  const fetchStatesData = (country_code, stateVal, state_id_ ) => {
    if (country_code) {
      return UserService.StatesData(country_code, stateVal, state_id_)
        .then((response) => {
          const res = response.data.states;
          return res;
        })
        .catch((e) => {
          setMessage("There was an error while retrieving the states.");
          setSuccessful(false);
        });
    } else {
      return [];
    }      
  };
  
  const fetchCityData = (country_code, state_code, cityVal, city_id_) => {
    if (country_code, state_code) {
      return UserService.CityData(
        country_code,
        state_code,
        cityVal,
        city_id_
      )
        .then((response) => {
          const res = response.data.cities;
          return res;
        })
        .catch((e) => {
          setMessage("There was an error while retrieving the cities.");
          setSuccessful(false);
        });
    } else {
      return [];
    }      
  };

  const handleEmployee = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      const employee = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        designation: designation,
        addressId: addressId,
        temporary: temporaryAddress,
        permanent: permanentAddress,
      };

      if (employeeId) {
        UserService.EmployeeUpdate(employeeId, employee)
          .then((response) => {
            setMessage("The employee was updated successfully.");
            setSuccessful(true);
          })
          .catch((e) => {
            setMessage("There was an error while updating the employee.");
            setSuccessful(false);
          });
      } else {
        UserService.postEmployee(employee)
          .then((response) => {
            setMessage("The employee was created successfully.");
            setSuccessful(true);
          })
          .catch((e) => {
            setMessage("There was an error while creating the employee.");
            setSuccessful(false);
          });
      }
    }
  };

  return (
    <div className="col-md-12">
      <div className="card">
        <Form onSubmit={handleEmployee} ref={form}>
          {!successful && (
            <div className="row">
              <div className="col-12">
                <h3>Personal Details</h3>
              </div>
              <div className="form-group col-6">
                <label htmlFor="firstname">First name</label>
                <Input
                  type="text"
                  className="form-control"
                  name="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  validations={[required, vfirstname]}
                />
              </div>

              <div className="form-group col-6">
                <label htmlFor="lastname">Last name</label>
                <Input
                  type="text"
                  className="form-control"
                  name="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  validations={[required, vlastname]}
                />
              </div>

              <div className="form-group col-12">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  validations={[required, validEmail]}
                />
              </div>

              <div className="form-group col-6">
                <label htmlFor="designation">Designation</label>
                <Select
                  defaultValue={designation}
                  value={options.find((obj) => obj.value === designation)} // set selected value
                  options={options}
                  onChange={(e) => setDesignation(e.value)}
                />
              </div>

              <div className="col-12">
                <h3>Address Details</h3>
                <h5 className="line_through">Temporary address</h5>
              </div>

              <div className="form-group col-12">
                <label htmlFor="temporaryAddress.street">Street</label>
                <Input
                  type="text"
                  className="form-control"
                  name="temporaryAddress.street"
                  value={temporaryAddress.street}
                  onChange={(e) =>
                    setTemporaryAddress({
                      ...temporaryAddress,
                      street: e.target.value,
                    })
                  }
                  validations={[required]}
                />
              </div>

              <div className="form-group col-6">
                <label htmlFor="temporaryAddress.country">Country</label>
                <AsyncSelect
                  //custom function get value object from country
                  value={{
                    _id: temporaryAddress.country._id,
                    name: temporaryAddress.country.name,
                  }}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e._id}
                  loadOptions={() =>
                    fetchCountryData(inputValue, temporaryAddress.country?._id)
                  }
                  defaultOptions
                  onInputChange={(value) => setValue(value)}
                  onChange={(value) =>
                    setTemporaryAddress({
                      ...temporaryAddress,
                      country: value,
                    })
                  }
                />
              </div>

              <div className="form-group col-6">
                <label htmlFor="temporaryAddress.country">States</label>
                <AsyncSelect
                  //custom function get value object from country
                  value={{
                    _id: temporaryAddress.state._id,
                    name: temporaryAddress.state.name,
                  }}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e._id}
                  loadOptions={() =>
                    fetchStatesData(
                      temporaryAddress.country?.iso2,
                      stateInputValue,
                      temporaryAddress.state?._id
                    )
                  }
                  onInputChange={(value) => setStateInputValue(value)}
                  onChange={(value) =>
                    setTemporaryAddress({
                      ...temporaryAddress,
                      state: value,
                    })
                  }
                />
              </div>

              <div className="form-group col-6">
                <label htmlFor="temporaryAddress.country">City</label>
                <AsyncSelect
                  //custom function get value object from country
                  value={{
                    _id: temporaryAddress.city._id,
                    name: temporaryAddress.city.name,
                  }}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e._id}
                  loadOptions={() =>
                    fetchCityData(
                      temporaryAddress.country?.iso2,
                      temporaryAddress.state.state_code,
                      cityInputValue,
                      temporaryAddress.city?._id
                    )
                  }
                  onInputChange={(value) => setCityInputValue(value)}
                  onChange={(value) =>
                    setTemporaryAddress({
                      ...temporaryAddress,
                      city: value,
                    })
                  }
                />
              </div>

              <div className="col-12">
                <h5 className="line_through">Permanent address</h5>
              </div>

              <div className="form-group col-12">
                <label htmlFor="permanentAddress.street">Street</label>
                <Input
                  type="text"
                  className="form-control"
                  name="permanentAddress.street"
                  value={permanentAddress.street}
                  onChange={(e) =>
                    setPermanentAddress({
                      ...permanentAddress,
                      street: e.target.value,
                    })
                  }
                  validations={[required]}
                />
              </div>

              <div className="form-group col-6">
                <label htmlFor="permanentAddress.country">Country</label>
                <AsyncSelect
                  //custom function get value object from country
                  value={{
                    _id: permanentAddress.country._id,
                    name: permanentAddress.country.name,
                  }}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e._id}
                  loadOptions={() =>
                    fetchCountryData(inputValue, permanentAddress.country?._id)
                  }
                  defaultOptions
                  onInputChange={(value) => setValue(value)}
                  onChange={(value) =>
                    setPermanentAddress({
                      ...permanentAddress,
                      country: value,
                    })
                  }
                />
              </div>

              <div className="form-group col-6">
                <label htmlFor="permanentAddress.country">States</label>
                <AsyncSelect
                  //custom function get value object from country
                  value={{
                    _id: permanentAddress.state._id,
                    name: permanentAddress.state.name,
                  }}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e._id}
                  loadOptions={() =>
                    fetchStatesData(
                      permanentAddress.country?.iso2,
                      stateInputValue,
                      permanentAddress.state?._id
                    )
                  }
                  onInputChange={(value) => setStateInputValue(value)}
                  onChange={(value) =>
                    setPermanentAddress({
                      ...permanentAddress,
                      state: value,
                    })
                  }
                />
              </div>

              <div className="form-group col-6">
                <label htmlFor="permanentAddress.country">City</label>
                <AsyncSelect
                  //custom function get value object from country
                  value={{
                    _id: permanentAddress.city._id,
                    name: permanentAddress.city.name,
                  }}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e._id}
                  loadOptions={() =>
                    fetchCityData(
                      permanentAddress.country?.iso2,
                      permanentAddress.state.state_code,
                      cityInputValue,
                      permanentAddress.city?._id
                    )
                  }
                  onInputChange={(value) => setCityInputValue(value)}
                  onChange={(value) =>
                    setPermanentAddress({
                      ...permanentAddress,
                      city: value,
                    })
                  }
                />
              </div>

              <div className="form-group col-12 text-right">
                <button className="btn btn-primary">Submit</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Employee;
