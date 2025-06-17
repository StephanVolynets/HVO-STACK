import * as admin from "firebase-admin";
import { PrismaService } from "src/prisma/src/prisma.service";
import moment from "moment";

async function getOrCreateToken(userId: number, userFirebaseId: string, prismaService: PrismaService): Promise<string> {
  // Step 1: Retrieve the last token for the user
  const lastToken = await prismaService.token.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc", // Get the most recent token
    },
  });

  // Step 2: Check if the token is valid
  const now = new Date();
  if (lastToken && lastToken.expiresAt > now) {
    return lastToken.token; // Return the valid token
  }

  // Step 3: Generate a new Firebase custom token
  const newFirebaseToken = await admin.auth().createCustomToken(userFirebaseId);

  // Step 4: Create a new token entry in the database
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + parseInt(process.env.TOKEN_EXPIRATION_DAYS, 10));

  await prismaService.token.create({
    data: {
      userId,
      token: newFirebaseToken,
      expiresAt: expirationDate,
    },
  });

  return newFirebaseToken;
}

export function formatDate(date: Date): string {
  return moment(date).format("MM/DD/YYYY hh:mm A");
}
