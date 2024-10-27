// app/(protected)/page.tsx

import UserSearch from "@/components/search"; // Adjust path as necessary

export default function UserPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Search</h1>
      <UserSearch />
    </div>
  );
}
