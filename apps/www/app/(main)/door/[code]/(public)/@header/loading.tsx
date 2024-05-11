//

import ContentLoader from "react-content-loader";

//

export default function Loading() {
  return (
    <ContentLoader
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      height="50px"
      preserveAspectRatio="none"
      speed={2}
      viewBox="0 0 1500 100"
    >
      <circle cx="50" cy="50" r="50" />
      <rect x="115" y="0" rx="3" ry="3" width="200" height="30" />
      <rect x="115" y="50" rx="3" ry="3" width="250" height="30" />
    </ContentLoader>
  );
}
