'use client';
import { UserButton } from '@stackframe/stack';
import { useTheme } from 'next-themes';

export default function ProfileButton() {
  const { setTheme, theme } = useTheme();
  
  return (
    <div>
      <UserButton
        showUserInfo={true}
        colorModeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
      />
    </div>
  );
}
