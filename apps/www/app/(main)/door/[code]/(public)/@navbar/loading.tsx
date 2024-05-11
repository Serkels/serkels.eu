//

import ContentLoader from "react-content-loader";

//

export default function Loading() {
  return (
    <ContentLoader
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      height="40px"
      preserveAspectRatio="none"
      speed={2}
      viewBox="0 0 100 40"
    >
      <rect x="0" y="0" rx="2" ry="2" width="100%" height="100%" />
    </ContentLoader>
  );
}
