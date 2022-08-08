import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  Response,
} from "@remix-run/node";
import {
  createItem,
  deleteItem,
  getItemById,
  Item,
  updateItem,
} from "~/models/item.server";
import invariant from "tiny-invariant";
import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import { levelItemsCost, maxLevelCost } from "~/models/level.server";
import { useEffect, useState } from "react";

type LoaderData = {
  item: Item;
};
export const loader: LoaderFunction = async ({ request, params }) => {
  if (params.itemId === "new") return json({ item: null });
  invariant(params.itemId, "item id not provided");
  const item = await getItemById(params.itemId);
  const userId = await requireUserId(request);
  if (!item) throw new Response("item not found", { status: 404 });
  if (item.userId !== userId)
    throw new Response("you don't have access to this item", { status: 403 });
  return json({ item });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.levelId, "level id is required");
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  invariant(params.itemId, "item id is required");
  invariant(typeof params.itemId === "string", "item id not provided");

  if (intent === "delete") {
    await deleteItem(params.itemId);
    return redirect(`/play/${params.levelId}`);
  }

  const title = formData.get("title"); // TODO: couldn't destructure like { title, price } = formData.values() or something?
  const price = formData.get("price");
  const url = formData.get("url");
  const description = formData.get("description");

  const errors = {
    title: title ? null : "Title is required",
    price: price ? null : "Price is required",
  };
  if (Object.values(errors).some((errorMessage) => errorMessage))
    return json(errors);

  invariant(typeof title === "string", "title must be string");
  invariant(typeof price === "string", "price must be string");
  invariant(typeof url === "string", "url must be string");
  invariant(typeof description === "string", "description must be string");

  const level = await prisma.level.findFirstOrThrow({
    where: { userId, id: params.levelId },
  });

  if (
    params.itemId === "new"
      ? parseFloat(price) + (await levelItemsCost(level.id)) >
        maxLevelCost(level.number)
      : Math.abs(
          (await prisma.item.findFirstOrThrow({ where: { id: params.itemId } }))
            .price - parseFloat(price)
        ) +
          (await levelItemsCost(level.id)) >
        maxLevelCost(level.number)
  ) {
    return json({
      price: `${title} is too expensive($${price}) to be in level ${
        level.number
      }(max $${maxLevelCost(
        level.number
      )}). Remove some items or add an item up to $${
        maxLevelCost(level.number) - (await levelItemsCost(level.id))
      }`,
    });
  }
  const itemData = {
    title,
    price: parseFloat(price),
    levelId: level.id,
    userId,
    url: url ?? "",
    description: description ?? "",
  };
  const item =
    params.itemId === "new"
      ? await createItem(itemData)
      : await updateItem({ ...itemData, id: params.itemId });

  return redirect(`/play/${params.levelId}/${item.id}`);
};

const inputClassName = `w-full rounded border border-gray-300 px-2 py-1 text-lg text-gray-600`;

export default function ItemDetails() {
  const data = useLoaderData() as unknown as LoaderData;
  const errors = useActionData<typeof action>();

  const transition = useTransition();
  const isCreating = transition.submission?.formData.get("intent") === "create";
  const isUpdating = transition.submission?.formData.get("intent") === "update";
  const isDeleting = transition.submission?.formData.get("intent") === "delete";

  const isNewItem = !data.item;
  const [editForm, setEditForm] = useState(false);

  useEffect(() => {
    if (!isUpdating) setEditForm(false);
  }, [isUpdating]);

  return (
    <main
      className="card flex flex-col gap-4"
      style={{ minWidth: 320, padding: "1em" }}
    >
      {!isNewItem && !editForm ? (
        <>
          <div className="head flex flex-row items-center justify-between">
            <h1 className="text-xl font-medium">{data.item?.title}</h1>
            <span className="text-lg font-medium text-emerald-400">
              ${data.item?.price}
            </span>
          </div>
          <p className="text-slate-500">
            {data.item?.description !== ""
              ? data.item?.description
              : "This item doesn't have description"}
          </p>
          {data.item?.url && (
            <a
              href={data.item?.url}
              className="text-sm font-medium text-blue-400 underline"
            >
              {data.item?.url}
            </a>
          )}
          <div className="buttons flex flex-row items-center justify-end gap-2">
            <button
              className="flex items-center gap-2 rounded bg-blue-400 py-1 px-3 text-white shadow-md"
              onClick={() => setEditForm(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
            <Form method="post">
              <button
                type="submit"
                name="intent"
                value="delete"
                disabled={isDeleting}
                className="flex items-center gap-2 rounded bg-rose-400 py-1 px-3 text-white shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
            </Form>
          </div>
        </>
      ) : (
        <Form
          method="post"
          className="flex flex-col items-stretch gap-4 rounded-md bg-orange-100 p-4 shadow-md"
        >
          <h3 className="text-center text-lg font-bold">
            {isNewItem ? "Create New Item" : "Edit Item"}
          </h3>
          <div>
            <label>
              Title*:{" "}
              {errors?.title ? (
                <em className="text-red-600">{errors.title}</em>
              ) : null}
              <input
                type="text"
                name="title"
                className={inputClassName}
                key={data?.item?.title ?? "new"}
                defaultValue={data?.item?.title}
              />
            </label>
          </div>
          <div>
            <label>
              Price*:{" "}
              {errors?.price ? (
                <em className="text-red-600">{errors.price}</em>
              ) : null}
              <input
                type="number"
                name="price"
                className={inputClassName}
                key={data?.item?.price ?? "new"}
                defaultValue={data?.item?.price}
              />
            </label>
          </div>
          <div>
            <label>
              URL:{" "}
              {/* {errors?.url ? (
              <em className="text-red-600">{errors.url}</em>
            ) : null} */}
              <input
                type="text"
                name="url"
                className={inputClassName}
                key={data?.item?.url ?? "new"}
                defaultValue={data?.item?.url}
              />
            </label>
          </div>
          <div>
            <label>
              Description:{" "}
              {/* {errors?.description ? (
              <em className="text-red-600">{errors.description}</em>
            ) : null} */}
              <textarea
                name="description"
                className={inputClassName}
                key={data?.item?.description ?? "new"}
                defaultValue={data?.item?.description}
              />
            </label>
          </div>
          <div className="flex flex-row justify-end gap-2">
            <button
              type="submit"
              name="intent"
              value={isNewItem ? "create" : "update"}
              disabled={isCreating || isUpdating}
              className="btn btn-primary text-shadow rounded bg-green-500 py-1 px-4 text-white shadow-md"
            >
              {isNewItem
                ? isCreating
                  ? "Creating Item ..."
                  : "Create Item"
                : isUpdating
                ? "Updating ..."
                : "Update"}
            </button>
            {editForm && (
              <button
                className="rounded bg-slate-400 py-1 px-3 text-white shadow-md"
                onClick={() => setEditForm(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </Form>
      )}
    </main>
  );
}
