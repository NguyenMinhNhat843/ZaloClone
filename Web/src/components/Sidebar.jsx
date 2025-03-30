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
import SearchBar from "./SearchBar";
import Messages from "./Messages";
import Contacts from "./Contacts";

export default function Sidebar({
  onSelectUser,
  selectedUser,
  onSelectGroup,
  selectedGroup,
  filteredUsers,
  activeItem,
  setActiveItemUserGroup,
  activeItemUserGroup,
}) {
  return (
    <div className="w-100 flex flex-col border-r bg-white">
      {activeItem === "messages" ? (
        <Messages
          filteredUsers={filteredUsers}
          onSelectUser={onSelectUser}
          selectedUser={selectedUser}
          onSelectGroup={onSelectGroup}
          selectedGroup={selectedGroup}
        />
      ) : (
        ""
      )}
      {activeItem === "contacts" ? (
        <Contacts
          setActiveItemUserGroup={setActiveItemUserGroup}
          activeItemUserGroup={activeItemUserGroup}
        />
      ) : (
        ""
      )}
    </div>
  );
}
