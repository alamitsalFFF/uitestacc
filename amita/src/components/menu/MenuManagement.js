import React from "react";
import { Link, redirect } from "react-router-dom";
import "./Menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop, faCartShopping, faCoins, faMoneyCheckDollar, faTruckPlane } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";

function MenuManagement() {
  return (
    <div className="container">
      <div className="row">
      <div>
          <h3 style={{ textAlign: "left" }}>&nbsp; &nbsp;Cash Management</h3>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Card
              style={{
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                //padding: "1rem",
                // border: "5px",
                margin: "5px",
                textAlign:"center",borderBottom:"inset"
              }}
            >
              <Link to="/uitestacc/CashSale" style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                  <FontAwesomeIcon icon={faShop} size="2x" style={{color: "#2d01bd",}} />
                  </Card.Title>
                  <Card.Text>Sell Products/Asset</Card.Text>
                </Card.Body>
              </Link>
            </Card>
            </div>
            <div className="col-md-6">
            <Card
              style={{
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                //padding: "1rem",
                // border: "5px",
                margin: "5px",
                textAlign:"center",borderBottom:"inset"
              }}
            >
              <Link to="/uitestacc/QuickBuy" style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                  <FontAwesomeIcon icon={faCartShopping} size="2x" style={{color: "#2d01bd",}} />
                  </Card.Title>
                  <Card.Text>Buy Products/Asset</Card.Text>
                </Card.Body>
              </Link>
            </Card>
            </div>
            </div>
            <div className="row">
            <div className="col-md-6">
            <Card
              style={{
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                //padding: "1rem",
                // border: "5px",
                margin: "5px",
                textAlign:"center",borderBottom:"inset"
              }}
            >
              <Link to="/uitestacc/Cash" style={{color:"black",textDecoration: "none"}}>
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon icon={faCoins} size="2x" style={{ color: "#2d01bd" }}/>
                  </Card.Title>
                  <Card.Text>Cash Receive</Card.Text>
                </Card.Body>
              </Link>
            </Card>
            </div>
            <div className="col-md-6">
            <Card
              style={{
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                //padding: "1rem",
                // border: "5px",
                margin: "5px",
                textAlign:"center",borderBottom:"inset"
              }}
            >
              <Link to="/uitestacc/Cash" style={{color:"black",textDecoration: "none"}}>
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon icon={faMoneyCheckDollar} size="2x" style={{ color: "#2d01bd" }}/>
                  </Card.Title>
                  <Card.Text>Cash Payment</Card.Text>
                </Card.Body>
              </Link>
            </Card>
            </div>
            </div>
            <div className="row">
            <div className="col-md-6">
            <Card
              style={{
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                //padding: "1rem",
                // border: "5px",
                margin: "5px",
                textAlign:"center",borderBottom:"inset"
              }}
            >
              <Link to="/uitestacc/Cash" style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon icon={faTruckPlane} size="2x" style={{ color: "#2d01bd" }}/>
                  </Card.Title>
                  <Card.Text>Cash Transfer</Card.Text>
                </Card.Body>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuManagement;
