//

export const Inbox_QueryKeys = {
  all: ["inbox"] as const,
  lists() {
    return [...this.all, "list"] as const;
  },
  item(id: number | string) {
    return [...this.all, "item", String(id)] as const;
  },
  by_participent(id: number | string) {
    return [...this.all, "by_participent", String(id)] as const;
  },
  thread(id: number | string) {
    return [...this.all, "thread", String(id)] as const;
  },
  messages(thread_id: number | string) {
    return [...this.thread(thread_id), "messages"] as const;
  },
};
