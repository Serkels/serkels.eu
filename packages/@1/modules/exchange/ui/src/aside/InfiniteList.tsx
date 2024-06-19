//

import ContentLoader from "react-content-loader";
import { Item } from "./Item";

export function Loading() {
  return (
    <Item variants={{}}>
      <Item.Footer>
        <ContentLoader
          speed={2}
          height="100px"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="3" ry="3" width="100" height="100" />
        </ContentLoader>
      </Item.Footer>
    </Item>
  );
}
