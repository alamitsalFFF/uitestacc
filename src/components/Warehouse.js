import React, { Component,useState } from "react";
import { variables } from "./Variables.js";
// import React, { useState } from 'react';
import { useTable } from 'react-table';
import { API_BASE } from "./api/url.js";

export class Warehouse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      warehouses: [],
      modalTitle: "Warehouse",
      warehouseID: 0,
      warehouseCode: "",
      name: "",
      location: "",
      address: "",
      assetAccCode: "",
      incomeAccCode: "",
      expenseAccCode: "",

      WarehouseIDFiter: "",
      WarehouseNameFiter: "",
      WarehouseWithoutFiter: [],
    };
  }

  FilterFn() {
    var WarehouseIDFiter = this.state.WarehouseIDFiter;
    var WarehouseNameFiter = this.state.WarehouseNameFiter;

    var filteredData = this.state.WarehouseWithoutFiter.filter(function (el) {
      return (
        el.WarehouseIDFiter.toString()
          .toLowerCase()
          .includes(WarehouseIDFiter.toString().trim().toLowerCase()) &&
        el.WarehouseNameFiter.toString()
          .toLowerCase()
          .includes(WarehouseNameFiter.toString().trim().toLowerCase())
      );
    });

    this.setState({ warehouses: filteredData });
  }

  sortResult(prop, asc) {
    var sortedData = this.state.WarehouseWithoutFiter.sort(function (a, b) {
      if (asc) {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });

    this.setState({ warehouses: sortedData });
  }

  changeWarehouseIDFiter = (e) => {
    this.state.WarehouseIDFiter = e.target.value;
    this.FilterFn();
  };
  changeWarehouseNameFiter = (e) => {
    this.state.WarehouseNameFiter = e.target.value;
    this.FilterFn();
  };

  refreshList() {
    fetch(`${API_BASE}Warehouses/GetWarehouse`)
      // fetch('http://103.225.168.137/AccAPITest/Api/Prototype/Warehouses/GetWarehouses/')
      // fetch(variables.API_URL1)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ warehouses: data });
      });
  }

  componentDidMount() {
    this.refreshList();
  }

  changeWarehouseCode = (e) => {
    this.setState({ warehouseCode: e.target.value });
  };
  changeName = (e) => {
    this.setState({ name: e.target.value });
  };
  changeLocation = (e) => {
    this.setState({ location: e.target.value });
  };
  changeAddress = (e) => {
    this.setState({ address: e.target.value });
  };
  changeAssetAccCode = (e) => {
    this.setState({ assetAccCode: e.target.value });
  };
  changeIncomeAccCode = (e) => {
    this.setState({ incomeAccCode: e.target.value });
  };
  changeExpenseAccCode = (e) => {
    this.setState({ expenseAccCode: e.target.value });
  };

  addClick() {
    this.setState({
      modalTitle: "Add Warehouse",
      warehouseID: 0,
      warehouseCode: "",
      name: "",
      location: "",
      address: "",
      assetAccCode: "",
      incomeAccCode: "",
      expenseAccCode: "",
    });
  }
  editClick(war) {
    this.setState({
      modalTitle: "Edit Warehouse",
      warehouseID: war.warehouseID,
      warehouseCode: war.warehouseCode,
      name: war.name,
      location: war.location,
      address: war.address,
      assetAccCode: war.assetAccCode,
      incomeAccCode: war.incomeAccCode,
      expenseAccCode: war.expenseAccCode,
    });
  }
  createClick() {
    fetch(variables.API_URL + "Warehouses/SetWarehouse", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        warehouseCode: this.state.warehouseCode,
        name: this.state.name,
        location: this.state.location,
        address: this.state.address,
        assetAccCode: this.state.assetAccCode,
        incomeAccCode: this.state.incomeAccCode,
        expenseAccCode: this.state.expenseAccCode,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert("Failed");
        }
      );
  }
  updateClick() {
    fetch(variables.API_URL + "Warehouses/EditWarehouse", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        warehouseID: this.state.warehouseID,
        warehouseCode: this.state.warehouseCode,
        name: this.state.name,
        location: this.state.location,
        address: this.state.address,
        assetAccCode: this.state.assetAccCode,
        incomeAccCode: this.state.incomeAccCode,
        expenseAccCode: this.state.expenseAccCode,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert("Failed");
        }
      );
  }
  deleteClick(id) {
    if (window.confirm("Are you sure?")) {
      fetch(variables.API_URL + "/Warehouses/DeleteWarehouse/" + id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            alert(result);
            this.refreshList();
          },
          (error) => {
            alert("Failed");
          }
        );
    }
  }

  render() {
    const {
      warehouses,
      modalTitle,
      warehouseID,
      warehouseCode,
      name,
      location,
      address,
      assetAccCode,
      incomeAccCode,
      expenseAccCode,
    } = this.state;

    // const WarehouseTable = ({ warehouses }) => {
    // const latestWarehouses = warehouses.slice(-5);

    // const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 5; // Number of items per page
    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const endIndex = startIndex + itemsPerPage;
    // const currentWarehouses = warehouses.slice(startIndex, endIndex);

    // const table = useTable({
    //   columns: [
    //     { Header: 'WarehouseCode', accessor: 'warehouseCode' },
    //     { Header: 'Name', accessor: 'name' },
    //     { Header: 'Location', accessor: 'location' },
    //     { Header: 'Address', accessor: 'address' },
    //     { Header: 'AssetAccCode', accessor: 'assetAccCode' },
    //     { Header: 'IncomeAccCode', accessor: 'incomeAccCode' },
    //     { Header: 'ExpenseAccCode', accessor: 'expenseAccCode' },
    //   ],
    //   data: currentWarehouses,
    // });

    return (

      <div>
        <div  >
          {/* <div className="modal-dialog modal-lg modal-dialog-centered"> */}
          <div>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
              </div>
              <div>
              {warehouseID == 0 ? (
                  <button type="button" className="btn btn-primary float-start" onClick={() => this.createClick()}>
                    Create
                  </button>
                ) : null}

                {warehouseID !== 0 && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary float-start"
                      onClick={() => this.updateClick()}
                    >
                      Update
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary m-2 float-end"
                      onClick={() => this.deleteClick(warehouseID)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              <div className="modal-body">
                <div className="p-2 w-90 bd-highlight">
                  <div className="input-group mb-3">
                    <span className="input-group-text">WarehouseCode</span>
                    <input
                      type="text"
                      className="form-control"
                      value={warehouseCode}
                      onChange={this.changeWarehouseCode}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text">Name</span>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={this.changeName}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text">Location</span>
                    <input type="text" className="form-control" value={location} onChange={this.changeLocation} />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text">Address</span>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      onChange={this.changeAddress}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text">AssetAccCode</span>
                    <input
                      type="text"
                      className="form-control"
                      value={assetAccCode}
                      onChange={this.changeAssetAccCode}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text">IncomeAccCode</span>
                    <input
                      type="text"
                      className="form-control"
                      value={incomeAccCode}
                      onChange={this.changeIncomeAccCode}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text">ExpenseAccCode</span>
                    <input
                      type="text"
                      className="form-control"
                      value={expenseAccCode}
                      onChange={this.changeExpenseAccCode}
                    />
                  </div>
                </div>
                {/* {warehouseID == 0 ? (
                  <button type="button" className="btn btn-primary float-start" onClick={() => this.createClick()}>
                    Create
                  </button>
                ) : null}

                {warehouseID !== 0 && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary float-start"
                      onClick={() => this.updateClick()}
                    >
                      Update
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary m-2 float-end"
                      onClick={() => this.deleteClick(warehouseID)}
                    >
                      Delete
                    </button>
                  </>
                )} */}
              </div>
            </div>
          </div>
        </div>

        {/*/////*/}
        <table className="table table-striped" >
          <thead>
            <tr>
              <th>WarehouseCode</th>
              <th>Name</th>
              <th>Location</th>
              <th>Address</th>
              <th>AssetAccCode</th>
              <th>IncomeAccCode</th>
              <th>ExpenseAccCode</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((war) => (
              <tr key={war.warehouseID}>
                {/* <td>{war.warehouseID}</td> */}
                {/* <td>{war.warehouseCode}</td> */}
                <td>
                  <button
                    type="button"
                    className="btn btn-link"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.editClick(war)}
                  >
                    {war.warehouseCode}
                  </button>
                </td>
                <td>{war.name}</td>
                <td>{war.location}</td>
                <td>{war.address}</td>
                <td>{war.assetAccCode}</td>
                <td>{war.incomeAccCode}</td>
                <td>{war.expenseAccCode}</td>
              </tr>
            ))}
          </tbody>
          {/* ///// */}
          {/* <tbody>
            {table.war.map((war) => {
              return(
              <tr key={war.original.warehouseID}>
                <td>
                  <button
                    type="button"
                    className="btn btn-link"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.editClick(war)}
                  >
                    {war.warehouseCode}
                  </button>
                </td>
                <td>{war.name}</td>
                <td>{war.location}</td>
                <td>{war.address}</td>
                <td>{war.assetAccCode}</td>
                <td>{war.incomeAccCode}</td>
                <td>{war.expenseAccCode}</td>
              </tr>
            );
        })}
          </tbody> */}
        </table>
        {/* <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
      <span> Page {currentPage} </span>
      <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(warehouses.length / itemsPerPage)}>Next</button> */}
    </div>
    );
  }
  }

