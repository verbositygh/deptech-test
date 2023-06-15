import prismaClient from "../prismaClient";

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  try {
    const actAs = JSON.parse(cookies.actAs);
    if (isNaN(parseInt(actAs?.id ?? '')) || (await prismaClient.user.findUnique({where: {id: parseInt(actAs.id)}}))?.plainPassword !== actAs?.plainPassword) {
      throw new Error();
    }
  } catch (e) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Auth Error',
      });
  }
  const body = await readBody(event);
  try {
    const item = await prismaClient.item.create({
      data: body
    });
    return item;
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'An error occured. Read the data for details.',
      data: e?.issues,
    });
  }
});
