//

export const Inbox_QueryKeys = {
  all: ["inbox"] as const,
  lists() {
    return [...this.all, "list"] as const;
  },
  thread(id: number | string) {
    return [...this.all, "thread", String(id)] as const;
  },
  messages(thread_id: number | string) {
    return [...this.thread(thread_id), "messages"] as const;
  },
};
