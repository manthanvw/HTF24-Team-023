import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vnndbhnaytdphummfyeq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubmRiaG5heXRkcGh1bW1meWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NjM5NjYsImV4cCI6MjA0NTUzOTk2Nn0.c6BleR5T5C4GsO7W-Ggk5Zd0l9LhSgEUx_TgJdFhlmw';
const supabase = createClient(supabaseUrl, supabaseKey);

const dummyMessages = [
  {
    sender_id: '123e4567-e89b-12d3-a456-426614174000',
    receiver_id: '123e4567-e89b-12d3-a456-426614174001',
    content: 'Hello, how are you?',
    created_at: '2023-10-01T10:00:00Z',
    is_read: false,
  },
  {
    sender_id: '123e4567-e89b-12d3-a456-426614174001',
    receiver_id: '123e4567-e89b-12d3-a456-426614174000',
    content: 'I am good, thanks!',
    created_at: '2023-10-01T10:01:00Z',
    is_read: true,
  },
  {
    sender_id: '123e4567-e89b-12d3-a456-426614174002',
    receiver_id: '123e4567-e89b-12d3-a456-426614174000',
    content: 'Are you available for a call?',
    created_at: '2023-10-01T10:02:00Z',
    is_read: false,
  },
  {
    sender_id: '123e4567-e89b-12d3-a456-426614174000',
    receiver_id: '123e4567-e89b-12d3-a456-426614174002',
    content: "Sure, let's do it.",
    created_at: '2023-10-01T10:05:00Z',
    is_read: false,
  },
];

async function insertMessages() {
  const { data, error } = await supabase
    .from('messages')
    .insert(dummyMessages);

  if (error) console.error('Error inserting data:', error);
  else console.log('Data inserted successfully:', data);
}

insertMessages();

src/lib/data.js