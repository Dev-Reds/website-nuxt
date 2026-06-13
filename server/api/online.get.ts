export default defineEventHandler(() => {
  return { count: getOnlineCount() }
})
