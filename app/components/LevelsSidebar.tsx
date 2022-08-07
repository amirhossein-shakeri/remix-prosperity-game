import { Link } from "@remix-run/react";
import type { Level } from "~/models/level.server";

type Props = {
  levels: Array<Level>;
};

export default function LevelsSidebar({ levels, ...props }: Props) {
  return (
    <div className="LevelsSidebar" {...props}>
      <h3 className="title">Levels</h3>
      {levels.map((l) => (
        <Link to={l.id} prefetch="intent" key={l.id}>
          <div className="rounded border border-orange-200 py-1 text-center transition-all hover:bg-orange-400 hover:text-white">
            Level {l.number}
          </div>
        </Link>
      ))}
    </div>
  );
}
