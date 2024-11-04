import React, { useState } from 'react';
import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import CustomNavbar from "./components/Navigation/Navbar/Navbar";
import Sidebar from "./components/Navigation/Sidebar/Sidebar";
import ListStd from "./components/Students/ListStudent/ListStd";
import Newstd from "./components/Students/NewStudent/NewStd";
import Classes from "./components/Classes/Classes";
import NewClasse from "./components/Classes/NewClasse";
import ListTeacher from "./components/Teachers/ListTeacher";
import Newteacher from "./components/Teachers/NewTeacher/Newteacher";
import StudentProfiel from "./components/Students/StudentProfiel/StudentProfiel";
import LoginPage from "./components/Login/LoginForm";
import ClassesList from "./components/Classes/ClassesList/ClassesList";
import Dashboard from './components/Dashboard/Dashboard';
import TeacherProfile from './components/Teachers/TeacherProfiel/TeacherProfiel';
import Settings from './components/Setting/Settings';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? <CustomNavbar toggleSidebar={toggleSidebar} /> : null}
        <Container fluid>
          <Row>
            {isAuthenticated ? (
              <>
                <Col md={isSidebarExpanded ? 10 : 12} className="content">
                  <Switch>
                    <Route path="/List/Std" component={ListStd} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/List/Teacher" component={ListTeacher} />
                    <Route path="/List/Newteacher" component={Newteacher} />
                    <Route path="/List/Newstd" component={Newstd} />
                    <Route path="/List/Classes" exact component={Classes} />
                    <Route exact path="/List/ClassesList/:id" component={ClassesList} />
                    <Route path="/List/NewClasse" component={NewClasse} />
                    <Route path="/List/StudentProfiel" component={StudentProfiel} />
                    <Route path="/List/TeacherProfile" component={TeacherProfile} />
                    <Route path="/List/Settings" component={Settings} />
                    <Redirect exact from="/" to="/dashboard" />
                  </Switch>
                </Col>
                <Col md={isSidebarExpanded ? 2 : 0} className={`sidebar ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
                  <Sidebar />
                </Col>
              </>
            ) : (
              <Col md={12}>
                <Redirect to="/Login" />
                <Route path="/Login" exact component={LoginPage} />
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </Router>
  );
}

export default App;
