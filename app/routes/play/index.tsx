import { Link, Outlet } from "@remix-run/react";

export default function Dashboard() {
  return (
    <main>
      <h1>Welcome Back %%user.name%% !</h1>
      Your level is %%10%% and you've bought %%30%% items which cost
      %%$20,590%%. You've wasted %%$610%% ...
      <Link to="levels">go to levels</Link>
    </main>
  );
}
