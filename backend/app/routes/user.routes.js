const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  
  app.post("/api/test/employee/add", [authJwt.verifyToken], controller.registerEmployee);
  
  app.get("/api/test/employee/list", [authJwt.verifyToken], controller.getEmployeeList);

  app.get("/api/test/employee/findOne/:id", [authJwt.verifyToken], controller.getEmployee);
  
  app.put("/api/test/employee/update/:id", [authJwt.verifyToken], controller.EmployeeUpdate);
 
  app.delete("/api/test/employee/delete/:id", [authJwt.verifyToken], controller.EmployeeDelete);

  //countries
  app.get("/api/test/countries", [authJwt.verifyToken], controller.getCountries);
  app.get("/api/test/states", [authJwt.verifyToken], controller.getStates);
  app.get("/api/test/cities", [authJwt.verifyToken], controller.getCities);

};
