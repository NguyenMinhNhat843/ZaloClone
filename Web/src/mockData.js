export const users = [
  { id: 1, name: "John Doe", avatar: "/placeholder.svg" },
  { id: 2, name: "Jane Smith", avatar: "/placeholder.svg" },
  { id: 3, name: "Alice Johnson", avatar: "/placeholder.svg" },
  { id: 4, name: "Bob Williams", avatar: "/placeholder.svg" },
  { id: 5, name: "Emma Brown", avatar: "/placeholder.svg" },
];

export const messages = [
  { id: 1, senderId: 1, receiverId: 2, content: "Hey Jane, how are you?", timestamp: "2023-06-01T10:00:00.000Z" },
  { id: 2, senderId: 2, receiverId: 1, content: "Hi John! I'm good, thanks. How about you?", timestamp: "2023-06-01T10:05:00.000Z" },
  { id: 3, senderId: 1, receiverId: 2, content: "I'm doing well. Do you want to grab lunch later?", timestamp: "2023-06-01T10:10:00.000Z" },
];

export const groups = [
  { id: 1, name: "Work Team", avatar: "/placeholder.svg", members: [1, 2, 3, 4] },
  { id: 2, name: "Family", avatar: "/placeholder.svg", members: [1, 5] },
];

export const groupMessages = [
  { id: 1, groupId: 1, senderId: 1, content: "Hey team, what's the status on the project?", timestamp: "2023-06-02T09:00:00.000Z" },
  { id: 2, groupId: 1, senderId: 2, content: "I've finished my part. Just need to review it.", timestamp: "2023-06-02T09:05:00.000Z" },
];

export const stickerPacks = [
    {
        id: 'cats',
        name: 'Cute Cats',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807196/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807196 + i}/android/sticker.png`
        )
      },
      {
        id: 'bunny',
        name: 'Lovely Bunny',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807203/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807203 + i}/android/sticker.png`
        )
      },
      {
        id: 'bear',
        name: 'Sweet Bear',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807225/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807225 + i}/android/sticker.png`
        )
      },
      {
        id: 'dog',
        name: 'Cool Doggo',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807236/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807236 + i}/android/sticker.png`
        )
      },
      {
        id: 'fox',
        name: 'Funny Fox',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807244/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807244 + i}/android/sticker.png`
        )
      },
        {
        id: 'panda',
        name: 'Happy Panda',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807260/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807260 + i}/android/sticker.png`
        )
      },
      {
        id: 'penguin',
        name: 'Dancing Penguin',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807280/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807280 + i}/android/sticker.png`
        )
      },
      {
        id: 'frog',
        name: 'Smiley Frog',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807300/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807300 + i}/android/sticker.png`
        )
      },
      {
        id: 'piggy',
        name: 'Chubby Piggy',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807320/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807320 + i}/android/sticker.png`
        )
      },
      {
        id: 'duck',
        name: 'Quirky Duck',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807340/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807340 + i}/android/sticker.png`
        )
      }
      
  ];
 