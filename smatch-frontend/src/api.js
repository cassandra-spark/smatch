export async function runSQLQuery(sql) {
  const res = await fetch("http://localhost:3005/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request: sql })
  });
  return await res.json();
}
