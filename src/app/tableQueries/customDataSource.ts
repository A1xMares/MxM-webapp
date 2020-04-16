// -----------------------------------//
// Dependencies and libraries imports //
// -----------------------------------//
import { ApiService } from '../services/api/api.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of, pipe } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

export class CustomDataSource implements DataSource<any[]> {
    // --------------------------- //
    // Local variables declaration //
    // --------------------------- //
    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    // Observers declaration (avoid leaks and uses for communicate through generic-components) //
    public count = 0;
    // --------------------- //
    // Component constructor //
    // --------------------- //
    constructor(
        private apiService: ApiService
    ) {}
    // ------------------------------------------------//
    // Method to make a connection with the DataSource //
    // ------------------------------------------------//
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.dataSubject.asObservable();
    }
    // ----------------------------------------------------------------//
    // Method to disconnect the DataSource (once finished the process) //
    // ----------------------------------------------------------------//
    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }
    // ------------------------------------//
    // Method to load data using the query //
    // ------------------------------------//
    loadData(query: string): Observable<any[]> {
        this.loadingSubject.next(true);
        return new Observable(objs => {
            this.apiService.getTableDataObjects(query).pipe(
                catchError(() => of([])),
                finalize(() => {
                    this.loadingSubject.next(false);
                })
            ).subscribe((data: any) => {
              this.count = data.total;
              this.dataSubject.next(data.data);
              objs.next(data.data);
            });
        });
    }
}
