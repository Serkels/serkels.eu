//

import {
  Archive,
  Bell,
  Binoculars,
  Book,
  Bookmark,
  Circle,
  Envelope,
  Exchange,
  Gear,
  HamburgerMenu,
  Link,
  LocationRadius,
  Logo,
  MessageGroup,
  Messenger,
  PaperPlane,
  Pen,
  PenSquare,
  Person,
  Plus,
  PlusBox,
  School,
  Share,
  UserAvatarFilled,
} from "@1.ui/react/icons";

//

const ICONS = [
  Archive,
  Bell,
  Binoculars,
  Book,
  Bookmark,
  Circle,
  Envelope,
  Exchange,
  Gear,
  HamburgerMenu,
  Link,
  LocationRadius,
  Logo,
  MessageGroup,
  Messenger,
  PaperPlane,
  Pen,
  PenSquare,
  Person,
  Plus,
  PlusBox,
  School,
  Share,
  UserAvatarFilled,
];

export default function Page() {
  return (
    <main className="grid grid-flow-row grid-cols-6">
      {ICONS.map((Component, index) => (
        <div key={index}>
          <figure>
            {<Component className="mx-auto h-24 w-24" />}
            <figcaption className="text-center">{Component.name}</figcaption>
          </figure>
        </div>
      ))}
    </main>
  );
}
