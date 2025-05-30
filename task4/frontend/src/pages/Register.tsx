import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="container mx-auto">
        <div className="row w-100 mt-5">
            <div className="col-6">
                <div className="row-12">
                    <h1 className="text-primary text-2xl fst-italic">USER APP</h1>
                </div>
                <div className="row-12 mt-5 mb-5 d-flex flex-column gap-3 align-items-center justify-content-center">
                    <div>
                        <span className="fs-5"> start your journey</span>
                        <h2>Sign Up To the App</h2>

                    </div>
                    <form action="/register" method="POST" className="d-flex flex-column gap-3">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" className="form-control" />
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" className="form-control" />
                    <button type="submit">Sign Up</button>
                    </form>
                </div>
                <div className="row-12 mt-3 d-flex justify-content-between position-absolute bottom-0">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                    <span>forgot password</span>
                </div>
            </div>
            <div className="col-6">
                <img src="https://img.freepik.com/free-vector/registration-concept-illustration_114360-1230.jpg" alt="" />
            </div>
        </div>
    </div>
  )
}
