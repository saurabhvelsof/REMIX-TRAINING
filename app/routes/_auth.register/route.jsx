import { Form, json, Link, redirect, useActionData } from "@remix-run/react";
// import { getUser, login, register } from "../../utils/auth.server";
import { validateEmail, validatePassword } from "../../utils/utils";
import { useEffect, useRef, useState } from "react";
import { getUser, register } from "../../utils/auth.server";

export const meta = () => {
  return [{ title: "Register" }];
};

export const loader = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect("/") : null;
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const cnfpassword = formData.get("cnfpassword");
  const name = formData.get("name");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      {
        errors: {
          name: "Name is required",
        },
        fields: { name, email, password, cnfpassword },
      },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || email.length === 0) {
    return json(
      {
        errors: {
          email: "Email is required",
        },
        fields: { name, email, password, cnfpassword },
      },
      { status: 400 }
    );
  }

  if (validateEmail(email)) {
    return json(
      {
        errors: {
          email: "Email is invalid",
          password: null,
          cnfpassword: null,
          form: null,
          name: null,
        },
        fields: { name, email, password, cnfpassword },
      },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      {
        errors: {
          password: "Password is required",
        },
        fields: { name, email, password, cnfpassword },
      },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      {
        errors: {
          password: "Password is too short",
        },
        fields: { name, email, password, cnfpassword },
      },
      { status: 400 }
    );
  }

  // Check if password and confirm password match
  if (password !== cnfpassword) {
    return json(
      {
        errors: {
          cnfpassword: "Passwords do not match",
        },
        fields: { name, email, password, cnfpassword },
      },
      { status: 400 }
    );
  }

  return await register({ email, password });
};

export default function Register() {
  const actionData = useActionData();
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    name: actionData?.fields?.name || "",
    cnfpassword: actionData?.fields?.cnfpassword || "",
  });
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [clientErrors, setClientErrors] = useState({});

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

  const validateForm = (event) => {
    const errors = {};

    const name = formData?.name?.trim();
    const email = formData?.email?.trim();
    const password = formData?.password?.trim();
    const confirmPassword = formData?.cnfpassword?.trim();

    if (!name || name.length < 3 || name.length > 100) {
      errors.name = "Name must be between 3 and 100 characters";
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
              <h5 className="text-primary mb-0">Regsiter!</h5>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body pt-0">
        <div className="py-4 px-2">
          <Form className="form-horizontal" method="post" onSubmit={validateForm}>
            {actionData?.errors?.form ? (
              <div className="pt-1 text-danger" id="email-error">
                {actionData.errors.form}
              </div>
            ) : null}
            <div className="form-group">
              <label for="firstname">Name*</label>
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="Enter Name"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange(e)}
              />
              {actionData?.errors?.name ? (
                <div className="pt-1 text-danger" id="name-error">
                  {actionData.errors.name}
                </div>
              ) : null}
              {clientErrors.name && (
                <p className="text-danger">{clientErrors.name}</p>
              )}
            </div>
            <div className="form-group">
              <label for="email">Email*</label>
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
              <label for="password">Password*</label>
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
            <div className="form-group">
              <label for="password">Confirm Password*</label>
              <input
                type="password"
                className="form-control"
                id="confirmpassword"
                placeholder="Enter Confirm Password"
                name="cnfpassword"
                value={formData.cnfpassword}
                onChange={(e) => handleInputChange(e)}
              />
              {actionData?.errors?.cnfpassword ? (
                <div className="pt-1 text-danger" id="password-error">
                  {actionData.errors.cnfpassword}
                </div>
              ) : null}
              {clientErrors.confirmPassword && (
                <p className="text-danger">{clientErrors.confirmPassword}</p>
              )}
            </div>
            <div className="py-2 mt-3">
              <button className="btn btn-primary btn-block waves-effect waves-light">
                Register
              </button>
            </div>
          </Form>
          <div className="mt-4 text-center">
            <Link to={`/login`} className="text-muted">
              <i className="mdi mdi-lock mr-1"></i> Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
