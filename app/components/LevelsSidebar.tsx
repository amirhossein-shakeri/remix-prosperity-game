import { Form, Link } from "@remix-run/react";
import type { Level } from "~/models/level.server";

type Props = {
  levels: Array<Level>;
  active: string;
};

export default function LevelsSidebar({ levels, active, ...props }: Props) {
  console.log("SIDEBAR ACTIVE: ", active);
  return (
    <div className="LevelsSidebar" {...props}>
      <h3 className="title">Levels</h3>
      <Form method="post" action="/play?index">
        <button
          type="submit"
          className="w-full rounded border border-orange-200 py-1 px-3 text-center transition-all hover:bg-orange-400 hover:text-white"
        >
          Create Next Level
        </button>
      </Form>
      {levels.map((l) => (
        <Link to={l.id} prefetch="intent" key={l.id}>
          <div
            key={l.id}
            className={`${
              "" // l.id === active ? "bg-orange-200" : "" doesn't work properly! because of state update stuff!
            } rounded border border-orange-200 py-1 text-center transition-all hover:bg-orange-400 hover:text-white`}
          >
            Level {l.number}
          </div>
        </Link>
      ))}
    </div>
  );
}
