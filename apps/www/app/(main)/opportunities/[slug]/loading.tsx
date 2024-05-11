//

import ContentLoader from "react-content-loader";

//

export default function Loading() {
  return (
    <ContentLoader
      backgroundColor="#f3f3f3"
      className="mx-auto box-content px-6 py-12"
      foregroundColor="#ecebeb"
      speed={2}
      viewBox="0 0 600 600"
    >
      <rect x="0" y="0" rx="3" ry="3" width="600" height="35" />
      <circle cx="20" cy="80" r="20" />
      <rect x="0" y="110" rx="3" ry="3" width="600" height="300" />
    </ContentLoader>
  );
}
