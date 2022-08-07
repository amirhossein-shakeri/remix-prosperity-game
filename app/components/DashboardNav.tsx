import { Form, Link } from "@remix-run/react";
import Logo from "./Logo";

export default function DashboardNav() {
  return (
    <div className="DashboardNav">
      <Logo />
      <div>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-rose-400 py-1 px-2 text-sm text-white shadow-md"
          >
            Logout
          </button>
        </Form>
      </div>
    </div>
  );
}
