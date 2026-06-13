export default defineEventHandler(() => {
  return db.getFriendRequests()
})
