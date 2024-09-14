import { BaseQuest } from "./entities/Quest";

export interface Repository {
    get: (id: string) => Promise<BaseQuest>;
    save: (quest: BaseQuest) => Promise<void>;
    delete: (id: string) => Promise<void>;
}
