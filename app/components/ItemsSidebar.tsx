import { Link } from "@remix-run/react";
import type { Item } from "~/models/item.server";

type Props = {
  items: Array<Item>;
};

export default function ItemsSidebar({ items, ...props }: Props) {
  return (
    <div className="ItemsSidebar rounded-md bg-white p-2 shadow-md" {...props}>
      <h4
        className="mb-2 text-center text-orange-400"
        style={{ fontFamily: "Pacifico" }}
      >
        Items
      </h4>
      <Link to="new" prefetch="intent">
        <div className="flex items-center justify-between gap-2 rounded border border-orange-200 py-1 px-3">
          Create New Item
          <span className="text-sm italic text-emerald-400">$?</span>
        </div>
      </Link>
      {items.map((i) => (
        <Link to={i.id} prefetch="intent" key={i.id}>
          <div className="flex items-center justify-between gap-2 rounded border border-orange-200 py-1 px-3">
            {i.title}
            <span className="text-sm italic text-emerald-400">${i.price}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
