import { Form, json, Link, useActionData } from "@remix-run/react";
import { login, getUser } from "../../utils/auth.server";
import { redirect } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";
import { validateEmail, validateName } from "../../utils/utils";

export const meta = () => {
  return [{ title: "Login" }];
};

export const loader = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect("/") : null;
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");

  if (typeof email !== "string" || email.length === 0) {
    return json(
      { errors: { email: "Email is required", password: null, form: null } },
      { status: 400 }
    );
  }

  if (validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null, form: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required", form: null } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      {
        errors: { email: null, password: "Password is too short", form: null },
      },
      { status: 400 }
    );
  }

  return await login({
    email,
    password,
    remember: remember === "on" ? true : false,
  });
};

export default function Login() {
  const actionData = useActionData();
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
  });
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [clientErrors, setClientErrors] = useState({}); // Client-side errors

  const validateForm = (event) => {
    const errors = {};

    const email = formData?.email?.trim();
    const password = formData?.password?.trim();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Please enter email address";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      errors.password = "Please enter password.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setClientErrors(errors);

    // Prevent form submission if there are client-side errors
    if (Object.keys(errors).length > 0) {
      event.preventDefault();
    }
  };

  return (
    <>
      <div className="bg-soft-primary">
        <div className="row">
          <div className="col-12">
            <div className="text-primary p-4">
              <h5 className="text-primary mb-0">Sign in to continue!</h5>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body pt-2">
        <div className="p-2">
          <Form
            className="form-horizontal"
            method="post"
            onSubmit={validateForm}
          >
            {actionData?.errors?.form ? (
              <div className="pt-1 text-danger" id="email-error">
                {actionData.errors.form}
              </div>
            ) : null}
            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input
                ref={emailRef}
                autoFocus={true}
                type="text"
                className="form-control"
                id="email"
                placeholder="Enter Email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange(e)}
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
              />
              {actionData?.errors?.email ? (
                <div className="pt-1 text-danger" id="email-error">
                  {actionData.errors.email}
                </div>
              ) : null}
              {clientErrors.email && (
                <p className="text-danger">{clientErrors.email}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="userpassword">Password</label>
              <input
                type="password"
                className="form-control"
                id="userpassword"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange(e)}
                ref={passwordRef}
                autoComplete="current-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-danger" id="password-error">
                  {actionData.errors.password}
                </div>
              ) : null}
              {clientErrors.password && (
                <p className="text-danger">{clientErrors.password}</p>
              )}
            </div>

            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customControlInline"
                name="remember"
              />
              <label
                className="custom-control-label"
                htmlFor="customControlInline"
              >
                Remember me
              </label>
            </div>

            <div className="mt-3">
              <button
                className="btn btn-primary btn-block waves-effect waves-light"
                type="submit"
              >
                Log In
              </button>
            </div>

            <div className="mt-4 text-center">
              <h5 className="font-size-14 mb-3">Sign in with</h5>

              <ul className="list-inline">
                <li className="list-inline-item">
                  <a
                    href=""
                    className="social-list-item bg-primary text-white border-primary"
                  >
                    <i className="mdi mdi-facebook"></i>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a
                    href=""
                    className="social-list-item bg-info text-white border-info"
                  >
                    <i className="mdi mdi-twitter"></i>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a
                    href=""
                    className="social-list-item bg-danger text-white border-danger"
                  >
                    <i className="mdi mdi-google"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-4 text-center">
              <Link to={`/register`} className="text-muted">
                <i className="mdi mdi-lock mr-1"></i> Register
              </Link>
            </div>
            <div className="mt-4 text-center">
              <a href="#" className="text-muted">
                <i className="mdi mdi-lock mr-1"></i> Forgot your password?
              </a>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
