import { useNavigate } from '@tanstack/react-router';
import { LogOut, Menu, User } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { logout } from '@/features/auth/api/auth.api';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type HeaderProps = {
  onMobileMenuToggle: () => void;
};

export const Header = ({ onMobileMenuToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const initials =
    user?.firstName && user?.lastName
      ? `${String(user.firstName)}${String(user.lastName)}`
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : (user?.email?.charAt(0).toUpperCase() ?? 'A');

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <header className="bg-background flex h-14 items-center justify-between border-b px-4">
      {/* Left side — mobile menu button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileMenuToggle}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Right side — user dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            {user?.email && (
              <span className="hidden text-sm md:inline-block">
                {user.email}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <User size={16} />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
