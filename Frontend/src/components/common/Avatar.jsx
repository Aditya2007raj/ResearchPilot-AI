import React, { useState } from 'react';

const BASE_URL = 'http://localhost:8000';

export function Avatar({ user, src, name, size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false);

  const profilePic = src || user?.profile_picture;
  const fullName = name || user?.full_name || 'User';

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  const imageUrl = getImageUrl(profilePic);

  if (imageUrl && !imageError) {
    return (
      <img
        src={imageUrl}
        alt={fullName}
        onError={() => setImageError(true)}
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover border border-[var(--border-subtle)] shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} rounded-full bg-[var(--accent-indigo)]/20 border border-[var(--accent-indigo)]/40 flex items-center justify-center text-[var(--accent-indigo)] font-mono font-bold shrink-0 select-none shadow-sm ${className}`}
    >
      {getInitials(fullName)}
    </div>
  );
}

export default Avatar;
