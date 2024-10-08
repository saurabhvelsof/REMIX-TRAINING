import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

// import "./tailwind.css";
import veloValidationStylesHref from "./assets/style.css?url";

export const links = () => [
  {
    rel: "stylesheet",
    href: veloValidationStylesHref,
    type: "text/css",
  },
];

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="text/javascript" src="/app/assets/jquery.js"></script>
        <script
          type="text/javascript"
          src="/app/assets/jquery.validate.js"
        ></script>
        <script type="text/javascript" src="/app/assets/validation.js"></script>
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning={true} data-sidebar="dark">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
