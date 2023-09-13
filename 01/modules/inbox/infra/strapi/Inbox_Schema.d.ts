import { z } from "zod";
export declare const Inbox_Schema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    thread: z.ZodObject<{
        data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            attributes: z.ZodObject<{
                participants: z.ZodObject<{
                    data: z.ZodArray<z.ZodObject<{
                        attributes: z.ZodObject<{
                            id: z.ZodOptional<z.ZodNumber>;
                            firstname: z.ZodString;
                            lastname: z.ZodString;
                            about: z.ZodString;
                            createdAt: z.ZodDate;
                            updatedAt: z.ZodDate;
                            university: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        }, {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        }>;
                        id: z.ZodNumber;
                    }, "strip", z.ZodTypeAny, {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }, {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }>, "many">;
                }, "strip", z.ZodTypeAny, {
                    data: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }[];
                }, {
                    data: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }[];
                }>;
                last_message: z.ZodOptional<z.ZodObject<{
                    data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        attributes: z.ZodObject<{
                            id: z.ZodOptional<z.ZodNumber>;
                            content: z.ZodString;
                            createdAt: z.ZodDate;
                            updatedAt: z.ZodDate;
                            author: z.ZodOptional<z.ZodObject<{
                                data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                                    attributes: z.ZodObject<{
                                        id: z.ZodOptional<z.ZodNumber>;
                                        firstname: z.ZodString;
                                        lastname: z.ZodString;
                                        about: z.ZodString;
                                        createdAt: z.ZodDate;
                                        updatedAt: z.ZodDate;
                                        university: z.ZodString;
                                    }, "strip", z.ZodTypeAny, {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    }, {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    }>;
                                    id: z.ZodNumber;
                                }, "strip", z.ZodTypeAny, {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                }, {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                }>>>;
                            }, "strip", z.ZodTypeAny, {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            }, {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            }>>;
                        }, "strip", z.ZodTypeAny, {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        }, {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        }>;
                        id: z.ZodNumber;
                    }, "strip", z.ZodTypeAny, {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    }, {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    }>>>;
                }, "strip", z.ZodTypeAny, {
                    data?: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    } | null | undefined;
                }, {
                    data?: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    } | null | undefined;
                }>>;
                updatedAt: z.ZodDate;
            }, "strip", z.ZodTypeAny, {
                updatedAt: Date;
                participants: {
                    data: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }[];
                };
                last_message?: {
                    data?: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    } | null | undefined;
                } | undefined;
            }, {
                updatedAt: Date;
                participants: {
                    data: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }[];
                };
                last_message?: {
                    data?: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    } | null | undefined;
                } | undefined;
            }>;
            id: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: number;
            attributes: {
                updatedAt: Date;
                participants: {
                    data: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }[];
                };
                last_message?: {
                    data?: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    } | null | undefined;
                } | undefined;
            };
        }, {
            id: number;
            attributes: {
                updatedAt: Date;
                participants: {
                    data: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }[];
                };
                last_message?: {
                    data?: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    } | null | undefined;
                } | undefined;
            };
        }>>>;
    }, "strip", z.ZodTypeAny, {
        data?: {
            id: number;
            attributes: {
                updatedAt: Date;
                participants: {
                    data: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }[];
                };
                last_message?: {
                    data?: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    } | null | undefined;
                } | undefined;
            };
        } | null | undefined;
    }, {
        data?: {
            id: number;
            attributes: {
                updatedAt: Date;
                participants: {
                    data: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }[];
                };
                last_message?: {
                    data?: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    } | null | undefined;
                } | undefined;
            };
        } | null | undefined;
    }>;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    updatedAt: Date;
    thread: {
        data?: {
            id: number;
            attributes: {
                updatedAt: Date;
                participants: {
                    data: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }[];
                };
                last_message?: {
                    data?: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    } | null | undefined;
                } | undefined;
            };
        } | null | undefined;
    };
    id?: number | undefined;
}, {
    updatedAt: Date;
    thread: {
        data?: {
            id: number;
            attributes: {
                updatedAt: Date;
                participants: {
                    data: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            firstname: string;
                            lastname: string;
                            about: string;
                            university: string;
                            id?: number | undefined;
                        };
                    }[];
                };
                last_message?: {
                    data?: {
                        id: number;
                        attributes: {
                            createdAt: Date;
                            updatedAt: Date;
                            content: string;
                            id?: number | undefined;
                            author?: {
                                data?: {
                                    id: number;
                                    attributes: {
                                        createdAt: Date;
                                        updatedAt: Date;
                                        firstname: string;
                                        lastname: string;
                                        about: string;
                                        university: string;
                                        id?: number | undefined;
                                    };
                                } | null | undefined;
                            } | undefined;
                        };
                    } | null | undefined;
                } | undefined;
            };
        } | null | undefined;
    };
    id?: number | undefined;
}>;
export type Inbox_Schema = z.TypeOf<typeof Inbox_Schema>;
export declare const Inbox_DataSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        thread: z.ZodObject<{
            data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                attributes: z.ZodObject<{
                    participants: z.ZodObject<{
                        data: z.ZodArray<z.ZodObject<{
                            attributes: z.ZodObject<{
                                id: z.ZodOptional<z.ZodNumber>;
                                firstname: z.ZodString;
                                lastname: z.ZodString;
                                about: z.ZodString;
                                createdAt: z.ZodDate;
                                updatedAt: z.ZodDate;
                                university: z.ZodString;
                            }, "strip", z.ZodTypeAny, {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            }, {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            }>;
                            id: z.ZodNumber;
                        }, "strip", z.ZodTypeAny, {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }, {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }>, "many">;
                    }, "strip", z.ZodTypeAny, {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    }, {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    }>;
                    last_message: z.ZodOptional<z.ZodObject<{
                        data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                            attributes: z.ZodObject<{
                                id: z.ZodOptional<z.ZodNumber>;
                                content: z.ZodString;
                                createdAt: z.ZodDate;
                                updatedAt: z.ZodDate;
                                author: z.ZodOptional<z.ZodObject<{
                                    data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                                        attributes: z.ZodObject<{
                                            id: z.ZodOptional<z.ZodNumber>;
                                            firstname: z.ZodString;
                                            lastname: z.ZodString;
                                            about: z.ZodString;
                                            createdAt: z.ZodDate;
                                            updatedAt: z.ZodDate;
                                            university: z.ZodString;
                                        }, "strip", z.ZodTypeAny, {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        }, {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        }>;
                                        id: z.ZodNumber;
                                    }, "strip", z.ZodTypeAny, {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    }, {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    }>>>;
                                }, "strip", z.ZodTypeAny, {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                }, {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                }>>;
                            }, "strip", z.ZodTypeAny, {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            }, {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            }>;
                            id: z.ZodNumber;
                        }, "strip", z.ZodTypeAny, {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        }, {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        }>>>;
                    }, "strip", z.ZodTypeAny, {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    }, {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    }>>;
                    updatedAt: z.ZodDate;
                }, "strip", z.ZodTypeAny, {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                }, {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                }>;
                id: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            }, {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            }>>>;
        }, "strip", z.ZodTypeAny, {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        }, {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        }>;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        updatedAt: Date;
        thread: {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        };
        id?: number | undefined;
    }, {
        updatedAt: Date;
        thread: {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        };
        id?: number | undefined;
    }>;
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    attributes: {
        updatedAt: Date;
        thread: {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        };
        id?: number | undefined;
    };
}, {
    id: number;
    attributes: {
        updatedAt: Date;
        thread: {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        };
        id?: number | undefined;
    };
}>;
export type Inbox_DataSchema = z.TypeOf<typeof Inbox_DataSchema>;
export declare const InboxList_Schema: z.ZodArray<z.ZodObject<{
    attributes: z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        thread: z.ZodObject<{
            data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                attributes: z.ZodObject<{
                    participants: z.ZodObject<{
                        data: z.ZodArray<z.ZodObject<{
                            attributes: z.ZodObject<{
                                id: z.ZodOptional<z.ZodNumber>;
                                firstname: z.ZodString;
                                lastname: z.ZodString;
                                about: z.ZodString;
                                createdAt: z.ZodDate;
                                updatedAt: z.ZodDate;
                                university: z.ZodString;
                            }, "strip", z.ZodTypeAny, {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            }, {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            }>;
                            id: z.ZodNumber;
                        }, "strip", z.ZodTypeAny, {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }, {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }>, "many">;
                    }, "strip", z.ZodTypeAny, {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    }, {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    }>;
                    last_message: z.ZodOptional<z.ZodObject<{
                        data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                            attributes: z.ZodObject<{
                                id: z.ZodOptional<z.ZodNumber>;
                                content: z.ZodString;
                                createdAt: z.ZodDate;
                                updatedAt: z.ZodDate;
                                author: z.ZodOptional<z.ZodObject<{
                                    data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                                        attributes: z.ZodObject<{
                                            id: z.ZodOptional<z.ZodNumber>;
                                            firstname: z.ZodString;
                                            lastname: z.ZodString;
                                            about: z.ZodString;
                                            createdAt: z.ZodDate;
                                            updatedAt: z.ZodDate;
                                            university: z.ZodString;
                                        }, "strip", z.ZodTypeAny, {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        }, {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        }>;
                                        id: z.ZodNumber;
                                    }, "strip", z.ZodTypeAny, {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    }, {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    }>>>;
                                }, "strip", z.ZodTypeAny, {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                }, {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                }>>;
                            }, "strip", z.ZodTypeAny, {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            }, {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            }>;
                            id: z.ZodNumber;
                        }, "strip", z.ZodTypeAny, {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        }, {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        }>>>;
                    }, "strip", z.ZodTypeAny, {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    }, {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    }>>;
                    updatedAt: z.ZodDate;
                }, "strip", z.ZodTypeAny, {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                }, {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                }>;
                id: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            }, {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            }>>>;
        }, "strip", z.ZodTypeAny, {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        }, {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        }>;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        updatedAt: Date;
        thread: {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        };
        id?: number | undefined;
    }, {
        updatedAt: Date;
        thread: {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        };
        id?: number | undefined;
    }>;
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    attributes: {
        updatedAt: Date;
        thread: {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        };
        id?: number | undefined;
    };
}, {
    id: number;
    attributes: {
        updatedAt: Date;
        thread: {
            data?: {
                id: number;
                attributes: {
                    updatedAt: Date;
                    participants: {
                        data: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                firstname: string;
                                lastname: string;
                                about: string;
                                university: string;
                                id?: number | undefined;
                            };
                        }[];
                    };
                    last_message?: {
                        data?: {
                            id: number;
                            attributes: {
                                createdAt: Date;
                                updatedAt: Date;
                                content: string;
                                id?: number | undefined;
                                author?: {
                                    data?: {
                                        id: number;
                                        attributes: {
                                            createdAt: Date;
                                            updatedAt: Date;
                                            firstname: string;
                                            lastname: string;
                                            about: string;
                                            university: string;
                                            id?: number | undefined;
                                        };
                                    } | null | undefined;
                                } | undefined;
                            };
                        } | null | undefined;
                    } | undefined;
                };
            } | null | undefined;
        };
        id?: number | undefined;
    };
}>, "many">;
export type InboxList_Schema = z.TypeOf<typeof InboxList_Schema>;
//# sourceMappingURL=Inbox_Schema.d.ts.map