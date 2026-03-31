import { useState } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import './Purchase Requisition.css'
import axios from 'axios';




function PurchaseRequisition() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit} className='form-pr'>
        <h1 className='h1-pr'>Purchase Requisition</h1>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label >AccDocNo</Form.Label>
          <Form.Control 
            id='accdocno'
            required
            type="text"
            placeholder="IVS-xxxxxxxx"
            // defaultValue="IVS-22090001"
            readOnly
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom02">
          <Form.Label>AccEffectiveDate</Form.Label>
          <Form.Control
            required
            type="date"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>PartCode</Form.Label>
          <Form.Control type="text" placeholder="C00xx" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom04">
          <Form.Label>PartyTaxCode</Form.Label>
          <Form.Control type="text" placeholder="เลขปชช13หลัก" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid state.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className='mb-3'>
        <Form.Group as={Col} md="12" controlId="validationCustom05">
          <Form.Label>PartName</Form.Label>
          <Form.Control type="text" placeholder="กรุณากรอกชื่อบริษัท" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid zip.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className='mb-3'>
        <Form.Group as={Col} md="12" controlId="validationCustom05">
          <Form.Label>PartyAddress</Form.Label>
          <Form.Control type="text" placeholder="กรุณากรอกที่อยู่บริษัท" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid zip.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>DocRefNo</Form.Label>
          <Form.Control type="text" placeholder="DLxxxxxxxx" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom04">
          <Form.Label >DocStatus</Form.Label>
          <Form.Control type="text" placeholder="2"  required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid state.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>AccBatchDate</Form.Label>
          <Form.Control type="date" placeholder="" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom04">
          <Form.Label>IssueBy</Form.Label>
          <Form.Control type="text" placeholder="ADMIN" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid state.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>AccPostDate</Form.Label>
          <Form.Control type="date" placeholder="" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom04">
          <Form.Label>FiscalYear</Form.Label>
          <Form.Control type="date" placeholder="" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid state.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      {/* <Form.Group className="mb-3">
        <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
          feedbackType="invalid"
        />
      </Form.Group> */}
      <Button variant="success" type="submit">Submit PR</Button>
      <Button >New</Button>

    </Form>
  );
}

export default PurchaseRequisition;
