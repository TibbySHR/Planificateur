import React, { useContext } from "react";
import "./styles.scss";
import DIROLogo from "../../assets/images/15_DIRO_LOGO_RGB.png";
import FASLogo from "../../assets/images/Faculte des arts et des sciences-UdeM Officiel RVB.png";
import julien from "../../assets/images/julien.jpeg";
import zahra from "../../assets/images/zahra.jpeg";
import gauransh from "../../assets/images/gauransh.jpeg";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SchoolContext } from "../../store/contexts/schoolContext";

const MyNavbar = () => {
  const schoolContext = useContext(SchoolContext);
  const { t } = useTranslation();

  const OpenPopup = (message: JSX.Element) => {
    schoolContext.togglePopUp(true, message);
  };

  let msg = (
    <div className="navbar__about_container">
      <div>
        <h4 className="navbar__about_container_element">Julien-Charles Cyr</h4>
        <img className="navbar__about__image" src={julien} alt="" />
      </div>
      <div>
        <h4 className="navbar__about_container_element">Zahra Sabah</h4>
        <img className="navbar__about__image" src={zahra} alt="" />
      </div>
      <div>
        <h4 className="navbar__about_container_element">Gauransh K.</h4>
        <img className="navbar__about__image" src={gauransh} alt="" />
      </div>
    </div>
  );

  return (
    <Navbar expand="lg" className="bg-body-tertiary navbar" sticky="top">
      <Navbar.Brand href="/" className="navbar__brand">
        <span>Planificateur</span>
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        className="navbar__toggle_btn"
      />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            {t("navbar.course_selection")}
          </Nav.Link>
          {/* <Nav.Link as={Link} to={"/horaire"}>
            {t("navbar.course_schedule")}
          </Nav.Link> */}
          <Nav.Link as={Link} to={"/advancedSearch"}>
            {t("navbar.advanced_search")}
          </Nav.Link>
        </Nav>

        {/* <Nav className="navbar__about" onClick={() => OpenPopup(msg)}>
          {t("navbar.about")}
        </Nav> */}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
