export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string
  if (!userId) return { calls: [] }
  const calls = await db.getCalls()
  const now = Date.now()
  let calls: any[] = await db.get('calls')
  for (let i = calls.length - 1; i >= 0; i--) {
    if (calls[i].status === 'ended' && now - calls[i].ts > 60000) calls.splice(i, 1)
  }
<<<<<<< Updated upstream
  await db.setCalls(calls)
=======
<<<<<<< HEAD
  await db.set('calls', calls)
=======
  await db.setCalls(calls)
>>>>>>> 98321310bf72329fcee0133ee3345a6415bf900a
>>>>>>> Stashed changes
  const active = calls.filter((c: any) =>
    (c.status !== 'ended' || now - c.ts < 30000) &&
    (c.fromUserId === userId || c.toUserId === userId)
  )
  return { calls: active }
})
