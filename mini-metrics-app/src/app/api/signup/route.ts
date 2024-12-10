import bcrypt from "bcrypt";

import prisma from "@/lib/db/client";
import { SignupFormSchema } from "@/lib/definitions";
import { createSession } from "@/lib/session";
import type { SignupInput } from "@/lib/form/definitions";

export async function POST(request: Request) {
  const signupForm: SignupInput = await request.json();

  // Validation
  const validatedFields = SignupFormSchema.safeParse(signupForm);

  if (!validatedFields.success) {
    return Response.json({
      errors: validatedFields.error.flatten().fieldErrors,
    }, {
      status: 400,
    });
  }

  // Auth
  const hashedPassword = await bcrypt.hash(signupForm.password, 10)

  const user = await prisma.user.create({
    data: {
      name: signupForm.username,
      email: signupForm.email,
      password: hashedPassword
    },
  })

  // if (!user) {
  //   return {
  //     message: "An error occured while creating your account."
  //   }
  // }

  // Session
  await createSession(user.id.toString())

  return Response.json(user, {
    status: 200,
  });
}
