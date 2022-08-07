import { Link } from "@remix-run/react";

export default function Logo() {
  return (
    <Link to="/play" prefetch="render">
      <h2 className="Logo">Prosperity Game</h2>
    </Link>
  );
}
