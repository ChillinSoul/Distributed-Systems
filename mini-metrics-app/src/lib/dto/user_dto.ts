import 'server-only'
import bcrypt from 'bcrypt';
import { getUser } from '../dal';
import prisma from '../db/client';

interface NewUser {
  username: string;
  email: string;
  password: string;
}

export async function newUserDTO({ username, email, password }: NewUser) {
  // Auth
  const hashedPassword = await bcrypt.hash(password, 10);
  
  return await prisma.user.create({
    data: {
      name: username,
      email: email,
      password: hashedPassword
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });
}

export async function getUserDTO(slug: number) {
  const currentUser = await getUser();
  if (!currentUser) return null;

  const userData = await prisma.user.findUnique({
    where: {
      id: slug
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });

  return userData ? {
    name: userData.name,
    email: userData.email,
  } : null;
}
