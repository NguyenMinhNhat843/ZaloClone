import React, { useState } from 'react';
import { users, groups } from '../mockData';

export default function GroupManagement() {
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (newGroupName && selectedMembers.length > 0) {
      console.log(`Creating group: ${newGroupName} with members:`, selectedMembers);
      // Here you would typically send a request to your backend to create the group
      setNewGroupName('');
      setSelectedMembers([]);
    }
  };

  const toggleMember = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
      <form onSubmit={handleCreateGroup} className="mb-6">
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Group Name"
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Select Members:</h3>
          {users.map(user => (
            <div key={user.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`user-${user.id}`}
                checked={selectedMembers.includes(user.id)}
                onChange={() => toggleMember(user.id)}
                className="mr-2"
              />
              <label htmlFor={`user-${user.id}`}>{user.name}</label>
            </div>
          ))}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Create Group
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Existing Groups</h2>
      {groups.map(group => (
        <div key={group.id} className="mb-4">
          <h3 className="font-semibold">{group.name}</h3>
          <p>Members: {group.members.map(id => users.find(user => user.id === id)?.name).join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

