//

import { AvatarMedia } from "@1.ui/react/avatar";
import { TimeInfo } from "@1.ui/react/time";
import { tv } from "tailwind-variants";
import { useQuestion } from "./context";

//

export function Header() {
  const question = useQuestion();

  return (
    <header className="mb-4 flex justify-between">
      <AvatarMedia
        name={question.owner.profile.name}
        image={question.owner.profile.image}
        university={question.owner.university}
      />
      <div className="flex items-start space-x-2">
        <TimeInfo timestamps={question} />
      </div>
    </header>
  );
  // return null;
  // const {
  //   question: { attributes },
  // } = useContext(QACardContext);

  // const owner_id = attributes?.profile?.data?.id!;
  // const is_accepted = Boolean(attributes?.is_accepted);
  // const university = attributes?.profile?.data?.attributes?.university;
  // const username = [
  //   attributes?.profile?.data?.attributes?.firstname,
  //   attributes?.profile?.data?.attributes?.lastname,
  // ].join(" ");

  // return (
  //   <header className="mb-4 flex justify-between">
  //     <AvatarMedia u={owner_id} university={university} username={username} />
  //     <div className="flex items-start space-x-2">
  //       <QACard_ActionGroup />
  //       <Circle
  //         className={clsx("mt-3 inline-block h-4", {
  //           "text-Chateau_Green": is_accepted,
  //           "text-[#C10000]": !is_accepted,
  //         })}
  //       />
  //       <TimeInfo
  //         values={{
  //           createdAt: attributes?.createdAt,
  //           updatedAt: attributes?.edited_at,
  //         }}
  //       />
  //     </div>
  //   </header>
  // );
}

function QACard_ActionGroup() {
  return null;
}
//   const { data: session } = useSession();
//   const {
//     question: { attributes },
//   } = useContext(QACardContext);
//   const jwt = session?.user?.jwt;

//   if (!jwt) {
//     return null;
//   }
//   if (session?.user?.profile.id !== attributes?.profile?.data?.id) {
//     return null;
//   }

//   return (
//     <nav className="flex">
//       <QACard_EditButton />
//       <DeleteIconButton />
//     </nav>
//   );
// }

// function QACard_EditButton() {
//   const {
//     statefulStatus: [{ isEditing }, setStatus],
//   } = useContext(QACardContext);

//   const on_editing = useCallback(() => {
//     setStatus((state) => ({ ...state, isEditing: !state.isEditing }));
//   }, [isEditing]);

//   return (
//     <Button className="px-2 py-2" onPress={on_editing} intent="light">
//       {isEditing ? "❌" : "🖊️"}
//     </Button>
//   );
// }

const header = tv({
  base: "",
});
