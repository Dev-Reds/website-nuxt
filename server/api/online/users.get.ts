export default defineEventHandler(async () => {
  const ids = await getOnlineUserIds()
  const lastSeen = await getLastSeenAll()
  return { ids, lastSeen }
})
