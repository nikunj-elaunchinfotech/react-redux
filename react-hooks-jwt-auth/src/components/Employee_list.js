import React, { useState, useEffect, useMemo, useRef } from "react";
import UserService from "../services/user.service";
import { useTable } from "react-table";
import { useHistory } from "react-router";
import Swal from "sweetalert2";
import PaginationComponent  from "./Pagination";
import useDocumentTitle from "@rehooks/document-title";


const EmployeesList = (props) => {
  useDocumentTitle("Employees List");
  const [tutorials, setTutorials] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const employeRef = useRef();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const pageSizes = [3, 6, 9];
  const history = useHistory();

   const designation = [
     { value: "1", label: "Developer" },
     { value: "2", label: "Tester" },
     { value: "3", label: "Project Manager" },
     { value: "4", label: "HR" },
     { value: "5", label: "Admin" },
     { value: "6", label: "Other" },
   ];

  employeRef.current = tutorials;

  const getRequestParams = (searchTitle, page, pageSize) => {
    let params = {};

    if (searchTitle) {
      params["title"] = searchTitle;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  };

  const retrieveEmployees = () => {
    const params = getRequestParams(searchTitle, page, pageSize);

    UserService.getEmployeeList(params)
      .then((response) => {
        const { employe, totalItems } = response.data;

        setTutorials(employe);
        setCount(totalItems);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(retrieveEmployees, [page, pageSize]);


  const findByTitle = () => {
    setPage(1);
    retrieveEmployees();
  };

  const openTutorial = (rowIndex) => {
    const id = employeRef.current[rowIndex].id;
    history.push("/employe/edit/" + id);    
  };
  
  const deleteEmploye = (rowIndex) => {
    const id = employeRef.current[rowIndex].id;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      preConfirm: () => {
          UserService.EmployeeDelete(id)
          .then((response) => {
            history.push({
              pathname: "/employe/list",          
            });
            
            let newTutorials = [...employeRef.current];
            newTutorials.splice(rowIndex, 1);
            setTutorials(newTutorials);
            Swal.fire("Deleted!", "Employee has been deleted.", "success");
          },
          (error) => {
            Swal.fire("Error", error.message, "error");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };
    

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const columns = useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstname",
      },
      {
        Header: "Last Name",
        accessor: "lastname",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Designation",
        accessor: "designation",
        Cell: (row) => {
          return (
            <div>
              {designation.map((item) => {
                if (item.value === row.value) {
                  return item.label;
                }
              })}
            </div>
          );
        }
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => openTutorial(rowIdx)} className="btn btn-sm btn-secondary">Edit</span>
              <span onClick={() => deleteEmploye(rowIdx)} className="btn btn-sm btn-danger ml-2">Delete</span>
            </div>
          );
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: tutorials,
    });

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="col-md-12 list">
        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <PaginationComponent
          page={page}
          count={count}
          pageSize={pageSize}
          pageSizes={pageSizes}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default EmployeesList;
