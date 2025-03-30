import React, { useState, useEffect } from "react";
import {
  Search,
  MessageCircle,
  Users,
  Phone,
  Settings,
  UserPlus,
  Group,
} from "lucide-react";
import { users, groups } from "../mockData";

export default function Messages({onSelectUser, selectedUser, onSelectGroup, selectedGroup,filteredUsers}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mb-4">
        <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">
          Direct Messages
        </h3>
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`cursor-pointer p-4 hover:bg-gray-100 ${selectedUser && selectedUser.id === user.id ? "bg-gray-200" : ""}`}
            onClick={() => onSelectUser(user)}
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">Click to chat</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">
          Groups
        </h3>
        {groups.map((group) => (
          <div
            key={group.id}
            className={`cursor-pointer p-4 hover:bg-gray-100 ${selectedGroup && selectedGroup.id === group.id ? "bg-gray-200" : ""}`}
            onClick={() => onSelectGroup(group)}
          >
            <div className="flex items-center space-x-3">
              <img
                src={group.avatar || "/placeholder.svg"}
                alt={group.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-gray-500">Click to chat</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
