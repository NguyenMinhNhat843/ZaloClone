import React, { useState, useEffect } from "react";
import Messages from "./Messages";
import Contacts from "./Contacts";
import PropTypes from "prop-types";

export default function Sidebar({
  onSelectUser,
  selectedUser,
  onSelectGroup,
  selectedGroup,
  filteredUsers,
  activeItem,
  setActiveItemUserGroup,
  activeItemUserGroup,
  setNumOfConversations,
}) {
  return (
    <div className="w-100 flex flex-col border-r bg-white">
      {activeItem === "messages" ? (
        <div>
          <Messages
            filteredUsers={filteredUsers}
            onSelectUser={onSelectUser}
            selectedUser={selectedUser}
            onSelectGroup={onSelectGroup}
            selectedGroup={selectedGroup}
            setNumOfConversations={setNumOfConversations}
          />
        </div>
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

Sidebar.propTypes = {
  onSelectUser: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  onSelectGroup: PropTypes.func.isRequired,
  selectedGroup: PropTypes.object,
  filteredUsers: PropTypes.array.isRequired,
  activeItem: PropTypes.string.isRequired,
  setActiveItemUserGroup: PropTypes.func.isRequired,
  activeItemUserGroup: PropTypes.string.isRequired,
  setNumOfConversations: PropTypes.func.isRequired,
};
