import { useState } from 'react';
import { User, LogOut, Settings, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProfileDropdownProps {
  username?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

const ProfileDropdown = ({ 
  username = "John Doe", 
  email = "john.doe@example.com", 
  role = "Retailer",
  profileImage 
}: ProfileDropdownProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Add logout logic here (clear tokens, etc.)
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-200"
        >
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src={profileImage} alt={username} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 p-2 bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg" 
        align="end"
      >
        <DropdownMenuLabel className="p-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profileImage} alt={username} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">{username}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="p-3 cursor-pointer hover:bg-accent/50 rounded-md transition-colors">
          <Edit3 className="mr-3 h-4 w-4 text-primary" />
          <span>Edit Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="p-3 cursor-pointer hover:bg-accent/50 rounded-md transition-colors">
          <Settings className="mr-3 h-4 w-4 text-primary" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="p-3 cursor-pointer hover:bg-destructive/10 rounded-md transition-colors text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;