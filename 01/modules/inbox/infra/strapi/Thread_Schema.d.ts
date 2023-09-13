import { z } from "zod";
export declare const Thread_Schema: z.ZodObject<{
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
export type Thread_Schema = z.TypeOf<typeof Thread_Schema>;
export declare const Thread_DataSchema: z.ZodObject<{
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
}>;
export type Thread_DataSchema = z.TypeOf<typeof Thread_DataSchema>;
//# sourceMappingURL=Thread_Schema.d.ts.map