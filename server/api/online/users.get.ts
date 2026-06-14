export default defineEventHandler(() => {
  return { ids: getOnlineUserIds() }
})
