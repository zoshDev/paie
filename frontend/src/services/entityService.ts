
export async function fetchEntities<T>(endpoint: string): Promise<T[]> {
  const res = await fetch(`/api/${endpoint}`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des données");
  return res.json();
}

export async function createEntity<T>(endpoint: string, data: T) {
  const res = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la création");
  return res.json();
}

export async function updateEntity<T>(endpoint: string, id: string, data: T) {
  const res = await fetch(`/api/${endpoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  return res.json();
}
