export default function Footer() {
  return (
    <footer className="text-center bg-dark text-light">
      <section className="d-flex justify-content-center justify-content-lg-between p-4">
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href="" className="me-4 text-reset">
            <i className="bi bi-bicebook"></i>
          </a>
          <a href="" className="me-4 text-reset">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="" className="me-4 text-reset">
            <i className="bi bi-google"></i>
          </a>
          <a href="" className="me-4 text-reset">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="" className="me-4 text-reset">
            <i className="bi bi-linkedin"></i>
          </a>
          <a href="" className="me-4 text-reset">
            <i className="bi bi-github"></i>
          </a>
        </div>
      </section>
    </footer>
  );
}
