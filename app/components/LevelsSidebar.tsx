import { Link } from "@remix-run/react";
import type { Level } from "~/models/level.server";

type Props = {
  levels: Array<Level>;
};

export default function LevelsSidebar({ levels, ...props }: Props) {
  return (
    <div className="w-2/12 border p-1" {...props}>
      <h3>LEVELS SIDEBAR</h3>
      {levels.map((l) => (
        <Link to={l.id} prefetch="intent">
          <div>Level {l.number}</div>
        </Link>
      ))}
    </div>
  );
}
