//

import {
  Approved,
  ApprovedByTheOrganizer,
  Archive,
  Bell,
  Binoculars,
  Book,
  Bookmark,
  Circle,
  Denied,
  Envelope,
  Exchange,
  Gear,
  Idle,
  Link,
  LocationRadius,
  Logo,
  MessageGroup,
  Messenger,
  Montains,
  PaperPlane,
  Pen,
  PenSquare,
  Person,
  Plus,
  PlusBox,
  School,
  Share,
  Trash,
  UserAvatarFilled,
} from "@1.ui/react/icons";

//

const ICONS = [
  Approved,
  ApprovedByTheOrganizer,
  Archive,
  Bell,
  Binoculars,
  Book,
  Bookmark,
  Circle,
  Denied,
  Envelope,
  Exchange,
  Gear,
  Idle,
  Link,
  LocationRadius,
  Logo,
  MessageGroup,
  Messenger,
  Montains,
  PaperPlane,
  Pen,
  PenSquare,
  Person,
  Plus,
  PlusBox,
  School,
  Share,
  Trash,
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
