"use server";

import bcrypt from "bcrypt";

import prisma from "@/lib/db/client";
import { LoginFormSchema, SignupFormSchema } from "@/lib/definitions";
import { createSession } from "@/lib/session";
import type { LoginInput, SignupInput } from "@/lib/form/definitions";
import { redirect } from "next/navigation";

export async function signUp(signupForm: SignupInput) {
  // const signupForm: SignupInput = await request.json();

  // Validation
  const validatedFields = SignupFormSchema.safeParse(signupForm);

  if (!validatedFields.success) return validatedFields.error.flatten().fieldErrors;

  // Auth
  const hashedPassword = await bcrypt.hash(signupForm.password, 10)

  const user = await prisma.user.create({
    data: {
      name: signupForm.username,
      email: signupForm.email,
      password: hashedPassword
    },
  });

  // Session
  await createSession(user.id.toString());

  redirect("/Formulas");
}

export async function login(loginForm: LoginInput) {
  // const loginForm: LoginInput = await request.json();

  // Validation
  const validatedFields = LoginFormSchema.safeParse(loginForm);

  if (!validatedFields.success) return validatedFields.error.flatten().fieldErrors;

  // Auth

  const user = await prisma.user.findUnique({
    where:{
      email: loginForm.email, 
    }
  });

  if(user === null ){ // verify that user exists within the db 
    return null;
  }
  const verified= await bcrypt.compare(loginForm.password, user.password);
  if(verified){
    // Session
    await createSession(user.id.toString());

    redirect("/Formulas");
  }
  else{
    return null;
  }
}