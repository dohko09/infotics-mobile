import React from "react";

const Footer = () => {
  return (
    // Componente del footer
    <footer
      style={{
        textAlign: "center",
      }}
    >
      <div className="row justify-content-center mt-1">
        <div className="col-md-4">
          <ul className="list-unstyled d-flex justify-content-center">
            <li className="me-3">
              <a href="https://www.facebook.com/WilSonBHC/?locale=es_LA">
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li className="me-3">
              <a href="https://twitter.com/cmentordev">
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/_elwilo/">
                <i className="fab fa-instagram"></i>
              </a>
            </li>
          </ul>
        </div>
        <div className="col-12">
          <p>&copy; CodeMentor 2023. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
