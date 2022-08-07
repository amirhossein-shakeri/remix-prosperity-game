import { Link } from "@remix-run/react";
import type { Item } from "~/models/item.server";

type Props = {
  items: Array<Item>;
};

export default function ItemsSidebar({ items, ...props }: Props) {
  return (
    <div className="w-3/12 border p-1" {...props}>
      <h4>ITEMS SIDEBAR</h4>
      {items.map((i) => (
        <Link to={i.id} prefetch="intent">
          <div className="flex justify-between">
            {i.title}
            <span className="text-sm italic text-emerald-400">${i.price}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
