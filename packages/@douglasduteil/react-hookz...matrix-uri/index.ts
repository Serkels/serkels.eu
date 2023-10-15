//

import { useEventListener } from "@react-hookz/web";
import { useEffect, useRef, useState } from "react";

// see https://www.w3.org/DesignIssues/MatrixURIs.html
function decode_matric_uri<T>(hash: string) {
  return hash.split(";").reduce((matrix, pair) => {
    const [key, value] = pair.split("=");
    return { ...matrix, ...(key && value ? { [key]: value } : {}) };
  }, {} as T);
}
function encode_matric_uri(matrix: Record<string, any>) {
  return Object.entries(matrix)
    .map((pair) => pair.join("="))
    .join(";");
}

export function useMatrixHash<T extends Record<string, any>>(initialState: T) {
  // const router = useRouter();
  // const pathname = usePathname();
  const hash_ref = useRef(decodeURI(window.location.hash.slice(1)));
  const [matrix, set_matrix] = useState<T>(initialState);

  useEffect(function sync_matric_to_url_initial() {
    if (hash_ref.current) return;
    hash_ref.current = encode_matric_uri(initialState);
    // router.replace(`${pathname}#${hash_ref.current}`, { scroll: false });

    window.location.hash = hash_ref.current;
  }, []);

  useEffect(
    function sync_matric_to_url() {
      const hash = encode_matric_uri(matrix);
      if (hash === hash_ref.current) return;
      // router.replace(`${pathname}#${hash_ref.current}`, { scroll: false }); // //
      hash_ref.current = hash;
      window.location.hash = hash_ref.current;
    },
    [matrix],
  );

  useEventListener(window, "hashchange", () => {
    set_matrix(decode_matric_uri(hash_ref.current));
  });

  return [matrix, set_matrix];
}
