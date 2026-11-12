import { MdArrowOutward, MdCopyright } from "react-icons/md";
import { portfolioUrl } from "../data/portfolioRoutes";
import { instagramUrl } from "../data/socialLinks";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:liuqm110@gmail.com" data-cursor="disable">
                liuqm110@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+14172348164" data-cursor="disable">
                +1 417 234 8164
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/Kiren-67m"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/qiming-liu-845ba92a0/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
            <a
              href={portfolioUrl("Profile")}
              data-cursor="disable"
              className="contact-social"
            >
              Full Portfolio <MdArrowOutward />
            </a>
            <a
              href="mailto:liuqm110@gmail.com"
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Portfolio of <br /> <span>Qiming Liu</span>
            </h2>
            <h5>
              <MdCopyright aria-label="Copyright" /> 2026 Qiming Liu
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
