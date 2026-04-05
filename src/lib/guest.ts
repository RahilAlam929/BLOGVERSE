export function getGuestId(): string {
  if (typeof window === "undefined") return "";

  let guestId = localStorage.getItem("guest_id");

  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).slice(2)}${Date.now()}`;
    localStorage.setItem("guest_id", guestId);
  }

  return guestId;
}

export function getGuestName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("guest_name") || "";
}

export function setGuestName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("guest_name", name.trim());
}

export function clearGuestName(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("guest_name");
}