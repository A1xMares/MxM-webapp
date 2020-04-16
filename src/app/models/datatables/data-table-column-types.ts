import {TableColumnType} from "./table-column-type";
import {Injectable} from "@angular/core";

@Injectable()
export class DataTableColumnTypes {

    private months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    public phoneNumber = new TableColumnType(
        'phoneNumber',
        (data) => data ? this.processPhone(data) : 'N/D',
        180,
        {},
        true,
        '150px'
    );

    public place = new TableColumnType(
        'place',
        (data) => data ? data : 'N/D',
        250,
        {},
        true
    );

    public date = new TableColumnType(
        'date',
        (data) => data ? this.getFormattedDate(data) : 'N/D',
        160,
        {},
        true
    );

    public dateTime = new TableColumnType(
        'dateTime',
        (data) => data ? (this.getFormattedDate(data) + ' ' + this.getFormattedTime(data)) : 'N/D',
        200,
        {},
        true
    );

    public money = new TableColumnType(
        'money',
        (data) => data ? ('$ ' + this.processNumber(data, 2)) : 'N/D',
        150,
        {},
        true
    );

    public moneyEdit = new TableColumnType(
        'money',
        (data) => ('$ ' + this.processNumber(data, 2)),
        150,
        {},
        true,
        null,
        {type: 'number'},
    );

    public mtSuffix = new TableColumnType(
        'mtSuffix',
        (data) => (this.processNumber(data, 3) + ' MT'),
        150,
        {},
        true
    );

    public mtSuffixEdit = new TableColumnType(
        'mtSuffix',
        (data) => (this.processNumber(data, 3) + ' MT'),
        150,
        {},
        true,
        null,
        {type: 'number'},
    );

    public quantity = new TableColumnType(
        'quantity',
        (data) => data ? this.processNumber(data, 2) : 'N/D',
        150,
        {},
        true,
        null,
        null,

    );


    public quantityEdit = new TableColumnType(
        'quantity',
        (data) => this.processNumber(data, 2),
        150,
        {},
        true,
        null,
        {type: 'number'},
    );

    public factorBuMt = new TableColumnType(
        'factorBuMt',
        (data) => (this.processNumber(data, 2) + ' BU / MT'),
        160,
        {},
        true
    );

    public text = new TableColumnType(
        'text',
        (data) => data ? data : 'N/D',
        200,
        {},
        true,
        null,
        false
    );

    public textEdit = new TableColumnType(
        'text',
        (data) => data ? data : 'N/D',
        200,
        {},
        true,
        null,
        {type: 'text'},
    );

    public iconText = new TableColumnType(
        'iconText',
        (data) => data,
        200,
        {},
        true
    );

    public check = new TableColumnType(
        'check',
        (data) => data,
        80,
        {},
        false
    );


    public icon = new TableColumnType(
        'icon',
        (data) => data,
        80,
        {},
        false
    );

    public color = new TableColumnType(
        'color',
        (data) => data,
        100,
        {},
        false
    );

    public expandButton = new TableColumnType(
        'expandButton',
        (data) => data,
        80,
        {},
        false
    );

    public button = new TableColumnType(
        'button',
        (data) => data,
        80,
        {},
        false
    );

    public expandHidden = new TableColumnType(
        'expandHidden',
        (data) => data,
        80,
        {},
        false
    );

    public html = new TableColumnType(
        'html',
        (data) => data,
        300,
        {},
        false
    );

    public textIcon = new TableColumnType(
        'textIcon',
        (data) => data,
        65,
        {},
        false,
        '65px',
        '',
        ''
    );

  public relation = new TableColumnType(
    'relation',
    (data) => data ? data : 'N/D',
    200,
    {},
    true,
    null,
    false
  );

    constructor() {}

    public processNumber(data, digits) {
        if (data) {
            if (typeof data === 'number') {
                return data.toLocaleString();
            }
        }
        return 0;
    }

    public processPhone(phone) {
        if (phone !== undefined && phone !== null && phone !== '-') {
            if (typeof phone !== 'string') phone = phone.toString();
            if (phone !== '' && phone !== '0') {
                return  phone.length == 11 ? ( phone.substring(0,1) + ' (' + ' ' +  phone.substring(1,4) + ' ) ' + phone.substring(4,7) + ' ' + phone.substring(7,11)) : ( '(' + ' ' +  phone.substring(0,3) + ' ) ' + phone.substring(3,6) + ' ' + phone.substring(6,10));
            }
        }
        return '-';
    }

    public getFormattedDate(date) {
        const tempDate = new Date(date);
        const month = (tempDate.getMonth() + 1);
        const day = tempDate.getDate();
        const year = tempDate.getFullYear();
        return month + '/' + day + '/' + year;
    }
    public getFormattedTime(date) {
        const tempDate = new Date(date);
        let hours: any = tempDate.getHours();
        hours < 10 ? (hours = '0' + hours.toString()) : hours.toString();
        let minutes: any = tempDate.getMinutes();
        minutes < 10 ? (minutes = '0' + minutes.toString()) : minutes.toString();
        return hours + ':' + minutes;
    }

    public getDateRange(from, to) {
        const fromDate = new Date(from);
        const fromMonth = this.months[fromDate.getMonth()];
        const fromYear = fromDate.getFullYear();
        const toDate = new Date(to);
        const toMonth = this.months[toDate.getMonth()];
        const toYear = toDate.getFullYear();
        return fromMonth + '/' + fromYear + ' - ' + toMonth + '/' + toYear;
    }
}
