export const users = [
  { id: 1, name: "John Doe", avatar: "/upload/avatar.png" },
  { id: 2, name: "Jane Smith", avatar: "/upload/avatar.png" },
  { id: 3, name: "Alice Johnson", avatar: "/upload/avatar.png" },
  { id: 4, name: "Bob Williams", avatar: "/upload/avatar.png" },
  { id: 5, name: "Emma Brown", avatar: "/upload/avatar.png" },
];

export const messages = [
  { id: 1, senderId: 1, receiverId: 2, content: "Hey Jane, how are you?", timestamp: "2023-06-01T10:00:00.000Z" },
  { id: 2, senderId: 2, receiverId: 1, content: "Hi John! I'm good, thanks. How about you?", timestamp: "2023-06-01T10:05:00.000Z" },
  { id: 3, senderId: 1, receiverId: 2, content: "I'm doing well. Do you want to grab lunch later?", timestamp: "2023-06-01T10:10:00.000Z" },
];

export const groups = [
  { id: 1, name: "Work Team", avatar: "/upload/avatar.png", members: [1, 2, 3, 4] },
  { id: 2, name: "Family", avatar: "/upload/avatar.png", members: [1, 5] },
];

export const groupMessages = [
  { id: 1, groupId: 1, senderId: 1, content: "Hey team, what's the status on the project?", timestamp: "2023-06-02T09:00:00.000Z" },
  { id: 2, groupId: 1, senderId: 2, content: "I've finished my part. Just need to review it.", timestamp: "2023-06-02T09:05:00.000Z" },
];

