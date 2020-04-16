
export class TableColumnType {
    constructor(
        public type: string = 'text',
        public formatter: any = (data) => data,
        public minWidthNumber: number = 200,
        public config: any = {},
        public hasCopyButton: boolean = true,
        public maxWidthText: string = '',
        public editButton: any = false,
        public dropDown: any = false,
        public formatterAppliedOnRow: any = false,
    ) {}
}
