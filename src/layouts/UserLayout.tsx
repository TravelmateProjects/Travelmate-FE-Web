import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UserSidebar from '../components/UserSidebar';

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Container fluid>
      <Row>
        <Col md={3} className="min-vh-100 p-0">
          <UserSidebar />
        </Col>
        <Col md={9} className="p-4">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default UserLayout;
