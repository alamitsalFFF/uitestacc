import React from "react";
import { Link, redirect } from "react-router-dom";
import "./Menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { faMoneyBills, faLayerGroup, faCreditCard, faDatabase, faChartLine, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";

function MenuMain() {
  return (
    <div className="container">
      <div className="row">
        <div className="row">
          <div className="col-md-12">
            <Card
              style={{
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                //padding: "1rem",
                // border: "5px",
                margin: "5px",
                textAlign:"center",
                borderBottom:"inset"
              }}
            >
              <Link to="/uitestacc/Cash" style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon
                      icon={faMoneyBills}
                      size="2x"
                      style={{ color: "#2d01bd",textAlign:"center"}}
                    />
                  </Card.Title>
                  <Card.Text>Cash Payment/Receive</Card.Text>
                </Card.Body>
              </Link>
            </Card>

            <Card
              style={{
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                //padding: "1rem",
                // border: "5px",
                margin: "5px",
                textAlign:"center",
                borderBottom:"inset"
              }}
            >
              <Link to="/uitestacc" style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon icon={faLayerGroup} size="2x" style={{ color: "#2d01bd" }}/>
                  </Card.Title>
                  <Card.Text>Receivables</Card.Text>
                </Card.Body>
              </Link>
            </Card>

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
              <Link to="/uitestacc" style={{color:"black",textDecoration: "none"}}>
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon icon={faCreditCard} size="2x" style={{ color: "#2d01bd" }}/>
                  </Card.Title>
                  <Card.Text>Payables</Card.Text>
                </Card.Body>
              </Link>
            </Card>
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
              <Link to="/uitestacc" style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon icon={faDatabase} size="2x" style={{ color: "#2d01bd" }}/>
                  </Card.Title>
                  <Card.Text>Asset</Card.Text>
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
              <Link to="/uitestacc/Entries" style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon icon={faFileInvoiceDollar} size="2x" style={{ color: "#2d01bd" }}/>
                  </Card.Title>
                  <Card.Text>Journal Entries</Card.Text>
                </Card.Body>
              </Link>
            </Card>
          </div>
          <div className="col-md-6">
            <Card
              style={{
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                //padding: "1rem",
                // border: "5px",
                margin: "5px",
                textAlign:"center",borderBottom:"inset"
              }}
            >
              <Link to="/uitestacc/"style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon icon={faChartLine} size="2x" style={{ color: "#2d01bd" }}/>
                  </Card.Title>
                  <Card.Text>Reports</Card.Text>
                </Card.Body>
              </Link>
            </Card>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <Card
              style={{
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                //padding: "1rem",
                // border: "5px",
                margin: "5px",
                textAlign:"center",borderBottom:"inset"
              }}
            >
              <Link to="/uitestacc/Master" style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      size="2x"
                      style={{ color: "#2d01bd" ,textAlign:"center"}}
                    />
                  </Card.Title>
                  <Card.Text>Master</Card.Text>
                </Card.Body>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuMain;
