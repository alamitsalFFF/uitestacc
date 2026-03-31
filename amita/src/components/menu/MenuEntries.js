import React from "react";
import { Link, redirect } from "react-router-dom";
import "./Menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney, faHandsHoldingCircle, faObjectGroup, faCubes, faUsersLine } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";

function MenuEntries() {
  return (
    <div className="container">
      <div className="row">
      <div>
          <h3 style={{ textAlign: "left" }}>&nbsp; &nbsp;Journal Entries</h3>
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
              <Link to="/uitestacc/Transaction" style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                  <FontAwesomeIcon icon={faHouseChimney} size="2x" style={{color: "#2d01bd",}} />
                  </Card.Title>
                  <Card.Text>Purchase</Card.Text>
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
              <Link to="/uitestacc/Master" style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                  <FontAwesomeIcon icon={faHandsHoldingCircle} size="2x" style={{color: "#2d01bd",}} />
                  </Card.Title>
                  <Card.Text>Sale</Card.Text>
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
              <Link to="/uitestacc/Master" style={{color:"black",textDecoration: "none"}}>
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon icon={faObjectGroup} size="2x" style={{ color: "#2d01bd" }}/>
                  </Card.Title>
                  <Card.Text>Paid/Purchase Return</Card.Text>
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
              <Link to="/uitestacc/Master" style={{color:"black",textDecoration: "none"}}>
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon icon={faCubes} size="2x" style={{ color: "#2d01bd" }}/>
                  </Card.Title>
                  <Card.Text>Receive/Sale Return</Card.Text>
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
              <Link to="/uitestacc/Master" style={{color:"black",textDecoration: "none"}}> 
                <Card.Body>
                  <Card.Title>
                    <FontAwesomeIcon icon={faUsersLine} size="2x" style={{ color: "#2d01bd" }}/>
                  </Card.Title>
                  <Card.Text>General</Card.Text>
                </Card.Body>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuEntries;
