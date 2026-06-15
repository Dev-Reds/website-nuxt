export default defineEventHandler(async (event) => {
  const chatId = getRouterParam(event, 'chatId')!
  const body = await readBody(event)
  db.setMessages(chatId, body)
  return { ok: true }
})
