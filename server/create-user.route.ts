import { hash } from 'argon2';
import { Request, Response } from 'express';
import { db } from './database';
import { USERS } from './database-data';
import { validatePassword } from './password-validation';

export async function createUser(req: Request, res: Response) {
  const credentials = req.body;

  const errors = validatePassword(credentials.password);

  if (errors) {
    res.status(400).json({ errors });
  } else {
    const passwordDigest = await hash(credentials.password);

    const user = db.createUser(credentials.email, passwordDigest);

    console.log(USERS);

    res.status(200).json({ id: user.id, email: user.email });
  }
}
