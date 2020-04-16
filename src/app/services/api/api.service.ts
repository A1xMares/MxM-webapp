import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as SecureLS from 'secure-ls';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ApiService {
  // Local variables //

  private url = 'https://api.mxm-web.com.mx/api/';

  private fileUrl = '';

  private contractsUrl = this.url + 'LocalContainers/temporalfiles/upload';

  public currentUserValue = {};

  // Constructor //
  constructor(
      private http: HttpClient
  ) {}

  // Obtain objects from 1 collection //
  getDataObjects( type: string) {
    return this.http.get(this.url + type, {headers:  new HttpHeaders({Authorization: this.getToken() }) });
  }

  // Obtain object per id //
  getDataObject( type: string, id: string) {
    // console.log(this.url  + type + id);
    return this.http.get(this.url + type + '/' + id, );
  }

  // Obtain object per id //
  getExistObject( type: string, id: string) {
    // console.log(this.url  + type + id);
    return this.http.get(this.url + type + '/' + id + '/exists', );
  }

  // Add a new data object //
  addDataObject(model: any, type: string) {
    return this.http.post(this.url  + type, model);
  }

  // Add a new data object //
  addDataRelation(model: any, type: string, ralationType: string, id: string, fk: string) {
    return this.http.put(
      this.url  + type + '/' + id + '/' + ralationType + '/' + fk, model,
    );
  }

  // Edit object per id //
  editDataObject(id: string, model: any , type: string) {
    return this.http.patch(this.url + type + '/' + id, model, );
  }

  // Delete object per id //
  deleteDataObject(type: string, id: string) {
    return this.http.delete(this.url + type + '/' + id, );
  }

  // Obtain data to fill table //
  getTableDataObjects(query: string) {
    return this.http.get(this.url + query, );
  }

  // Obtain data from external services //
  getGenericDataObjects(query: string) {
    return this.http.get(query, );
  }


  useRemoteMethod(model: string, method: string, params: object) {
    const body = {
      ...params
    };
    return this.http.post(this.url + model + '/' + method, body, {headers: new HttpHeaders({Authorization: 'Bearer ' + this.getToken() }) });
  }

  private getToken() {
    const ls = new SecureLS({
      encodingType: 'aes'
    });
    const currentUser = ls.get('LH52NZe7Av');
    if (currentUser) {
      return ('Bearer ' + currentUser.id);
    } else {
      return '';
    }
  }

  // Add file to the bucket
  addFile(file: File, fileName: string, fileType: string) {
    const formData = new FormData();
    formData.append(fileType, file, fileName);
    return this.http.post(this.fileUrl, formData);
  }

  // Add image to the bucket
  addContracts(excel: File, id: string) {
    const formData = new FormData();
    formData.append('csv', excel, id);
    return this.http.post(this.contractsUrl, formData);
  }

  // Add image object (multiple images) to the bucket
  /*addImageObject(image: File[], id: string[]) {
    const formData = new FormData();
    for (let x = 0; x < image.length; x++) {
      formData.append('image', image[x], id[x]);
    }
  }*/
}
