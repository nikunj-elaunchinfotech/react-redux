const db = require("../models");
const Employee = db.employe;
const Address = db.address;
const Countries = db.countries;
const States = db.states;
const Cities = db.cities;

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.registerEmployee = (req, res) => {
  
  const address_ = new Address({
    temporary: {
      street: req.body.temporary.street,
      city: req.body.temporary.city,
      state: req.body.temporary.state,
      country: req.body.temporary.country,
    },
    permanent: {
      street: req.body.permanent.street,
      city: req.body.permanent.city,
      state: req.body.permanent.state,
      country: req.body.permanent.country,
    },
  });  

  address_.save((err, address) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      const employee = new Employee({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        designation: req.body.designation,
      });

      employee.addressId = address._id;
      employee.save((err, employee) => {
        if (err) {
          res.status(500).send({ message: err });
        } else {
          res.status(200).send({ message: "Employee added successfully" });
        }
      });
    }
  });
};

exports.getEmployeeList = (req, res) => {
  const { page, size, title } = req.query;
  var condition = title
    ? { firstname: { $regex: new RegExp(title), $options: "i" } }
    : {};

  const { limit, offset } = getPagination(page, size);
  
  Employee.paginate(condition, { offset, limit })
    .then((data) => {
      return res.status(200).json({
        totalItems: data.totalDocs,
        employe: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });

    })
    .catch((err) => {
     return res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.getEmployee = async (req, res) => {
  const id = req.params.id;
  //attach country name object from address country id
  
  await Employee.findById(id)
    .populate({
      path: "addressId",
      populate: [{
        path: "temporary.country permanent.country",
        model: "countries",
      },
      {
        path: "temporary.state permanent.state",
        model: "states",
      },
      {
        path: "temporary.city permanent.city",
        model: "cities",
      }
    ],
    })
    .lean()
    .exec((err, employee) => {
      if (err) {
        return res.status(500).send({ message: err });
      } else if (!employee) {
        return res.status(404).send({ message: "Employee not found." });
      } else {
        return res.status(200).send(employee);
      }
    });
};

exports.EmployeeUpdate = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  // update address too
  const id = req.params.id;
  const address_ = new Address({
    temporary: {
      street: req.body.temporary.street,
      city: req.body.temporary.city,
      state: req.body.temporary.state,
      country: req.body.temporary.country,
    },
    permanent: {
      street: req.body.permanent.street,
      city: req.body.permanent.city || req.body.temporary.city,
      state: req.body.permanent.state || req.body.temporary.state,
      country: req.body.permanent.country || req.body.temporary.country,
    },
  });


  address_.save((err, address) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
        //add address id to employee
        Employee.findByIdAndUpdate(id, {...req.body, addressId: address._id }, { useFindAndModify: false })
        .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Employee with id=${id}. Maybe Employee was not found!`,
          });
        } else res.send({ message: "Employee was updated successfully." });
        })
        .catch((err) => {
          res.status(500).send({  message: "Error updating Employee with id=" + id});
        });
      }
  });

};

exports.EmployeeDelete = (req, res) => {
  const id = req.params.id;

  Employee.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Employee with id=${id}. Maybe Employee was not found!`,
        });
      } else {
        res.send({
          message: "Employee was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Employee with id=" + id,
      });
    });
};

exports.getCountries = (req, res) => {
  //set search params for query

  const { title } = req.query;
  const { country_id } = req.query;
  var condition = title
    ? { name: { $regex: new RegExp(title), $options: "i" } }
    : {};
  
  //check if country_id is set and title is empty
  if (country_id && !title) {
    condition = { _id: country_id };
  }

  Countries.find(condition, { name: 1, iso2: 1 , id: 1})
    // .limit(10)
    .then((data) => { 
      return res.status(200).json({
        countries: data,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving Countries.",
      });
    });
};

exports.getStates = (req, res) => {
  //set search params for query
  const { title } = req.query;
  const { country_code } = req.query;
  const { state_id } = req.query;

  States.find(
    {
      $and: [
        { country_code: country_code },
        {name: { $regex: new RegExp(title), $options: "i" }}        
      ],
    },
    { name: 1, state_code: 1 }
  )
    .limit(10)
    .then((data) => {
      return res.status(200).json({
        states: data,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving States.",
      });
    });
};

exports.getCities = (req, res) => {
  //set search params for query
  const { title } = req.query;
  const { country_code } = req.query;
  const { state_code } = req.query;
  const { city_id } = req.query;

  Cities.find(
    {
      $and: [
        { country_code: country_code },
        { state_code : state_code},
        { name: { $regex: new RegExp(title), $options: "i" } },
      ],
    },
    { name: 1, id: 1 }
  )
    .limit(10)
    .then((data) => {
      return res.status(200).json({
        cities: data,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving Cities.",
      });
    });
};