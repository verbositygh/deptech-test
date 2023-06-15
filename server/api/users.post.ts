import prismaClient from "../prismaClient";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const customer = await prismaClient.user.create({
      data: body
    });
    return customer;
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'An error occured. Read the data for details.',
      data: e?.issues,
    });
  }
});

