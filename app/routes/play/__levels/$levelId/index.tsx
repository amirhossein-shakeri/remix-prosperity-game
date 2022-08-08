import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { Level, levelItemsCost, maxLevelCost } from "~/models/level.server";
import type { Item } from "~/models/item.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  level: Level;
  maxCost: number;
  itemsCost: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.levelId, "level id is required");
  const level = await prisma.level.findFirstOrThrow({
    where: { id: params.levelId, userId: await requireUserId(request) },
  });
  return {
    level,
    maxCost: maxLevelCost(level.number),
    itemsCost: await levelItemsCost(level.id),
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUserId(request);
  const formData = await request.formData();
  invariant(typeof params.levelId === "string", "level id is required");

  const intent = formData.get("intent");
  if (intent === "delete") {
    await prisma.level.delete({ where: { id: params.levelId } });
    return redirect("/play");
  }

  const note = formData.get("note");
  invariant(typeof note === "string", "note is required");

  await prisma.level.update({ data: { note }, where: { id: params.levelId } });

  return redirect(`/play/${params.levelId}`);
};

export default function LevelIndex() {
  const { level, maxCost, itemsCost } =
    useLoaderData() as unknown as LoaderData;
  const errors = useActionData<typeof action>();

  const transition = useTransition();
  const isUpdating = transition.submission?.formData.get("intent") === "update";
  const isDeleting = transition.submission?.formData.get("intent") === "delete";
  return (
    <Form
      method="post"
      className="card //justify-between flex flex-col gap-4"
      style={{ flexGrow: 1, maxWidth: 600 }}
    >
      <div className="head">
        <h1 className="title text-xl font-medium">Level {level.number}</h1>
        <p className="text-slate-400">
          max:{" "}
          <span className="text-lg font-medium text-emerald-400">
            ${maxCost}
          </span>
        </p>
        <p className="text-slate-400">
          spent:{" "}
          <span className="text-lg font-medium text-emerald-400">
            ${itemsCost}
          </span>
        </p>
        <p className="text-slate-400">
          remaining:{" "}
          <span className="text-lg font-medium text-emerald-400">
            ${maxCost - itemsCost}
          </span>
        </p>
      </div>
      <div>
        <label>
          Notes:
          <textarea
            className="mt-2 w-full rounded border border-slate-300 bg-slate-100 py-1 px-2 font-mono text-sm text-slate-500"
            name="note"
            key={level.id}
            defaultValue={level.note}
            placeholder="Write your notes here ..."
            disabled={isUpdating}
            rows={4}
          />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button
          name="intent"
          value="update"
          type="submit"
          className="rounded bg-blue-400 py-1 px-3 text-white shadow-md"
        >
          {isUpdating ? "Updating ..." : "Update Level Notes"}
        </button>
        <Link to="new" prefetch="intent">
          <button className="rounded bg-orange-400 py-1 px-3 text-white shadow-md">
            Add New Item
          </button>
        </Link>
        <Form method="post">
          <button
            name="intent"
            value="delete"
            type="submit"
            className="rounded bg-rose-400 py-1 px-3 text-white shadow-md"
          >
            {isDeleting ? "Deleting ..." : "Delete Level"}
          </button>
        </Form>
      </div>
    </Form>
  );
}
