import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/food1.png" alt="Avatar" />
          <AvatarFallback>EF</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Egg Fried Rice</p>
          <p className="text-sm text-muted-foreground">Stall: Amoy hawker center</p>
        </div>
        <div className="ml-auto font-medium">+$5.99</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/food2.png" alt="Avatar" />
          <AvatarFallback>PS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Pizza Slice</p>
          <p className="text-sm text-muted-foreground">Stall: Pizza Hut @ AMK Hub</p>
        </div>
        <div className="ml-auto font-medium">+$3.49</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/food3.png" alt="Avatar" />
          <AvatarFallback>FI</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">French Fries</p>
          <p className="text-sm text-muted-foreground">Stall: Fry It @ Koufu Ang Mo Kio</p>
        </div>
        <div className="ml-auto font-medium">+$2.49</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/food4.png" alt="Avatar" />
          <AvatarFallback>NL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Nasi Lemak</p>
          <p className="text-sm text-muted-foreground">Stall: malay food @ Lau Pa Sat</p>
        </div>
        <div className="ml-auto font-medium">+$4.29</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/food5.png" alt="Avatar" />
          <AvatarFallback>IC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Ice Cream</p>
          <p className="text-sm text-muted-foreground">Stall: Sweet Treats @ maxwell</p>
        </div>
        <div className="ml-auto font-medium">+$1.99</div>
      </div>
    </div>
  );
}
