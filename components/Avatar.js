'use client';

import Avatar from 'boring-avatars';

const palettes = {
  default: ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
  sunrise: ['#F94144', '#F3722C', '#F8961E', '#F9C74F', '#90BE6D'],
  ocean: ['#001219', '#005F73', '#0A9396', '#94D2BD', '#E9D8A6'],
  candy: ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF'],
};

export default function UserAvatar({ name, size = 40, variant = 'beam', palette = 'default', className = '' }) {
  const colors = palettes[palette] || palettes.default;

  return (
    <div className={`inline-block rounded-full overflow-hidden border-2 border-black dark:border-white ${className}`} style={{ width: size, height: size }}>
      <Avatar
        size={size}
        name={name || 'User'}
        variant={variant}
        colors={colors}
      />
    </div>
  );
}
