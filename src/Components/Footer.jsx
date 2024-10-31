import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"; //individual Import

import './Footer.css';

const Footer = () => {
  return (
    <>
      <div className="footer">
        <div>&#169; Copyright to PLACART &#174; 2023</div>
        <div className="d-flex text-light">
          <div>Contact us:</div>
          <div className="d-flex" style={{ alignItems: "center", gap: "10px" }}>
            <FontAwesomeIcon icon={faEnvelope} style={{ color: "#ffffff" }} />
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=yeshwanth.ch.naidu@gmail.com"
              target="_blank"
            >
              Mail
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
