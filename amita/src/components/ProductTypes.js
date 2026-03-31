import React, { Component } from 'react';
import { variables } from './Variables.js';

export class ProductTypes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalTitle:""
            ,productTypes:[]
            ,productTypeID:0
            ,productTypeCode:""
            ,productTypeName:""
            ,warehouseCode:""
            ,isMaterial:""
            ,isService:""
            ,rateVat:""
            ,rateWht:""
            ,vatType:""
        }
    }

    refreshList(){
        //fetch(variables.API_URL+'warehouse')
        fetch(variables.API_URL+'ProductType/GetProductType')
        .then(response=>response.json())
        .then(data=>{
             this.setState({productTypes:data});
        });
    }
    
    componentDidMount(){
        this.refreshList();
    }

    changeProductTypeCode = (e)=>{
        this.setState({productTypeCode:e.target.value});
    }
    changeProductTypeName = (e)=>{
        this.setState({productTypeName:e.target.value});
    }
    changeWarehouseCode = (e)=>{
        this.setState({warehouseCode:e.target.value});
    }
    changeIsMaterial = (e)=>{
        this.setState({isMaterial:e.target.value});
    }
    changeIsService = (e)=>{
        this.setState({isService:e.target.value});
    }
    changeRateVat = (e)=>{
        this.setState({rateVat:e.target.value});
    }
    changeRateWht = (e)=>{
        this.setState({rateWht:e.target.value});
    }
    changeVatType = (e)=>{
        this.setState({vatType:e.target.value});
    }
    
    addClick(){
        this.setState({
            modalTitle:"Add ProductType"
            ,productTypeID:0
            ,productTypeName:""
            ,warehouseCode:""
            ,isMaterial:""
            ,isService:""
            ,rateVat:""
            ,rateWht:""
            ,vatType:""
        });
    }
    editClick(prot){
        this.setState({
            modalTitle:"Edit ProductType",
            productTypeID:prot.productTypeID,
            productTypeCode:prot.productTypeCode,
            productTypeName:prot.productTypeName,
            warehouseCode:prot.warehouseCode,
            isMaterial:prot.isMaterial,
            isService:prot.isService,
            rateVat:prot.rateVat,
            rateWht:prot.rateWht,
            vatType:prot.vatType,
        });
    }
    createClick(){
        fetch(variables.API_URL+'ProductType/SetProductType',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                productTypeCode:this.state.productTypeCode,
                productTypeName:this.state.productTypeName,
                warehouseCode:this.state.warehouseCode,
                isMaterial:this.state.isMaterial,
                isService:this.state.isService,
                rateVat:this.state.rateVat,
                rateWht:this.state.rateWht,
                vatType:this.state.vatType
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            this.refreshList();
        },(error)=>{
            alert('Failed');
        })
    }
    updateClick(){
        fetch(variables.API_URL+'ProductType/EditProductType',{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                productTypeID:this.state.productTypeID,
                productTypeCode:this.state.productTypeCode,
                productTypeName:this.state.productTypeName,
                warehouseCode:this.state.warehouseCode,
                isMaterial:this.state.isMaterial,
                isService:this.state.isService,
                rateVat:this.state.rateVat,
                rateWht:this.state.rateWht,
                vatType:this.state.vatType
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            this.refreshList();
        },(error)=>{
            alert('Failed');
        })
    }
    deleteClick(id){
        if(window.confirm('Are you sure?')){
        fetch(variables.API_URL+'ProductType/DeleteProductType/'+id,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            this.refreshList();
        },(error)=>{
            alert('Failed');
        })}
    }

    render() {
        const {
            productTypes,
            modalTitle,
            productTypeID,
            productTypeCode
            ,productTypeName
            ,warehouseCode
            ,isMaterial
            ,isService
            ,rateVat
            ,rateWht
            ,vatType
        }=this.state;
        return (
<div>

    <button type="button"
        className="btn btn-primary m-2 float-end"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={()=>this.addClick()}>
        Add ProductType
    </button>
    <table className="table table-striped">
        <thead>
            <tr>
                <th>ProductTypeID</th>
                <th>ProductTypeCode</th>
                <th>ProductTypeName</th>
                <th>WarehouseCode</th>
                <th>IsMaterial</th>
                <th>IsService</th>
                <th>RateVat</th>
                <th>RateWht</th>
                <th>VatType</th>
                <th>Options</th>
            </tr>
        </thead>
        <tbody>
            {productTypes.map(prot =>
                <tr key={prot.productTypeID}>
                    <td>{prot.productTypeID}</td>
                    <td>{prot.productTypeCode}</td>
                    <td>{prot.productTypeName}</td>
                    <td>{prot.warehouseCode}</td>
                    <td>{prot.isMaterial}</td>
                    <td>{prot.isService}</td>
                    <td>{prot.rateVat}</td>
                    <td>{prot.rateWht}</td>
                    <td>{prot.vatType}</td>
                    <td>
                        <button type="button" className="btn btn-light mr-1"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => this.editClick(prot)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentisMaterial" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                        </button>
                        <button type="button"
                        className="btn btn-light mr-1"
                        onClick={() => this.deleteClick(prot.productTypeID)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentisMaterial" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                        </button>
                    </td>
                </tr>
            )}
        </tbody>
    </table>

<div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
<div className="modal-dialog modal-lg modal-dialog-centered">
<div className="modal-content">
    <div className="modal-header">
        <h5 className="modal-title">{modalTitle}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div className="modal-body">

    <div className="p-2 w-90 bd-highlight">
        <div className="input-group mb-3">
            <span className="input-group-text">ProductTypeCode</span>  
            <input type="text" className="form-control"
            value={productTypeCode}
            onChange={this.changeProductTypeCode}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">ProductTypeName</span>  
            <input type="text" className="form-control"
            value={productTypeName}
            onChange={this.changeProductTypeName}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">WarehouseCode</span>  
            <input type="text" className="form-control"
            value={warehouseCode}
            onChange={this.changeWarehouseCode}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">IsMaterial</span>  
            <input type="text" className="form-control"
            value={isMaterial}
            onChange={this.changeIsMaterial}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">IsService</span>  
            <input type="text" className="form-control"
            value={isService}
            onChange={this.changeIsService}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">RateVat</span>  
            <input type="text" className="form-control"
            value={rateVat}
            onChange={this.changeRateVat}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">RateWht</span>  
            <input type="text" className="form-control"
            value={rateWht}
            onChange={this.changeRateWht}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">VatType</span>  
            <input type="text" className="form-control"
            value={vatType}
            onChange={this.changeVatType}/>
        </div>
        </div>
        {productTypeID==0?
        <button type="button"
        className="btn btn-primary float-start"
        onClick={()=>this.createClick()}
        >Create</button>
        :null}

        {productTypeID!=0?
        <button type="button"
        className="btn btn-primary float-start"
        onClick={()=>this.updateClick()}>Update</button>:null}    
    </div>
    </div>
</div>                      
</div>

</div>
        )
    }
}