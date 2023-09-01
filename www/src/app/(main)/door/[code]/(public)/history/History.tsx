"use client";

//

export function History() {
  return (
    <ul>
      <Empty />
    </ul>
  );
}

function Empty() {
  return (
    <li>
      <p className="text-center">N/A History</p>
    </li>
  );
}
