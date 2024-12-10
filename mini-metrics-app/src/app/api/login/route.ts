import bcrypt from "bcrypt";

import prisma from "@/lib/db/client";
import { LoginFormSchema } from "@/lib/definitions";
import { createSession, deleteSession, getUserId } from "@/lib/session";
import type { LoginInput } from "@/lib/form/definitions";

export async function POST(request: Request) {
  const loginInput: LoginInput = await request.json();

  // Validation
  const validatedFields = LoginFormSchema.safeParse(loginInput);

  if (!validatedFields.success) {
    return Response.json({
      errors: validatedFields.error.flatten().fieldErrors,
    }, {
      status: 400,
    });
  }

  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    }
  })

  if (!user) {
    return new Response("No user found with this email", {
      status: 400,
    });
  }

  const passed = await bcrypt.compare(password, user.password);
  console.log(passed);

  if (!passed) {
    return new Response("Wrong credentials, try again", {
      status: 403,
    });
  }

  await createSession(user.id.toString());

  return Response.json(user, {
    status: 200,
  })
}

export async function DELETE() {
  const userId = await getUserId();
  if (!userId) return new Response("You're not logged in", {
    status: 403,
  });

  deleteSession();

  return new Response("Log out done", {
    status: 200,
  });
}
