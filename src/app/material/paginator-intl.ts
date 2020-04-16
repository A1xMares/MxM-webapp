import {MatPaginatorIntl} from '@angular/material/paginator';

export function getSpanishPaginatorIntl() {

    const rRangeLabel = (page: number, pageSize: number, length: number) => {
        return  (((page * pageSize) + 1) + ' - ' + (length > pageSize ? ((page + 1) * pageSize) : length) + ' de ' + length);
    };

    const paginatorIntl = new MatPaginatorIntl();

    paginatorIntl.itemsPerPageLabel = '';
    paginatorIntl.nextPageLabel = 'Siguiente';
    paginatorIntl.previousPageLabel = 'Anterior';
    paginatorIntl.getRangeLabel = rRangeLabel;
    paginatorIntl.firstPageLabel = '';

    return paginatorIntl;
}

