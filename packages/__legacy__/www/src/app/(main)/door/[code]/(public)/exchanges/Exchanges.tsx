"use client";

//

export function Exchanges() {
  return (
    <ul>
      <Empty />
    </ul>
  );
}

function Empty() {
  return (
    <li>
      <p className="text-center">N/A Exchanges</p>
    </li>
  );
}
