// components/UserSearch.tsx

"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust the path as necessary
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  username: string;
  "Full Name": string; // Ensure this matches your table structure
  phone: string;
}

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, \"Full Name\", phone") // Use quotes for "Full Name"
        .ilike("\"Full Name\"", `%${searchTerm}%`); // You can modify this line to search by full name as well

      if (error) throw error;

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </Button>

      {users.length > 0 && (
        <ul className="mt-4">
          {users.map((user) => (
            <li key={user.id} className="border-b py-2">
              <strong>{user.username}</strong> ({user["Full Name"]}) {/* Access Full Name correctly */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
