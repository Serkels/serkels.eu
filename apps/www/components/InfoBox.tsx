interface InfoBoxProps {
  message: string;
}

export function InfoBox({ message }: InfoBoxProps) {
  return (
    <div className="fixed left-0 top-0 z-[51] ml-0 flex w-full items-center justify-center bg-red-500 p-6 text-white md:bottom-2 md:top-auto md:w-[25%] md:rounded-e-2xl">
      {message}
    </div>
  );
}

export default InfoBox;
