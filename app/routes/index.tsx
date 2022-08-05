import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();

  return (
    <main>
      <h1 className="hero-logo">Prosperity Game</h1>
      <div>
        {user ? (
          <>
            <p>Welcome {user.email} user.name!</p>
            <Link to="/play">Continue Playing (Level 8 user.level)</Link>
          </>
        ) : (
          <div>
            <Link to="/join">Start The Game</Link>
            <Link to="/login">Continue My Game</Link>
          </div>
        )}
      </div>
      <p className="contribution">
        by
        <a href="https://github.com/amirhossein-shakeri">Amirhossein Shakeri</a>
      </p>
    </main>
  );
}
