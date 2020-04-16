import {TableColumnType} from "./table-column-type";

export class TableColumn {
    constructor(
        public property: string = '',
        public title: string = '',
        public hasSorter: boolean = false,
        public columnType: TableColumnType = new TableColumnType(),
        public buttonIcon: string = '',
        public flexGrow: number = 1,
        public isCustomExpandible: boolean = false,
        public expandibleTemplate: string = 'tempDefault',
        public expandibleIcon: string = '',
        public principalIcon: string = '',
        public secondIcon: string = '',
        public task: boolean = false
    ) {
    }
}
