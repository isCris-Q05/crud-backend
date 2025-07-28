import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import userService from "../services/userService";

const UserAvatar = () => {
  const [user, setUser] = useState(null);
  const username = localStorage.getItem('user');

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return;
      try {
        const users = await userService.getAllUsers();
        const matchedUser = users.data.find((user) => user.username === username);

        console.log(matchedUser);
        setUser(matchedUser || null);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUser();
  }, [username]);

  if (!username) {
    return <Avatar>A</Avatar>;
  }

  return (
    <Avatar
      src={user?.profilePictureLink || undefined}
      sx={{
        bgcolor: 'primary.main',
        width: 44,
        height: 44,
        fontSize: '1.25rem',
      }}
    >
      {!user?.profilePictureLink && username.charAt(0).toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;
