// components/UserSearch.tsx

"use client";

import React, { useState } from "react";
import { createClient } from '@supabase/supabase-js';
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
    const supabaseUrl = 'https://vnndbhnaytdphummfyeq.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubmRiaG5heXRkcGh1bW1meWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NjM5NjYsImV4cCI6MjA0NTUzOTk2Nn0.c6BleR5T5C4GsO7W-Ggk5Zd0l9LhSgEUx_TgJdFhlmw';
    const supabase = createClient(supabaseUrl, supabaseKey);
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
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full max-w-md"
        />
        <Button onClick={handleSearch} disabled={isLoading} className="w-full max-w-md">
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {users.length > 0 && (
        <ul className="mt-4 mx-auto w-full max-w-md">
          {users.map((user) => (
            <li key={user.id} className="border-b py-2">
              {user["Full Name"]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
