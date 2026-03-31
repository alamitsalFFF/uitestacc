import React, { Component } from 'react';
import { variables } from './Variables.js';

export class Products extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // warehouses: [],
            modalTitle:""
            ,products:[]
            ,productID:0
            ,productCode:""
            ,productName:""
            ,brand:""
            ,color:""
            ,size:""
            ,sizeUnit:""
            ,volume:""
            ,volumeUnit:""
            ,unitStock:""
            ,productTypeCode:""
        }
    }

    refreshList(){
        //fetch(variables.API_URL+'warehouse')
        fetch(variables.API_URL+'Product/GetProduct')
        .then(response=>response.json())
        .then(data=>{
             this.setState({products:data});
        });
    }
    
    componentDidMount(){
        this.refreshList();
    }

    changeProductCode = (e)=>{
        this.setState({productCode:e.target.value});
    }
    changeProductName = (e)=>{
        this.setState({productName:e.target.value});
    }
    changeBrand = (e)=>{
        this.setState({brand:e.target.value});
    }
    changeColor = (e)=>{
        this.setState({color:e.target.value});
    }
    changeSize = (e)=>{
        this.setState({size:e.target.value});
    }
    changeSizeUnit = (e)=>{
        this.setState({sizeUnit:e.target.value});
    }
    changeVolume = (e)=>{
        this.setState({volume:e.target.value});
    }
    changeVolumeUnit = (e)=>{
        this.setState({volumeUnit:e.target.value});
    }
    changeUnitStock = (e)=>{
        this.setState({unitStock:e.target.value});
    }
    changeProductTypeCode = (e)=>{
        this.setState({productTypeCode:e.target.value});
    }

    addClick(){
        this.setState({
            modalTitle:"Add Product"
            ,productID:0
            ,productCode:""
            ,productName:""
            ,brand:""
            ,color:""
            ,size:""
            ,sizeUnit:""
            ,volume:""
            ,volumeUnit:""
            ,unitStock:""
            ,productTypeCode:""
        });
    }
    editClick(pro){
        this.setState({
            modalTitle:"Edit Product",
            productID:pro.productID,
            productCode:pro.productCode,
            productName:pro.productName,
            brand:pro.brand,
            color:pro.color,
            size:pro.size,
            sizeUnit:pro.sizeUnit,
            volume:pro.volume,
            volumeUnit:pro.volumeUnit,
            unitStock:pro.unitStock,
            productTypeCode:pro.productTypeCode
        });
    }
    createClick(){
        fetch(variables.API_URL+'Product/SetProduct',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                
                productCode:this.state.productCode,
                productName:this.state.productName,
                brand:this.state.brand,
                color:this.state.color,
                size:this.state.size,
                sizeUnit:this.state.sizeUnit,
                volume:this.state.volume,
                volumeUnit:this.state.volumeUnit,
                unitStock:this.state.unitStock,
                productTypeCode:this.state.productTypeCode
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
        fetch(variables.API_URL+'Product/EditProduct',{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                productID:this.state.productID,
                productCode:this.state.productCode,
                productName:this.state.productName,
                brand:this.state.brand,
                color:this.state.color,
                size:this.state.size,
                sizeUnit:this.state.sizeUnit,
                volume:this.state.volume,
                volumeUnit:this.state.volumeUnit,
                unitStock:this.state.unitStock,
                productTypeCode:this.state.productTypeCode
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
        fetch(variables.API_URL+'/Product/DeleteProduct/'+id,{
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
            // warehouses,
            products,
            modalTitle,
            productID,
            productCode
            ,productName
            ,brand
            ,color
            ,size
            ,sizeUnit
            ,volume
            ,volumeUnit
            ,unitStock
            ,productTypeCode
        }=this.state;
        return (
<div>

    <button type="button"
        className="btn btn-primary m-2 float-end"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={()=>this.addClick()}>
        Add Product
    </button>
    <table className="table table-striped">
        <thead>
            <tr>
                <th>ProductID</th>
                <th>ProductCode</th>
                <th>ProductName</th>
                <th>Brand</th>
                <th>Color</th>
                <th>Size</th>
                <th>SizeUnit</th>
                <th>Volume</th>
                <th>VolumeUnit</th>
                <th>UnitStock</th>
                <th>ProductTypeCode</th>
                <th>Options</th>
            </tr>
        </thead>
        <tbody>
            {products.map(pro =>
                <tr key={pro.productID}>
                    <td>{pro.productID}</td>
                    <td>{pro.productCode}</td>
                    {/* <td><button class="btn btn-link" data-bs-toggle="modal" data-bs-target="#modaledit" onclick="EditData('${pro.productID}')">${pro.productCode}</button></td> */}
                    <td>{pro.productName}</td>
                    <td>{pro.brand}</td>
                    <td>{pro.color}</td>
                    <td>{pro.size}</td>
                    <td>{pro.sizeUnit}</td>
                    <td>{pro.volume}</td>
                    <td>{pro.volumeUnit}</td>
                    <td>{pro.unitStock}</td>
                    <td>{pro.productTypeCode}</td>
                    <td>
                        <button type="button" className="btn btn-light mr-1"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => this.editClick(pro)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentcolor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                        </button>
                        <button type="button"
                        className="btn btn-light mr-1"
                        onClick={() => this.deleteClick(pro.productID)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentcolor" className="bi bi-trash-fill" viewBox="0 0 16 16">
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
            <span className="input-group-text">ProductCode</span>  
            <input type="text" className="form-control"
            value={productCode}
            onChange={this.changeProductCode}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">ProductName</span>  
            <input type="text" className="form-control"
            value={productName}
            onChange={this.changeProductName}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">Brand</span>  
            <input type="text" className="form-control"
            value={brand}
            onChange={this.changeBrand}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">Color</span>  
            <input type="text" className="form-control"
            value={color}
            onChange={this.changeColor}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">Size</span>  
            <input type="text" className="form-control"
            value={size}
            onChange={this.changeSize}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">SizeUnit</span>  
            <input type="text" className="form-control"
            value={sizeUnit}
            onChange={this.changeSizeUnit}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">Volume</span>  
            <input type="text" className="form-control"
            value={volume}
            onChange={this.changeVolume}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">VolumeUnit</span>  
            <input type="text" className="form-control"
            value={volumeUnit}
            onChange={this.changeVolumeUnit}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">UnitStock</span>  
            <input type="text" className="form-control"
            value={unitStock}
            onChange={this.changeUnitStock}/>
        </div>
        <div className="input-group mb-3">
            <span className="input-group-text">ProductTypeCode</span>  
            <input type="text" className="form-control"
            value={productTypeCode}
            onChange={this.changeProductTypeCode}/>
        </div>
        </div>
        {productID==0?
        <button type="button"
        className="btn btn-primary float-start"
        onClick={()=>this.createClick()}
        >Create</button>
        :null}

        {productID!=0?
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