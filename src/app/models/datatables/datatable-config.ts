import { TableColumn } from "./table-column";

export class DatatableConfig {
    constructor(
        public searchModel: string = '',
        public includeObject: any[] = [],
        public sorterProp: string = '',
        public sorterDirection: string = '',
        public columns: TableColumn[] = [],
        public fromRightRemoveIndex: number = 1,
        public filteredByBranch: boolean = true,
        public needRoleValidation: boolean = false,
        public socketEvent: string = searchModel,
        public fromLeftRemoveIndex: number = 0
    ) {}
}
