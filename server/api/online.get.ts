export default defineEventHandler(async () => {
  return { count: await getOnlineCount() }
})