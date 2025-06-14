import React from 'react';

interface ProfileAvatarProps {
  name?: string | null;
  email?: string | null;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ name, email }) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold">
      {initials}
    </div>
  );
};
