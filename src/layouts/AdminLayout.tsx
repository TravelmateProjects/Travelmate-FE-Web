import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Container fluid>
      <Row>
        <Col md={3} className="min-vh-100 p-0">
          <AdminSidebar />
        </Col>
        <Col md={9} className="p-4">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;