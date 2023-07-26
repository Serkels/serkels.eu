//

export function get_session_bookmarks_id(
  session: import("next-auth").Session | null,
) {
  return (
    session?.user?.profile.attributes?.bookmarks?.data?.map(({ id }) =>
      String(id),
    ) ?? []
  );
}
