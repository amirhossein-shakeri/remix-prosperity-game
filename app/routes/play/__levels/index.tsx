import { Form, useActionData } from "@remix-run/react";
import { ActionArgs, redirect } from "@remix-run/node";
import { createLevel } from "~/models/level.server";
import { requireUserId } from "~/session.server";
import { getUserNextLevelNumber } from "~/models/user.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  await createLevel({
    userId,
    number: await getUserNextLevelNumber(userId),
    note: "",
  });
  return redirect("/play");
}

export default function Levels() {
  const actionData = useActionData<typeof action>();
  return (
    <main>
      <h1>Welcome Back %%user.name%% !</h1>
      <p>Please seelect a level to show the details or Create a new one</p>
      Your level is %%10%% and you've bought %%30%% items which cost
      %%$20,590%%. You've wasted %%$610%% ...
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-orange-400 px-8 py-2 text-white shadow"
        >
          Start Next Level
        </button>
      </Form>
    </main>
  );
}
