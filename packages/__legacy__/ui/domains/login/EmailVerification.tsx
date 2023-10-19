//

export function EmailVerification({ email, onUndo }: Props) {
  return (
    <>
      Email Verification Keep this window open and in a new tab open the link we
      just sent to {email} <button onClick={onUndo}>(undo)</button> with
      security code: Delightful Thorny Devil
    </>
  );
}

//

type Props = { email: string; onUndo: () => void };
