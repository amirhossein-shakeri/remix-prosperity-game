import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();

  return (
    <main className="h-full p-4">
      <h1 className="hero-logo font-pacifico text-center text-4xl text-orange-400">
        Prosperity Game
      </h1>
      <div className="my-8">
        {user ? (
          <>
            <p>Welcome {user.email} user.name!</p>
            <Link to="/play">Continue Playing (Level 8 user.level)</Link>
          </>
        ) : (
          <div className="flex flex-row items-center justify-center gap-2">
            <Link className="btn btn-primary" to="/join">
              Start The Game
            </Link>
            <Link className="btn bg-white" to="/login">
              Continue My Game
            </Link>
          </div>
        )}
      </div>
      <p className="contribution font-pacifico fixed bottom-0 my-8 mt-auto w-full text-center">
        by{" "}
        <a
          href="https://github.com/amirhossein-shakeri"
          className="text-blue-500 underline"
          target="blank"
        >
          Amirhossein Shakeri
        </a>
      </p>
    </main>
  );
}
