export default defineEventHandler((event) => {
  const chatId = getRouterParam(event, 'chatId')!
  return db.getMessages(chatId)
})
