import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={3} className="min-vh-100 p-0">
          <AdminSidebar />
        </Col>
        <Col md={9} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;