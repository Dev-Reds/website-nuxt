export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string
  if (!userId) return { calls: [] }
  const calls = await db.getCalls()
  const now = Date.now()
  for (let i = calls.length - 1; i >= 0; i--) {
    if (calls[i].status === 'ended' && now - calls[i].ts > 60000) calls.splice(i, 1)
  }
  await db.setCalls(calls)
  const active = calls.filter((c: any) =>
    (c.status !== 'ended' || now - c.ts < 30000) &&
    (c.fromUserId === userId || c.toUserId === userId)
  )
  return { calls: active }
})
